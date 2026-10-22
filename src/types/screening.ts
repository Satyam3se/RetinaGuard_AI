export type DRStageNumber = 0 | 1 | 2 | 3 | 4;

export type DRStageKey = 
  | 'NO_DR' 
  | 'MILD_NPDR' 
  | 'MODERATE_NPDR' 
  | 'SEVERE_NPDR' 
  | 'PROLIFERATIVE_DR';

export type DatasetSourceKey = 
  | 'APTOS_2019' 
  | 'IDRID' 
  | 'DRIVE' 
  | 'MESSIDOR_2' 
  | 'CLINICAL_UPLOAD';

export interface DRSeverityMeta {
  stage: DRStageNumber;
  key: DRStageKey;
  title: string;
  shortLabel: string;
  description: string;
  referralPriority: 'Routine' | 'Elective' | 'Urgent' | 'Immediate Emergency';
  recommendedAction: string;
  followUpInterval: string;
  badgeColor: {
    bg: string;
    text: string;
    border: string;
  };
}

export type QualityStatus = 'acceptable' | 'suboptimal' | 'unusable';

export interface ImageQualityMetrics {
  status: QualityStatus;
  overallScore: number; // 0 - 100
  clarityScore: number; // 0 - 100
  macularCenteringScore: number; // 0 - 100
  illuminationUniformity: number; // 0 - 100
  focusSharpness: number; // 0 - 100
  mediaOpacityDetected: boolean; // e.g. cataract obstruction
  pupillaryDilationAdequate: boolean;
  artifacts: string[];
  canProceedToInference: boolean;
  recommendations: string[];
}

export interface PredictiveBiomarker {
  id: string;
  type: 'microaneurysm' | 'hemorrhage' | 'hard_exudate' | 'cotton_wool_spot' | 'neovascularization' | 'venous_beading';
  label: string;
  quadrant: 'Superior Temporal' | 'Inferior Temporal' | 'Superior Nasal' | 'Inferior Nasal' | 'Macula Central';
  confidence: number;
  clinicalSignificance: string;
  locationRatio?: { x: number; y: number }; // normalized 0..1 coordinates
}

export interface GradCamTelemetry {
  heatmapUrl: string;
  originalImageUrl: string;
  blendedOverlayUrl: string;
  targetLayer: string; // e.g. "Conv5_Block3_out"
  peakActivationQuadrants: string[];
  saliencyResolution: string; // "512x512"
  biomarkers: PredictiveBiomarker[];
}

export type ScreeningStatus = 
  | 'draft'
  | 'image_captured'
  | 'quality_verified'
  | 'quality_failed'
  | 'inference_completed'
  | 'referred_to_hospital'
  | 'signed_off';

export interface ScreeningPatient {
  id: string;
  abhaId?: string; // Ayushman Bharat Health Account ID
  fullName: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  contactPhone?: string;
  villageOrTown: string;
  district: string;
  state: string;
  knownDiabetesYears?: number;
  hypertensionHistory?: boolean;
}

export interface MultiDatasetEvaluation {
  sourceDataset: DatasetSourceKey;
  aptosClassification: {
    grade: DRStageNumber;
    gradeName: string;
    quadraticKappaScore: number;
    probabilities: [number, number, number, number, number];
  };
  idridLesionQuantification: {
    microaneurysmCount: number;
    hemorrhageCount: number;
    hardExudatesAreaMm2: number;
    softExudatesDetected: boolean;
    neovascularizationPresent: boolean;
    lesionSeverityGrade: number; // 0 - 4
  };
  messidorMacularEdema: {
    dmeRiskGrade: 0 | 1 | 2; // 0 = None, 1 = Exudates >1DD, 2 = Exudates <=1DD (CSME)
    distanceToFoveaUm: number;
    csmeDetected: boolean;
    recommendation: string;
  };
  driveVesselMetrics: {
    arteriolarVenularRatio: number; // Normal ~0.67
    tortuosityIndex: number; // 0 - 1
    vesselBranchingDensity: number; // 0 - 1
    vascularCaliberStatus: 'Normal' | 'Arteriolar Narrowing' | 'Venous Dilatation';
  };
  uncertaintyMetrics: {
    evidentialConfidence: number; // 0 - 100
    epistemicUncertainty: number; // 0 - 1
    aleatoricUncertainty: number; // 0 - 1
    clinicalDecisionRecommendation: 'Autonomous Clearance' | 'Standard Review' | 'Urgent Specialist Review';
  };
}

export interface ScreeningSession {
  id: string;
  patient: ScreeningPatient;
  eyeExamined: 'OD' | 'OS' | 'OU'; // OD = Right Eye, OS = Left Eye, OU = Both
  capturedAt: string;
  healthCenterName: string;
  operatorName: string;
  operatorRole: 'Vision Technician' | 'ASHA Worker' | 'Medical Officer' | 'Ophthalmologist';
  deviceModel: string;
  fundusImageUrl: string;
  quality: ImageQualityMetrics;
  stageResult?: DRStageNumber;
  confidenceScore?: number; // 0 - 100
  explanation?: GradCamTelemetry;
  multiDatasetAnalysis?: MultiDatasetEvaluation;
  status: ScreeningStatus;
  referralHospital?: string;
  clinicianReviewNotes?: string;
  isDemoRecord: boolean;
}

export interface ScreeningStats {
  totalScreened: number;
  stage0NoDR: number;
  stage1Mild: number;
  stage2Moderate: number;
  stage3Severe: number;
  stage4Proliferative: number;
  actionableReferred: number;
  opticalRetakeRate: number;
}

/* ─── Training & Dataset Types ────────────────────────────── */

export interface DatasetItem {
  id: DatasetSourceKey;
  name: string;
  subtitle: string;
  institution: string;
  url: string;
  totalImages: number;
  resolution: string;
  fieldOfView: string;
  cameraHardware: string;
  annotationType: string;
  targetTask: string;
  keyMetric: string;
  benchmarkScore: string;
  description: string;
  distribution: { label: string; count: number; percentage: number }[];
  sampleCases: {
    id: string;
    title: string;
    stage: DRStageNumber;
    imageUrl: string;
    clinicalNotes: string;
    lesionSummary: string;
  }[];
}

export interface ModelTrainingConfig {
  runName: string;
  datasets: DatasetSourceKey[];
  backbone: 'convnext_base' | 'efficientnet_b4' | 'resnet50_dr' | 'vit_b16' | 'unet_vessel';
  lossFunction: 'evidential_ce' | 'focal_kappa' | 'dice_bce' | 'multi_task_fusion';
  epochs: number;
  batchSize: number;
  learningRate: number;
  optimizer: 'AdamW' | 'SGD_Momentum' | 'Lion';
  weightDecay: number;
  imageResolution: 512 | 768 | 1024;
  useClahe: boolean;
  useCircleCrop: boolean;
  evidentialUncertaintyLoss: boolean;
}

export interface TrainingEpochRecord {
  epoch: number;
  trainLoss: number;
  valLoss: number;
  quadraticKappa: number;
  auroc: number;
  idridLesionF1: number;
  driveDice: number;
  messidorDmeAuc: number;
  learningRate: number;
}

export interface ModelCheckpoint {
  id: string;
  name: string;
  createdAt: string;
  backbone: string;
  datasetsTrainedOn: DatasetSourceKey[];
  finalKappa: number;
  finalAuroc: number;
  driveDice: number;
  idridF1: number;
  messidorAuc: number;
  isActive: boolean;
  parametersCount: string;
  fileSizeBytes: string;
}
