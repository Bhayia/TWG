import React, { useState } from 'react';
import { MembershipItem } from '../types';
import { useCart } from '../context/CartContext';
import { Award, Check, Sparkles, Shield, Compass } from 'lucide-react';

interface MembershipSectionProps {
  memberships: MembershipItem[];
}

export const MembershipSection: React.FC<MembershipSectionProps> = ({ memberships }) => {
  const { setIsInquiryOpen, setInquirySubject } = useCart();
  const [selectedDuration, setSelectedDuration] = useState<'1-year' | '5-year'>('1-year');

  const filteredMemberships = memberships.filter((m) => m.tierType === selectedDuration);

  const handleJoin = (plan: MembershipItem) => {
    setInquirySubject(`Membership Application: ${plan.name} (${plan.duration} — ₹${plan.price.toLocaleString('en-IN')})`);
    setIsInquiryOpen(true);
  };

  return (
    <section id="memberships" className="relative py-28 bg-[#151210] border-t border-[#4A2819]/50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#8C281C]/20 border border-[#8C281C]/40 text-xs font-cinzel font-semibold tracking-[0.25em] uppercase text-[#D9B47A] mb-3">
            <Award className="w-3.5 h-3.5 text-[#C98224]" />
            Sacred Fellowship
          </div>

          <h2 className="font-cinzel text-3xl sm:text-4xl md:text-5xl font-bold tracking-wide uppercase text-[#F6EBD4] leading-tight">
            DON'T JUST ATTEND THE JOURNEY. <br />
            <span className="text-[#C98224]">BECOME PART OF IT.</span>
          </h2>

          <p className="mt-4 font-serif-cormorant italic text-lg sm:text-2xl text-[#D9B47A]">
            Membership opens continuous study, intimate sangha discourses, priority retreat access, and international expeditions.
          </p>

          {/* 1-Year vs 5-Year Duration Toggle */}
          <div className="mt-8 inline-flex p-1.5 rounded-full bg-[#1C1814] border border-[#4A2819]">
            <button
              onClick={() => setSelectedDuration('1-year')}
              className={`px-6 py-2 rounded-full text-xs font-cinzel font-bold tracking-wider transition-all cursor-pointer ${
                selectedDuration === '1-year'
                  ? 'bg-gradient-to-r from-[#C98224] to-[#8C281C] text-[#F6EBD4] shadow-md'
                  : 'text-[#D9B47A]/70 hover:text-[#F6EBD4]'
              }`}
            >
              1-Year Annual Fellowships
            </button>
            <button
              onClick={() => setSelectedDuration('5-year')}
              className={`px-6 py-2 rounded-full text-xs font-cinzel font-bold tracking-wider transition-all cursor-pointer ${
                selectedDuration === '5-year'
                  ? 'bg-gradient-to-r from-[#C98224] to-[#8C281C] text-[#F6EBD4] shadow-md'
                  : 'text-[#D9B47A]/70 hover:text-[#F6EBD4]'
              }`}
            >
              5-Year Global Fellowships
            </button>
          </div>
        </div>

        {/* Membership Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredMemberships.map((plan) => (
            <div
              key={plan.id}
              className={`rounded-2xl p-7 flex flex-col justify-between transition-all duration-300 relative shadow-2xl ${
                plan.featured
                  ? 'bg-[#1E1915] border-2 border-[#C98224] shadow-[#C98224]/20 scale-102'
                  : 'bg-[#181513] border border-[#4A2819] hover:border-[#D9B47A]/50'
              }`}
            >
              {plan.featured && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-0.5 rounded-full bg-[#C98224] text-[#12100E] text-[10px] font-cinzel font-bold uppercase tracking-widest shadow-md">
                  Most Chosen Path
                </div>
              )}

              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-cinzel text-xl font-bold uppercase tracking-wide text-[#F6EBD4]">
                    {plan.name}
                  </h3>
                  <Award className="w-5 h-5 text-[#C98224]" />
                </div>

                <div className="font-serif-cormorant italic text-xs text-[#D9B47A] min-h-[32px]">
                  {plan.tagline}
                </div>

                {/* Pricing Block */}
                <div className="my-6 pb-6 border-b border-[#4A2819]/60">
                  <div className="text-3xl font-cinzel font-bold text-[#F6EBD4]">
                    ₹{plan.price.toLocaleString('en-IN')}
                  </div>
                  <div className="text-[11px] font-cinzel uppercase tracking-widest text-[#D9B47A]/70 mt-1">
                    {plan.period}
                  </div>
                </div>

                {/* Highlights */}
                <div className="space-y-2 mb-6">
                  <div className="p-2.5 rounded-xl bg-[#12100E]/80 border border-[#4A2819]/50 text-xs">
                    <span className="text-[#D9B47A] font-semibold block">Classes / Sessions</span>
                    <span className="text-[#F6EBD4]">{plan.sessionsCount}</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-[#12100E]/80 border border-[#4A2819]/50 text-xs">
                    <span className="text-[#D9B47A] font-semibold block">International Scope</span>
                    <span className="text-[#F6EBD4]">{plan.internationalAccess}</span>
                  </div>
                </div>

                {/* Detailed Benefits List */}
                <ul className="space-y-3 text-xs text-[#F6EBD4]/75 mb-6">
                  {plan.benefits.map((benefit, idx) => (
                    <li key={idx} className="flex items-start gap-2.5">
                      <Check className="w-4 h-4 text-[#C98224] shrink-0 mt-0.5" />
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <button
                onClick={() => handleJoin(plan)}
                className={`w-full py-3 rounded-xl font-cinzel font-bold text-xs tracking-[0.2em] uppercase transition-all cursor-pointer ${
                  plan.featured
                    ? 'bg-gradient-to-r from-[#C98224] to-[#8C281C] text-[#F6EBD4] hover:brightness-110 shadow-lg shadow-[#8C281C]/30'
                    : 'bg-[#4A2819]/50 hover:bg-[#4A2819] text-[#D9B47A] hover:text-[#F6EBD4] border border-[#4A2819]'
                }`}
              >
                Join Fellowship
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
