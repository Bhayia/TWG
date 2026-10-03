import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { db } from '../lib/firebase';
import { collection, addDoc } from 'firebase/firestore';
import { BookingRecord } from '../types';
import confetti from 'canvas-confetti';
import {
  X,
  Calendar,
  MapPin,
  CheckCircle2,
  CalendarPlus,
  Sparkles,
  Ticket,
  AlertCircle,
} from 'lucide-react';

export const BookingModal: React.FC = () => {
  const { selectedEventForBooking, setSelectedEventForBooking, showToast } = useCart();
  const { user } = useAuth();

  const [ticketCount, setTicketCount] = useState<number>(1);
  const [name, setName] = useState<string>(user?.displayName || '');
  const [email, setEmail] = useState<string>(user?.email || '');
  const [phone, setPhone] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [confirmedBookingId, setConfirmedBookingId] = useState<string | null>(null);

  // Background scroll lock and escape listener
  React.useEffect(() => {
    if (!selectedEventForBooking) return;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedEventForBooking]);

  if (!selectedEventForBooking) return null;

  const event = selectedEventForBooking;
  const unitPrice = event.earlyBirdPrice || event.ticketPrice;
  const totalAmount = unitPrice * ticketCount;

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !phone.trim()) {
      showToast('Please provide your complete name, email, and phone number.');
      return;
    }

    setIsSubmitting(true);
    try {
      const bookingData: Omit<BookingRecord, 'id'> = {
        eventId: event.id,
        eventTitle: event.title,
        attendeeName: name.trim(),
        attendeeEmail: email.trim().toLowerCase(),
        attendeePhone: phone.trim(),
        ticketCount,
        totalAmount,
        status: 'confirmed',
        paymentMethod: 'UPI / Direct Bank Transfer Verification',
        notes: notes.trim(),
        createdAt: new Date().toISOString(),
      };

      const docRef = await addDoc(collection(db, 'bookings'), bookingData);
      setConfirmedBookingId(docRef.id);

      // Trigger celebration confetti
      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#C98224', '#8C281C', '#D9B47A', '#F6EBD4'],
        });
      } catch {}

      showToast('Sacred Retreat Reservation Confirmed!');
    } catch (err: any) {
      console.error('Error recording booking in Firestore:', err);
      showToast('Unable to complete reservation. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getGoogleCalendarUrl = () => {
    const title = encodeURIComponent(`Travel With Guru: ${event.title}`);
    const details = encodeURIComponent(
      `Retreat Pass for ${name}\nBooking Ref: ${confirmedBookingId}\nTickets: ${ticketCount}\n\nVenue: ${event.location}\nIncludes: 2 days residential retreat, sattvic sadya, guided meditation, and Sree Narayana Guru philosophy masterclasses.`
    );
    const location = encodeURIComponent(event.location);
    const dates = '20261114T023000Z/20261115T123000Z';
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${dates}&details=${details}&location=${location}`;
  };

  const handleClose = () => {
    setSelectedEventForBooking(null);
    setConfirmedBookingId(null);
  };

  return (
    <div
      onClick={handleClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-300"
      role="dialog"
      aria-modal="true"
      aria-labelledby="booking-modal-title"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-xl bg-[#181513] border border-[#4A2819] rounded-3xl p-6 sm:p-8 shadow-2xl max-h-[90vh] overflow-y-auto"
      >
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-5 right-5 p-2 rounded-full text-[#F6EBD4]/70 hover:text-white hover:bg-[#4A2819]/50 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {confirmedBookingId ? (
          /* Confirmation Success State */
          <div className="text-center py-6 space-y-5 animate-in zoom-in-95 duration-500">
            <div className="w-16 h-16 rounded-full bg-[#C98224]/20 border border-[#C98224] mx-auto flex items-center justify-center text-[#C98224]">
              <CheckCircle2 className="w-9 h-9" />
            </div>

            <div className="space-y-1">
              <h3 className="font-cinzel text-2xl font-bold uppercase text-[#F6EBD4]">
                Reservation Confirmed
              </h3>
              <p className="font-serif-cormorant italic text-base text-[#D9B47A]">
                Your place on the path has been reserved.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#12100E] border border-[#4A2819] text-left text-xs space-y-2 text-[#F6EBD4]/80">
              <div className="flex justify-between border-b border-[#4A2819]/50 pb-1.5">
                <span className="text-[#D9B47A]">Booking Reference:</span>
                <span className="font-mono font-bold text-[#C98224]">{confirmedBookingId}</span>
              </div>
              <div className="flex justify-between">
                <span>Attendee:</span>
                <span className="font-semibold text-white">{name}</span>
              </div>
              <div className="flex justify-between">
                <span>Programme:</span>
                <span className="font-semibold text-white">{event.title}</span>
              </div>
              <div className="flex justify-between">
                <span>Passes:</span>
                <span>{ticketCount} Adult Participant(s)</span>
              </div>
              <div className="flex justify-between border-t border-[#4A2819]/50 pt-1.5">
                <span className="font-bold text-[#D9B47A]">Total Dakshina:</span>
                <span className="font-bold font-cinzel text-base text-[#F6EBD4]">
                  ₹{totalAmount.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            <div className="space-y-3 pt-2">
              <a
                href={getGoogleCalendarUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 rounded-xl bg-[#4A2819]/80 hover:bg-[#4A2819] border border-[#D9B47A]/50 text-[#F6EBD4] font-cinzel text-xs font-bold tracking-wider uppercase transition-colors flex items-center justify-center gap-2"
              >
                <CalendarPlus className="w-4 h-4 text-[#C98224]" />
                Add to My Google Calendar
              </a>

              <button
                onClick={handleClose}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-[#C98224] to-[#8C281C] text-[#F6EBD4] font-cinzel text-xs font-bold tracking-wider uppercase"
              >
                Done / Back to Website
              </button>
            </div>
          </div>
        ) : (
          /* Booking Form State */
          <div>
            <div className="mb-6 border-b border-[#4A2819]/50 pb-4">
              <div className="text-[11px] font-cinzel uppercase tracking-widest text-[#C98224] mb-1 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                Programme Registration
              </div>
              <h3 className="font-cinzel text-2xl font-bold uppercase text-[#F6EBD4]">
                {event.title}
              </h3>
              <p className="font-serif-cormorant italic text-sm text-[#D9B47A]">
                {event.subtitle}
              </p>
            </div>

            <form onSubmit={handleBookingSubmit} className="space-y-4">
              {/* Event Meta Recap */}
              <div className="p-3.5 rounded-xl bg-[#12100E] border border-[#4A2819]/60 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 text-[#D9B47A]">
                  <Calendar className="w-4 h-4 text-[#C98224]" />
                  <span>2 Days (Nov 14 - 15)</span>
                </div>
                <div className="flex items-center gap-2 text-[#D9B47A]">
                  <MapPin className="w-4 h-4 text-[#8C281C]" />
                  <span>Athirappilly, Kerala</span>
                </div>
              </div>

              {/* Attendee Details */}
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-cinzel tracking-wider uppercase text-[#D9B47A] mb-1">
                    Your Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your full name"
                    className="w-full px-4 py-2.5 rounded-xl bg-[#12100E] border border-[#4A2819] text-[#F6EBD4] text-sm focus:outline-none focus:border-[#C98224]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-cinzel tracking-wider uppercase text-[#D9B47A] mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your.email@domain.com"
                      className="w-full px-4 py-2.5 rounded-xl bg-[#12100E] border border-[#4A2819] text-[#F6EBD4] text-sm focus:outline-none focus:border-[#C98224]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-cinzel tracking-wider uppercase text-[#D9B47A] mb-1">
                      WhatsApp / Phone *
                    </label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 98460 XXXXX"
                      className="w-full px-4 py-2.5 rounded-xl bg-[#12100E] border border-[#4A2819] text-[#F6EBD4] text-sm focus:outline-none focus:border-[#C98224]"
                    />
                  </div>
                </div>

                {/* Ticket Quantity */}
                <div>
                  <label className="block text-xs font-cinzel tracking-wider uppercase text-[#D9B47A] mb-1">
                    Number of Attendees
                  </label>
                  <div className="flex items-center space-x-3">
                    {[1, 2, 3, 4].map((n) => (
                      <button
                        type="button"
                        key={n}
                        onClick={() => setTicketCount(n)}
                        className={`flex-1 py-2 rounded-xl text-xs font-cinzel font-bold border transition-all cursor-pointer ${
                          ticketCount === n
                            ? 'bg-[#C98224] text-[#12100E] border-[#C98224]'
                            : 'bg-[#12100E] text-[#D9B47A] border-[#4A2819] hover:border-[#D9B47A]'
                        }`}
                      >
                        {n} {n === 1 ? 'Seat' : 'Seats'}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Dietary / Special Notes */}
                <div>
                  <label className="block text-xs font-cinzel tracking-wider uppercase text-[#D9B47A] mb-1">
                    Special Accommodations / Dietary Notes (Optional)
                  </label>
                  <textarea
                    rows={2}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="E.g. Pure Jain Sattvic diet, ground floor cottage preference..."
                    className="w-full px-4 py-2 rounded-xl bg-[#12100E] border border-[#4A2819] text-[#F6EBD4] text-xs focus:outline-none focus:border-[#C98224]"
                  />
                </div>
              </div>

              {/* Price Calculation */}
              <div className="p-4 rounded-xl bg-[#12100E] border border-[#4A2819] space-y-1.5 text-xs">
                <div className="flex justify-between text-[#F6EBD4]/75">
                  <span>Pass Rate ({ticketCount} × ₹{unitPrice.toLocaleString('en-IN')})</span>
                  <span>₹{totalAmount.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between font-bold text-sm text-[#F6EBD4] border-t border-[#4A2819]/50 pt-1.5">
                  <span className="font-cinzel text-[#D9B47A]">Total Amount:</span>
                  <span className="font-cinzel text-base text-[#F6EBD4]">
                    ₹{totalAmount.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#C98224] via-[#8C281C] to-[#4A2819] text-[#F6EBD4] font-cinzel font-bold text-xs sm:text-sm tracking-[0.2em] uppercase hover:brightness-110 shadow-xl shadow-[#8C281C]/30 border border-[#D9B47A]/30 transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <Ticket className="w-4 h-4 text-[#D9B47A]" />
                {isSubmitting ? 'Confirming Place...' : 'Confirm Reservation'}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
