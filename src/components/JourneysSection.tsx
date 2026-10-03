import React, { useState } from 'react';
import { JourneyItem } from '../types';
import { useCart } from '../context/CartContext';
import { Compass, MapPin, Calendar, Clock, ArrowRight, Sparkles } from 'lucide-react';

interface JourneysSectionProps {
  journeys: JourneyItem[];
}

export const JourneysSection: React.FC<JourneysSectionProps> = ({ journeys }) => {
  const { setIsInquiryOpen, setInquirySubject } = useCart();
  const [selectedCountry, setSelectedCountry] = useState<string>('All');

  const countries = ['All', 'India', 'Nepal', 'Malaysia'];

  const filteredJourneys =
    selectedCountry === 'All'
      ? journeys
      : journeys.filter((j) => j.country === selectedCountry);

  const handleInquireJourney = (journey: JourneyItem) => {
    setInquirySubject(`Journey Enquiry: ${journey.title} (${journey.country} — ${journey.duration})`);
    setIsInquiryOpen(true);
  };

  return (
    <section id="journeys" className="relative py-28 bg-[#12100E] border-t border-[#4A2819]/50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#C98224]/20 border border-[#C98224]/40 text-xs font-cinzel font-semibold tracking-[0.25em] uppercase text-[#D9B47A] mb-3">
            <Compass className="w-3.5 h-3.5 text-[#C98224]" />
            Sacred Pilgrimages
          </div>

          <h2 className="font-cinzel text-3xl sm:text-4xl md:text-5xl font-bold tracking-wide uppercase text-[#F6EBD4]">
            TRAVEL BEYOND PLACES. <br />
            <span className="text-[#C98224]">TRAVEL WITHIN.</span>
          </h2>

          <p className="mt-4 font-serif-cormorant italic text-lg sm:text-2xl text-[#D9B47A]">
            Destinations curated not for commercial sightseeing, but as living gateways into inner stillness, timeless philosophy, and sacred geography.
          </p>

          {/* Country Tabs */}
          <div className="mt-8 inline-flex p-1.5 rounded-full bg-[#181513] border border-[#4A2819]">
            {countries.map((c) => (
              <button
                key={c}
                onClick={() => setSelectedCountry(c)}
                className={`px-5 py-1.5 rounded-full text-xs font-cinzel font-bold tracking-wider transition-all cursor-pointer ${
                  selectedCountry === c
                    ? 'bg-[#C98224] text-[#12100E] shadow-md'
                    : 'text-[#D9B47A]/70 hover:text-[#F6EBD4]'
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        {/* Journeys Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {filteredJourneys.map((j) => (
            <div
              key={j.id}
              className="rounded-3xl bg-[#181513] border border-[#4A2819] overflow-hidden hover:border-[#C98224]/70 transition-all duration-500 hover:-translate-y-2 shadow-2xl flex flex-col justify-between group"
            >
              <div>
                {/* Image */}
                <div className="relative h-60 w-full overflow-hidden">
                  <img
                    src={j.image}
                    alt={j.title}
                    className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#181513] via-transparent to-black/30" />
                  <span className="absolute top-4 left-4 px-3 py-1 rounded-full bg-[#8C281C]/90 text-[#F6EBD4] text-[11px] font-cinzel font-bold uppercase tracking-wider border border-[#D9B47A]/30">
                    {j.country}
                  </span>
                  <span className="absolute bottom-4 right-4 px-3 py-1 rounded-full bg-[#12100E]/80 text-[#D9B47A] text-xs font-cinzel font-semibold backdrop-blur-md">
                    {j.duration}
                  </span>
                </div>

                {/* Content */}
                <div className="p-6 sm:p-7 space-y-4">
                  <h3 className="font-cinzel text-xl font-bold uppercase text-[#F6EBD4] group-hover:text-[#D9B47A] transition-colors leading-snug">
                    {j.title}
                  </h3>

                  <div className="flex items-start gap-2 text-xs text-[#C98224] font-medium">
                    <MapPin className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                    <span>{j.route}</span>
                  </div>

                  <p className="text-xs sm:text-sm text-[#F6EBD4]/75 leading-relaxed">
                    {j.description}
                  </p>

                  {/* Highlights */}
                  <div className="pt-2">
                    <div className="text-[11px] font-cinzel uppercase tracking-wider text-[#D9B47A] mb-2">
                      Key Experiences
                    </div>
                    <ul className="space-y-1.5 text-xs text-[#F6EBD4]/70">
                      {j.highlights.slice(0, 3).map((hl, idx) => (
                        <li key={idx} className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#C98224]" />
                          <span className="truncate">{hl}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Bottom Footer Price & Button */}
              <div className="p-6 pt-0 border-t border-[#4A2819]/40 mt-4 flex items-center justify-between">
                <div>
                  <div className="text-[10px] font-cinzel uppercase tracking-widest text-[#D9B47A]/70">
                    Pilgrim Rate
                  </div>
                  <div className="text-xl font-cinzel font-bold text-[#F6EBD4]">
                    ₹{j.price.toLocaleString('en-IN')}
                  </div>
                </div>

                <button
                  onClick={() => handleInquireJourney(j)}
                  className="px-4 py-2.5 rounded-xl bg-[#4A2819]/60 hover:bg-gradient-to-r hover:from-[#C98224] hover:to-[#8C281C] text-[#D9B47A] hover:text-[#F6EBD4] border border-[#4A2819] hover:border-transparent font-cinzel text-xs font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1.5"
                >
                  Itinerary <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
