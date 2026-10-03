import React from 'react';
import { SiteSettings } from '../types';
import { BrandLogo } from './BrandLogo';
import { ArrowDown, Sparkles, Compass, Calendar } from 'lucide-react';

interface HeroSectionProps {
  settings: SiteSettings;
  onExploreClick: () => void;
  onProgrammeClick: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  settings,
  onExploreClick,
  onProgrammeClick,
}) => {
  return (
    <section className="relative min-h-screen w-full flex flex-col justify-between items-center text-center overflow-hidden bg-[#12100E]">
      {/* Background Cinematic Layer */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <img
          src={settings.heroPosterUrl || '/src/assets/images/twg_hero_cinema_1790837622263.jpg'}
          alt="Travel With Guru sacred stone pathway in dawn mist"
          loading="eager"
          decoding="async"
          className="w-full h-full object-cover object-center scale-105 opacity-60 filter contrast-110 brightness-90 transition-transform duration-1000 motion-safe:animate-[pulse_12s_ease-in-out_infinite]"
        />
        {/* Cinematic Vignette & Saffron Atmosphere Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#12100E] via-[#12100E]/40 to-[#12100E]/80" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_20%,_#12100E_90%)]" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#8C281C]/20 via-transparent to-[#C98224]/15 mix-blend-overlay" />
      </div>

      {/* Optional Top Announcement Bar */}
      {settings.showAnnouncement && settings.announcement && (
        <div className="relative z-10 w-full pt-20 px-4">
          <div className="max-w-3xl mx-auto py-1.5 px-4 rounded-full bg-[#8C281C]/50 border border-[#C98224]/40 text-[#F6EBD4] text-xs font-medium flex items-center justify-center gap-2 backdrop-blur-md shadow-lg animate-in fade-in duration-700">
            <span className="w-2 h-2 rounded-full bg-[#C98224] animate-ping" />
            <span className="truncate">{settings.announcement}</span>
            <button
              onClick={onProgrammeClick}
              className="text-[#D9B47A] underline hover:text-white cursor-pointer ml-1 font-semibold"
            >
              Reserve Seat →
            </button>
          </div>
        </div>
      )}

      {/* Main Center Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-24 my-auto flex flex-col items-center">
        {/* Sacred Emblem & Brand */}
        <div className="mb-4 inline-flex flex-col items-center animate-in fade-in slide-in-from-bottom-6 duration-1000">
          <BrandLogo variant="iconOnly" size="lg" theme="dark" />
          <div className="mt-3 text-xs md:text-sm tracking-[0.38em] uppercase text-[#D9B47A] font-cinzel font-semibold">
            INDIA • NEPAL • MALAYSIA
          </div>
        </div>

        {/* Master Headline */}
        <div className="space-y-3 max-w-4xl">
          <h1 className="font-cinzel text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-[0.16em] uppercase text-[#F6EBD4] leading-tight drop-shadow-2xl">
            WALK THE PATH <br />
            <span className="text-saffron-gradient">OF WISDOM</span>
          </h1>

          <p className="font-serif-cormorant italic text-lg sm:text-2xl md:text-3xl text-[#D9B47A] font-normal tracking-wide max-w-2xl mx-auto pt-2">
            "Wisdom is not only something we learn. <br className="hidden sm:inline" />
            It is something we walk, breathe, and experience."
          </p>
        </div>

        {/* 4 Sacred Stages Ticker */}
        <div className="mt-8 flex items-center justify-center space-x-2 sm:space-x-6 text-[10px] sm:text-xs tracking-[0.3em] uppercase text-[#F6EBD4]/75 font-cinzel border-y border-[#4A2819]/60 py-2.5 px-6 bg-[#181513]/40 backdrop-blur-sm rounded-full">
          <span className="hover:text-[#C98224] transition-colors">SEEK</span>
          <span className="text-[#C98224]">•</span>
          <span className="hover:text-[#C98224] transition-colors">EXPERIENCE</span>
          <span className="text-[#C98224]">•</span>
          <span className="hover:text-[#C98224] transition-colors">UNDERSTAND</span>
          <span className="text-[#C98224]">•</span>
          <span className="hover:text-[#C98224] transition-colors">TRANSFORM</span>
        </div>

        {/* Action CTAs */}
        <div className="mt-10 flex flex-col sm:flex-row items-center gap-4 sm:gap-5 w-full sm:w-auto">
          <button
            onClick={onProgrammeClick}
            className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-gradient-to-r from-[#C98224] via-[#8C281C] to-[#4A2819] text-[#F6EBD4] font-cinzel font-bold text-xs sm:text-sm tracking-[0.2em] uppercase hover:brightness-110 shadow-2xl shadow-[#8C281C]/40 border border-[#D9B47A]/30 transition-all hover:scale-105 cursor-pointer flex items-center justify-center gap-2"
          >
            <Calendar className="w-4 h-4 text-[#D9B47A]" />
            First Programme: Guruvinae Ariyan
          </button>

          <button
            onClick={onExploreClick}
            className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-[#181513]/80 hover:bg-[#4A2819]/40 border border-[#D9B47A]/40 text-[#D9B47A] hover:text-[#F6EBD4] font-cinzel font-semibold text-xs sm:text-sm tracking-[0.2em] uppercase backdrop-blur-md transition-all hover:border-[#C98224] cursor-pointer flex items-center justify-center gap-2"
          >
            <Compass className="w-4 h-4 text-[#C98224]" />
            Explore The Journey
          </button>
        </div>
      </div>

      {/* Bottom Sacred Scroll Cue */}
      <div className="relative z-10 pb-8 flex flex-col items-center">
        <button
          onClick={onExploreClick}
          className="group flex flex-col items-center space-y-1 text-[#D9B47A]/70 hover:text-[#C98224] transition-colors cursor-pointer"
          aria-label="Scroll down the sacred path"
        >
          <span className="text-[10px] tracking-[0.3em] font-cinzel uppercase">
            Walk Down The Path
          </span>
          <ArrowDown className="w-4 h-4 animate-bounce text-[#C98224]" />
        </button>
      </div>
    </section>
  );
};
