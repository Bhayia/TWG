import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { db } from '../lib/firebase';
import { collection, addDoc } from 'firebase/firestore';
import { InquiryRecord } from '../types';
import { X, Send, CheckCircle2, Sparkles, MessageSquare } from 'lucide-react';

export const InquiryModal: React.FC = () => {
  const { isInquiryOpen, setIsInquiryOpen, inquirySubject, showToast } = useCart();
  const { user } = useAuth();

  const [name, setName] = useState(user?.displayName || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSent, setIsSent] = useState(false);

  // Background scroll lock and escape listener
  React.useEffect(() => {
    if (!isInquiryOpen) return;
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
  }, [isInquiryOpen]);

  if (!isInquiryOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) {
      showToast('Please provide your name, email, and message.');
      return;
    }

    setIsSubmitting(true);
    try {
      const inquiryData: Omit<InquiryRecord, 'id'> = {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        phone: phone.trim(),
        subject: inquirySubject || 'General Sacred Inquiry',
        message: message.trim(),
        type: inquirySubject.includes('Consultation')
          ? 'consultation'
          : inquirySubject.includes('Membership')
          ? 'general'
          : 'general',
        status: 'new',
        createdAt: new Date().toISOString(),
      };

      await addDoc(collection(db, 'inquiries'), inquiryData);
      setIsSent(true);
      showToast('Your message has been received by our Sanctuary.');
    } catch (err) {
      console.error('Error recording inquiry in Firestore:', err);
      showToast('Unable to transmit inquiry. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setIsInquiryOpen(false);
    setIsSent(false);
    setMessage('');
  };

  return (
    <div
      onClick={handleClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300"
      role="dialog"
      aria-modal="true"
      aria-label="Sanctuary Dialogue Modal"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-lg bg-[#181513] border border-[#4A2819] rounded-3xl p-6 sm:p-8 shadow-2xl"
      >
        <button
          onClick={handleClose}
          className="absolute top-5 right-5 p-2 rounded-full text-[#F6EBD4]/70 hover:text-white hover:bg-[#4A2819]/50 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {isSent ? (
          <div className="text-center py-8 space-y-4">
            <CheckCircle2 className="w-14 h-14 text-[#C98224] mx-auto animate-bounce" />
            <h3 className="font-cinzel text-2xl font-bold uppercase text-[#F6EBD4]">
              Message Received
            </h3>
            <p className="font-serif-cormorant italic text-base text-[#D9B47A]">
              Our sanctuary coordinators will review your inquiry with contemplation and respond via email or WhatsApp shortly.
            </p>
            <button
              onClick={handleClose}
              className="mt-4 px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#C98224] to-[#8C281C] text-[#F6EBD4] font-cinzel text-xs font-bold uppercase tracking-wider"
            >
              Close
            </button>
          </div>
        ) : (
          <div>
            <div className="mb-6 border-b border-[#4A2819]/50 pb-4">
              <div className="text-[11px] font-cinzel uppercase tracking-widest text-[#C98224] mb-1 flex items-center gap-1.5">
                <MessageSquare className="w-3.5 h-3.5" />
                Sanctuary Dialogue
              </div>
              <h3 className="font-cinzel text-xl font-bold uppercase text-[#F6EBD4]">
                {inquirySubject || 'Sacred Inquiry'}
              </h3>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-cinzel text-[#D9B47A] mb-1">
                  Your Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your name"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#12100E] border border-[#4A2819] text-[#F6EBD4] text-xs focus:outline-none focus:border-[#C98224]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-cinzel text-[#D9B47A] mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@email.com"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#12100E] border border-[#4A2819] text-[#F6EBD4] text-xs focus:outline-none focus:border-[#C98224]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-cinzel text-[#D9B47A] mb-1">
                    Phone / WhatsApp
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 XXXXX XXXXX"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#12100E] border border-[#4A2819] text-[#F6EBD4] text-xs focus:outline-none focus:border-[#C98224]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-cinzel text-[#D9B47A] mb-1">
                  Your Question or Intention *
                </label>
                <textarea
                  required
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Share your spiritual inquiry, preferred consultation time, or custom journey request..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#12100E] border border-[#4A2819] text-[#F6EBD4] text-xs focus:outline-none focus:border-[#C98224]"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-[#C98224] to-[#8C281C] text-[#F6EBD4] font-cinzel text-xs font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <Send className="w-3.5 h-3.5" />
                {isSubmitting ? 'Sending...' : 'Transmit Message to Sanctuary'}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
