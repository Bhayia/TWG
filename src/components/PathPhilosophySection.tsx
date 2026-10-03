import React from 'react';
import { Sparkles, Compass, Flame, Heart, Eye, Sun, Mountain } from 'lucide-react';

interface PathPhilosophyProps {
  aboutPhilosophy?: string;
}

export const PathPhilosophySection: React.FC<PathPhilosophyProps> = ({ aboutPhilosophy }) => {
  const steps = [
    {
      num: '01',
      title: 'SEEK',
      subtitle: 'The Call Beyond The Surface',
      desc: 'The journey begins when you pause the noise of modern existence and turn your attention toward the deeper question: Who am I, and how shall I walk this earth with peace?',
      icon: <Eye className="w-5 h-5 text-[#C98224]" />,
    },
    {
      num: '02',
      title: 'EXPERIENCE',
      subtitle: 'Living Tradition & Direct Feeling',
      desc: 'Wisdom cannot remain a theoretical concept. Through dawn meditation, sacred sound resonance, Ayurvedic living, and holy pilgrim ground, wisdom becomes felt reality.',
      icon: <Flame className="w-5 h-5 text-[#C98224]" />,
    },
    {
      num: '03',
      title: 'UNDERSTAND',
      subtitle: 'The Clarity of Universal Truth',
      desc: 'Grounding your life in the non-dual truth: "One in kind, one in faith, one in God is humankind." Erasing artificial divisions of mind and discovering inner oneness.',
      icon: <Sun className="w-5 h-5 text-[#C98224]" />,
    },
    {
      num: '04',
      title: 'TRANSFORM',
      subtitle: 'Living With Purpose & Stillness',
      desc: 'Walking back into family, leadership, and work with tranquil steadiness. The journey does not end when you leave the sanctuary — your life becomes the sanctuary.',
      icon: <Heart className="w-5 h-5 text-[#C98224]" />,
    },
  ];

  return (
    <section id="philosophy" className="relative py-28 bg-[#151210] border-t border-[#4A2819]/40 overflow-hidden">
      {/* Sacred Watermark Background */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-[radial-gradient(circle,_#C98224_0%,_transparent_70%)] opacity-5 pointer-events-none blur-3xl" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Eyebrow & Title */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#8C281C]/20 border border-[#8C281C]/50 text-xs font-cinzel font-semibold tracking-[0.25em] uppercase text-[#D9B47A] mb-4">
            <Sparkles className="w-3.5 h-3.5 text-[#C98224]" />
            The Sacred Foundation
          </div>

          <h2 className="font-cinzel text-3xl sm:text-4xl md:text-5xl font-bold tracking-wide uppercase text-[#F6EBD4] leading-tight">
            THE PATH <span className="text-[#C98224]">OF WISDOM</span>
          </h2>

          <p className="mt-5 font-serif-cormorant text-xl md:text-2xl text-[#D9B47A] italic leading-relaxed">
            {aboutPhilosophy ||
              'Travel With Guru brings together profound spiritual philosophy, wellness practices, reflection, sacred community, and transformative journeys inspired by Sree Narayana Guru and the silence of Shiva Mayam.'}
          </p>
        </div>

        {/* 4 Steps Journey Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((s, idx) => (
            <div
              key={s.title}
              className="relative p-7 rounded-2xl bg-[#1A1613] border border-[#4A2819]/60 hover:border-[#C98224] transition-all duration-500 hover:-translate-y-1.5 shadow-xl group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-6">
                  <span className="font-cinzel text-2xl font-bold text-[#8C281C] group-hover:text-[#C98224] transition-colors">
                    {s.num}
                  </span>
                  <div className="p-2.5 rounded-full bg-[#4A2819]/40 border border-[#4A2819]">
                    {s.icon}
                  </div>
                </div>

                <h3 className="font-cinzel text-lg font-bold tracking-wider uppercase text-[#F6EBD4] group-hover:text-[#D9B47A] transition-colors">
                  {s.title}
                </h3>
                <div className="font-serif-cormorant italic text-sm text-[#C98224] mb-3">
                  {s.subtitle}
                </div>
                <p className="text-sm text-[#F6EBD4]/75 leading-relaxed">
                  {s.desc}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-[#4A2819]/40 flex items-center justify-between text-[11px] font-cinzel tracking-widest text-[#D9B47A]/60 uppercase">
                <span>Stage {idx + 1}</span>
                <span className="group-hover:translate-x-1 transition-transform text-[#C98224]">→</span>
              </div>
            </div>
          ))}
        </div>

        {/* Dual Spiritual Heritage Balance (Sree Narayana Guru + Shiva Mayam) */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Card 1: Sree Narayana Guru */}
          <div className="p-8 rounded-2xl bg-gradient-to-br from-[#1C1814] to-[#251A14] border border-[#8C281C]/40 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#C98224]/10 rounded-full blur-2xl pointer-events-none" />
            <div className="flex items-center gap-3 mb-4">
              <Sun className="w-6 h-6 text-[#C98224]" />
              <h3 className="font-cinzel text-xl font-bold uppercase tracking-wider text-[#F6EBD4]">
                Sree Narayana Guru
              </h3>
            </div>
            <div className="font-serif-cormorant italic text-base text-[#D9B47A] mb-3">
              Knowledge • Universal Equality • Education • Transformation
            </div>
            <p className="text-sm text-[#F6EBD4]/80 leading-relaxed mb-4">
              "One in kind, one in faith, one in God is humankind." The master revolutionary of Kerala taught that enlightenment is neither dogmatic nor elitist. True wisdom liberates human potential through education, dignity, self-reliance, and universal fellowship.
            </p>
            <div className="flex flex-wrap gap-2 text-xs font-medium text-[#D9B47A]">
              <span className="px-2.5 py-1 rounded bg-[#4A2819]/60 border border-[#4A2819]">Advaita Vedanta</span>
              <span className="px-2.5 py-1 rounded bg-[#4A2819]/60 border border-[#4A2819]">Sivagiri Tradition</span>
              <span className="px-2.5 py-1 rounded bg-[#4A2819]/60 border border-[#4A2819]">Social Oneness</span>
            </div>
          </div>

          {/* Card 2: Shiva Mayam */}
          <div className="p-8 rounded-2xl bg-gradient-to-br from-[#1C1814] to-[#1A1822] border border-[#4A2819] relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#D9B47A]/10 rounded-full blur-2xl pointer-events-none" />
            <div className="flex items-center gap-3 mb-4">
              <Mountain className="w-6 h-6 text-[#D9B47A]" />
              <h3 className="font-cinzel text-xl font-bold uppercase tracking-wider text-[#F6EBD4]">
                Shiva Mayam
              </h3>
            </div>
            <div className="font-serif-cormorant italic text-base text-[#D9B47A] mb-3">
              Stillness • Sacred Silence • Water & Stone • Eternal Consciousness
            </div>
            <p className="text-sm text-[#F6EBD4]/80 leading-relaxed mb-4">
              Shiva is not merely a mythological form; it is the primordial stillness from which all cosmos vibrates and into which all thought dissolves. Expressed through natural mountain pathways, sacred waters of Kerala, the sacred flame, and unshakeable inner silence.
            </p>
            <div className="flex flex-wrap gap-2 text-xs font-medium text-[#D9B47A]">
              <span className="px-2.5 py-1 rounded bg-[#4A2819]/60 border border-[#4A2819]">Primordial Stillness</span>
              <span className="px-2.5 py-1 rounded bg-[#4A2819]/60 border border-[#4A2819]">Holy Consecration</span>
              <span className="px-2.5 py-1 rounded bg-[#4A2819]/60 border border-[#4A2819]">Nada & Sound</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
