import React, { useState, useEffect } from 'react';
import { BrandLogo } from './BrandLogo';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import {
  ShoppingBag,
  User,
  Shield,
  Menu,
  X,
  Compass,
  Calendar,
  Sparkles,
  Award,
  BookOpen,
} from 'lucide-react';

interface NavbarProps {
  currentView: 'public' | 'admin' | 'member';
  setCurrentView: (view: 'public' | 'admin' | 'member') => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentView, setCurrentView }) => {
  const { user, isAdmin, isMember, signInWithGoogle, signOut } = useAuth();
  const { cartCount, setIsCartOpen } = useCart();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'The Path', href: '#philosophy' },
    { name: 'Programmes', href: '#programmes' },
    { name: 'Memberships', href: '#memberships' },
    { name: 'Sacred Journeys', href: '#journeys' },
    { name: 'Store', href: '#store' },
    { name: 'Consultation', href: '#consultation' },
    { name: 'Community', href: '#community' },
  ];

  const handleNavClick = (href: string) => {
    setMobileMenuOpen(false);
    if (currentView !== 'public') {
      setCurrentView('public');
      setTimeout(() => {
        const el = document.querySelector(href);
        el?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      const el = document.querySelector(href);
      el?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled || currentView !== 'public'
            ? 'bg-[#12100E]/95 backdrop-blur-md border-b border-[#4A2819]/50 py-3 shadow-2xl'
            : 'bg-gradient-to-b from-[#12100E]/80 via-[#12100E]/40 to-transparent py-4'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Logo */}
          <button
            onClick={() => {
              setCurrentView('public');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="focus:outline-none cursor-pointer text-left"
          >
            <BrandLogo variant="horizontal" size="sm" theme="dark" />
          </button>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-7">
            {navLinks.map((link) => (
              <button
                key={link.name}
                onClick={() => handleNavClick(link.href)}
                className="font-cinzel text-xs tracking-[0.16em] uppercase text-[#F6EBD4]/80 hover:text-[#D9B47A] transition-colors relative py-1 group cursor-pointer"
              >
                {link.name}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#C98224] transition-all duration-300 group-hover:w-full" />
              </button>
            ))}
          </nav>

          {/* Right Action Icons */}
          <div className="flex items-center space-x-3 sm:space-x-4">
            {/* View switcher buttons */}
            {isAdmin && (
              <button
                onClick={() => setCurrentView(currentView === 'admin' ? 'public' : 'admin')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold tracking-wider font-cinzel transition-all ${
                  currentView === 'admin'
                    ? 'bg-[#C98224] text-[#12100E]'
                    : 'bg-[#8C281C]/40 border border-[#8C281C] text-[#D9B47A] hover:bg-[#8C281C]/70'
                }`}
                title="Admin Content Management Dashboard"
              >
                <Shield className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">CMS</span> Admin
              </button>
            )}

            {isMember && !isAdmin && (
              <button
                onClick={() => setCurrentView(currentView === 'member' ? 'public' : 'member')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold tracking-wider font-cinzel transition-all ${
                  currentView === 'member'
                    ? 'bg-[#D9B47A] text-[#12100E]'
                    : 'bg-[#4A2819]/50 border border-[#4A2819] text-[#F6EBD4] hover:border-[#D9B47A]'
                }`}
              >
                <Award className="w-3.5 h-3.5 text-[#C98224]" />
                <span className="hidden sm:inline">My Portal</span>
              </button>
            )}

            {/* Cart Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 rounded-full text-[#F6EBD4] hover:text-[#D9B47A] hover:bg-[#4A2819]/40 transition-colors"
              aria-label="View Shopping Cart"
            >
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#8C281C] text-[#F6EBD4] text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center border border-[#D9B47A]">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Auth Button */}
            {user ? (
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => signOut()}
                  className="hidden sm:inline-flex items-center gap-1 px-3 py-1.5 rounded-full border border-[#4A2819] text-xs text-[#D9B47A]/80 hover:text-[#F6EBD4] hover:border-[#C98224] transition-colors"
                >
                  <User className="w-3.5 h-3.5" />
                  Sign Out
                </button>
              </div>
            ) : (
              <button
                onClick={() => signInWithGoogle()}
                className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#4A2819]/60 hover:bg-[#4A2819] border border-[#D9B47A]/40 text-xs font-medium text-[#F6EBD4] transition-all hover:scale-105"
              >
                <User className="w-3.5 h-3.5 text-[#C98224]" />
                Sign In
              </button>
            )}

            {/* Primary CTA */}
            <button
              onClick={() => handleNavClick('#programmes')}
              className="hidden md:inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-gradient-to-r from-[#C98224] to-[#8C281C] text-[#F6EBD4] text-xs font-cinzel font-bold tracking-wider hover:brightness-110 shadow-lg shadow-[#8C281C]/20 transition-all cursor-pointer"
            >
              Join Programme
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-[#F6EBD4] hover:bg-[#4A2819]/40"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-[#181513]/98 border-b border-[#4A2819] px-6 py-6 space-y-4 animate-in fade-in slide-in-from-top-4 duration-300">
            <div className="flex flex-col space-y-3">
              {navLinks.map((link) => (
                <button
                  key={link.name}
                  onClick={() => handleNavClick(link.href)}
                  className="font-cinzel text-sm tracking-widest text-[#F6EBD4] hover:text-[#C98224] text-left py-2 border-b border-[#4A2819]/40"
                >
                  {link.name}
                </button>
              ))}
            </div>

            <div className="pt-4 flex flex-col space-y-2.5">
              <button
                onClick={() => handleNavClick('#programmes')}
                className="w-full py-2.5 rounded-full bg-gradient-to-r from-[#C98224] to-[#8C281C] text-[#F6EBD4] font-cinzel text-xs font-bold tracking-wider"
              >
                Book 2-Day Retreat
              </button>

              {user ? (
                <button
                  onClick={() => signOut()}
                  className="w-full py-2 rounded-full border border-[#4A2819] text-xs text-[#D9B47A] font-medium"
                >
                  Signed in as {user.email?.split('@')[0]} (Sign Out)
                </button>
              ) : (
                <button
                  onClick={() => signInWithGoogle()}
                  className="w-full py-2.5 rounded-full bg-[#4A2819] text-xs font-medium text-[#F6EBD4] flex items-center justify-center gap-2"
                >
                  <User className="w-4 h-4 text-[#C98224]" />
                  Sign In with Google
                </button>
              )}
            </div>
          </div>
        )}
      </header>
    </>
  );
};
