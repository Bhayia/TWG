import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX, Sparkles } from 'lucide-react';

export const AudioPlayer: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const oscillatorsRef = useRef<OscillatorNode[]>([]);
  const gainNodeRef = useRef<GainNode | null>(null);
  const bellIntervalRef = useRef<number | null>(null);

  const startSacredDrone = () => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioCtx();
      audioCtxRef.current = ctx;

      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(0.01, ctx.currentTime);
      masterGain.gain.exponentialRampToValueAtTime(0.12, ctx.currentTime + 3);
      masterGain.connect(ctx.destination);
      gainNodeRef.current = masterGain;

      // Sacred Tanpura chord frequencies (Root: 108Hz, Fifth: 162Hz, Octave: 216Hz, 432Hz harmonic)
      const freqs = [108, 162, 216, 432];
      oscillatorsRef.current = freqs.map((f, i) => {
        const osc = ctx.createOscillator();
        const oscGain = ctx.createGain();
        osc.type = i % 2 === 0 ? 'sine' : 'triangle';
        osc.frequency.setValueAtTime(f + (Math.random() - 0.5) * 0.8, ctx.currentTime);

        oscGain.gain.value = i === 3 ? 0.04 : 0.25;
        osc.connect(oscGain);
        oscGain.connect(masterGain);
        osc.start();
        return osc;
      });

      // Play soft temple bell every 18 seconds
      const playTempleBell = () => {
        if (!audioCtxRef.current || audioCtxRef.current.state !== 'running') return;
        const now = audioCtxRef.current.currentTime;
        const bellOsc = audioCtxRef.current.createOscillator();
        const bellGain = audioCtxRef.current.createGain();

        bellOsc.type = 'sine';
        bellOsc.frequency.setValueAtTime(852, now); // Solfeggio 852Hz third-eye frequency
        bellGain.gain.setValueAtTime(0.08, now);
        bellGain.gain.exponentialRampToValueAtTime(0.0001, now + 4.5);

        bellOsc.connect(bellGain);
        bellGain.connect(audioCtxRef.current.destination);
        bellOsc.start(now);
        bellOsc.stop(now + 5);
      };

      bellIntervalRef.current = window.setInterval(playTempleBell, 18000);
      setIsPlaying(true);
    } catch (err) {
      console.warn('AudioContext initialization error:', err);
    }
  };

  const stopSacredDrone = () => {
    if (gainNodeRef.current && audioCtxRef.current) {
      const now = audioCtxRef.current.currentTime;
      gainNodeRef.current.gain.linearRampToValueAtTime(0.001, now + 1.2);
      setTimeout(() => {
        oscillatorsRef.current.forEach((osc) => {
          try {
            osc.stop();
            osc.disconnect();
          } catch {}
        });
        oscillatorsRef.current = [];
        if (audioCtxRef.current) {
          audioCtxRef.current.close().catch(() => {});
          audioCtxRef.current = null;
        }
      }, 1300);
    }
    if (bellIntervalRef.current) {
      clearInterval(bellIntervalRef.current);
      bellIntervalRef.current = null;
    }
    setIsPlaying(false);
  };

  const toggleAudio = () => {
    if (isPlaying) {
      stopSacredDrone();
    } else {
      startSacredDrone();
    }
  };

  useEffect(() => {
    return () => {
      stopSacredDrone();
    };
  }, []);

  return (
    <button
      onClick={toggleAudio}
      aria-pressed={isPlaying}
      className={`fixed bottom-6 right-6 z-40 flex items-center gap-2 px-3.5 py-2.5 rounded-full border transition-all duration-300 shadow-2xl backdrop-blur-md text-xs font-medium ${
        isPlaying
          ? 'bg-[#C98224]/20 border-[#C98224] text-[#F6EBD4] shadow-[#C98224]/30'
          : 'bg-[#181513]/85 border-[#4A2819] text-[#D9B47A] hover:border-[#C98224]/60'
      }`}
      title={isPlaying ? 'Mute Sacred Atmosphere Sound' : 'Play Sacred Sanctuary Atmosphere'}
      aria-label="Toggle sacred sanctuary ambience"
    >
      {isPlaying ? (
        <>
          <Volume2 className="w-4 h-4 text-[#C98224] animate-pulse" />
          <span className="font-cinzel tracking-wider">Atmosphere: ON</span>
          <span className="w-2 h-2 rounded-full bg-[#C98224] animate-ping" />
        </>
      ) : (
        <>
          <VolumeX className="w-4 h-4 text-[#D9B47A]/70" />
          <span className="font-cinzel tracking-wider hidden sm:inline">Atmosphere Audio</span>
        </>
      )}
    </button>
  );
};
