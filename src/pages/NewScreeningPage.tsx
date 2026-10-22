import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { AuthLayout } from '../components/layout/AuthLayout';
import { Alert } from '../components/common/Alert';
import { screeningService } from '../services/screeningService';
import { BENCHMARK_DATASETS } from '../services/datasetData';
import type { DatasetSourceKey } from '../types/screening';

export const NewScreeningPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [studyId, setStudyId] = useState('STUDY-2026-1042');
  const [patientName, setPatientName] = useState('Radha Sharma');
  const [eyeSide, setEyeSide] = useState<'OD' | 'OS'>('OD');
  const [consentConfirmed, setConsentConfirmed] = useState(true);
  const [selectedFile, setSelectedFile] = useState<string | null>(
    'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=1000&q=80'
  );
  const [fileName, setFileName] = useState('aptos_fundus_sample_OD.jpg');
  const [fileSize, setFileSize] = useState('3.8 MB');
  const [datasetSource, setDatasetSource] = useState<DatasetSourceKey>('APTOS_2019');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  // Load preset sample if routed from DatasetTrainingPage
  useEffect(() => {
    if (location.state && (location.state as any).presetSample) {
      const preset = (location.state as any).presetSample;
      const source = (location.state as any).datasetSource || 'APTOS_2019';
      setSelectedFile(preset.imageUrl);
      setFileName(`${source.toLowerCase()}_sample_${preset.id}.jpg`);
      setFileSize('4.1 MB');
      setDatasetSource(source);
      setStudyId(`STUDY-${preset.id}`);
    }
  }, [location.state]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUploadError(null);
    const file = e.target.files?.[0];
    if (file) {
      if (!['image/jpeg', 'image/jpg', 'image/png'].includes(file.type)) {
        setUploadError('Invalid format. Only JPG, JPEG and PNG images are accepted.');
        return;
      }
      if (file.size > 20 * 1024 * 1024) {
        setUploadError('File exceeds maximum limit of 20 MB.');
        return;
      }
      setFileName(file.name);
      setFileSize(`${(file.size / (1024 * 1024)).toFixed(1)} MB`);
      setDatasetSource('CLINICAL_UPLOAD');
      const reader = new FileReader();
      reader.onload = () => {
        setSelectedFile(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSelectBenchmarkSample = (sample: any, source: DatasetSourceKey) => {
    setSelectedFile(sample.imageUrl);
    setFileName(`${source.toLowerCase()}_${sample.id}.jpg`);
    setFileSize('4.2 MB');
    setDatasetSource(source);
    setStudyId(`STUDY-${sample.id}`);
    setUploadError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploadError(null);
    if (!selectedFile) {
      setUploadError('Please select or upload a retinal fundus image before proceeding.');
      return;
    }
    if (!consentConfirmed) {
      setUploadError('Please confirm patient informed screening consent.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await screeningService.analyzeRetinaImage({
        imageUrl: selectedFile,
        eyeSide,
        patientName,
        datasetSource,
        patientId: studyId,
      });

      // Route to Step 4: Automated Image Quality Check
      navigate(`/screening/${res.data.id}/quality`);
    } catch (err: any) {
      setUploadError(err.message || 'Error executing AI screening intake. Please try again.');
      setIsSubmitting(false);
    }
  };

  return (
    <AuthLayout>
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header */}
        <div className="pb-6 border-b border-gray-200 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="text-[10px] font-mono tracking-widest text-[#000000] uppercase block font-semibold mb-1">
              Clinical Intake & AI Vision Inference
            </span>
            <h1 className="text-2xl sm:text-3xl font-light tracking-tight text-[#000000]">
              New Retinal Screening
            </h1>
            <p className="text-xs text-gray-500 mt-1">
              Upload a patient fundus scan or select from verified clinical benchmarks: APTOS 2019, IDRiD, DRIVE, or Messidor-2.
            </p>
          </div>

          <Link
            to="/train"
            className="text-xs font-mono font-bold uppercase underline hover:text-teal self-start sm:self-auto"
          >
            ← View Training Studio & Datasets
          </Link>
        </div>

        {/* Progress Steps Indicator */}
        <div className="bg-[#ffffff] border border-[#e0e0e0] p-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
            <div className="p-2.5 bg-[#000000] text-white flex items-center gap-2">
              <span className="font-semibold">01</span>
              <span>Upload / Select · Active</span>
            </div>
            <div className="p-2.5 bg-gray-100 text-gray-500 flex items-center gap-2 border border-gray-200">
              <span className="font-semibold">02</span>
              <span>Optical Quality · Automated</span>
            </div>
            <div className="p-2.5 bg-gray-100 text-gray-500 flex items-center gap-2 border border-gray-200">
              <span className="font-semibold">03</span>
              <span>Multi-Dataset AI · Staging</span>
            </div>
            <div className="p-2.5 bg-gray-100 text-gray-500 flex items-center gap-2 border border-gray-200">
              <span className="font-semibold">04</span>
              <span>Report & Export</span>
            </div>
          </div>
        </div>

        {uploadError && <Alert type="warning">{uploadError}</Alert>}

        {/* Form & Side Panel Grid */}
        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Upload Card */}
          <div className="lg:col-span-2 bg-white p-6 sm:p-8 border border-[#e0e0e0] shadow-sm space-y-6">
            <div className="border-b border-gray-200 pb-4 flex items-center justify-between">
              <span className="text-xs font-mono uppercase tracking-wider text-[#000000] font-semibold">
                Patient & Optical Acquisition
              </span>
              <span className="text-[10px] font-mono text-gray-500 uppercase">
                Provenance: {datasetSource.replace('_', ' ')}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-[10px] font-mono uppercase tracking-wider text-gray-500 mb-1.5 font-semibold">
                  Patient Full Name
                </label>
                <input
                  type="text"
                  required
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                  className="w-full bg-[#ffffff] border border-[#e0e0e0] px-3.5 py-2 text-xs text-[#000000] font-mono focus:border-[#000000] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono uppercase tracking-wider text-gray-500 mb-1.5 font-semibold">
                  Study ID
                </label>
                <input
                  type="text"
                  required
                  value={studyId}
                  onChange={(e) => setStudyId(e.target.value)}
                  className="w-full bg-[#ffffff] border border-[#e0e0e0] px-3.5 py-2 text-xs text-[#000000] font-mono focus:border-[#000000] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono uppercase tracking-wider text-gray-500 mb-1.5 font-semibold">
                  Eye Examined
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setEyeSide('OD')}
                    className={`py-2 text-xs font-mono uppercase tracking-wider border cursor-pointer transition-colors ${
                      eyeSide === 'OD'
                        ? 'border-[#000000] bg-[#000000] text-white font-semibold'
                        : 'border-[#e0e0e0] bg-[#ffffff] text-gray-500 hover:border-black/30'
                    }`}
                  >
                    Right (OD)
                  </button>
                  <button
                    type="button"
                    onClick={() => setEyeSide('OS')}
                    className={`py-2 text-xs font-mono uppercase tracking-wider border cursor-pointer transition-colors ${
                      eyeSide === 'OS'
                        ? 'border-[#000000] bg-[#000000] text-white font-semibold'
                        : 'border-[#e0e0e0] bg-[#ffffff] text-gray-500 hover:border-black/30'
                    }`}
                  >
                    Left (OS)
                  </button>
                </div>
              </div>
            </div>

            {/* Quick Benchmark Preset Selector */}
            <div className="space-y-3 pt-2">
              <label className="block text-[10px] font-mono uppercase tracking-wider text-gray-500 font-semibold">
                Quick-Load Benchmark Dataset Cases:
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {BENCHMARK_DATASETS.map((d) => {
                  const sample = d.sampleCases[0];
                  const isSelected = datasetSource === d.id && selectedFile === sample.imageUrl;
                  return (
                    <button
                      key={d.id}
                      type="button"
                      onClick={() => handleSelectBenchmarkSample(sample, d.id)}
                      className={`p-2.5 text-left border font-mono text-[11px] transition-all cursor-pointer ${
                        isSelected
                          ? 'border-black bg-black text-white shadow-sm'
                          : 'border-gray-200 bg-gray-50 hover:bg-gray-100 text-gray-800'
                      }`}
                    >
                      <div className="font-bold uppercase text-[10px] truncate">{d.name.split(' ')[0]}</div>
                      <div className="text-[9px] text-gray-400 mt-0.5 truncate">{sample.title}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Fundus Preview / Upload Area */}
            <div>
              <label className="block text-[10px] font-mono uppercase tracking-wider text-gray-500 mb-2 font-semibold">
                Retinal Fundus Photograph
              </label>

              {selectedFile ? (
                <div className="border border-[#e0e0e0] bg-[#ffffff] p-5 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                    <div className="w-28 h-28 bg-black overflow-hidden flex-shrink-0 border border-gray-300">
                      <img src={selectedFile} alt="Fundus Preview" className="w-full h-full object-cover" />
                    </div>
                    <div className="space-y-1.5 font-mono text-xs">
                      <div className="font-semibold text-black truncate max-w-sm">{fileName}</div>
                      <div className="text-gray-500 text-[11px]">Size: {fileSize}</div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] text-emerald-800 bg-emerald-50 px-2 py-0.5 border border-emerald-200 uppercase font-semibold">
                          Format Validated
                        </span>
                        <span className="text-[10px] bg-teal-dim text-black px-2 py-0.5 border border-teal/30 uppercase font-bold">
                          {datasetSource}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 pt-3 border-t border-gray-200 font-mono text-xs">
                    <label className="text-black uppercase font-bold underline cursor-pointer hover:text-teal">
                      Upload Custom Fundus Image
                      <input
                        type="file"
                        accept="image/png, image/jpeg, image/jpg"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>
              ) : (
                <label className="border-2 border-dashed border-gray-300 hover:border-black p-8 text-center block cursor-pointer transition-colors bg-gray-50">
                  <div className="space-y-2 font-mono">
                    <svg className="w-8 h-8 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                    </svg>
                    <div className="text-xs font-semibold text-black uppercase">Click or Drag Retinal Fundus File Here</div>
                    <div className="text-[10px] text-gray-500">Supports JPG, JPEG, PNG up to 20 MB</div>
                  </div>
                  <input
                    type="file"
                    accept="image/png, image/jpeg, image/jpg"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
              )}
            </div>

            {/* Informed Consent Confirmation */}
            <div className="pt-4 border-t border-gray-200">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={consentConfirmed}
                  onChange={(e) => setConsentConfirmed(e.target.checked)}
                  className="mt-0.5 accent-black cursor-pointer"
                />
                <span className="text-xs font-mono text-gray-700 leading-relaxed">
                  I confirm patient informed screening consent has been collected and the fundus scan has been anonymized in accordance with clinical protocol.
                </span>
              </label>
            </div>

            {/* Submit Action */}
            <button
              type="submit"
              disabled={isSubmitting || !selectedFile}
              className={`w-full py-4 font-mono font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${
                isSubmitting
                  ? 'bg-gray-400 text-white cursor-not-allowed'
                  : 'bg-black text-white hover:bg-gray-800 shadow-md'
              }`}
            >
              {isSubmitting ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  <span>Executing Multi-Dataset AI Screening Inference...</span>
                </>
              ) : (
                <>
                  <span>⚡ Run Optical Quality & AI Diagnostic Staging</span>
                  <span>→</span>
                </>
              )}
            </button>
          </div>

          {/* Right Column: Multi-Dataset Standards Reference */}
          <div className="space-y-6 font-mono text-xs">
            <div className="bg-white p-6 border border-[#e0e0e0] shadow-sm space-y-4">
              <span className="text-[10px] uppercase tracking-widest text-gray-500 font-bold block border-b border-gray-200 pb-2">
                Diagnostic Benchmark Standards
              </span>

              <div className="space-y-3">
                <div className="p-3 bg-gray-50 border border-gray-200">
                  <div className="font-bold text-black text-[11px] mb-0.5">APTOS 2019 (Aravind Eye)</div>
                  <p className="text-[10px] text-gray-600">5-class ICDR grading (0: None to 4: Proliferative) with Quadratic Weighted Kappa.</p>
                </div>

                <div className="p-3 bg-gray-50 border border-gray-200">
                  <div className="font-bold text-black text-[11px] mb-0.5">IDRiD (Maharashtra)</div>
                  <p className="text-[10px] text-gray-600">Lesion segmentations for Microaneurysms, Hemorrhages, Hard & Soft Exudates.</p>
                </div>

                <div className="p-3 bg-gray-50 border border-gray-200">
                  <div className="font-bold text-black text-[11px] mb-0.5">DRIVE (Utrecht)</div>
                  <p className="text-[10px] text-gray-600">Arteriolar-to-venular ratio (AVR ~0.67) and vascular tortuosity indices.</p>
                </div>

                <div className="p-3 bg-gray-50 border border-gray-200">
                  <div className="font-bold text-black text-[11px] mb-0.5">Messidor-2 (France)</div>
                  <p className="text-[10px] text-gray-600">Diabetic Macular Edema (DME) risk stratification based on distance to fovea.</p>
                </div>
              </div>

              <div className="pt-3 border-t border-gray-200 text-[10px] text-gray-500">
                Offline-first edge inference and cloud Gemini multimodal vision support active.
              </div>
            </div>
          </div>
        </form>
      </div>
    </AuthLayout>
  );
};
