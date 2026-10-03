import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { db } from '../lib/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { BookingRecord, OrderRecord } from '../types';
import { BrandLogo } from './BrandLogo';
import {
  User,
  Award,
  Calendar,
  ShoppingBag,
  BookOpen,
  Download,
  CheckCircle2,
  Clock,
  ArrowLeft,
  Sparkles,
  ExternalLink,
} from 'lucide-react';

interface MemberPortalProps {
  onBackToWebsite: () => void;
}

export const MemberPortal: React.FC<MemberPortalProps> = ({ onBackToWebsite }) => {
  const { user, userProfile, signOut } = useAuth();
  const [activeTab, setActiveTab] = useState<'bookings' | 'orders' | 'materials'>('bookings');
  const [bookings, setBookings] = useState<BookingRecord[]>([]);
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadUserData() {
      if (!user?.email) {
        setLoading(false);
        return;
      }

      try {
        // Query user's bookings
        const bq = query(collection(db, 'bookings'), where('attendeeEmail', '==', user.email.toLowerCase()));
        const bSnap = await getDocs(bq);
        const bList: BookingRecord[] = [];
        bSnap.forEach((doc) => bList.push({ id: doc.id, ...doc.data() } as BookingRecord));
        setBookings(bList);

        // Query user's orders
        const oq = query(collection(db, 'orders'), where('customerEmail', '==', user.email.toLowerCase()));
        const oSnap = await getDocs(oq);
        const oList: OrderRecord[] = [];
        oSnap.forEach((doc) => oList.push({ id: doc.id, ...doc.data() } as OrderRecord));
        setOrders(oList);
      } catch (err) {
        console.warn('Error fetching member records from Firestore:', err);
      } finally {
        setLoading(false);
      }
    }

    loadUserData();
  }, [user]);

  const studyMaterials = [
    {
      title: 'Atmopadesha Satakam (One Hundred Verses of Self-Instruction)',
      author: 'Sree Narayana Guru',
      description: 'The crowning masterpiece of Advaitic wisdom translated into Malayalam & English commentary.',
      pages: '48 Pages PDF',
    },
    {
      title: 'Daiva Dasakam (Ten Verses to God)',
      author: 'Universal Prayer for Humanity',
      description: 'Chanted daily in meditation sanctuaries. Commentary on unity and surrender.',
      pages: '12 Pages PDF',
    },
    {
      title: 'The Bio-Electromagnetism of Himalayan Rudrakshas',
      author: 'Dr. Madhavan Namboothiri',
      description: 'Scientific and Ayurvedic insights on nervous system stabilization through sacred beads.',
      pages: '24 Pages PDF',
    },
    {
      title: 'Nada Yoga & Acoustic Vibrational Healing Guide',
      author: 'Aparna Krishnan',
      description: 'Daily breath and sound resonance exercises for morning sadhana.',
      pages: '18 Pages PDF',
    },
  ];

  return (
    <div className="min-h-screen bg-[#12100E] text-[#F6EBD4] pt-24 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-[#4A2819]">
          <div className="flex items-center gap-4">
            <button
              onClick={onBackToWebsite}
              className="p-2 rounded-xl bg-[#181513] border border-[#4A2819] text-[#D9B47A] hover:text-white transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <div className="text-[11px] font-cinzel uppercase tracking-widest text-[#C98224]">
                Seeker Sanctum
              </div>
              <h1 className="font-cinzel text-2xl sm:text-3xl font-bold uppercase text-[#F6EBD4]">
                Member Sanctuary
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs text-[#D9B47A]/75">
              {user?.email}
            </span>
            <button
              onClick={() => signOut()}
              className="px-3.5 py-1.5 rounded-full border border-[#4A2819] text-xs font-cinzel text-[#D9B47A] hover:text-white transition-colors"
            >
              Sign Out
            </button>
          </div>
        </div>

        {/* Member Status Card */}
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#1C1814] via-[#241A14] to-[#1C1814] border border-[#C98224]/50 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-[#8C281C]/40 border border-[#C98224] flex items-center justify-center text-[#C98224]">
              <Award className="w-8 h-8" />
            </div>
            <div>
              <div className="text-xs font-cinzel uppercase tracking-widest text-[#C98224]">
                Active Fellowship
              </div>
              <h2 className="font-cinzel text-xl sm:text-2xl font-bold text-[#F6EBD4]">
                {userProfile?.displayName || 'Honored Seeker'}
              </h2>
              <p className="text-xs text-[#D9B47A] font-serif-cormorant italic">
                Member ID: TWG-{(user?.uid || '84920').slice(0, 8).toUpperCase()}
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="p-3 rounded-2xl bg-[#12100E]/80 border border-[#4A2819] text-center min-w-[110px]">
              <div className="text-[10px] font-cinzel uppercase text-[#D9B47A]">Retreats</div>
              <div className="font-cinzel text-xl font-bold text-[#F6EBD4] mt-0.5">
                {bookings.length}
              </div>
            </div>
            <div className="p-3 rounded-2xl bg-[#12100E]/80 border border-[#4A2819] text-center min-w-[110px]">
              <div className="text-[10px] font-cinzel uppercase text-[#D9B47A]">Store Orders</div>
              <div className="font-cinzel text-xl font-bold text-[#F6EBD4] mt-0.5">
                {orders.length}
              </div>
            </div>
          </div>
        </div>

        {/* Portal Navigation Tabs */}
        <div className="flex border-b border-[#4A2819] gap-4">
          <button
            onClick={() => setActiveTab('bookings')}
            className={`pb-3 font-cinzel text-xs sm:text-sm font-bold tracking-wider uppercase flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
              activeTab === 'bookings'
                ? 'border-[#C98224] text-[#C98224]'
                : 'border-transparent text-[#F6EBD4]/60 hover:text-[#D9B47A]'
            }`}
          >
            <Calendar className="w-4 h-4" />
            My Retreat Passes ({bookings.length})
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className={`pb-3 font-cinzel text-xs sm:text-sm font-bold tracking-wider uppercase flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
              activeTab === 'orders'
                ? 'border-[#C98224] text-[#C98224]'
                : 'border-transparent text-[#F6EBD4]/60 hover:text-[#D9B47A]'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            Store Purchases ({orders.length})
          </button>

          <button
            onClick={() => setActiveTab('materials')}
            className={`pb-3 font-cinzel text-xs sm:text-sm font-bold tracking-wider uppercase flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
              activeTab === 'materials'
                ? 'border-[#C98224] text-[#C98224]'
                : 'border-transparent text-[#F6EBD4]/60 hover:text-[#D9B47A]'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            Study Materials
          </button>
        </div>

        {/* Tab 1: Bookings */}
        {activeTab === 'bookings' && (
          <div className="space-y-4">
            {bookings.length === 0 ? (
              <div className="text-center py-16 p-8 rounded-3xl bg-[#181513] border border-[#4A2819] space-y-3">
                <Calendar className="w-10 h-10 text-[#4A2819] mx-auto" />
                <p className="font-cinzel text-base text-[#D9B47A]">No Registered Retreats Yet</p>
                <p className="text-xs text-[#F6EBD4]/60 max-w-sm mx-auto">
                  Join the 2-day Guruvinae Ariyan retreat in Athirappilly to begin your experiential journey.
                </p>
                <button
                  onClick={onBackToWebsite}
                  className="mt-2 px-6 py-2.5 rounded-full bg-gradient-to-r from-[#C98224] to-[#8C281C] text-[#F6EBD4] font-cinzel text-xs font-bold uppercase tracking-wider"
                >
                  Explore Upcoming Retreats
                </button>
              </div>
            ) : (
              bookings.map((b) => (
                <div
                  key={b.id}
                  className="p-6 rounded-2xl bg-[#181513] border border-[#4A2819] flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded bg-[#C98224]/20 border border-[#C98224] text-[#C98224] text-[10px] font-cinzel font-bold uppercase">
                        {b.status}
                      </span>
                      <span className="text-xs font-mono text-[#D9B47A]/70">
                        Ref: {b.id.slice(0, 10)}
                      </span>
                    </div>
                    <h3 className="font-cinzel text-lg font-bold text-[#F6EBD4]">
                      {b.eventTitle}
                    </h3>
                    <p className="text-xs text-[#F6EBD4]/70">
                      Attendee: <span className="text-white font-medium">{b.attendeeName}</span> ({b.ticketCount} Pass)
                    </p>
                  </div>

                  <div className="text-right">
                    <div className="text-xs text-[#D9B47A]">Dakshina Paid</div>
                    <div className="font-cinzel text-xl font-bold text-[#F6EBD4]">
                      ₹{b.totalAmount.toLocaleString('en-IN')}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Tab 2: Orders */}
        {activeTab === 'orders' && (
          <div className="space-y-4">
            {orders.length === 0 ? (
              <div className="text-center py-16 p-8 rounded-3xl bg-[#181513] border border-[#4A2819] space-y-3">
                <ShoppingBag className="w-10 h-10 text-[#4A2819] mx-auto" />
                <p className="font-cinzel text-base text-[#D9B47A]">No Store Orders Found</p>
                <p className="text-xs text-[#F6EBD4]/60 max-w-sm mx-auto">
                  Explore genuine Nepalese 5-Mukhi Rudrakshas and natural botanical temple attars.
                </p>
              </div>
            ) : (
              orders.map((o) => (
                <div
                  key={o.id}
                  className="p-6 rounded-2xl bg-[#181513] border border-[#4A2819] space-y-4"
                >
                  <div className="flex items-center justify-between border-b border-[#4A2819]/50 pb-3">
                    <div>
                      <span className="text-xs font-mono text-[#D9B47A]">Order #{o.id.slice(0, 8)}</span>
                      <div className="text-[11px] text-[#F6EBD4]/60">{new Date(o.createdAt).toLocaleDateString()}</div>
                    </div>
                    <span className="px-2.5 py-1 rounded-full bg-[#4A2819] text-[#D9B47A] text-[10px] font-cinzel font-bold uppercase">
                      {o.status}
                    </span>
                  </div>

                  <div className="space-y-2">
                    {o.items?.map((item, idx) => (
                      <div key={idx} className="flex justify-between text-xs text-[#F6EBD4]/80">
                        <span>
                          {item.name} × {item.quantity}
                        </span>
                        <span className="font-semibold">₹{(item.price * item.quantity).toLocaleString('en-IN')}</span>
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-between border-t border-[#4A2819]/50 pt-3 text-xs">
                    <span className="text-[#D9B47A]">Ship to: {o.shippingAddress}</span>
                    <span className="font-cinzel font-bold text-base text-[#F6EBD4]">
                      Total: ₹{o.totalAmount.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Tab 3: Study Materials */}
        {activeTab === 'materials' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {studyMaterials.map((mat, idx) => (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-[#181513] border border-[#4A2819] flex flex-col justify-between space-y-4 hover:border-[#C98224] transition-colors"
              >
                <div>
                  <div className="flex items-center justify-between text-[11px] text-[#C98224] font-cinzel mb-2">
                    <span>{mat.author}</span>
                    <span>{mat.pages}</span>
                  </div>
                  <h3 className="font-cinzel text-base font-bold text-[#F6EBD4] mb-2">
                    {mat.title}
                  </h3>
                  <p className="text-xs text-[#F6EBD4]/70 leading-relaxed font-sans">
                    {mat.description}
                  </p>
                </div>

                <button
                  onClick={() => alert(`Accessing "${mat.title}". Direct encrypted download prepared for member.`)}
                  className="w-full py-2.5 rounded-xl bg-[#4A2819]/50 hover:bg-[#4A2819] text-[#D9B47A] hover:text-[#F6EBD4] border border-[#4A2819] text-xs font-cinzel font-semibold tracking-wider uppercase transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  Download Sanctum PDF
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
