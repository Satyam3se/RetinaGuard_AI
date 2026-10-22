"""
RetinaGuard AI - PyTorch Inference & Explainability Script
Evaluates real fundus images with trained weights (retinaguard_multitask_weights.pt)
"""

import os
import sys
import argparse
import numpy as np
import cv2
import torch
import torch.nn as nn
import torch.nn.functional as F
import torchvision.transforms as T
import torchvision.models as models

# 1. Model Definition matching trained checkpoint
class RetinaGuardMultiTaskModel(nn.Module):
    def __init__(self, backbone='efficientnet_b0', pretrained=False, num_classes=5):
        super().__init__()
        base = models.efficientnet_b0(weights=None)
        in_features = base.classifier[1].in_features
        base.classifier = nn.Identity()
        self.backbone = base

        self.dr_classifier = nn.Sequential(
            nn.Linear(in_features, 512),
            nn.BatchNorm1d(512),
            nn.GELU(),
            nn.Dropout(0.3),
            nn.Linear(512, num_classes)
        )

        self.dme_classifier = nn.Sequential(
            nn.Linear(in_features, 256),
            nn.BatchNorm1d(256),
            nn.GELU(),
            nn.Dropout(0.2),
            nn.Linear(256, 3)
        )

        self.evidence_head = nn.Sequential(
            nn.Linear(in_features, 128),
            nn.ReLU(),
            nn.Linear(128, num_classes),
            nn.Softplus()
        )

    def forward(self, x):
        features = self.backbone(x)
        dr_logits = self.dr_classifier(features)
        dme_logits = self.dme_classifier(features)
        evidence = self.evidence_head(features)
        alpha = evidence + 1.0
        return {
            'dr_logits': dr_logits,
            'dme_logits': dme_logits,
            'evidence': evidence,
            'alpha': alpha
        }

def apply_clahe_preprocessing(image_path: str, target_size=(224, 224)):
    img = cv2.imread(image_path)
    if img is None:
        raise ValueError(f"Cannot load image: {image_path}")
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    _, thresh = cv2.threshold(gray, 10, 255, cv2.THRESH_BINARY)
    contours, _ = cv2.findContours(thresh, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    if contours:
        c = max(contours, key=cv2.contourArea)
        x, y, w, h = cv2.boundingRect(c)
        img = img[y:y+h, x:x+w]
    img = cv2.resize(img, target_size, interpolation=cv2.INTER_AREA)
    lab = cv2.cvtColor(img, cv2.COLOR_BGR2LAB)
    l, a, b = cv2.split(lab)
    clahe = cv2.createCLAHE(clipLimit=2.0, tileGridSize=(8, 8))
    cl = clahe.apply(l)
    enhanced_lab = cv2.merge((cl, a, b))
    enhanced_bgr = cv2.cvtColor(enhanced_lab, cv2.COLOR_LAB2BGR)
    return cv2.cvtColor(enhanced_bgr, cv2.COLOR_BGR2RGB)

DR_STAGES = [
    "Grade 0: No Apparent Retinopathy",
    "Grade 1: Mild Non-Proliferative DR",
    "Grade 2: Moderate Non-Proliferative DR",
    "Grade 3: Severe Non-Proliferative DR",
    "Grade 4: Proliferative Diabetic Retinopathy"
]

DME_RISK = [
    "Grade 0: DME Absent (No hard exudates near macula)",
    "Grade 1: Moderate DME Risk (Hard exudates outside 1DD of fovea)",
    "Grade 2: Clinically Significant Macular Edema (CSME)"
]

def predict(image_path: str, weights_path: str):
    device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
    model = RetinaGuardMultiTaskModel(backbone='efficientnet_b0', pretrained=False)
    
    if not os.path.exists(weights_path):
        raise FileNotFoundError(f"Weights file not found at {weights_path}")
        
    state_dict = torch.load(weights_path, map_location=device)
    model.load_state_dict(state_dict)
    model.to(device)
    model.eval()

    rgb = apply_clahe_preprocessing(image_path, target_size=(224, 224))
    tensor = T.functional.to_tensor(rgb)
    tensor = T.functional.normalize(tensor, mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225]).unsqueeze(0).to(device)

    with torch.no_grad():
        out = model(tensor)
        dr_probs = F.softmax(out['dr_logits'], dim=1).squeeze().cpu().numpy()
        dme_probs = F.softmax(out['dme_logits'], dim=1).squeeze().cpu().numpy()
        alpha = out['alpha'].squeeze().cpu().numpy()
        
        # Evidential uncertainty: S = sum(alpha), uncertainty u = K / S
        k = len(alpha)
        s = np.sum(alpha)
        uncertainty = k / s
        confidence = (1.0 - uncertainty) * 100

    pred_dr = int(np.argmax(dr_probs))
    pred_dme = int(np.argmax(dme_probs))

    print("\n" + "="*60)
    print("      RETINAGUARD AI -- MULTI-TASK CLINICAL INFERENCE")
    print("="*60)
    print(f"Target Image:        {os.path.basename(image_path)}")
    print(f"Model Checkpoint:    {os.path.basename(weights_path)}")
    print("-" * 60)
    print(f">> DIAGNOSIS:        {DR_STAGES[pred_dr]}")
    print(f">> DR Confidence:    {dr_probs[pred_dr]*100:.2f}%")
    print(f">> DME RISK SCORE:   {DME_RISK[pred_dme]}")
    print(f">> DME Probability:  {dme_probs[pred_dme]*100:.2f}%")
    print(f">> Uncertainty (u):  {uncertainty:.4f} (Model Confidence: {confidence:.1f}%)")
    print("-" * 60)
    print("Probabilities per DR Stage:")
    for idx, (stage, prob) in enumerate(zip(DR_STAGES, dr_probs)):
        bar = "#" * int(prob * 30)
        print(f"  [{idx}] {stage[:25]:<26} {prob*100:5.1f}%  {bar}")
    print("="*60 + "\n")

if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('--image', type=str, required=True, help="Path to retinal image")
    parser.add_argument('--weights', type=str, default='retinaguard_multitask_weights.pt')
    args = parser.parse_args()
    predict(args.image, args.weights)
