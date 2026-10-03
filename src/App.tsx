/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider, useCart } from './context/CartContext';
import { db } from './lib/firebase';
import { collection, doc, onSnapshot, getDoc } from 'firebase/firestore';
import { seedFirestoreIfEmpty } from './lib/seedFirestore';
import {
  SiteSettings,
  EventItem,
  MembershipItem,
  ProductItem,
  JourneyItem,
  FaqItem,
  ConsultationItem,
} from './types';
import {
  initialSiteSettings,
  initialEvents,
  initialMemberships,
  initialProducts,
  initialJourneys,
  initialConsultations,
  initialFaqs,
} from './lib/initialData';

// Components
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { PathPhilosophySection } from './components/PathPhilosophySection';
import { EventProgrammeSection } from './components/EventProgrammeSection';
import { MembershipSection } from './components/MembershipSection';
import { JourneysSection } from './components/JourneysSection';
import { StoreSection } from './components/StoreSection';
import { ConsultationSection } from './components/ConsultationSection';
import { CommunitySection } from './components/CommunitySection';
import { Footer } from './components/Footer';
import { AudioPlayer } from './components/AudioPlayer';
import { BookingModal } from './components/BookingModal';
import { CartDrawer } from './components/CartDrawer';
import { InquiryModal } from './components/InquiryModal';
import { MemberPortal } from './components/MemberPortal';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { Sparkles, CheckCircle2 } from 'lucide-react';

