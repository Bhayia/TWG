import React, { useState } from 'react';
import { FaqItem } from '../types';
import { BrandLogo } from './BrandLogo';
import { Users, Quote, ChevronDown, ChevronUp, Sparkles, BookOpen, Award, Compass } from 'lucide-react';

interface CommunitySectionProps {
  faqs: FaqItem[];
  onProgrammeClick: () => void;
  onMembershipClick: () => void;
}

export const CommunitySection: React.FC<CommunitySectionProps> = ({
  faqs,
  onProgrammeClick,
  onMembershipClick,
}) => {
  const [openFaq, setOpenFaq] = useState<string | null>(faqs[0]?.id || null);

  const testimonials = [
    {
      quote:
        'Walking the quiet morning path during the retreat completely changed how I experience pressure in corporate leadership. Sree Narayana Guru’s philosophy became a living compass for me.',
      author: 'Rajesh Menon',
      location: 'Bangalore • Entrepreneur',
      event: 'Kerala Heritage Seeker',
    },
    {
      quote:
        'The sound therapy and dawn Nilavilakku pooja at Athirappilly was one of the purest spiritual experiences of my adult life. Truly sacred and devoid of commercialism.',
      author: 'Dr. Priya Varma',
      location: 'Kochi • Healthcare Professional',
      event: 'Guru Sadhana Member',
    },
    {
      quote:
        'To meditate where the stone Shiva Lingam was consecrated by Guru himself brought chills of reverence. Travel With Guru is not a vacation company — it is an awakening.',
      author: 'Siddharth Nair',
      location: 'Dubai / Kerala • Global Fellow',
      event: 'Pilgrim & Life Mission Member',
    },
  ];

  return (
    <section id="community" className="relative py-28 bg-[#151210] border-t border-[#4A2819]/50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#C98224]/20 border border-[#C98224]/40 text-xs font-cinzel font-semibold tracking-[0.25em] uppercase text-[#D9B47A] mb-3">
            <Users className="w-3.5 h-3.5 text-[#C98224]" />
            The Sacred Sangha
          </div>

          <h2 className="font-cinzel text-3xl sm:text-4xl md:text-5xl font-bold tracking-wide uppercase text-[#F6EBD4]">
            WALK <span className="text-[#C98224]">TOGETHER</span>
          </h2>

          <p className="mt-4 font-serif-cormorant italic text-lg sm:text-2xl text-[#D9B47A]">
            "Progress is not an isolated mountain peak. It is a shared pilgrimage of consciousness."
          </p>
        </div>

        {/* Testimonials 3 Columns */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
          {testimonials.map((t, idx) => (
            <div
              key={idx}
              className="p-8 rounded-3xl bg-[#181513] border border-[#4A2819] relative flex flex-col justify-between shadow-xl"
            >
              <div>
                <Quote className="w-8 h-8 text-[#8C281C] mb-4 opacity-70" />
                <p className="font-serif-cormorant italic text-base sm:text-lg text-[#F6EBD4]/90 leading-relaxed mb-6">
                  "{t.quote}"
                </p>
              </div>

              <div className="pt-4 border-t border-[#4A2819]/40">
                <div className="font-cinzel text-sm font-bold text-[#D9B47A]">
                  {t.author}
                </div>
                <div className="text-xs text-[#F6EBD4]/60 mt-0.5">{t.location}</div>
                <div className="text-[11px] text-[#C98224] font-medium mt-1">
                  {t.event}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* FAQ Accordion Section */}
        <div className="max-w-3xl mx-auto mb-28">
          <div className="text-center mb-10">
            <h3 className="font-cinzel text-2xl font-bold uppercase text-[#F6EBD4]">
              Frequently Asked Questions
            </h3>
            <p className="text-xs sm:text-sm text-[#D9B47A] mt-2 font-serif-cormorant italic">
              Clarifications regarding our retreats, memberships, and sacred ethics.
            </p>
          </div>

          <div className="space-y-3">
            {faqs.map((faq) => {
              const isOpen = openFaq === faq.id;
              return (
                <div
                  key={faq.id}
                  className="rounded-2xl bg-[#181513] border border-[#4A2819] overflow-hidden transition-colors"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : faq.id)}
                    aria-expanded={isOpen}
                    aria-controls={`faq-answer-${faq.id}`}
                    className="w-full p-5 text-left flex items-center justify-between text-sm sm:text-base font-cinzel font-semibold text-[#F6EBD4] hover:text-[#D9B47A] transition-colors cursor-pointer"
                  >
                    <span>{faq.question}</span>
                    {isOpen ? (
                      <ChevronUp className="w-4 h-4 text-[#C98224] shrink-0 ml-3" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-[#D9B47A]/70 shrink-0 ml-3" />
                    )}
                  </button>
                  {isOpen && (
                    <div
                      id={`faq-answer-${faq.id}`}
                      role="region"
                      aria-labelledby={`faq-btn-${faq.id}`}
                      className="p-5 pt-0 text-xs sm:text-sm text-[#F6EBD4]/75 leading-relaxed font-sans border-t border-[#4A2819]/30"
                    >
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Master Final Call to Action Section (TWG-FINAL-07) */}
        <div className="rounded-3xl bg-gradient-to-b from-[#1C1814] to-[#12100E] border-2 border-[#C98224]/50 p-8 sm:p-16 text-center shadow-2xl relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_#8C281C_0%,_transparent_75%)] opacity-20 pointer-events-none" />

          <div className="relative z-10 max-w-2xl mx-auto space-y-6">
            <BrandLogo variant="iconOnly" size="lg" theme="dark" />

            <h3 className="font-cinzel text-3xl sm:text-4xl md:text-5xl font-bold tracking-wider uppercase text-[#F6EBD4] leading-tight">
              YOUR JOURNEY BEGINS <br />
              <span className="text-[#C98224]">WITH A STEP.</span>
            </h3>

            <p className="font-serif-cormorant italic text-lg sm:text-2xl text-[#D9B47A]">
              Whether joining the 2-day Guruvinae Ariyan retreat in Athirappilly, participating in continuous membership, or exploring the Himalayan silence of Nepal.
            </p>

            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={onProgrammeClick}
                className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-gradient-to-r from-[#C98224] via-[#8C281C] to-[#4A2819] text-[#F6EBD4] font-cinzel font-bold text-xs sm:text-sm tracking-[0.2em] uppercase hover:brightness-110 shadow-2xl shadow-[#8C281C]/40 border border-[#D9B47A]/30 transition-all hover:scale-105 cursor-pointer"
              >
                Explore Programmes
              </button>
              <button
                onClick={onMembershipClick}
                className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-[#181513] hover:bg-[#4A2819]/40 border border-[#D9B47A]/40 text-[#D9B47A] hover:text-[#F6EBD4] font-cinzel font-bold text-xs sm:text-sm tracking-[0.2em] uppercase transition-all cursor-pointer"
              >
                Become a Member
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
