import React, { useState } from 'react';
import { EventItem } from '../types';
import { useCart } from '../context/CartContext';
import {
  Calendar,
  MapPin,
  Clock,
  Users,
  CheckCircle2,
  CalendarPlus,
  Ticket,
  Sparkles,
  ChevronRight,
} from 'lucide-react';

interface EventProgrammeProps {
  event: EventItem;
}

export const EventProgrammeSection: React.FC<EventProgrammeProps> = ({ event }) => {
  const { setSelectedEventForBooking } = useCart();
  const [activeDay, setActiveDay] = useState<number>(1);

  const currentDaySchedule = event.schedule?.find((d) => d.day === activeDay) || event.schedule?.[0];

  // Google Calendar one-click link generator
  const getGoogleCalendarUrl = () => {
    const title = encodeURIComponent(`Travel With Guru: ${event.title}`);
    const details = encodeURIComponent(
      `${event.subtitle}\n\nVenue: ${event.location}\nIncludes: 2 days residential retreat, sattvic sadya, guided meditation, and Sree Narayana Guru philosophy masterclasses.`
    );
    const location = encodeURIComponent(event.location);
    // 2026-11-14T08:00:00 to 2026-11-15T18:00:00 UTC
    const dates = '20261114T023000Z/20261115T123000Z';
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${dates}&details=${details}&location=${location}`;
  };

  const seatsLeft = Math.max(0, event.capacity - event.bookedCount);
  const percentageBooked = Math.round((event.bookedCount / event.capacity) * 100);

  return (
    <section id="programmes" className="relative py-28 bg-[#12100E] border-t border-[#4A2819]/50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#C98224]/20 border border-[#C98224]/40 text-xs font-cinzel font-semibold tracking-[0.25em] uppercase text-[#D9B47A] mb-3">
            <Sparkles className="w-3.5 h-3.5 text-[#C98224]" />
            First Flagship Programme
          </div>

          <h2 className="font-cinzel text-3xl sm:text-4xl md:text-5xl font-bold tracking-wide uppercase text-[#F6EBD4]">
            GURUVINAE ARIYAN <br />
            <span className="text-[#C98224]">GURUVINODOPPAM</span>
          </h2>

          <p className="mt-3 font-serif-cormorant italic text-xl md:text-2xl text-[#D9B47A]">
            {event.subtitle}
          </p>
        </div>

        {/* Master Programme Feature Card */}
        <div className="rounded-3xl bg-[#181513] border border-[#4A2819] overflow-hidden shadow-2xl">
          {/* Card Top Banner / Media Header */}
          <div className="relative h-72 md:h-96 w-full overflow-hidden">
            <img
              src={event.heroImage || '/src/assets/images/twg_event_retreat_1790837641748.jpg'}
              alt={event.title}
              loading="lazy"
              decoding="async"
              className="w-full h-full object-cover object-center filter contrast-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#181513] via-[#181513]/50 to-transparent" />

            {/* Quick Meta Badges on image */}
            <div className="absolute top-6 left-6 flex flex-wrap gap-2">
              <span className="px-3.5 py-1.5 rounded-full bg-[#8C281C]/90 backdrop-blur-md text-[#F6EBD4] text-xs font-cinzel font-bold tracking-wider uppercase border border-[#D9B47A]/30">
                2 Days Residential
              </span>
              <span className="px-3.5 py-1.5 rounded-full bg-[#12100E]/80 backdrop-blur-md text-[#D9B47A] text-xs font-cinzel font-semibold tracking-wider uppercase border border-[#4A2819]">
                Athirappilly, Kerala
              </span>
            </div>

            {/* Price badge */}
            <div className="absolute bottom-6 right-6 text-right bg-[#12100E]/85 backdrop-blur-md p-4 rounded-2xl border border-[#C98224]/50 shadow-xl">
              <div className="text-[11px] font-cinzel uppercase tracking-widest text-[#D9B47A]">
                Retreat Pass
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl sm:text-3xl font-bold font-cinzel text-[#F6EBD4]">
                  ₹{event.ticketPrice.toLocaleString('en-IN')}
                </span>
                {event.earlyBirdPrice && (
                  <span className="text-sm line-through text-neutral-400">
                    ₹{event.earlyBirdPrice.toLocaleString('en-IN')}
                  </span>
                )}
              </div>
              <div className="text-[10px] text-[#C98224] font-medium mt-0.5">
                All-inclusive with stay & meals
              </div>
            </div>
          </div>

          {/* Card Body Grid */}
          <div className="p-6 sm:p-10 grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Left Column: Details & Schedule (7 Cols) */}
            <div className="lg:col-span-7 space-y-8">
              <div>
                <h3 className="font-cinzel text-xl font-bold text-[#F6EBD4] mb-3">
                  About The Spiritual Gathering
                </h3>
                <p className="text-sm sm:text-base text-[#F6EBD4]/80 leading-relaxed font-sans">
                  {event.description}
                </p>
              </div>

              {/* Day 1 vs Day 2 Timeline Switcher */}
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-[#4A2819] pb-3">
                  <h4 className="font-cinzel text-base font-bold uppercase tracking-wider text-[#D9B47A]">
                    Programme Journey Schedule
                  </h4>
                  <div className="flex gap-2" role="tablist" aria-label="Retreat Daily Schedule">
                    {event.schedule?.map((d) => (
                      <button
                        key={d.day}
                        role="tab"
                        aria-selected={activeDay === d.day}
                        onClick={() => setActiveDay(d.day)}
                        className={`px-4 py-1.5 rounded-full text-xs font-cinzel font-bold transition-all cursor-pointer ${
                          activeDay === d.day
                            ? 'bg-[#C98224] text-[#12100E] shadow-md'
                            : 'bg-[#4A2819]/40 text-[#D9B47A] hover:bg-[#4A2819]'
                        }`}
                      >
                        Day {d.day}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="text-xs font-cinzel text-[#C98224] tracking-wider mb-2">
                  {currentDaySchedule?.dayTitle} • {currentDaySchedule?.date}
                </div>

                {/* Vertical Timeline Items */}
                <div className="space-y-3 max-h-[380px] overflow-y-auto pr-2">
                  {currentDaySchedule?.items.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-xl bg-[#1C1814] border border-[#4A2819]/50 hover:border-[#C98224]/50 transition-colors flex items-start gap-4"
                    >
                      <div className="shrink-0 w-20 text-[11px] font-mono font-bold text-[#C98224] pt-0.5">
                        {item.time}
                      </div>
                      <div className="space-y-1">
                        <div className="text-sm font-semibold text-[#F6EBD4]">
                          {item.title}
                        </div>
                        {item.description && (
                          <div className="text-xs text-[#F6EBD4]/65 leading-relaxed">
                            {item.description}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Acharyas & Speakers */}
              <div>
                <h4 className="font-cinzel text-sm font-bold uppercase tracking-wider text-[#D9B47A] mb-3">
                  Guiding Acharyas
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {event.speakers?.map((sp, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl bg-[#1C1814] border border-[#4A2819]/40 text-center"
                    >
                      <div className="font-cinzel text-xs font-bold text-[#F6EBD4]">
                        {sp.name}
                      </div>
                      <div className="text-[11px] text-[#C98224] mt-0.5">
                        {sp.role}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column: Inclusions, Capacity & Booking Box (5 Cols) */}
            <div className="lg:col-span-5 flex flex-col justify-between space-y-6 bg-[#151210] p-6 sm:p-8 rounded-2xl border border-[#4A2819]">
              <div className="space-y-6">
                <div>
                  <h4 className="font-cinzel text-sm font-bold uppercase tracking-wider text-[#D9B47A] mb-3">
                    What Is Included
                  </h4>
                  <ul className="space-y-2.5">
                    {event.inclusions?.map((inc, idx) => (
                      <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-[#F6EBD4]/80">
                        <CheckCircle2 className="w-4 h-4 text-[#C98224] shrink-0 mt-0.5" />
                        <span>{inc}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Capacity Counter Progress Bar */}
                <div className="p-4 rounded-xl bg-[#1C1814] border border-[#4A2819]/50 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-cinzel text-[#D9B47A] flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-[#C98224]" />
                      Sanctuary Capacity
                    </span>
                    <span className="font-bold text-[#F6EBD4]">
                      {event.bookedCount} / {event.capacity} Filled ({percentageBooked}%)
                    </span>
                  </div>
                  <div
                    className="w-full bg-[#12100E] h-2 rounded-full overflow-hidden border border-[#4A2819]"
                    role="progressbar"
                    aria-valuenow={percentageBooked}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-label="Sanctuary Reservation Capacity"
                  >
                    <div
                      className="bg-gradient-to-r from-[#C98224] to-[#8C281C] h-full rounded-full transition-all duration-1000"
                      style={{ width: `${percentageBooked}%` }}
                    />
                  </div>
                  <div className="text-[11px] text-[#C98224] font-medium text-right">
                    {seatsLeft} places remaining for this batch
                  </div>
                </div>

                {/* Venue Detail */}
                <div className="flex items-start gap-3 p-3.5 rounded-xl bg-[#1C1814] border border-[#4A2819]/40 text-xs text-[#F6EBD4]/75">
                  <MapPin className="w-4 h-4 text-[#8C281C] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-[#F6EBD4] block">
                      Sacred Riverside Sanctuary
                    </span>
                    {event.location}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3 pt-4 border-t border-[#4A2819]/40">
                <button
                  onClick={() => setSelectedEventForBooking(event)}
                  className="w-full py-4 rounded-xl bg-gradient-to-r from-[#C98224] via-[#8C281C] to-[#4A2819] text-[#F6EBD4] font-cinzel font-bold text-sm tracking-[0.2em] uppercase hover:brightness-110 shadow-xl shadow-[#8C281C]/30 border border-[#D9B47A]/30 transition-all hover:scale-[1.02] cursor-pointer flex items-center justify-center gap-2"
                >
                  <Ticket className="w-4 h-4 text-[#D9B47A]" />
                  Book Your Seat Now
                </button>

                <a
                  href={getGoogleCalendarUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 rounded-xl bg-[#1C1814] hover:bg-[#4A2819]/50 border border-[#4A2819] text-[#D9B47A] hover:text-[#F6EBD4] font-cinzel text-xs font-semibold tracking-wider uppercase transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <CalendarPlus className="w-4 h-4 text-[#C98224]" />
                  Add to Google Calendar
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
