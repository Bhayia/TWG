import React from 'react';
import { ConsultationItem } from '../types';
import { useCart } from '../context/CartContext';
import { MessageSquare, Clock, Video, Sparkles, Calendar } from 'lucide-react';

interface ConsultationSectionProps {
  consultations: ConsultationItem[];
}

export const ConsultationSection: React.FC<ConsultationSectionProps> = ({ consultations }) => {
  const { setSelectedConsultation, setIsInquiryOpen, setInquirySubject } = useCart();

  const handleBook = (c: ConsultationItem) => {
    setSelectedConsultation(c);
    setInquirySubject(`Consultation Request: ${c.title} (${c.duration} — ₹${c.price})`);
    setIsInquiryOpen(true);
  };

  return (
    <section id="consultation" className="relative py-28 bg-[#12100E] border-t border-[#4A2819]/50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#8C281C]/20 border border-[#8C281C]/40 text-xs font-cinzel font-semibold tracking-[0.25em] uppercase text-[#D9B47A] mb-3">
            <MessageSquare className="w-3.5 h-3.5 text-[#C98224]" />
            Personal Guidance
          </div>

          <h2 className="font-cinzel text-3xl sm:text-4xl md:text-5xl font-bold tracking-wide uppercase text-[#F6EBD4]">
            SOMETIMES THE JOURNEY <br />
            <span className="text-[#C98224]">NEEDS A CONVERSATION</span>
          </h2>

          <p className="mt-4 font-serif-cormorant italic text-lg sm:text-2xl text-[#D9B47A]">
            Private, confidential dialogues with senior Acharyas to untangle life questions, cultivate emotional clarity, and harmonize your daily lifestyle with Dharma.
          </p>
        </div>

        {/* Consultations Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {consultations.map((c) => (
            <div
              key={c.id}
              className="p-8 rounded-3xl bg-[#181513] border border-[#4A2819] hover:border-[#C98224] transition-all duration-300 shadow-xl flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="p-3 rounded-2xl bg-[#4A2819]/30 border border-[#4A2819] text-[#C98224]">
                    <Clock className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-cinzel text-[#D9B47A] border border-[#4A2819] px-3 py-1 rounded-full">
                    {c.duration}
                  </span>
                </div>

                <h3 className="font-cinzel text-xl font-bold uppercase text-[#F6EBD4] leading-snug">
                  {c.title}
                </h3>

                <p className="text-xs sm:text-sm text-[#F6EBD4]/75 leading-relaxed">
                  {c.description}
                </p>

                <div className="pt-2">
                  <div className="text-[10px] font-cinzel uppercase tracking-wider text-[#D9B47A]/70 mb-2">
                    Available Formats
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {c.availableModes.map((m, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 rounded-lg bg-[#12100E] border border-[#4A2819] text-[11px] text-[#F6EBD4]/80 flex items-center gap-1.5"
                      >
                        <Video className="w-3 h-3 text-[#C98224]" />
                        {m}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-[#4A2819]/40 flex items-center justify-between">
                <div>
                  <div className="text-[10px] font-cinzel uppercase tracking-widest text-[#D9B47A]/70">
                    Dakshina / Fee
                  </div>
                  <div className="text-xl font-cinzel font-bold text-[#F6EBD4]">
                    ₹{c.price.toLocaleString('en-IN')}
                  </div>
                </div>

                <button
                  onClick={() => handleBook(c)}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#C98224] to-[#8C281C] text-[#F6EBD4] font-cinzel text-xs font-bold uppercase tracking-wider hover:brightness-110 shadow-lg shadow-[#8C281C]/20 transition-all cursor-pointer flex items-center gap-2"
                >
                  <Calendar className="w-3.5 h-3.5 text-[#D9B47A]" />
                  Book Dialogue
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
