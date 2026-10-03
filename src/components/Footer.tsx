import React from 'react';
import { BrandLogo } from './BrandLogo';
import { SiteSettings } from '../types';
import { Mail, Phone, MapPin, Instagram, Youtube, Facebook, Shield, Heart } from 'lucide-react';

interface FooterProps {
  settings: SiteSettings;
  onAdminClick: () => void;
  onNavClick: (href: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ settings, onAdminClick, onNavClick }) => {
  return (
    <footer className="bg-[#0E0C0B] border-t border-[#4A2819] text-[#F6EBD4]/70 pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-16">
          {/* Brand Info (2 Cols) */}
          <div className="lg:col-span-2 space-y-4">
            <BrandLogo variant="horizontal" size="md" theme="dark" />
            <p className="text-xs sm:text-sm text-[#F6EBD4]/70 leading-relaxed font-sans max-w-sm pt-2">
              A sacred movement for self-discovery, spiritual awareness, and cultural pilgrimage inspired by Sree Narayana Guru and Shiva Mayam. Travel is our outer expression; wisdom is our destination.
            </p>
            <div className="pt-2 flex items-center space-x-3">
              <a
                href={settings.socialLinks?.instagram || '#'}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full bg-[#181513] border border-[#4A2819] text-[#D9B47A] hover:text-[#C98224] hover:border-[#C98224] transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href={settings.socialLinks?.youtube || '#'}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full bg-[#181513] border border-[#4A2819] text-[#D9B47A] hover:text-[#C98224] hover:border-[#C98224] transition-colors"
                aria-label="YouTube"
              >
                <Youtube className="w-4 h-4" />
              </a>
              <a
                href={settings.socialLinks?.whatsapp || '#'}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full bg-[#181513] border border-[#4A2819] text-[#D9B47A] hover:text-[#C98224] hover:border-[#C98224] transition-colors"
                aria-label="WhatsApp"
              >
                <Phone className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Nav Links: Pillars */}
          <div className="space-y-3">
            <h4 className="font-cinzel text-xs font-bold uppercase tracking-[0.2em] text-[#D9B47A]">
              The Journey
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => onNavClick('#philosophy')} className="hover:text-[#C98224] transition-colors cursor-pointer">
                  The Path of Wisdom
                </button>
              </li>
              <li>
                <button onClick={() => onNavClick('#philosophy')} className="hover:text-[#C98224] transition-colors cursor-pointer">
                  Sree Narayana Guru
                </button>
              </li>
              <li>
                <button onClick={() => onNavClick('#philosophy')} className="hover:text-[#C98224] transition-colors cursor-pointer">
                  Shiva Mayam Stillness
                </button>
              </li>
              <li>
                <button onClick={() => onNavClick('#journeys')} className="hover:text-[#C98224] transition-colors cursor-pointer">
                  Sacred Destinations
                </button>
              </li>
            </ul>
          </div>

          {/* Programmes & Fellowship */}
          <div className="space-y-3">
            <h4 className="font-cinzel text-xs font-bold uppercase tracking-[0.2em] text-[#D9B47A]">
              Programmes
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => onNavClick('#programmes')} className="hover:text-[#C98224] transition-colors cursor-pointer">
                  Guruvinae Ariyan Retreat
                </button>
              </li>
              <li>
                <button onClick={() => onNavClick('#memberships')} className="hover:text-[#C98224] transition-colors cursor-pointer">
                  Annual Memberships
                </button>
              </li>
              <li>
                <button onClick={() => onNavClick('#memberships')} className="hover:text-[#C98224] transition-colors cursor-pointer">
                  5-Year Fellowships
                </button>
              </li>
              <li>
                <button onClick={() => onNavClick('#store')} className="hover:text-[#C98224] transition-colors cursor-pointer">
                  Sacred Store & Rudraksha
                </button>
              </li>
              <li>
                <button onClick={() => onNavClick('#consultation')} className="hover:text-[#C98224] transition-colors cursor-pointer">
                  1:1 Acharya Guidance
                </button>
              </li>
            </ul>
          </div>

          {/* Contact Sanctuary */}
          <div className="space-y-3">
            <h4 className="font-cinzel text-xs font-bold uppercase tracking-[0.2em] text-[#D9B47A]">
              Sanctuary
            </h4>
            <ul className="space-y-2.5 text-xs text-[#F6EBD4]/75">
              <li className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-[#C98224] shrink-0 mt-0.5" />
                <span>{settings.address}</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-[#C98224] shrink-0" />
                <span>{settings.contactPhone}</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-[#C98224] shrink-0" />
                <span className="truncate">{settings.contactEmail}</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar with Admin Link */}
        <div className="pt-8 border-t border-[#4A2819]/50 flex flex-col sm:flex-row items-center justify-between text-xs text-[#F6EBD4]/50 gap-4">
          <div className="flex items-center gap-1">
            <span>© {new Date().getFullYear()} Travel With Guru. All Rights Reserved.</span>
          </div>

          <div className="flex items-center space-x-6">
            <button
              onClick={onAdminClick}
              className="flex items-center gap-1 text-[#D9B47A]/60 hover:text-[#C98224] transition-colors cursor-pointer font-cinzel text-[11px]"
            >
              <Shield className="w-3 h-3" />
              Administrator CMS
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