function MainWebsite() {
  const [currentView, setCurrentView] = useState<'public' | 'admin' | 'member'>('public');

  // Database-driven content state
  const [siteSettings, setSiteSettings] = useState<SiteSettings>(initialSiteSettings);
  const [events, setEvents] = useState<EventItem[]>(initialEvents);
  const [memberships, setMemberships] = useState<MembershipItem[]>(initialMemberships);
  const [products, setProducts] = useState<ProductItem[]>(initialProducts);
  const [journeys, setJourneys] = useState<JourneyItem[]>(initialJourneys);
  const [consultations] = useState<ConsultationItem[]>(initialConsultations);
  const [faqs, setFaqs] = useState<FaqItem[]>(initialFaqs);

  const { toastMessage } = useCart();

  // Handle URL route /admin or /member
  useEffect(() => {
    const handleUrlRoute = () => {
      const path = window.location.pathname;
      const hash = window.location.hash;
      if (path.includes('/admin') || hash === '#admin') {
        setCurrentView('admin');
      } else if (path.includes('/member') || hash === '#member') {
        setCurrentView('member');
      }
    };
    handleUrlRoute();
    window.addEventListener('popstate', handleUrlRoute);
    window.addEventListener('hashchange', handleUrlRoute);
    return () => {
      window.removeEventListener('popstate', handleUrlRoute);
      window.removeEventListener('hashchange', handleUrlRoute);
    };
  }, []);

  // Sync route change to browser history / title
  const handleSetCurrentView = (view: 'public' | 'admin' | 'member') => {
    setCurrentView(view);
    if (view === 'admin') {
      window.history.pushState({}, '', '#admin');
    } else if (view === 'member') {
      window.history.pushState({}, '', '#member');
    } else {
      window.history.pushState({}, '', window.location.pathname.replace(/\/admin|\/member/, ''));
    }
  };

  // Seed Firestore on initial launch if empty
  useEffect(() => {
    seedFirestoreIfEmpty();
  }, []);

  // Live Firestore subscriptions
  useEffect(() => {
    // 1. Site Settings
    const unsubSettings = onSnapshot(
      doc(db, 'siteSettings', 'general'),
      (docSnap) => {
        if (docSnap.exists()) {
          setSiteSettings(docSnap.data() as SiteSettings);
        }
      },
      (err) => console.warn('siteSettings listener fallback:', err)
    );

    // 2. Events
    const unsubEvents = onSnapshot(
      collection(db, 'events'),
      (snap) => {
        if (!snap.empty) {
          const list: EventItem[] = [];
          snap.forEach((d) => list.push({ id: d.id, ...d.data() } as EventItem));
          setEvents(list);
        }
      },
      (err) => console.warn('events listener fallback:', err)
    );

    // 3. Memberships
    const unsubMemberships = onSnapshot(
      collection(db, 'memberships'),
      (snap) => {
        if (!snap.empty) {
          const list: MembershipItem[] = [];
          snap.forEach((d) => list.push({ id: d.id, ...d.data() } as MembershipItem));
          setMemberships(list.sort((a, b) => (a.order || 0) - (b.order || 0)));
        }
      },
      (err) => console.warn('memberships listener fallback:', err)
    );

    // 4. Products
    const unsubProducts = onSnapshot(
      collection(db, 'products'),
      (snap) => {
        if (!snap.empty) {
          const list: ProductItem[] = [];
          snap.forEach((d) => list.push({ id: d.id, ...d.data() } as ProductItem));
          setProducts(list);
        }
      },
      (err) => console.warn('products listener fallback:', err)
    );

    // 5. Journeys
    const unsubJourneys = onSnapshot(
      collection(db, 'journeys'),
      (snap) => {
        if (!snap.empty) {
          const list: JourneyItem[] = [];
          snap.forEach((d) => list.push({ id: d.id, ...d.data() } as JourneyItem));
          setJourneys(list);
        }
      },
      (err) => console.warn('journeys listener fallback:', err)
    );

    // 6. FAQs
    const unsubFaqs = onSnapshot(
      collection(db, 'faqs'),
      (snap) => {
        if (!snap.empty) {
          const list: FaqItem[] = [];
          snap.forEach((d) => list.push({ id: d.id, ...d.data() } as FaqItem));
          setFaqs(list);
        }
      },
      (err) => console.warn('faqs listener fallback:', err)
    );

    return () => {
      unsubSettings();
      unsubEvents();
      unsubMemberships();
      unsubProducts();
      unsubJourneys();
      unsubFaqs();
    };
  }, []);

  const scrollTo = (hash: string) => {
    if (currentView !== 'public') {
      handleSetCurrentView('public');
      setTimeout(() => {
        const el = document.querySelector(hash);
        el?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      const el = document.querySelector(hash);
      el?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const primaryEvent = events[0] || initialEvents[0];

  return (
    <div className="min-h-screen bg-[#12100E] text-[#F6EBD4] selection:bg-[#C98224] selection:text-[#12100E]">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 p-4 rounded-2xl bg-[#1C1814]/95 border border-[#C98224] shadow-2xl backdrop-blur-md text-xs text-[#F6EBD4] flex items-center gap-2.5 animate-in slide-in-from-top-4 duration-300">
          <Sparkles className="w-4 h-4 text-[#C98224] shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* View Routing */}
      {currentView === 'admin' ? (
        <AdminDashboard
          onBackToWebsite={() => handleSetCurrentView('public')}
          siteSettings={siteSettings}
          setSiteSettings={setSiteSettings}
        />
      ) : currentView === 'member' ? (
        <MemberPortal onBackToWebsite={() => handleSetCurrentView('public')} />
      ) : (
        /* Public Master Website */
        <div className="relative">
          <Navbar currentView={currentView} setCurrentView={handleSetCurrentView} />

          <HeroSection
            settings={siteSettings}
            onExploreClick={() => scrollTo('#philosophy')}
            onProgrammeClick={() => scrollTo('#programmes')}
          />

          <PathPhilosophySection aboutPhilosophy={siteSettings.aboutPhilosophy} />

          <EventProgrammeSection event={primaryEvent} />

          <MembershipSection memberships={memberships} />

          <JourneysSection journeys={journeys} />

          <StoreSection products={products} />

          <ConsultationSection consultations={consultations} />

          <CommunitySection
            faqs={faqs}
            onProgrammeClick={() => scrollTo('#programmes')}
            onMembershipClick={() => scrollTo('#memberships')}
          />

          <Footer
            settings={siteSettings}
            onAdminClick={() => handleSetCurrentView('admin')}
            onNavClick={scrollTo}
          />
        </div>
      )}

      {/* Persistent Modals & Ambient Sound */}
      <BookingModal />
      <CartDrawer />
      <InquiryModal />
      <AudioPlayer />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <MainWebsite />
      </CartProvider>
    </AuthProvider>
  );
}
