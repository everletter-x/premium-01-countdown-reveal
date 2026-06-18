import { useState, useEffect, useRef } from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
} from "framer-motion";
import { useConfigLoader } from "../shared";

interface Config {
  recipient: string;
  sender: string;
  title: string;
  message: string;
  photos: string[];
  theme: string;
  music: string;
  musicTitle: string;
  template: string;
  captions: string[];
  closing: string;
  reasons?: string[];
  musicAutoPlay?: boolean;
  musicVolume?: number;
}

const themeColors: Record<string, { bg: string; accent: string; text: string; glow: string }> = {
  pink: { bg: "bg-pink-soft", accent: "text-rose", text: "text-dark-luxury", glow: "shadow-pink-soft" },
  rose: { bg: "bg-rose", accent: "text-rose", text: "text-elegant-white", glow: "shadow-rose" },
  lavender: { bg: "bg-lavender", accent: "text-lavender", text: "text-dark-luxury", glow: "shadow-lavender" },
};

function LoadingScreen() {
  return (
    <motion.div
      className="fixed inset-0 flex items-center justify-center bg-dark-luxury z-50"
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
    >
      <div className="text-center">
        <motion.div
          className="w-16 h-16 mx-auto mb-8 border-2 border-gold-accent border-t-transparent rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
        <motion.p
          className="text-elegant-white text-lg font-light tracking-wide max-w-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          Sedang menyiapkan hadiah spesial untukmu...
        </motion.p>
      </div>
    </motion.div>
  );
}

