"""
RetinaGuard AI - Local PyTorch Inference API Bridge
Takes base64 image data or file path, passes through trained weights, returns JSON
"""

import sys
import json
import base64
import io
import os
import cv2
import numpy as np
import torch
import torch.nn as nn
import torch.nn.functional as F
import torchvision.transforms as T
import torchvision.models as models
from PIL import Image

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
        return {
            'dr_logits': self.dr_classifier(features),
            'dme_logits': self.dme_classifier(features),
            'evidence': self.evidence_head(features),
            'alpha': self.evidence_head(features) + 1.0
        }

def preprocess_numpy(img_bgr, target_size=(224, 224)):
    gray = cv2.cvtColor(img_bgr, cv2.COLOR_BGR2GRAY)
    _, thresh = cv2.threshold(gray, 10, 255, cv2.THRESH_BINARY)
    contours, _ = cv2.findContours(thresh, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    if contours:
        c = max(contours, key=cv2.contourArea)
        x, y, w, h = cv2.boundingRect(c)
        img_bgr = img_bgr[y:y+h, x:x+w]
    img_bgr = cv2.resize(img_bgr, target_size, interpolation=cv2.INTER_AREA)
    lab = cv2.cvtColor(img_bgr, cv2.COLOR_BGR2LAB)
    l, a, b = cv2.split(lab)
    clahe = cv2.createCLAHE(clipLimit=2.0, tileGridSize=(8, 8))
    cl = clahe.apply(l)
    enhanced_lab = cv2.merge((cl, a, b))
    enhanced_bgr = cv2.cvtColor(enhanced_lab, cv2.COLOR_LAB2BGR)
    return cv2.cvtColor(enhanced_bgr, cv2.COLOR_BGR2RGB)

def run_inference(image_input, weights_path='retinaguard_multitask_weights.pt'):
    try:
        if os.path.exists(image_input):
            img_bgr = cv2.imread(image_input)
        else:
            # Assume base64
            if ',' in image_input:
                image_input = image_input.split(',')[1]
            img_bytes = base64.b64decode(image_input)
            img_pil = Image.open(io.BytesIO(img_bytes)).convert('RGB')
            img_bgr = cv2.cvtColor(np.array(img_pil), cv2.COLOR_RGB2BGR)

        rgb = preprocess_numpy(img_bgr, target_size=(224, 224))
        tensor = T.functional.to_tensor(rgb)
        tensor = T.functional.normalize(tensor, mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225]).unsqueeze(0)

        device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
        model = RetinaGuardMultiTaskModel()
        model.load_state_dict(torch.load(weights_path, map_location=device))
        model.to(device)
        model.eval()

        with torch.no_grad():
            out = model(tensor.to(device))
            dr_probs = F.softmax(out['dr_logits'], dim=1).squeeze().cpu().tolist()
            dme_probs = F.softmax(out['dme_logits'], dim=1).squeeze().cpu().tolist()
            alpha = out['alpha'].squeeze().cpu().numpy()
            
            k = len(alpha)
            s = float(np.sum(alpha))
            uncertainty = float(k / s)
            confidence = float((1.0 - uncertainty) * 100)

        pred_dr = int(np.argmax(dr_probs))
        pred_dme = int(np.argmax(dme_probs))

        res = {
            "success": True,
            "stage": pred_dr,
            "confidence": round(dr_probs[pred_dr] * 100, 2),
            "dr_probabilities": [round(p, 4) for p in dr_probs],
            "dme_grade": pred_dme,
            "dme_probability": round(dme_probs[pred_dme] * 100, 2),
            "uncertainty": round(uncertainty, 4),
            "model_confidence": round(confidence, 1)
        }
        print(json.dumps(res))
    except Exception as e:
        print(json.dumps({"success": False, "error": str(e)}))

if __name__ == '__main__':
    if len(sys.argv) > 1:
        run_inference(sys.argv[1])
    else:
        print(json.dumps({"success": False, "error": "No image input provided"}))
