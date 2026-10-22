import React from 'react';
import { Link } from 'react-router-dom';
import { PublicLayout } from '../components/layout/PublicLayout';

/* â”€â”€ Static data â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
const stats = [
  { value: '77M+',  label: 'Diabetics in India' },
  { value: '25K',   label: 'Ophthalmologists available' },
  { value: '94.8%', label: 'AI model accuracy' },
  { value: '<1s',   label: 'Edge inference latency' },
];

const pillars = [
  {
    num: '01',
    title: 'Automated Fundus Quality Gate',
    body: 'Before running disease classifiers, an optical analysis module flags motion blur, poor pupillary dilation, and non-uniform illumination to prevent false negatives.',
    metric: 'Accuracy Rate: 99.1%',
  },
  {
    num: '02',
    title: 'Grad-CAM Biomarker Localization',
    body: 'Class Activation Maps highlight exact spatial quadrants responsible for predictions â€” pinpointing microaneurysms, intraretinal hemorrhages, and venous beading.',
    metric: 'Pixel-level Saliency',
  },
  {
    num: '03',
    title: 'Offline-First Edge Inference',
    body: 'Quantized ONNX models operate on standard laptops in zero-connectivity environments, batching encrypted telemetry once 4G is restored.',
    metric: 'Sub-second Latency',
  },
];

const steps = [
  { n: '1', title: 'Upload Image',   desc: 'Capture and upload retinal fundus image via camera or file.' },
  { n: '2', title: 'Quality Check',  desc: 'AI validates image quality before running the classifier.' },
  { n: '3', title: 'AI Grading',     desc: 'Severity grade + Grad-CAM heat map generated in < 1 second.' },
  { n: '4', title: 'Report & Refer', desc: 'PDF report generated for referral or local patient record.' },
];

export const LandingPage: React.FC = () => {
  return (
    <PublicLayout>

      {/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
          HERO â€” Full-bleed B&W eye photo + teal accents
      â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */}
      <section className="relative min-h-screen flex items-center overflow-hidden" data-purpose="hero-viewport">

        {/* Background eye photo */}
        <img
          src="/hero-eye.jpg"
          alt="Macro close-up of a human eye"
          className="absolute inset-0 w-full h-full object-cover object-center"
          fetchPriority="high"
        />

        {/* Dark left gradient overlay */}
        <div className="absolute inset-0 image-overlay-left" />
        {/* Bottom fade to black */}
        <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-black via-black/60 to-transparent" />

        {/* Teal-tinted grid lines */}
        <div className="grid-line-h" style={{ top: '32%' }} />
        <div className="grid-line-h" style={{ top: '64%' }} />
        <div className="grid-line-v" style={{ left: '58%' }} />

        {/* Hero content */}
        <div className="relative z-20 w-full max-w-[1440px] mx-auto px-6 lg:px-16 pt-36 pb-32">
          <div className="max-w-3xl">

            {/* Eyebrow with teal dot */}
            <div className="flex items-center gap-3 mb-8 animate-fade-up">
              <span className="teal-dot animate-pulse-teal" />
              <span className="label-mono text-white/60">
                AI-Assisted Retinal Screening Â· Rural India
              </span>
            </div>

            {/* Headline */}
            <h1 className="text-5xl sm:text-6xl lg:text-[82px] font-light text-white leading-[1.04] tracking-tight mb-8 animate-fade-up animate-fade-up-delay-1">
              See the signs.<br />
              <span className="font-bold" style={{ color: 'var(--c-teal)' }}>Understand</span>{' '}
              <span className="font-bold text-white">the insight.</span>
            </h1>

            {/* Sub */}
            <p className="text-lg text-white/55 max-w-xl leading-relaxed mb-12 animate-fade-up animate-fade-up-delay-2">
              Explainable, clinic-grade AI for rapid diabetic retinopathy screening
              through retinal fundus images â€” built for low-connectivity rural health centers.
            </p>

            {/* CTA row */}
            <div className="flex flex-wrap gap-4 animate-fade-up animate-fade-up-delay-3">
              <Link to="/screening/new" className="btn-primary py-4 px-9">
                Start Screening
              </Link>
              <Link to="/train" className="btn-outline-white py-4 px-9 border-teal text-white">
                Train Model (4 Datasets)
              </Link>
              <a href="#how-it-works" className="btn-outline-white py-4 px-7">
                How It Works
              </a>
            </div>
          </div>
        </div>

        {/* Stats strip pinned to bottom */}
        <div className="absolute bottom-0 left-0 right-0 z-20">
          <div className="max-w-[1440px] mx-auto px-0 grid grid-cols-2 md:grid-cols-4 border-t border-white/10">
            {stats.map((s, i) => (
              <div
                key={s.label}
                className={`py-5 px-8 glass-dark ${i < stats.length - 1 ? 'border-r border-white/10' : ''}`}
              >
                <div className="text-2xl sm:text-3xl font-bold mb-1" style={{ color: 'var(--c-teal)' }}>
                  {s.value}
                </div>
                <div className="label-mono text-white/35 text-[10px]">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
          SECTION 2 â€” Dark: Retinal vessel BG + pillars
      â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */}
      <section className="relative overflow-hidden bg-black py-32 sm:py-40" id="how-it-works">

        {/* Vessel texture */}
        <img
          src="/retinal-vessels.jpg"
          alt="Retinal blood vessel map"
          className="absolute inset-0 w-full h-full object-cover opacity-[0.18]"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black via-black/60 to-black pointer-events-none" />

        {/* Teal glow orb (decorative) */}
        <div
          className="absolute top-1/2 right-1/3 -translate-y-1/2 w-[600px] h-[600px] rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(0,194,168,0.06) 0%, transparent 70%)' }}
        />

        <div className="relative z-10 max-w-[1440px] mx-auto px-6 lg:px-16">

          {/* Header */}
          <div className="mb-20 max-w-2xl">
            <span className="teal-label block mb-4">Methodology & Architecture</span>
            <h2 className="text-4xl sm:text-5xl font-light text-white leading-tight tracking-tight">
              Clinical confidence begins with<br />
              <span className="font-bold text-white">explainable verification.</span>
            </h2>
            <p className="mt-6 text-white/45 text-base leading-relaxed max-w-xl">
              Traditional black-box networks lack physician trust in remote setups.
              RetinaGuard pairs every severity grade with direct histological evidence.
            </p>
          </div>

          {/* Three pillar cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-white/[0.06]">
            {pillars.map((p) => (
              <article
                key={p.num}
                className="bg-[#0d0d0d] p-10 flex flex-col justify-between group hover:bg-[#111] transition-colors"
              >
                <div>
                  {/* Large dim number */}
                  <div className="font-mono text-5xl font-bold mb-8 leading-none" style={{ color: 'rgba(0,194,168,0.18)' }}>
                    {p.num}
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-4 tracking-tight group-hover:text-[#00C2A8] transition-colors">
                    {p.title}
                  </h3>
                  <p className="text-sm text-white/45 leading-relaxed">{p.body}</p>
                </div>
                <div className="mt-10 pt-6 border-t border-white/8 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full" style={{ background: 'var(--c-teal)' }} />
                  <span className="label-mono text-[10px]" style={{ color: 'var(--c-teal)' }}>{p.metric}</span>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
          SECTION 3 â€” Light: 4-step workflow
      â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */}
      <section className="bg-white py-32 sm:py-40 border-b border-gray-200">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-start">

            {/* Left */}
            <div className="lg:sticky lg:top-32">
              <span className="teal-label block mb-5">4-Step Protocol</span>
              <h2 className="text-4xl sm:text-5xl font-light leading-tight tracking-tight text-black mb-6">
                From fundus image<br />to clinical insight<br />
                <span className="font-bold">in four steps.</span>
              </h2>
              <p className="text-gray-500 leading-relaxed max-w-md mb-10">
                Designed for community health workers with minimal ophthalmology training â€”
                the entire workflow is guided, audio-instructed, and works offline.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link to="/screening/new" className="btn-primary py-3.5 px-8">
                  Try It Now
                </Link>
                <Link to="/how-it-works" className="btn-outline py-3.5 px-8">
                  Learn More
                </Link>
              </div>
            </div>

            {/* Right â€” steps */}
            <div>
              {steps.map((step, i) => (
                <div
                  key={step.n}
                  className={`flex gap-6 py-8 ${i < steps.length - 1 ? 'border-b border-gray-200' : ''} group`}
                >
                  {/* Circle number with teal fill on hover */}
                  <div
                    className="flex-shrink-0 w-11 h-11 rounded-full border-2 border-black/20 flex items-center justify-center font-mono font-bold text-sm text-black transition-all group-hover:border-[#00C2A8] group-hover:bg-[#00C2A8] group-hover:text-black"
                  >
                    {step.n}
                  </div>
                  <div>
                    <div className="font-semibold text-black text-sm mb-2 group-hover:text-[#009E88] transition-colors">
                      {step.title}
                    </div>
                    <p className="text-sm text-black/45 leading-relaxed">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
          SECTION 4 â€” Black impact strip
      â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */}
      <section className="relative bg-black overflow-hidden py-28 sm:py-36">

        {/* Faint vessel texture */}
        <img
          src="/retinal-vessels.jpg"
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover opacity-[0.06]"
        />

        {/* Teal glow left */}
        <div
          className="absolute left-0 top-0 bottom-0 w-[500px] pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at left center, rgba(0,194,168,0.08) 0%, transparent 70%)' }}
        />

        <div className="relative z-10 max-w-[1440px] mx-auto px-6 lg:px-16 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-12">
          <div className="max-w-2xl">
            <span className="teal-label block mb-5">Public Health Impact</span>
            <h2 className="text-4xl sm:text-5xl font-light text-white leading-tight">
              77 million diabetics.<br />
              <span className="font-bold text-white">25,000 ophthalmologists.</span>
            </h2>
            <p className="mt-6 text-white/45 text-base leading-relaxed max-w-xl">
              RetinaGuard enables community health workers to screen at high volume,
              referring only actionable Stage 2+ DR patients to tertiary hospitals â€”
              closing a critical gap in rural eye care across India.
            </p>
            {/* Key highlights */}
            <div className="mt-10 grid grid-cols-3 gap-6">
              {[
                { n: '3Ã—', sub: 'Faster than manual screening' },
                { n: '98%', sub: 'Sensitivity on Stage 3+ DR' },
                { n: '60+', sub: 'PHC deployments piloted' },
              ].map((item) => (
                <div key={item.sub}>
                  <div className="text-2xl font-bold mb-1" style={{ color: 'var(--c-teal)' }}>{item.n}</div>
                  <div className="text-[11px] text-white/35 leading-snug">{item.sub}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-4 flex-shrink-0">
            <Link to="/screening/new" className="btn-primary py-4 px-12">
              Start Eye Scan
            </Link>
            <Link to="/login" className="btn-outline-white py-4 px-12">
              Clinician Sign In
            </Link>
          </div>
        </div>
      </section>

    </PublicLayout>
  );
};