function CountdownScreen({ onComplete }: { onComplete: () => void }) {
  const [count, setCount] = useState(3);

  useEffect(() => {
    if (count === 0) {
      onComplete();
      return;
    }
    const timer = setTimeout(() => setCount((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [count, onComplete]);

  return (
    <motion.div
      className="fixed inset-0 flex items-center justify-center bg-deep-black z-50"
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
    >
      <AnimatePresence mode="wait">
        {count > 0 && (
          <motion.div
            key={count}
            initial={{ scale: 0.3, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 2.5, opacity: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="text-gold-accent text-[120px] font-bold select-none"
          >
            {count}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function MusicButton({ src, title }: { src: string; title: string }) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);

  const toggle = () => {
    if (!audioRef.current) return;
    if (!audioRef.current.paused) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setPlaying((p) => !p);
  };

  return (
    <div className="fixed bottom-6 right-6 z-40">
      <audio ref={audioRef} src={src} loop />
      <motion.button
        onClick={toggle}
        className="w-14 h-14 rounded-full bg-gold-accent text-dark-luxury flex items-center justify-center shadow-lg"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        aria-label={playing ? "Pause music" : "Play music"}
        aria-pressed={playing}
      >
        {playing ? (
          <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 3v10.55A4 4 0 1 0 14 17V7h4V3h-6z" />
          </svg>
        )}
      </motion.button>
      <motion.div
        className="absolute -top-8 right-0 bg-dark-luxury text-elegant-white text-xs px-3 py-1 rounded-full whitespace-nowrap opacity-0 pointer-events-none"
        whileHover={{ opacity: 1 }}
      >
        {title}
      </motion.div>
    </div>
  );
}

function HeroSection({ recipient, title, theme }: { recipient: string; title: string; theme: string }) {
  const colors = themeColors[theme] || themeColors.pink;
  return (
    <motion.section
      className={`min-h-screen flex items-center justify-center ${colors.bg} ${colors.text} relative overflow-hidden`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      <div className="absolute inset-0 opacity-10">
        {Array.from({ length: 20 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-gold-accent rounded-full"
            style={{ left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%` }}
            animate={{ opacity: [0, 1, 0], scale: [0, 1.5, 0] }}
            transition={{ duration: 2 + Math.random() * 3, repeat: Infinity, delay: Math.random() * 2 }}
          />
        ))}
      </div>
      <div className="text-center z-10 px-6">
        <motion.p
          className="text-sm tracking-[0.3em] uppercase mb-4 opacity-70"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 0.7 }}
          transition={{ delay: 0.3 }}
        >
          For You
        </motion.p>
        <motion.h1
          className="text-5xl md:text-7xl font-bold mb-4"
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
        >
          {recipient}
        </motion.h1>
        <motion.div
          className="w-24 h-0.5 bg-gold-accent mx-auto my-6"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.8, duration: 0.6 }}
        />
        <motion.p
          className="text-2xl md:text-3xl font-light italic"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1 }}
        >
          {title}
        </motion.p>
      </div>
    </motion.section>
  );
}

function OpeningSection({ message }: { message: string }) {
  const lines = message.split("\n");
  return (
    <motion.section className="min-h-screen flex items-center justify-center bg-warm-white px-6 py-20">
      <div className="max-w-2xl mx-auto text-center">
        {lines.map((line, i) => (
          <motion.p
            key={i}
            className={`text-lg md:text-xl text-dark-luxury leading-relaxed ${i > 0 ? "mt-4" : ""}`}
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ delay: i * 0.2, duration: 0.6 }}
          >
            {line}
          </motion.p>
        ))}
      </div>
    </motion.section>
  );
}

function PhotoGrid({ photos, captions }: { photos: string[]; captions: string[] }) {
  return (
    <motion.section className="min-h-screen bg-elegant-white px-6 py-20">
      <div className="max-w-4xl mx-auto">
        <motion.h2
          className="text-3xl font-bold text-dark-luxury text-center mb-12"
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
        >
          Momen Bersama
        </motion.h2>
        <div className="grid grid-cols-2 gap-4">
          {photos.map((photo, i) => (
            <motion.div
              key={i}
              className="relative overflow-hidden rounded-xl aspect-square bg-pink-soft"
              initial={{ scale: 0.8, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15, duration: 0.5 }}
              whileHover={{ scale: 1.03 }}
            >
              <img
                src={`/${photo}`}
                alt={captions[i] || `Foto ${i + 1}`}
                className="w-full h-full object-cover"
                loading="lazy"
              />
              {captions[i] && (
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                  <p className="text-elegant-white text-sm font-medium">{captions[i]}</p>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
}

function AlasanSayang({ sender, reasons }: { sender: string; reasons: string[] }) {
  const displayReasons = reasons.length > 0 ? reasons : [
    "Senyummu yang selalu mencerahkan hariku",
    "Caramu mendengarkanku tanpa menghakimi",
    "Keberanianmu menghadapi setiap tantangan",
    "Ketulusan hatimu yang tak pernah berubah",
    "Setiap momen kecil bersamamu yang berarti",
  ];

  return (
    <motion.section className="min-h-screen bg-dark-luxury px-6 py-20 flex items-center">
      <div className="max-w-2xl mx-auto">
        <motion.h2
          className="text-3xl font-bold text-gold-accent text-center mb-12"
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
        >
          Alasan {sender} Sayang Kamu
        </motion.h2>
        <div className="space-y-6">
          {displayReasons.map((reason, i) => (
            <motion.div
              key={i}
              className="flex items-start gap-4"
              initial={{ x: -30, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15, duration: 0.5 }}
            >
              <span className="flex-shrink-0 w-8 h-8 rounded-full bg-gold-accent text-dark-luxury flex items-center justify-center text-sm font-bold">
                {i + 1}
              </span>
              <p className="text-elegant-white text-lg leading-relaxed">{reason}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
}

function MemorySection({ captions }: { captions: string[] }) {
  return (
    <motion.section className="min-h-screen bg-pink-soft px-6 py-20 flex items-center">
      <div className="max-w-2xl mx-auto text-center">
        <motion.h2
          className="text-3xl font-bold text-dark-luxury mb-8"
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
        >
          Kenangan Indah
        </motion.h2>
        <motion.div
          className="space-y-8"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
        >
          <div className="w-full h-px bg-dark-luxury/20 my-8" />
          {captions.map((caption, i) => (
            <motion.div
              key={i}
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <p className="text-xl text-dark-luxury italic">&ldquo;{caption}&rdquo;</p>
            </motion.div>
          ))}
          <div className="w-full h-px bg-dark-luxury/20 my-8" />
        </motion.div>
      </div>
    </motion.section>
  );
}

function ClosingSection({ closing, recipient }: { closing: string; recipient: string }) {
  return (
    <motion.section className="min-h-screen bg-deep-black flex items-center justify-center px-6">
      <div className="text-center max-w-lg">
        <motion.div
          className="w-16 h-16 mx-auto mb-8 border-2 border-gold-accent rounded-full flex items-center justify-center"
          initial={{ scale: 0 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: true }}
          transition={{ type: "spring", duration: 0.8 }}
        >
          <span className="text-gold-accent text-2xl">♥</span>
        </motion.div>
        <motion.p
          className="text-elegant-white text-xl md:text-2xl leading-relaxed mb-8"
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
        >
          {closing}
        </motion.p>
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 }}
        >
          <p className="text-gold-accent text-sm tracking-widest uppercase mb-2">With love,</p>
          <p className="text-elegant-white text-lg">{recipient}</p>
        </motion.div>
      </div>
    </motion.section>
  );
}

export default function HomePage() {
  const { config, loading: configLoading } = useConfigLoader<Config>("/config.json");
  const [phase, setPhase] = useState<"loading" | "countdown" | "revealed">("loading");
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.02], [1, 1]);

  useEffect(() => {
    if (!configLoading && config) {
      const timer = setTimeout(() => setPhase("countdown"), 1500);
      return () => clearTimeout(timer);
    }
  }, [configLoading, config]);

  if (configLoading || !config) {
    return (
      <div className="min-h-screen bg-dark-luxury">
        <LoadingScreen />
      </div>
    );
  }

  const theme = config.theme || "pink";

  return (
    <div className="min-h-screen bg-warm-white">
      <AnimatePresence mode="wait">
        {phase === "loading" && <LoadingScreen key="loading" />}
        {phase === "countdown" && (
          <CountdownScreen key="countdown" onComplete={() => setPhase("revealed")} />
        )}
      </AnimatePresence>

      {phase === "revealed" && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }}>
          <MusicButton src={`/${config.music}`} title={config.musicTitle} />

          <HeroSection recipient={config.recipient} title={config.title} theme={theme} />

          <OpeningSection message={config.message} />

          {config.photos.length > 0 && (
            <PhotoGrid photos={config.photos} captions={config.captions} />
          )}

          <AlasanSayang sender={config.sender} reasons={config.reasons || []} />

          <MemorySection captions={config.captions} />

          <ClosingSection closing={config.closing} recipient={config.sender} />

          <a
            href="https://wa.me/6282320114535?text=Halo%2C%20saya%20tertarik%20dengan%20EverLetter!"
            target="_blank"
            rel="noopener noreferrer"
            className="fixed bottom-6 right-6 z-50 bg-green-500 text-white px-6 py-3 rounded-full shadow-lg hover:bg-green-600 transition-colors flex items-center gap-2 font-medium"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            Pesan Sekarang
          </a>

          {/* Share Button */}
          <button
            onClick={() => {
              if (navigator.share) {
                navigator.share({
                  title: 'EverLetter - Bloom',
                  text: 'Lihat hadiah digital indah ini!',
                  url: window.location.href,
                });
              } else {
                navigator.clipboard.writeText(window.location.href);
                const toast = document.createElement('div');
                toast.className = 'fixed top-6 left-1/2 -translate-x-1/2 z-[100] bg-dark-luxury text-elegant-white px-6 py-3 rounded-full shadow-lg text-sm font-medium';
                toast.textContent = 'Link disalin ke clipboard!';
                document.body.appendChild(toast);
                setTimeout(() => toast.remove(), 3000);
              }
            }}
            className="fixed bottom-20 left-6 z-50 bg-elegant-white/20 backdrop-blur-sm text-white px-4 py-3 rounded-full shadow-lg hover:bg-elegant-white/30 transition-colors flex items-center gap-2"
            aria-label="Bagikan"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
            </svg>
          </button>
        </motion.div>
      )}
    </div>
  );
}
