import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { PublicLayout } from '../components/layout/PublicLayout';

export const ProjectPresentationPage: React.FC = () => {
  const [activeSlide, setActiveSlide] = useState(1);
  const pdfUrl = '/assets/aistudio/ppt.pdf__1__42aef891.pdf';

  const slides = [
    {
      num: 1,
      title: 'Title & Team TecnoX',
      tag: 'Round 2 · Room Round',
      content: {
        heading: 'RetinaGuard AI: Explainable AI for Diabetic Retinopathy Screening in Rural India',
        subtitle: 'IMAGE → EXPLANATION → REFERRAL',
        description:
          'A screening-support prototype that checks retinal image quality, estimates DR severity, explains the prediction visually, and supports referral to an ophthalmologist.',
        teamDetails: {
          teamName: 'TecnoX',
          teamId: 'TS-0123',
          track: 'MedTech',
          event: 'TECHSPARDHA 2K26 | IDEATHON: PROBLEM TO PROTOTYPE',
          institution: 'IMSEC',
          members: [
            { name: 'Anannya Das', roll: '240143165005', branch: 'CS, 3rd year', role: 'Team Lead' },
            { name: 'Radhika Rastogi', roll: '2401430120143', branch: 'CS, 3rd year', role: 'Team Member' },
            { name: 'Kavya Kaushik', roll: '240143165027', branch: 'CS, 3rd year', role: 'Team Member' },
            { name: 'Janahavi Jha', roll: '240143165025', branch: 'CS, 3rd year', role: 'Team Member' },
          ],
        },
      },
    },
    {
      num: 2,
      title: 'Problem Depth & Need',
      tag: 'Clinical Grounding',
      content: {
        heading: 'Diabetic Retinopathy Crisis in India & Frontline Bottlenecks',
        points: [
          {
            label: 'Who is Affected',
            desc: 'Adults with diabetes in India, especially those screened at Primary Health Centers (PHCs) and outreach camps; frontline workers capturing fundus images needing reliable quality feedback; ophthalmologists with limited review capacity.',
          },
          {
            label: 'How Bad It Is',
            desc: 'DR may progress silently before obvious visual symptoms and can cause permanent vision loss. Limited specialist access delays screening. Portable-camera image quality varies heavily under field conditions.',
          },
          {
            label: 'Evidence & Statistics',
            desc: 'Problem Statement ID 26038 reports 77M+ adults with diabetes in India and estimates DR affects ~18% (over 13.8 million citizens at risk of preventable blindness).',
          },
          {
            label: 'What Happens If Nothing Changes',
            desc: 'Patients needing urgent laser/anti-VEGF care are identified too late. Frontline teams lack actionable optical feedback and interpretable reports.',
          },
        ],
      },
    },
    {
      num: 3,
      title: 'Existing Solutions & The Gap',
      tag: 'Competitive Analysis',
      content: {
        heading: 'Comparative Landscape & The Gap We Fill',
        table: [
          {
            solution: 'LumineticsCore (Digital Diagnostics)',
            whatItDoes: 'AI-based autonomous DR screening.',
            limitation: 'High cost, strict regulatory constraints for rural outreach.',
            difference: 'RetinaGuard AI emphasizes quality feedback, Grad-CAM transparency, and human-in-the-loop referral.',
          },
          {
            solution: 'EyeArt (EyeNuk)',
            whatItDoes: 'AI screening from retinal fundus images.',
            limitation: 'Proprietary enterprise system requiring specialized hardware.',
            difference: 'Combines optical quality gating, severity estimation, explanation, and report in an open workflow prototype.',
          },
          {
            solution: 'APTOS 2019 Dataset',
            whatItDoes: 'Labeled fundus images for model development.',
            limitation: 'Research dataset only, not a clinical screening system.',
            difference: 'Adds automated quality assessment and clinical referral generation.',
          },
          {
            solution: 'IDRiD / DRIVE Datasets',
            whatItDoes: 'IDRiD: Lesion masks; DRIVE: Vessel segmentation.',
            limitation: 'Serve isolated research tasks, neither validates the end-to-end pipeline.',
            difference: 'Integrates lesion segmentation and vessel tortuosity into an explainable clinical decision workflow.',
          },
        ],
        gapStatement:
          'A rural-screening workflow combining quality assessment, severity estimation, Grad-CAM visualization, and referral support — with an ophthalmologist in the loop.',
      },
    },
    {
      num: 4,
      title: 'Technical Approach',
      tag: 'Pipeline & Toolbox',
      content: {
        heading: '6-Stage Diagnostic Pipeline & Technology Choices',
        steps: [
          { step: '1', title: 'Capture / Upload', desc: 'Worker uploads fundus photo' },
          { step: '2', title: 'Quality Check', desc: 'Focus, illumination & field of view' },
          { step: '3', title: 'Preprocess', desc: 'CLAHE, enhance usable images, reject ungradable' },
          { step: '4', title: 'EfficientNet-B0', desc: 'Severity estimate + class probabilities' },
          { step: '5', title: 'Grad-CAM', desc: 'Highlight regions influencing prediction' },
          { step: '6', title: 'Referral Report', desc: 'Ophthalmologist reviews and decides' },
        ],
        tooling: [
          'MATLAB / OpenCV Image Processing: quality checks, CLAHE, illumination normalization, and denoising.',
          'Deep Learning Toolbox / PyTorch: transfer learning with EfficientNet-B0 / ConvNeXt.',
          'Grad-CAM: visual explanation of regions influencing model prediction.',
          'Statistics & ML: sensitivity, specificity, F1-score, ROC-AUC, and quadratic kappa.',
        ],
      },
    },
    {
      num: 5,
      title: 'System Architecture & 10-Step Workflow',
      tag: 'Full-Stack Architecture',
      content: {
        heading: '10-Step End-to-End Workflow & Microservices Architecture',
        workflowSteps: [
          { num: 1, name: 'Login', detail: 'Healthcare worker / Ophthalmologist authentication' },
          { num: 2, name: 'Patient Registration', detail: 'De-identified demographic & diabetes history intake' },
          { num: 3, name: 'Image Upload', detail: 'JPG/PNG file preview, validation & camera ingest' },
          { num: 4, name: 'Image Quality Check', detail: 'Blur, contrast, FOV (If quality poor: Request Recapture!)' },
          { num: 5, name: 'Preprocessing', detail: 'CLAHE contrast equalization & circular masking' },
          { num: 6, name: 'AI Classification', detail: 'EfficientNet-B0 softmax probabilities across Grades 0-4' },
          { num: 7, name: 'Grad-CAM', detail: 'Interactive lesion saliency heatmap localization' },
          { num: 8, name: 'Screening Report', detail: 'Prediction + Probability + Explanation + Referral' },
          { num: 9, name: 'Ophthalmologist Review', detail: 'Clinical validation, override option & sign-off' },
          { num: 10, name: 'Secure Storage', detail: 'PostgreSQL database records, access control & audit trail' },
        ],
        stack: {
          frontend: 'React.js + Tailwind CSS (Responsive UI)',
          backend: 'FastAPI / Express Node.js Server',
          imageProcessing: 'OpenCV + Pillow (Quality, Preprocess, Normalization)',
          aiMl: 'PyTorch / ONNX + EfficientNet-B0 + Grad-CAM',
          database: 'PostgreSQL (Patients, Screenings, Reports, Users)',
          deployment: 'Docker (Cloud / Local PHC Edge)',
        },
      },
    },
    {
      num: 6,
      title: 'Security and Privacy',
      tag: 'Data Governance',
      content: {
        heading: 'Healthcare Data Protection & Threat Matrix',
        threats: [
          { threat: 'Unauthorized Access', protection: 'Role-based access control, encryption at rest, strong authentication.' },
          { threat: 'Interception in Transit', protection: 'HTTPS/TLS encryption; no public web links for raw clinical images.' },
          { threat: 'Metadata / Re-identification', protection: 'Remove unnecessary EXIF metadata; use de-identified coded case IDs.' },
          { threat: 'Wrong Output / Overreliance', protection: 'Show model limitations; require clinician review and follow-up plan.' },
          { threat: 'Evaluation Data Leakage', protection: 'Patient-level train/test separation; strict dataset access boundaries.' },
          { threat: 'Malicious Upload', protection: 'Validate MIME file types, dimensions, and size caps.' },
        ],
      },
    },
    {
      num: 7,
      title: 'Feasibility, Cost & Business Model',
      tag: 'Deployment Viability',
      content: {
        heading: 'Implementation Feasibility & Sustainability',
        points: [
          {
            title: 'Build Effort',
            text: 'Staged rollout: Quality Gate → Model → Grad-CAM/Report → Clinical Evaluation.',
          },
          {
            title: 'Business Model',
            text: 'Potential users: PHCs, screening camps, NGOs, eye-care networks, and public health programs. Sustainability through institutional licensing contracts.',
          },
          {
            title: 'Smallest Version First (MVP)',
            text: 'Upload → Quality Check → Supported Severity Classes → Grad-CAM → Clinical Report. Evaluated on unseen held-out datasets.',
          },
        ],
      },
    },
    {
      num: 8,
      title: 'Impact with Measurable Outcomes',
      tag: 'Validation KPIs',
      content: {
        heading: 'Measurable Clinical Targets',
        metrics: [
          { outcome: 'Image-Quality Feedback', target: 'Feedback for every uploaded image; test on labelled gradable/ungradable scans.' },
          { outcome: 'Report Generation Time', target: '≤ 30 seconds per usable image on standard edge hardware.' },
          { outcome: 'Referable-DR Performance', target: '> 90% Sensitivity and > 85% Specificity on unseen expert-labeled cohorts.' },
          { outcome: 'Explanation Usefulness', target: 'Clinician-rated usefulness rubric for spatial Grad-CAM attention.' },
        ],
      },
    },
    {
      num: 9,
      title: 'Research & References',
      tag: 'Citations & Grounding',
      content: {
        heading: 'Scientific Evidence & Citations',
        references: [
          { num: 1, title: 'Problem Statement ID 26038', author: 'MathWorks / Techspardha Ideathon Brief' },
          { num: 2, title: 'LumineticsCore (Digital Diagnostics)', author: 'Autonomous DR screening system' },
          { num: 3, title: 'EyeArt (EyeNuk)', author: 'AI screening from retinal images' },
          { num: 4, title: 'APTOS 2019 Blindness Detection', author: 'Kaggle / Asia Pacific Tele-Ophthalmology Society' },
          { num: 5, title: 'IDRiD Dataset', author: 'Indian DR Image Dataset (IEEE DataPort)' },
          { num: 6, title: 'DRIVE Dataset', author: 'Digital Retinal Images for Vessel Extraction' },
          { num: 7, title: 'Messidor-2 Dataset', author: 'Consortium des Hôpitaux (ADCIS)' },
          { num: 8, title: 'Selvaraju et al. (2017)', author: 'Grad-CAM: Visual Explanations from Deep Networks (ICCV)' },
        ],
      },
    },
    {
      num: 10,
      title: 'Conclusion & Thank You',
      tag: 'TecnoX · IMSEC',
      content: {
        heading: 'Thank You',
        subtitle: 'RetinaGuard AI · Team TecnoX [TS-0123] · IMSEC',
        description: 'Empowering frontline healthcare workers to prevent irreversible diabetic blindness through explainable AI.',
      },
    },
  ];

  return (
    <PublicLayout>
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12 py-10 sm:py-16 space-y-10">
        {/* Page Banner */}
        <div className="bg-black text-white p-6 sm:p-10 border border-white/10 shadow-2xl relative overflow-hidden">
          <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2 text-[10px] font-mono tracking-widest uppercase">
                <span className="bg-teal text-black font-bold px-2 py-0.5">TECHSPARDHA 2K26</span>
                <span className="bg-white/10 text-white px-2 py-0.5 border border-white/20">IDEATHON: PROBLEM TO PROTOTYPE</span>
                <span className="bg-white/10 text-teal px-2 py-0.5 border border-white/20">TEAM TECNOX · TS-0123</span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-light tracking-tight text-white">
                Project Presentation & System Blueprint
              </h1>
              <p className="text-xs sm:text-sm text-white/70 max-w-3xl">
                Official competition presentation deck and architecture specification for <strong>RetinaGuard AI</strong> (Team TecnoX, IMSEC).
              </p>
            </div>

            <div className="flex items-center gap-3">
              <a
                href={pdfUrl}
                download="RetinaGuard_AI_Techspardha_2K26.pdf"
                className="btn-primary text-xs py-3 px-6 whitespace-nowrap shadow-md"
              >
                <span>Download PDF Deck ↗</span>
              </a>
              <Link
                to="/screening/new"
                className="btn-outline-white text-xs py-3 px-6 whitespace-nowrap"
              >
                <span>Run Interactive Demo →</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Embedded PDF Viewer & Slide Navigator */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Slide Index & Team Info */}
          <div className="lg:col-span-4 space-y-6">
            {/* Team TecnoX Card */}
            <div className="bg-white border border-gray-200 p-6 shadow-sm space-y-4 font-mono text-xs">
              <div className="border-b border-gray-200 pb-3 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-gray-500 uppercase block font-bold">Team Details</span>
                  <h3 className="font-semibold text-black text-sm">TecnoX (ID: TS-0123)</h3>
                </div>
                <span className="text-[9px] bg-teal-dim text-black font-bold px-2 py-0.5 border border-teal/30">
                  IMSEC · MedTech
                </span>
              </div>

              <div className="space-y-2">
                <span className="text-[10px] text-gray-500 uppercase block font-semibold">Team Members (CS 3rd Year):</span>
                {[
                  { name: 'Anannya Das', roll: '240143165005', role: 'Team Lead' },
                  { name: 'Radhika Rastogi', roll: '2401430120143', role: 'Team Member' },
                  { name: 'Kavya Kaushik', roll: '240143165027', role: 'Team Member' },
                  { name: 'Janahavi Jha', roll: '240143165025', role: 'Team Member' },
                ].map((m) => (
                  <div key={m.roll} className="p-2 bg-gray-50 border border-gray-200 flex items-center justify-between">
                    <div>
                      <div className="font-bold text-black text-[11px]">{m.name}</div>
                      <div className="text-[10px] text-gray-500">Roll: {m.roll}</div>
                    </div>
                    <span className="text-[9px] bg-white border border-gray-300 px-1.5 py-0.5 text-gray-700 font-semibold">
                      {m.role}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Slide Index Selector */}
            <div className="bg-white border border-gray-200 p-6 shadow-sm space-y-3 font-mono text-xs">
              <span className="text-[10px] text-gray-500 uppercase tracking-wider font-bold block border-b border-gray-200 pb-2">
                Presentation Deck Slides (1–10)
              </span>

              <div className="space-y-1.5 max-h-[460px] overflow-y-auto pr-1">
                {slides.map((s) => (
                  <button
                    key={s.num}
                    onClick={() => setActiveSlide(s.num)}
                    className={`w-full p-2.5 text-left border transition-all flex items-center justify-between cursor-pointer ${
                      activeSlide === s.num
                        ? 'border-black bg-black text-white shadow-sm font-semibold'
                        : 'border-gray-200 bg-gray-50 text-gray-700 hover:border-gray-400 hover:bg-white'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] ${activeSlide === s.num ? 'text-teal' : 'text-gray-400'}`}>
                        {String(s.num).padStart(2, '0')}
                      </span>
                      <span className="text-[11px] truncate max-w-[170px]">{s.title}</span>
                    </div>
                    <span className={`text-[9px] uppercase px-1.5 py-0.5 ${activeSlide === s.num ? 'bg-teal text-black' : 'bg-gray-200 text-gray-600'}`}>
                      {s.tag}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Quick 10-Step Interactive Workflow Links */}
            <div className="bg-white border border-gray-200 p-6 shadow-sm space-y-3 font-mono text-xs">
              <span className="text-[10px] text-gray-500 uppercase tracking-wider font-bold block border-b border-gray-200 pb-2">
                10-Step Prototype Actions
              </span>
              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <Link to="/login" className="p-2 bg-gray-50 border border-gray-200 hover:border-black text-center block">
                  01 · Login
                </Link>
                <Link to="/screening/new" className="p-2 bg-gray-50 border border-gray-200 hover:border-black text-center block">
                  02 · Intake & Upload
                </Link>
                <Link to="/screening/RG-2025-0891/quality" className="p-2 bg-gray-50 border border-gray-200 hover:border-black text-center block">
                  04 · Quality Gate
                </Link>
                <Link to="/screening/RG-2025-0891/result" className="p-2 bg-gray-50 border border-gray-200 hover:border-black text-center block">
                  06 · AI Staging
                </Link>
                <Link to="/screening/RG-2025-0891/explanation" className="p-2 bg-gray-50 border border-gray-200 hover:border-black text-center block">
                  07 · Grad-CAM
                </Link>
                <Link to="/screening/RG-2025-0891/report" className="p-2 bg-gray-50 border border-gray-200 hover:border-black text-center block">
                  08 · Report & Sign
                </Link>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Slide Inspector & Embedded PDF */}
          <div className="lg:col-span-8 space-y-6">
            {/* Slide Inspector Card */}
            <div className="bg-white border border-gray-200 p-6 sm:p-8 shadow-sm space-y-6">
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-200 pb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-mono text-teal font-bold uppercase bg-black px-2 py-0.5">
                      Slide {activeSlide} of 10
                    </span>
                    <span className="text-[10px] font-mono text-gray-500 uppercase">
                      {slides[activeSlide - 1].tag}
                    </span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-light text-black">
                    {slides[activeSlide - 1].content.heading}
                  </h2>
                </div>

                {/* Navigation Controls */}
                <div className="flex items-center gap-2 self-start sm:self-auto font-mono text-xs">
                  <button
                    disabled={activeSlide === 1}
                    onClick={() => setActiveSlide((p) => Math.max(1, p - 1))}
                    className="px-3 py-1.5 border border-gray-300 disabled:opacity-40 hover:bg-gray-100 uppercase"
                  >
                    ← Prev
                  </button>
                  <button
                    disabled={activeSlide === 10}
                    onClick={() => setActiveSlide((p) => Math.min(10, p + 1))}
                    className="px-3 py-1.5 bg-black text-white hover:bg-gray-800 disabled:opacity-40 uppercase"
                  >
                    Next →
                  </button>
                </div>
              </div>

              {/* Dynamic Slide Content */}
              {activeSlide === 1 && (
                <div className="space-y-6">
                  <div className="p-5 bg-gray-50 border border-gray-200 space-y-3 font-mono text-xs">
                    <div className="text-base font-semibold text-black">
                      {slides[0].content.subtitle}
                    </div>
                    <p className="text-gray-700 leading-relaxed text-sm">
                      {slides[0].content.description}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono text-xs">
                    <div className="p-4 bg-gray-50 border border-gray-200 space-y-2">
                      <span className="text-[10px] text-gray-500 uppercase block font-bold">Track & Context</span>
                      <div className="text-black font-semibold">Track: MedTech</div>
                      <div className="text-gray-600">Event: Techspardha 2K26 Ideathon</div>
                      <div className="text-gray-600">Round 2 · Room Round</div>
                    </div>
                    <div className="p-4 bg-gray-50 border border-gray-200 space-y-2">
                      <span className="text-[10px] text-gray-500 uppercase block font-bold">Team Credentials</span>
                      <div className="text-black font-semibold">Team TecnoX [TS-0123]</div>
                      <div className="text-gray-600">Institution: IMSEC</div>
                      <div className="text-gray-600">Lead: Anannya Das (CS 3rd Year)</div>
                    </div>
                  </div>
                </div>
              )}

              {activeSlide === 2 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs">
                  {(slides[1].content.points as any[])?.map((pt) => (
                    <div key={pt.label || pt.title} className="p-4 bg-gray-50 border border-gray-200 space-y-2">
                      <span className="font-bold text-black uppercase text-[11px] block text-teal">
                        {pt.label || pt.title}
                      </span>
                      <p className="text-gray-700 leading-relaxed text-[11px]">{pt.desc || pt.text}</p>
                    </div>
                  ))}
                </div>
              )}

              {activeSlide === 3 && (
                <div className="space-y-4 font-mono text-xs">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border border-gray-200">
                      <thead>
                        <tr className="bg-gray-100 text-[10px] uppercase text-gray-600 border-b border-gray-200">
                          <th className="p-3">Solution</th>
                          <th className="p-3">Scope / Limitation</th>
                          <th className="p-3">How RetinaGuard Differs</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200 text-[11px]">
                        {slides[2].content.table?.map((row) => (
                          <tr key={row.solution}>
                            <td className="p-3 font-semibold text-black">{row.solution}</td>
                            <td className="p-3 text-gray-600">{row.limitation}</td>
                            <td className="p-3 text-emerald-800 font-medium">{row.difference}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="p-4 bg-teal-dim border border-teal/30 text-xs">
                    <strong className="text-black uppercase block mb-1">The Gap We Fill:</strong>
                    {slides[2].content.gapStatement}
                  </div>
                </div>
              )}

              {activeSlide === 4 && (
                <div className="space-y-5 font-mono text-xs">
                  <div className="grid grid-cols-2 sm:grid-cols-6 gap-2 text-center">
                    {slides[3].content.steps?.map((st) => (
                      <div key={st.step} className="p-3 bg-gray-50 border border-gray-200 space-y-1">
                        <span className="w-6 h-6 rounded-full bg-black text-white text-[10px] font-bold flex items-center justify-center mx-auto">
                          {st.step}
                        </span>
                        <div className="font-bold text-black text-[10px] mt-1">{st.title}</div>
                        <div className="text-[9px] text-gray-500">{st.desc}</div>
                      </div>
                    ))}
                  </div>

                  <div className="p-4 bg-gray-50 border border-gray-200 space-y-2">
                    <span className="font-bold text-black uppercase text-[11px] block">
                      Technology Choices & Rationale:
                    </span>
                    <ul className="space-y-1.5 list-disc list-inside text-gray-700 text-[11px]">
                      {slides[3].content.tooling?.map((t, idx) => (
                        <li key={idx}>{t}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {activeSlide === 5 && (
                <div className="space-y-6 font-mono text-xs">
                  {/* Microservices Stack */}
                  <div className="p-4 bg-gray-50 border border-gray-200 space-y-3">
                    <span className="font-bold text-black uppercase text-[11px] block border-b border-gray-200 pb-1">
                      1. System Architecture (Microservices)
                    </span>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-[11px]">
                      <div>
                        <span className="text-gray-500 block text-[9px] uppercase">Frontend:</span>
                        <span className="font-semibold text-black">React.js + Tailwind CSS</span>
                      </div>
                      <div>
                        <span className="text-gray-500 block text-[9px] uppercase">Backend:</span>
                        <span className="font-semibold text-black">FastAPI / Express Server</span>
                      </div>
                      <div>
                        <span className="text-gray-500 block text-[9px] uppercase">Image Processing:</span>
                        <span className="font-semibold text-black">OpenCV + Pillow (CLAHE)</span>
                      </div>
                      <div>
                        <span className="text-gray-500 block text-[9px] uppercase">AI Classification:</span>
                        <span className="font-semibold text-black">EfficientNet-B0 + Grad-CAM</span>
                      </div>
                      <div>
                        <span className="text-gray-500 block text-[9px] uppercase">Database:</span>
                        <span className="font-semibold text-black">PostgreSQL (Patients, Screenings)</span>
                      </div>
                      <div>
                        <span className="text-gray-500 block text-[9px] uppercase">Deployment:</span>
                        <span className="font-semibold text-black">Docker (Cloud / Edge PHC)</span>
                      </div>
                    </div>
                  </div>

                  {/* 10 Step Workflow List */}
                  <div className="space-y-2">
                    <span className="font-bold text-black uppercase text-[11px] block">
                      2. End-to-End 10-Step Workflow:
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {slides[4].content.workflowSteps?.map((ws) => (
                        <div key={ws.num} className="p-2.5 bg-gray-50 border border-gray-200 flex items-start gap-2.5">
                          <span className="w-5 h-5 rounded-full bg-black text-white text-[10px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                            {ws.num}
                          </span>
                          <div>
                            <div className="font-bold text-black text-[11px]">{ws.name}</div>
                            <div className="text-[10px] text-gray-600">{ws.detail}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeSlide === 6 && (
                <div className="space-y-4 font-mono text-xs">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border border-gray-200">
                      <thead>
                        <tr className="bg-gray-100 text-[10px] uppercase text-gray-600 border-b border-gray-200">
                          <th className="p-3">Threat Vector</th>
                          <th className="p-3">Security & Privacy Protection</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200 text-[11px]">
                        {slides[5].content.threats?.map((th) => (
                          <tr key={th.threat}>
                            <td className="p-3 font-semibold text-black">{th.threat}</td>
                            <td className="p-3 text-gray-700">{th.protection}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {activeSlide >= 7 && activeSlide <= 10 && (
                <div className="space-y-4 font-mono text-xs">
                  <div className="p-5 bg-gray-50 border border-gray-200 space-y-3">
                    <div className="text-sm font-semibold text-black">
                      {slides[activeSlide - 1].content.heading}
                    </div>
                    {slides[activeSlide - 1].content.description && (
                      <p className="text-gray-700 text-sm leading-relaxed">
                        {slides[activeSlide - 1].content.description}
                      </p>
                    )}
                    {slides[activeSlide - 1].content.points && (
                      <div className="space-y-3 pt-2">
                        {slides[activeSlide - 1].content.points?.map((p: any) => (
                          <div key={p.title || p.label} className="border-b border-gray-200 pb-2">
                            <span className="font-bold text-black uppercase text-[11px] block">{p.title || p.label}</span>
                            <span className="text-gray-600 text-[11px]">{p.text || p.desc}</span>
                          </div>
                        ))}
                      </div>
                    )}
                    {slides[activeSlide - 1].content.metrics && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                        {slides[activeSlide - 1].content.metrics?.map((m: any) => (
                          <div key={m.outcome} className="p-3 bg-white border border-gray-200">
                            <span className="font-bold text-black uppercase text-[10px] block">{m.outcome}</span>
                            <span className="text-gray-600 text-[10px] mt-1 block">{m.target}</span>
                          </div>
                        ))}
                      </div>
                    )}
                    {slides[activeSlide - 1].content.references && (
                      <div className="divide-y divide-gray-200 text-[11px]">
                        {slides[activeSlide - 1].content.references?.map((r: any) => (
                          <div key={r.num} className="py-2 flex items-center justify-between">
                            <span className="font-bold text-black">{r.num}. {r.title}</span>
                            <span className="text-gray-500 text-[10px]">{r.author}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Direct PDF Embed Section */}
              <div className="pt-6 border-t border-gray-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-gray-500 font-bold">
                    Embedded Official PDF Presentation
                  </span>
                  <a
                    href={pdfUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[10px] font-mono font-bold uppercase underline text-black hover:text-teal"
                  >
                    Open PDF in Full Window ↗
                  </a>
                </div>

                <div className="w-full h-[520px] bg-black border border-gray-300 overflow-hidden shadow-inner">
                  <iframe
                    src={`${pdfUrl}#page=${activeSlide}&view=FitH`}
                    title="Techspardha 2K26 Presentation PDF"
                    className="w-full h-full border-0"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
};
