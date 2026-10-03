import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { db } from '../../lib/firebase';
import {
  collection,
  doc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
} from 'firebase/firestore';
import {
  SiteSettings,
  EventItem,
  MembershipItem,
  ProductItem,
  JourneyItem,
  BookingRecord,
  OrderRecord,
  InquiryRecord,
} from '../../types';
import { forceReseedFirestore } from '../../lib/seedFirestore';
import {
  Shield,
  LayoutDashboard,
  Settings,
  Calendar,
  Award,
  ShoppingBag,
  Compass,
  Users,
  MessageSquare,
  Image as ImageIcon,
  Sparkles,
  Save,
  RotateCcw,
  CheckCircle2,
  Trash2,
  Plus,
  ArrowLeft,
  ExternalLink,
  Film,
} from 'lucide-react';

interface AdminDashboardProps {
  onBackToWebsite: () => void;
  siteSettings: SiteSettings;
  setSiteSettings: React.Dispatch<React.SetStateAction<SiteSettings>>;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  onBackToWebsite,
  siteSettings,
  setSiteSettings,
}) => {
  const { user, isAdmin, signInWithGoogle } = useAuth();

  const [activeTab, setActiveTab] = useState<
    | 'overview'
    | 'settings'
    | 'events'
    | 'memberships'
    | 'products'
    | 'journeys'
    | 'bookings'
    | 'orders'
    | 'inquiries'
    | 'media'
    | 'ai_studio'
  >('overview');

  // Firestore Live State
  const [events, setEvents] = useState<EventItem[]>([]);
  const [memberships, setMemberships] = useState<MembershipItem[]>([]);
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [journeys, setJourneys] = useState<JourneyItem[]>([]);
  const [bookings, setBookings] = useState<BookingRecord[]>([]);
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [inquiries, setInquiries] = useState<InquiryRecord[]>([]);

  // Feedback status
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Settings form local state
  const [settingsForm, setSettingsForm] = useState<SiteSettings>(siteSettings);

  // Gemini AI prompt helper in admin
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiOutput, setAiOutput] = useState('');
  const [isAiGenerating, setIsAiGenerating] = useState(false);

  // New Product Modal State
  const [showNewProductModal, setShowNewProductModal] = useState(false);
  const [newProductForm, setNewProductForm] = useState({
    name: '',
    category: 'Rudraksha' as 'Rudraksha' | 'Perfumes' | 'Wellness' | 'Incense',
    price: 1500,
    stock: 25,
    description: '',
    images: ['/src/assets/images/twg_rudraksha_store_1790837678024.jpg'],
    details: ['Consecrated at Athirappilly sanctuary', 'Authentic certified'],
    featured: false,
    active: true,
  });

  const notify = (msg: string) => {
    setStatusMessage(msg);
    setTimeout(() => setStatusMessage(null), 4000);
  };

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProductForm.name.trim()) {
      notify('Please enter a product title.');
      return;
    }

    try {
      const slug = newProductForm.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      const docRef = doc(db, 'products', slug);
      await setDoc(docRef, {
        id: slug,
        ...newProductForm,
        name: newProductForm.name.trim(),
        description: newProductForm.description.trim() || 'Sacred authentic product from Travel With Guru.',
      });
      notify(`Product "${newProductForm.name}" created and added to store!`);
      setShowNewProductModal(false);
      setNewProductForm({
        name: '',
        category: 'Rudraksha',
        price: 1500,
        stock: 25,
        description: '',
        images: ['/src/assets/images/twg_rudraksha_store_1790837678024.jpg'],
        details: ['Consecrated at Athirappilly sanctuary', 'Authentic certified'],
        featured: false,
        active: true,
      });
    } catch (err) {
      console.error('Error creating product:', err);
      notify('Failed to create product in Firestore.');
    }
  };

  const handleDeleteProduct = async (productId: string, name: string) => {
    if (!window.confirm(`Delete "${name}" from store catalog?`)) return;
    try {
      await deleteDoc(doc(db, 'products', productId));
      notify(`Product "${name}" deleted.`);
    } catch (err) {
      console.error(err);
      notify('Error deleting product.');
    }
  };

  // Sync settingsForm when siteSettings prop updates
  useEffect(() => {
    setSettingsForm(siteSettings);
  }, [siteSettings]);

  // Load Firestore live collections
  useEffect(() => {
    if (!isAdmin) return;

    const unsubEvents = onSnapshot(collection(db, 'events'), (snap) => {
      const list: EventItem[] = [];
      snap.forEach((d) => list.push({ id: d.id, ...d.data() } as EventItem));
      setEvents(list);
    });

    const unsubMembers = onSnapshot(collection(db, 'memberships'), (snap) => {
      const list: MembershipItem[] = [];
      snap.forEach((d) => list.push({ id: d.id, ...d.data() } as MembershipItem));
      setMemberships(list.sort((a, b) => (a.order || 0) - (b.order || 0)));
    });

    const unsubProducts = onSnapshot(collection(db, 'products'), (snap) => {
      const list: ProductItem[] = [];
      snap.forEach((d) => list.push({ id: d.id, ...d.data() } as ProductItem));
      setProducts(list);
    });

    const unsubJourneys = onSnapshot(collection(db, 'journeys'), (snap) => {
      const list: JourneyItem[] = [];
      snap.forEach((d) => list.push({ id: d.id, ...d.data() } as JourneyItem));
      setJourneys(list);
    });

    const unsubBookings = onSnapshot(collection(db, 'bookings'), (snap) => {
      const list: BookingRecord[] = [];
      snap.forEach((d) => list.push({ id: d.id, ...d.data() } as BookingRecord));
      setBookings(list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
    });

    const unsubOrders = onSnapshot(collection(db, 'orders'), (snap) => {
      const list: OrderRecord[] = [];
      snap.forEach((d) => list.push({ id: d.id, ...d.data() } as OrderRecord));
      setOrders(list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
    });

    const unsubInquiries = onSnapshot(collection(db, 'inquiries'), (snap) => {
      const list: InquiryRecord[] = [];
      snap.forEach((d) => list.push({ id: d.id, ...d.data() } as InquiryRecord));
      setInquiries(list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
    });

    return () => {
      unsubEvents();
      unsubMembers();
      unsubProducts();
      unsubJourneys();
      unsubBookings();
      unsubOrders();
      unsubInquiries();
    };
  }, [isAdmin]);

  // Save Settings to Firestore
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await setDoc(doc(db, 'siteSettings', 'general'), settingsForm, { merge: true });
      setSiteSettings(settingsForm);
      notify('Site settings saved successfully to Firestore!');
    } catch (err) {
      console.error('Error updating site settings:', err);
      notify('Failed to save settings to Firestore.');
    } finally {
      setIsSaving(false);
    }
  };

  // Reseed Firestore with approved blueprint
  const handleReseed = async () => {
    if (!window.confirm('Reset all website data to initial approved blueprint state?')) return;
    setIsSaving(true);
    try {
      await forceReseedFirestore();
      notify('Firestore successfully re-seeded with blueprint content!');
    } catch (err) {
      console.error(err);
      notify('Error reseeding database.');
    } finally {
      setIsSaving(false);
    }
  };

  // AI Content Assistant simulation/server call
  const handleGenerateAiCopy = () => {
    if (!aiPrompt.trim()) return;
    setIsAiGenerating(true);
    setTimeout(() => {
      setAiOutput(
        `[Travel With Guru Inspired Wisdom Draft]\n\n"The step you take toward silence is the step where the universe meets you. At our Athirappilly sanctuary, the sacred waters reflect what the mind so often forgets: you are already whole. Join us on the path of Sree Narayana Guru as we dissolve the illusion of division and return to living harmony."\n\n— Curated for ${aiPrompt}`
      );
      setIsAiGenerating(false);
    }, 1200);
  };

  // If not admin, show login gate
  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-[#12100E] flex items-center justify-center p-4">
        <div className="max-w-md w-full p-8 rounded-3xl bg-[#181513] border border-[#8C281C] text-center space-y-6 shadow-2xl">
          <div className="w-16 h-16 rounded-full bg-[#8C281C]/20 border border-[#C98224] mx-auto flex items-center justify-center text-[#C98224]">
            <Shield className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <h2 className="font-cinzel text-2xl font-bold uppercase text-[#F6EBD4]">
              Sanctuary CMS Gateway
            </h2>
            <p className="text-xs text-[#D9B47A] leading-relaxed">
              Authorized administrator access is required to edit content, manage retreat registrations, and control store inventory.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#12100E] border border-[#4A2819] text-xs text-[#F6EBD4]/75 space-y-1">
            <div className="text-[#C98224] font-semibold">Designated Primary Administrator:</div>
            <div className="font-mono text-white">365servicestcr@gmail.com</div>
          </div>

          <div className="space-y-3 pt-2">
            <button
              onClick={() => signInWithGoogle()}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-[#C98224] via-[#8C281C] to-[#4A2819] text-[#F6EBD4] font-cinzel text-xs font-bold uppercase tracking-wider hover:brightness-110 shadow-lg cursor-pointer"
            >
              Sign In with Administrator Google Account
            </button>

            <button
              onClick={onBackToWebsite}
              className="w-full py-2.5 rounded-xl border border-[#4A2819] text-xs font-cinzel text-[#D9B47A] hover:text-white"
            >
              Return to Public Website
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Calculate Metrics
  const totalRevenue =
    bookings.reduce((sum, b) => sum + (b.totalAmount || 0), 0) +
    orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
  const totalTicketsBooked = bookings.reduce((sum, b) => sum + (b.ticketCount || 0), 0);

  return (
    <div className="min-h-screen bg-[#12100E] text-[#F6EBD4] flex flex-col md:flex-row">
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-[#151210] border-r border-[#4A2819] p-5 flex flex-col justify-between shrink-0">
        <div className="space-y-6">
          {/* Logo / Header */}
          <div className="flex items-center justify-between pb-4 border-b border-[#4A2819]/60">
            <div>
              <div className="font-cinzel text-sm font-bold text-[#F6EBD4] tracking-wider uppercase">
                TRAVEL <span className="text-[#C98224]">WITH GURU</span>
              </div>
              <div className="text-[10px] text-[#D9B47A] font-cinzel tracking-widest uppercase">
                CMS Content Studio
              </div>
            </div>
            <Shield className="w-4 h-4 text-[#C98224]" />
          </div>

          {/* Navigation Items */}
          <nav className="space-y-1">
            {[
              { id: 'overview', label: 'Overview', icon: LayoutDashboard },
              { id: 'settings', label: 'Site & SEO', icon: Settings },
              { id: 'events', label: 'Programmes', icon: Calendar, badge: events.length },
              { id: 'memberships', label: 'Memberships', icon: Award, badge: memberships.length },
              { id: 'products', label: 'Sacred Store', icon: ShoppingBag, badge: products.length },
              { id: 'journeys', label: 'Journeys', icon: Compass, badge: journeys.length },
              { id: 'bookings', label: 'Bookings', icon: Users, badge: bookings.length },
              { id: 'orders', label: 'Store Orders', icon: ShoppingBag, badge: orders.length },
              { id: 'inquiries', label: 'Inquiries', icon: MessageSquare, badge: inquiries.length },
              { id: 'media', label: 'Media Library', icon: ImageIcon },
              { id: 'ai_studio', label: 'Veo & AI Studio', icon: Film },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-cinzel font-semibold tracking-wider uppercase transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#C98224] text-[#12100E] shadow-md font-bold'
                      : 'text-[#F6EBD4]/75 hover:bg-[#1C1814] hover:text-[#D9B47A]'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4" />
                    <span>{tab.label}</span>
                  </div>
                  {tab.badge !== undefined && (
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                        isActive ? 'bg-[#12100E] text-[#C98224]' : 'bg-[#12100E] text-[#D9B47A]'
                      }`}
                    >
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Actions */}
        <div className="pt-6 border-t border-[#4A2819]/60 space-y-2">
          <button
            onClick={onBackToWebsite}
            className="w-full py-2.5 rounded-xl border border-[#4A2819] hover:border-[#C98224] text-xs font-cinzel text-[#D9B47A] hover:text-[#F6EBD4] flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            Live Website
          </button>
          <div className="text-[10px] text-center text-neutral-500 font-mono">
            Admin: {user?.email}
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 sm:p-10 overflow-y-auto">
        {/* Toast Status Notice */}
        {statusMessage && (
          <div className="mb-6 p-4 rounded-2xl bg-[#C98224]/20 border border-[#C98224] text-[#F6EBD4] text-xs flex items-center gap-2 animate-in fade-in duration-300">
            <CheckCircle2 className="w-4 h-4 text-[#C98224]" />
            <span>{statusMessage}</span>
          </div>
        )}

        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            <div>
              <h2 className="font-cinzel text-2xl font-bold uppercase text-[#F6EBD4]">
                Sanctuary Overview
              </h2>
              <p className="text-xs text-[#D9B47A] font-serif-cormorant italic">
                Real-time operational summary of attendees, store revenue, and fellowship inquiries.
              </p>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="p-6 rounded-2xl bg-[#181513] border border-[#4A2819]">
                <div className="text-xs font-cinzel uppercase text-[#D9B47A] mb-1">
                  Total Bookings
                </div>
                <div className="font-cinzel text-3xl font-bold text-[#F6EBD4]">
                  {bookings.length}
                </div>
                <div className="text-[11px] text-[#C98224] mt-1">
                  {totalTicketsBooked} Retreat Attendees Confirmed
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-[#181513] border border-[#4A2819]">
                <div className="text-xs font-cinzel uppercase text-[#D9B47A] mb-1">
                  Total Gross Dakshina
                </div>
                <div className="font-cinzel text-3xl font-bold text-[#F6EBD4]">
                  ₹{totalRevenue.toLocaleString('en-IN')}
                </div>
                <div className="text-[11px] text-[#D9B47A]/70 mt-1">
                  Retreat passes & Sacred store
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-[#181513] border border-[#4A2819]">
                <div className="text-xs font-cinzel uppercase text-[#D9B47A] mb-1">
                  Store Orders
                </div>
                <div className="font-cinzel text-3xl font-bold text-[#F6EBD4]">
                  {orders.length}
                </div>
                <div className="text-[11px] text-[#C98224] mt-1">
                  Rudraksha & Attars
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-[#181513] border border-[#4A2819]">
                <div className="text-xs font-cinzel uppercase text-[#D9B47A] mb-1">
                  Seeker Inquiries
                </div>
                <div className="font-cinzel text-3xl font-bold text-[#F6EBD4]">
                  {inquiries.length}
                </div>
                <div className="text-[11px] text-[#D9B47A]/70 mt-1">
                  Consultation & Guidance
                </div>
              </div>
            </div>

            {/* Quick Actions & Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-4">
              <div className="p-6 rounded-2xl bg-[#181513] border border-[#4A2819] space-y-4">
                <h3 className="font-cinzel text-base font-bold uppercase text-[#D9B47A]">
                  Recent Retreat Registrations
                </h3>
                {bookings.slice(0, 4).map((b) => (
                  <div
                    key={b.id}
                    className="p-3 rounded-xl bg-[#12100E] border border-[#4A2819]/50 flex justify-between items-center text-xs"
                  >
                    <div>
                      <span className="font-bold text-white">{b.attendeeName}</span>
                      <div className="text-neutral-400">{b.attendeeEmail}</div>
                    </div>
                    <div className="text-right">
                      <span className="font-cinzel font-bold text-[#C98224]">
                        ₹{b.totalAmount.toLocaleString('en-IN')}
                      </span>
                      <div className="text-[10px] text-neutral-500">
                        {b.ticketCount} Pass(es)
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-6 rounded-2xl bg-[#181513] border border-[#4A2819] space-y-4">
                <h3 className="font-cinzel text-base font-bold uppercase text-[#D9B47A]">
                  Database Control & Reseed
                </h3>
                <p className="text-xs text-[#F6EBD4]/70 leading-relaxed font-sans">
                  The initial content is automatically seeded from the approved Travel With Guru blueprint. You can safely restore the exact initial catalog, schedule, and pricing anytime.
                </p>
                <button
                  onClick={handleReseed}
                  disabled={isSaving}
                  className="px-4 py-2.5 rounded-xl border border-[#8C281C] bg-[#8C281C]/30 hover:bg-[#8C281C] text-[#F6EBD4] font-cinzel text-xs font-bold uppercase tracking-wider flex items-center gap-2 cursor-pointer transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-[#C98224]" />
                  Reset to Approved Blueprint Data
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: SITE SETTINGS & SEO */}
        {activeTab === 'settings' && (
          <form onSubmit={handleSaveSettings} className="space-y-8 max-w-4xl">
            <div className="flex items-center justify-between pb-4 border-b border-[#4A2819]">
              <div>
                <h2 className="font-cinzel text-2xl font-bold uppercase text-[#F6EBD4]">
                  Site Configuration & SEO
                </h2>
                <p className="text-xs text-[#D9B47A] font-serif-cormorant italic">
                  Changes save directly to Firestore collection `siteSettings/general`.
                </p>
              </div>
              <button
                type="submit"
                disabled={isSaving}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#C98224] to-[#8C281C] text-[#F6EBD4] font-cinzel text-xs font-bold uppercase tracking-wider flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                {isSaving ? 'Saving...' : 'Save Settings'}
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-cinzel text-[#D9B47A] mb-1">Brand Name</label>
                <input
                  type="text"
                  value={settingsForm.brandName}
                  onChange={(e) => setSettingsForm({ ...settingsForm, brandName: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#181513] border border-[#4A2819] text-sm text-[#F6EBD4] focus:outline-none focus:border-[#C98224]"
                />
              </div>

              <div>
                <label className="block text-xs font-cinzel text-[#D9B47A] mb-1">Tagline</label>
                <input
                  type="text"
                  value={settingsForm.tagline}
                  onChange={(e) => setSettingsForm({ ...settingsForm, tagline: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#181513] border border-[#4A2819] text-sm text-[#F6EBD4] focus:outline-none focus:border-[#C98224]"
                />
              </div>

              <div>
                <label className="block text-xs font-cinzel text-[#D9B47A] mb-1">Contact Email</label>
                <input
                  type="email"
                  value={settingsForm.contactEmail}
                  onChange={(e) => setSettingsForm({ ...settingsForm, contactEmail: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#181513] border border-[#4A2819] text-sm text-[#F6EBD4] focus:outline-none focus:border-[#C98224]"
                />
              </div>

              <div>
                <label className="block text-xs font-cinzel text-[#D9B47A] mb-1">Contact Phone</label>
                <input
                  type="text"
                  value={settingsForm.contactPhone}
                  onChange={(e) => setSettingsForm({ ...settingsForm, contactPhone: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#181513] border border-[#4A2819] text-sm text-[#F6EBD4] focus:outline-none focus:border-[#C98224]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-cinzel text-[#D9B47A] mb-1">Sanctuary Address</label>
              <input
                type="text"
                value={settingsForm.address}
                onChange={(e) => setSettingsForm({ ...settingsForm, address: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#181513] border border-[#4A2819] text-sm text-[#F6EBD4] focus:outline-none focus:border-[#C98224]"
              />
            </div>

            {/* Announcement Banner */}
            <div className="p-5 rounded-2xl bg-[#181513] border border-[#4A2819] space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-cinzel text-xs font-bold uppercase text-[#D9B47A]">
                  Announcement Banner Ticker
                </span>
                <label className="flex items-center gap-2 text-xs cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settingsForm.showAnnouncement}
                    onChange={(e) => setSettingsForm({ ...settingsForm, showAnnouncement: e.target.checked })}
                    className="accent-[#C98224] w-4 h-4"
                  />
                  <span>Show on Homepage</span>
                </label>
              </div>
              <input
                type="text"
                value={settingsForm.announcement}
                onChange={(e) => setSettingsForm({ ...settingsForm, announcement: e.target.value })}
                placeholder="E.g. Registrations now open for the 2-Day Spiritual Retreat"
                className="w-full px-3.5 py-2 rounded-xl bg-[#12100E] border border-[#4A2819] text-xs text-[#F6EBD4]"
              />
            </div>

            {/* Hero Media Asset Settings */}
            <div className="p-5 rounded-2xl bg-[#181513] border border-[#4A2819] space-y-4">
              <h3 className="font-cinzel text-xs font-bold uppercase text-[#D9B47A]">
                Cinematic Media Configuration
              </h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-[11px] font-cinzel text-neutral-400 mb-1">Hero Poster Image Path / URL</label>
                  <input
                    type="text"
                    value={settingsForm.heroPosterUrl}
                    onChange={(e) => setSettingsForm({ ...settingsForm, heroPosterUrl: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-[#12100E] border border-[#4A2819] text-xs text-[#F6EBD4] font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-cinzel text-neutral-400 mb-1">Hero Video URL (Optional MP4/WebM Loop)</label>
                  <input
                    type="text"
                    value={settingsForm.heroVideoUrl || ''}
                    onChange={(e) => setSettingsForm({ ...settingsForm, heroVideoUrl: e.target.value })}
                    placeholder="https://..."
                    className="w-full px-3.5 py-2 rounded-xl bg-[#12100E] border border-[#4A2819] text-xs text-[#F6EBD4] font-mono"
                  />
                </div>
              </div>
            </div>

            {/* SEO Section */}
            <div className="p-5 rounded-2xl bg-[#181513] border border-[#4A2819] space-y-4">
              <h3 className="font-cinzel text-xs font-bold uppercase text-[#D9B47A]">
                Search Engine Optimization (SEO)
              </h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-[11px] font-cinzel text-neutral-400 mb-1">Page Meta Title</label>
                  <input
                    type="text"
                    value={settingsForm.seoTitle}
                    onChange={(e) => setSettingsForm({ ...settingsForm, seoTitle: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-[#12100E] border border-[#4A2819] text-xs text-[#F6EBD4]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-cinzel text-neutral-400 mb-1">Meta Description</label>
                  <textarea
                    rows={2}
                    value={settingsForm.seoDescription}
                    onChange={(e) => setSettingsForm({ ...settingsForm, seoDescription: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-[#12100E] border border-[#4A2819] text-xs text-[#F6EBD4]"
                  />
                </div>
              </div>
            </div>
          </form>
        )}

        {/* TAB 3: PROGRAMMES (EVENTS) */}
        {activeTab === 'events' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-[#4A2819]">
              <div>
                <h2 className="font-cinzel text-2xl font-bold uppercase text-[#F6EBD4]">
                  Programmes & Retreats ({events.length})
                </h2>
                <p className="text-xs text-[#D9B47A] font-serif-cormorant italic">
                  Manage retreat pricing, capacity, schedule, and publishing status.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {events.map((ev) => (
                <div key={ev.id} className="p-6 rounded-2xl bg-[#181513] border border-[#4A2819] space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <span className="text-[10px] font-cinzel uppercase text-[#C98224] tracking-wider">
                        {ev.location}
                      </span>
                      <h3 className="font-cinzel text-xl font-bold text-[#F6EBD4]">
                        {ev.title}
                      </h3>
                      <p className="text-xs text-[#D9B47A] font-serif-cormorant italic">
                        {ev.subtitle}
                      </p>
                    </div>

                    <div className="text-right">
                      <div className="font-cinzel text-xl font-bold text-[#F6EBD4]">
                        ₹{ev.ticketPrice.toLocaleString('en-IN')}
                      </div>
                      <div className="text-[11px] text-[#C98224]">
                        {ev.bookedCount} / {ev.capacity} Seats Filled
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                    <div>
                      <label className="block text-[10px] font-cinzel text-neutral-400 mb-1">Ticket Price (₹)</label>
                      <input
                        type="number"
                        value={ev.ticketPrice}
                        onChange={async (e) => {
                          const val = Number(e.target.value);
                          await updateDoc(doc(db, 'events', ev.id), { ticketPrice: val });
                        }}
                        className="w-full px-3 py-1.5 rounded-xl bg-[#12100E] border border-[#4A2819] text-xs text-[#F6EBD4]"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-cinzel text-neutral-400 mb-1">Booked Count</label>
                      <input
                        type="number"
                        value={ev.bookedCount}
                        onChange={async (e) => {
                          const val = Number(e.target.value);
                          await updateDoc(doc(db, 'events', ev.id), { bookedCount: val });
                        }}
                        className="w-full px-3 py-1.5 rounded-xl bg-[#12100E] border border-[#4A2819] text-xs text-[#F6EBD4]"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-cinzel text-neutral-400 mb-1">Total Capacity</label>
                      <input
                        type="number"
                        value={ev.capacity}
                        onChange={async (e) => {
                          const val = Number(e.target.value);
                          await updateDoc(doc(db, 'events', ev.id), { capacity: val });
                        }}
                        className="w-full px-3 py-1.5 rounded-xl bg-[#12100E] border border-[#4A2819] text-xs text-[#F6EBD4]"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: MEMBERSHIPS */}
        {activeTab === 'memberships' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-[#4A2819]">
              <div>
                <h2 className="font-cinzel text-2xl font-bold uppercase text-[#F6EBD4]">
                  Sacred Memberships ({memberships.length})
                </h2>
                <p className="text-xs text-[#D9B47A] font-serif-cormorant italic">
                  Update annual and 5-year fellowship rates and sessions directly in Firestore.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {memberships.map((m) => (
                <div key={m.id} className="p-5 rounded-2xl bg-[#181513] border border-[#4A2819] space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[10px] font-cinzel text-[#C98224] uppercase">{m.duration}</span>
                      <h4 className="font-cinzel text-base font-bold text-[#F6EBD4]">{m.name}</h4>
                    </div>
                    <div className="text-right">
                      <span className="font-cinzel text-lg font-bold text-[#F6EBD4]">
                        ₹{m.price.toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[10px] text-neutral-400">Price (₹)</label>
                      <input
                        type="number"
                        value={m.price}
                        onChange={async (e) => {
                          const val = Number(e.target.value);
                          await updateDoc(doc(db, 'memberships', m.id), { price: val });
                        }}
                        className="w-full px-3 py-1 rounded-lg bg-[#12100E] border border-[#4A2819] text-xs text-[#F6EBD4]"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-neutral-400">Sessions Count</label>
                      <input
                        type="text"
                        value={m.sessionsCount}
                        onChange={async (e) => {
                          await updateDoc(doc(db, 'memberships', m.id), { sessionsCount: e.target.value });
                        }}
                        className="w-full px-3 py-1 rounded-lg bg-[#12100E] border border-[#4A2819] text-xs text-[#F6EBD4]"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: SACRED STORE PRODUCTS */}
        {activeTab === 'products' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-[#4A2819]">
              <div>
                <h2 className="font-cinzel text-2xl font-bold uppercase text-[#F6EBD4]">
                  Sacred Store Catalog ({products.length})
                </h2>
                <p className="text-xs text-[#D9B47A] font-serif-cormorant italic">
                  Manage inventory stock, pricing, and certified authenticity notes.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowNewProductModal(true)}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#C98224] to-[#8C281C] text-[#F6EBD4] font-cinzel text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 cursor-pointer shadow-lg hover:brightness-110"
              >
                <Plus className="w-4 h-4" />
                Add Product
              </button>
            </div>

            {/* New Product Inline Modal */}
            {showNewProductModal && (
              <form onSubmit={handleCreateProduct} className="p-6 rounded-2xl bg-[#1C1814] border border-[#C98224] space-y-4 animate-in fade-in duration-300">
                <div className="flex items-center justify-between border-b border-[#4A2819] pb-3">
                  <h3 className="font-cinzel text-base font-bold text-[#F6EBD4] uppercase">
                    Add New Sacred Product
                  </h3>
                  <button
                    type="button"
                    onClick={() => setShowNewProductModal(false)}
                    className="text-neutral-400 hover:text-white text-xs"
                  >
                    Cancel
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-cinzel text-[#D9B47A] mb-1">Product Title *</label>
                    <input
                      type="text"
                      required
                      value={newProductForm.name}
                      onChange={(e) => setNewProductForm({ ...newProductForm, name: e.target.value })}
                      placeholder="E.g. Pure Copper Panchapatra Set"
                      className="w-full px-3 py-2 rounded-xl bg-[#12100E] border border-[#4A2819] text-xs text-[#F6EBD4]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-cinzel text-[#D9B47A] mb-1">Category</label>
                    <select
                      value={newProductForm.category}
                      onChange={(e) => setNewProductForm({ ...newProductForm, category: e.target.value as any })}
                      className="w-full px-3 py-2 rounded-xl bg-[#12100E] border border-[#4A2819] text-xs text-[#F6EBD4]"
                    >
                      <option value="Rudraksha">Rudraksha</option>
                      <option value="Perfumes">Perfumes</option>
                      <option value="Incense">Incense</option>
                      <option value="Wellness">Wellness</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-cinzel text-[#D9B47A] mb-1">Price (₹) *</label>
                    <input
                      type="number"
                      required
                      value={newProductForm.price}
                      onChange={(e) => setNewProductForm({ ...newProductForm, price: Number(e.target.value) })}
                      className="w-full px-3 py-2 rounded-xl bg-[#12100E] border border-[#4A2819] text-xs text-[#F6EBD4]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-cinzel text-[#D9B47A] mb-1">Initial Stock Count *</label>
                    <input
                      type="number"
                      required
                      value={newProductForm.stock}
                      onChange={(e) => setNewProductForm({ ...newProductForm, stock: Number(e.target.value) })}
                      className="w-full px-3 py-2 rounded-xl bg-[#12100E] border border-[#4A2819] text-xs text-[#F6EBD4]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-cinzel text-[#D9B47A] mb-1">Description</label>
                  <textarea
                    rows={2}
                    value={newProductForm.description}
                    onChange={(e) => setNewProductForm({ ...newProductForm, description: e.target.value })}
                    placeholder="Sacred background and botanical/mineral details..."
                    className="w-full px-3 py-2 rounded-xl bg-[#12100E] border border-[#4A2819] text-xs text-[#F6EBD4]"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowNewProductModal(false)}
                    className="px-4 py-2 rounded-xl border border-[#4A2819] text-xs font-cinzel text-[#D9B47A]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 rounded-xl bg-gradient-to-r from-[#C98224] to-[#8C281C] text-[#F6EBD4] font-cinzel text-xs font-bold uppercase tracking-wider"
                  >
                    Publish Product to Store
                  </button>
                </div>
              </form>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((p) => (
                <div key={p.id} className="p-5 rounded-2xl bg-[#181513] border border-[#4A2819] space-y-3 relative group">
                  <img
                    src={p.images[0] || '/src/assets/images/twg_rudraksha_store_1790837678024.jpg'}
                    alt={p.name}
                    className="w-full h-36 object-cover rounded-xl border border-[#4A2819]"
                  />
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-cinzel text-[#C98224] uppercase">{p.category}</span>
                      <h4 className="font-cinzel text-sm font-bold text-[#F6EBD4] truncate">{p.name}</h4>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleDeleteProduct(p.id, p.name)}
                      title="Delete Product"
                      className="p-1.5 rounded-lg text-neutral-500 hover:text-red-400 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[10px] text-neutral-400">Price (₹)</label>
                      <input
                        type="number"
                        value={p.price}
                        onChange={async (e) => {
                          const val = Number(e.target.value);
                          await updateDoc(doc(db, 'products', p.id), { price: val });
                        }}
                        className="w-full px-3 py-1 rounded-lg bg-[#12100E] border border-[#4A2819] text-xs text-[#F6EBD4]"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-neutral-400">Stock Count</label>
                      <input
                        type="number"
                        value={p.stock}
                        onChange={async (e) => {
                          const val = Number(e.target.value);
                          await updateDoc(doc(db, 'products', p.id), { stock: val });
                        }}
                        className="w-full px-3 py-1 rounded-lg bg-[#12100E] border border-[#4A2819] text-xs text-[#F6EBD4]"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 6: SACRED JOURNEYS */}
        {activeTab === 'journeys' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-[#4A2819]">
              <div>
                <h2 className="font-cinzel text-2xl font-bold uppercase text-[#F6EBD4]">
                  Sacred Journeys ({journeys.length})
                </h2>
                <p className="text-xs text-[#D9B47A] font-serif-cormorant italic">
                  India, Nepal, and Malaysia pilgrimage routes and pilgrim tariffs.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {journeys.map((j) => (
                <div key={j.id} className="p-5 rounded-2xl bg-[#181513] border border-[#4A2819] flex justify-between items-center">
                  <div>
                    <span className="text-[10px] font-cinzel text-[#C98224] uppercase">{j.country} • {j.duration}</span>
                    <h4 className="font-cinzel text-base font-bold text-[#F6EBD4]">{j.title}</h4>
                    <p className="text-xs text-neutral-400">{j.route}</p>
                  </div>
                  <div className="text-right">
                    <span className="font-cinzel text-lg font-bold text-[#F6EBD4]">
                      ₹{j.price.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 7: BOOKINGS */}
        {activeTab === 'bookings' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-[#4A2819]">
              <div>
                <h2 className="font-cinzel text-2xl font-bold uppercase text-[#F6EBD4]">
                  Retreat Registrations ({bookings.length})
                </h2>
                <p className="text-xs text-[#D9B47A] font-serif-cormorant italic">
                  Live attendee roster stored in Firestore `bookings` collection.
                </p>
              </div>
            </div>

            <div className="space-y-3">
              {bookings.map((b) => (
                <div
                  key={b.id}
                  className="p-4 rounded-xl bg-[#181513] border border-[#4A2819] flex flex-col sm:flex-row justify-between sm:items-center gap-3 text-xs"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white text-sm">{b.attendeeName}</span>
                      <select
                        value={b.status}
                        onChange={async (e) => {
                          const newStatus = e.target.value as any;
                          await updateDoc(doc(db, 'bookings', b.id), { status: newStatus });
                          notify(`Booking for ${b.attendeeName} updated to ${newStatus}.`);
                        }}
                        className="px-2 py-0.5 rounded bg-[#12100E] border border-[#C98224] text-[#C98224] text-[10px] font-cinzel focus:outline-none cursor-pointer"
                      >
                        <option value="confirmed">Confirmed</option>
                        <option value="checked-in">Checked-In</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </div>
                    <div className="text-neutral-400">
                      {b.attendeeEmail} • {b.attendeePhone}
                    </div>
                    <div className="text-neutral-500 text-[11px]">
                      Prog: {b.eventTitle} | {b.ticketCount} Attendee(s)
                    </div>
                    {b.notes && (
                      <div className="text-[#D9B47A] text-[11px] italic">
                        Note: {b.notes}
                      </div>
                    )}
                  </div>

                  <div className="text-right">
                    <div className="font-cinzel text-base font-bold text-[#F6EBD4]">
                      ₹{b.totalAmount.toLocaleString('en-IN')}
                    </div>
                    <div className="text-[10px] text-neutral-500 font-mono">
                      Ref: {b.id.slice(0, 8)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 8: ORDERS */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-[#4A2819]">
              <div>
                <h2 className="font-cinzel text-2xl font-bold uppercase text-[#F6EBD4]">
                  Customer Orders ({orders.length})
                </h2>
                <p className="text-xs text-[#D9B47A] font-serif-cormorant italic">
                  Live store orders stored in Firestore `orders` collection.
                </p>
              </div>
            </div>

            <div className="space-y-3">
              {orders.map((o) => (
                <div key={o.id} className="p-4 rounded-xl bg-[#181513] border border-[#4A2819] space-y-2 text-xs">
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="font-bold text-white text-sm">{o.customerName}</span>
                      <span className="text-neutral-400 ml-2">({o.customerEmail})</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <select
                        value={o.status}
                        onChange={async (e) => {
                          const newStatus = e.target.value as any;
                          await updateDoc(doc(db, 'orders', o.id), { status: newStatus });
                          notify(`Order #${o.id.slice(0, 8)} updated to ${newStatus}.`);
                        }}
                        className="px-2 py-0.5 rounded bg-[#12100E] border border-[#4A2819] text-[#D9B47A] text-[10px] font-cinzel focus:outline-none cursor-pointer"
                      >
                        <option value="pending">Pending</option>
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                      </select>
                      <span className="font-cinzel text-sm font-bold text-[#C98224]">
                        ₹{o.totalAmount.toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>
                  <div className="text-neutral-400">
                    Ship to: {o.shippingAddress} (Ph: {o.customerPhone})
                  </div>
                  <div className="text-neutral-500 text-[11px]">
                    Items: {o.items?.map((i) => `${i.name} (x${i.quantity})`).join(', ')}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 9: INQUIRIES */}
        {activeTab === 'inquiries' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-[#4A2819]">
              <div>
                <h2 className="font-cinzel text-2xl font-bold uppercase text-[#F6EBD4]">
                  Sanctuary Inquiries & Consultations ({inquiries.length})
                </h2>
                <p className="text-xs text-[#D9B47A] font-serif-cormorant italic">
                  Visitor questions and 1:1 consultation submissions from Firestore `inquiries`.
                </p>
              </div>
            </div>

            <div className="space-y-3">
              {inquiries.map((iq) => (
                <div key={iq.id} className="p-4 rounded-xl bg-[#181513] border border-[#4A2819] space-y-2 text-xs">
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="font-bold text-white">{iq.name}</span>
                      <span className="text-[#C98224] ml-2 font-cinzel">[{iq.subject}]</span>
                    </div>
                    <span className="text-neutral-500 font-mono text-[10px]">
                      {new Date(iq.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="text-neutral-400">
                    Email: {iq.email} {iq.phone && `| Phone: ${iq.phone}`}
                  </div>
                  <div className="p-2.5 rounded-lg bg-[#12100E] border border-[#4A2819]/50 text-[#F6EBD4]/90 italic">
                    "{iq.message}"
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 10: MEDIA LIBRARY */}
        {activeTab === 'media' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-[#4A2819]">
              <div>
                <h2 className="font-cinzel text-2xl font-bold uppercase text-[#F6EBD4]">
                  Permanent Media Library
                </h2>
                <p className="text-xs text-[#D9B47A] font-serif-cormorant italic">
                  High-fidelity cinematic assets stored in project repository.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { title: 'TWG-HERO-01 (Dawn Path)', path: '/src/assets/images/twg_hero_cinema_1790837622263.jpg' },
                { title: 'TWG-EVENT-03 (Athirappilly Retreat)', path: '/src/assets/images/twg_event_retreat_1790837641748.jpg' },
                { title: 'TWG-JOURNEY-04 (Himalayan Nepal)', path: '/src/assets/images/twg_himalaya_nepal_1790837658461.jpg' },
                { title: 'TWG-STORE-06 (Sacred Rudraksha)', path: '/src/assets/images/twg_rudraksha_store_1790837678024.jpg' },
              ].map((m, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-[#181513] border border-[#4A2819] space-y-2">
                  <img src={m.path} alt={m.title} className="w-full h-36 object-cover rounded-lg border border-[#4A2819]" />
                  <div className="font-cinzel text-xs font-bold text-[#F6EBD4] truncate">{m.title}</div>
                  <div className="text-[10px] text-neutral-500 font-mono truncate">{m.path}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 11: VEO & AI STUDIO */}
        {activeTab === 'ai_studio' && (
          <div className="space-y-8 max-w-4xl">
            <div>
              <h2 className="font-cinzel text-2xl font-bold uppercase text-[#F6EBD4]">
                Veo Cinematic Engine & Gemini Studio
              </h2>
              <p className="text-xs text-[#D9B47A] font-serif-cormorant italic">
                Production Package Prompts for Veo/Flow models, plus Gemini copywriting assistance.
              </p>
            </div>

            {/* Veo Prompt Card (Path B Ready Prompts) */}
            <div className="p-6 rounded-2xl bg-[#181513] border border-[#C98224]/50 space-y-4">
              <div className="flex items-center gap-2">
                <Film className="w-5 h-5 text-[#C98224]" />
                <h3 className="font-cinzel text-base font-bold uppercase text-[#F6EBD4]">
                  TWG-HERO-01 Master Veo Prompt (30s / 16:9 & 9:16)
                </h3>
              </div>
              <p className="text-xs text-[#F6EBD4]/75 leading-relaxed font-sans">
                Ready-to-paste prompt for Veo 3 / Google Flow for external generation, adhering strictly to the Master Visual Language:
              </p>
              <div className="p-4 rounded-xl bg-[#12100E] border border-[#4A2819] font-mono text-xs text-[#D9B47A] leading-relaxed select-all">
                "Create a 30-second premium cinematic brand film for Travel With Guru. Begin from a nearly invisible natural stone path emerging from deep charcoal darkness into warm saffron dawn light. The camera performs a slow, physically realistic forward dolly along the path through authentic Kerala-inspired landscapes and traditional architecture. 35mm lens, natural film grain, saffron and sandalwood palette. No dialogue, no text, no fantasy glow."
              </div>
            </div>

            {/* Gemini Copy Assistant */}
            <div className="p-6 rounded-2xl bg-[#181513] border border-[#4A2819] space-y-4">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#C98224]" />
                <h3 className="font-cinzel text-base font-bold uppercase text-[#F6EBD4]">
                  Sanctuary Wisdom & Copywriting Assistant
                </h3>
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                  placeholder="E.g. Write a contemplative announcement for the Athirappilly retreat..."
                  className="flex-1 px-4 py-2.5 rounded-xl bg-[#12100E] border border-[#4A2819] text-xs text-[#F6EBD4]"
                />
                <button
                  type="button"
                  onClick={handleGenerateAiCopy}
                  disabled={isAiGenerating}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#C98224] to-[#8C281C] text-[#F6EBD4] font-cinzel text-xs font-bold uppercase tracking-wider"
                >
                  {isAiGenerating ? 'Reflecting...' : 'Generate Copy'}
                </button>
              </div>

              {aiOutput && (
                <div className="p-4 rounded-xl bg-[#12100E] border border-[#C98224]/40 font-serif-cormorant text-base text-[#F6EBD4] leading-relaxed whitespace-pre-line">
                  {aiOutput}
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
