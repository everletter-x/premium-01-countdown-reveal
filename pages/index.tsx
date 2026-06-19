import { useState, useEffect, useRef, useMemo } from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
} from "framer-motion";
import Head from 'next/head';
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
}

const themeColors: Record<string, { bg: string; bgStart: string; bgEnd: string; cardBg: string; accent: string; accentHex: string; text: string; glow: string; glowHex: string; muted: string }> = {
  pink: { 
    bg: "bg-gradient-to-br from-[#0F0811] via-[#1A0B1A] to-[#250E20]",
    bgStart: "#0F0811",
    bgEnd: "#250E20",
    cardBg: "bg-white/[0.06] border-white/[0.12]",
    accent: "text-[#F6B3D0]", 
    accentHex: "#F6B3D0",
    text: "text-[#F9F5F6]", 
    glow: "shadow-pink-500/20",
    glowHex: "#F6B3D0",
    muted: "text-white/50",
  },
  rose: { 
    bg: "bg-gradient-to-br from-[#1A080A] via-[#2D1216] to-[#1A080A]",
    bgStart: "#1A080A",
    bgEnd: "#2D1216",
    cardBg: "bg-white/[0.06] border-white/[0.12]",
    accent: "text-[#FDA4AF]", 
    accentHex: "#FDA4AF",
    text: "text-[#FFE4E6]", 
    glow: "shadow-rose-500/20",
    glowHex: "#FDA4AF",
    muted: "text-white/50",
  },
  lavender: { 
    bg: "bg-gradient-to-br from-[#080711] via-[#0D0A1C] to-[#150F2A]",
    bgStart: "#080711",
    bgEnd: "#150F2A",
    cardBg: "bg-white/[0.06] border-white/[0.12]",
    accent: "text-[#C5B3E6]", 
    accentHex: "#C5B3E6",
    text: "text-[#F5F3F7]", 
    glow: "shadow-purple-500/20",
    glowHex: "#C5B3E6",
    muted: "text-white/50",
  },
  "warm-white": { 
    bg: "bg-gradient-to-br from-[#12110F] via-[#1E1915] to-[#2B2118]",
    bgStart: "#12110F",
    bgEnd: "#2B2118",
    cardBg: "bg-white/[0.06] border-white/[0.12]",
    accent: "text-[#E6C29E]", 
    accentHex: "#E6C29E",
    text: "text-[#FBFBF9]", 
    glow: "shadow-stone-500/20",
    glowHex: "#E6C29E",
    muted: "text-white/50",
  }
};

/* ── Rose Petal Particles (unique to Bloom) ── */
function RosePetals({ color }: { color: string }) {
  const petals = useMemo(() =>
    [...Array(14)].map((_, i) => ({
      left: `${(i * 13 + 3) % 100}%`,
      size: 6 + (i % 4) * 3,
      duration: 6 + (i % 5) * 2,
      delay: (i % 7) * 0.9,
      rotate: (i * 37) % 360,
      drift: 20 + (i % 3) * 15,
    })), []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {petals.map((p, i) => (
        <motion.div
          key={i}
          className="absolute"
          style={{
            left: p.left,
            top: "-5%",
            width: p.size,
            height: p.size * 1.4,
          }}
          animate={{
            y: ["0vh", "110vh"],
            x: [0, p.drift, -p.drift / 2, p.drift * 0.7],
            rotate: [p.rotate, p.rotate + 360],
            opacity: [0, 0.6, 0.4, 0],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            delay: p.delay,
            ease: "linear",
          }}
        >
          <svg viewBox="0 0 20 28" fill="none">
            <path
              d="M10 0C10 0 20 10 20 18C20 24 15.5 28 10 28C4.5 28 0 24 0 18C0 10 10 0 10 0Z"
              fill={color}
              fillOpacity={0.35}
            />
            <path
              d="M10 4C10 4 16 12 16 18C16 22 13 25 10 25"
              stroke={color}
              strokeOpacity={0.2}
              strokeWidth="0.5"
            />
          </svg>
        </motion.div>
      ))}
    </div>
  );
}

/* ── Ambient floating particles ── */
function AmbientParticles({ color }: { color: string }) {
  const particles = useMemo(() =>
    [...Array(8)].map((_, i) => ({
      left: `${(i * 17 + 5) % 100}%`,
      top: `${(i * 23 + 10) % 100}%`,
      size: 1 + (i % 3),
      duration: 4 + (i % 5),
      delay: (i % 7) * 0.8,
    })), []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {particles.map((p, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            left: p.left,
            top: p.top,
            width: p.size,
            height: p.size,
            backgroundColor: color,
          }}
          animate={{
            y: [0, -40, 0],
            opacity: [0, 0.4, 0],
            scale: [0.5, 1, 0.5],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            delay: p.delay,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

/* ── Premium Loading Screen ── */
function LoadingScreen({ theme }: { theme: string }) {
  const colors = themeColors[theme] || themeColors.pink;
  return (
    <motion.div
      className={`fixed inset-0 flex flex-col items-center justify-center ${colors.bg} z-50 font-sans`}
      exit={{ opacity: 0 }}
      transition={{ duration: 1, ease: "easeInOut" }}
    >
      <RosePetals color={colors.accentHex} />
      <div className="relative z-10 text-center">
        <div className="relative w-32 h-32 mb-10 flex items-center justify-center mx-auto">
          <motion.div
            className="absolute inset-0 rounded-full border border-white/10"
            animate={{ rotate: 360 }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          />
          <motion.div
            className="absolute inset-4 rounded-full border border-white/5"
            animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.1, 0.3] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute inset-8 rounded-full border border-white/10"
            animate={{ scale: [1.2, 1, 1.2], opacity: [0.2, 0.4, 0.2] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
          />
          <motion.div
            className="w-4 h-4 rotate-45"
            style={{ backgroundColor: colors.accentHex }}
            animate={{ scale: [1, 1.3, 1], opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>
        <motion.p
          className="font-display-premium text-white/40 text-xs tracking-[0.4em] uppercase"
          animate={{ opacity: [0.3, 0.7, 0.3] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        >
          Sedang Menyiapkan Hadiah Spesial...
        </motion.p>
      </div>
    </motion.div>
  );
}

/* ── Premium Countdown ── */
function CountdownScreen({ onComplete, theme }: { onComplete: () => void; theme: string }) {
  const [count, setCount] = useState(3);
  const colors = themeColors[theme] || themeColors.pink;

  useEffect(() => {
    if (count === 0) { onComplete(); return; }
    const timer = setTimeout(() => setCount((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [count, onComplete]);

  return (
    <motion.div
      className={`fixed inset-0 flex items-center justify-center ${colors.bg} z-50 font-sans overflow-hidden`}
      exit={{ opacity: 0, scale: 1.1 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
    >
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vw] h-[60vw] rounded-full opacity-20 blur-[120px] pointer-events-none"
        style={{ background: `radial-gradient(circle, ${colors.accentHex}, transparent)` }}
      />
      <AnimatePresence mode="wait">
        {count > 0 && (
          <motion.div
            key={count}
            initial={{ scale: 0.5, opacity: 0, filter: "blur(20px)" }}
            animate={{ scale: 1, opacity: 1, filter: "blur(0px)" }}
            exit={{ scale: 2, opacity: 0, filter: "blur(10px)" }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="relative z-10"
          >
            <span
              className="font-serif-premium font-bold select-none text-[clamp(6rem,18vw,14rem)] tracking-tighter leading-none"
              style={{ color: colors.accentHex }}
            >
              {count}
            </span>
          </motion.div>
        )}
      </AnimatePresence>
      <svg className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[30vw] h-[30vw] max-w-[280px] max-h-[280px] pointer-events-none z-10" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="48" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="0.5" />
        <motion.circle
          key={count}
          cx="50" cy="50" r="48"
          fill="none"
          stroke={colors.accentHex}
          strokeWidth="0.5"
          strokeDasharray="301.6"
          strokeLinecap="round"
          initial={{ strokeDashoffset: 301.6 }}
          animate={{ strokeDashoffset: 0 }}
          transition={{ duration: 1, ease: "linear" }}
          style={{ opacity: 0.4 }}
        />
      </svg>
    </motion.div>
  );
}

/* ── Premium Music Button ── */
function MusicButton({ src, title }: { src: string; title: string }) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);

  const toggle = () => {
    if (!audioRef.current) return;
    if (!audioRef.current.paused) audioRef.current.pause();
    else audioRef.current.play();
    setPlaying((p) => !p);
  };

  return (
    <div className="fixed bottom-6 right-6 z-40 font-sans">
      <audio ref={audioRef} src={src} loop />
      <motion.button
        onClick={toggle}
        className="w-14 h-14 rounded-full bg-white/[0.08] backdrop-blur-xl text-white flex items-center justify-center shadow-glass-lg border border-white/[0.12] cursor-pointer"
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1.5, type: "spring", stiffness: 200 }}
        whileHover={{ scale: 1.08, backgroundColor: "rgba(255,255,255,0.12)" }}
        whileTap={{ scale: 0.95 }}
        aria-label={playing ? "Pause music" : "Play music"}
      >
        {playing ? (
          <div className="flex gap-[3px] items-center justify-center h-4">
            <motion.div animate={{ height: [8, 16, 8] }} transition={{ duration: 1, repeat: Infinity }} className="w-[3px] bg-white rounded-full" />
            <motion.div animate={{ height: [12, 6, 12] }} transition={{ duration: 0.8, repeat: Infinity }} className="w-[3px] bg-white rounded-full" />
            <motion.div animate={{ height: [6, 14, 6] }} transition={{ duration: 1.2, repeat: Infinity }} className="w-[3px] bg-white rounded-full" />
          </div>
        ) : (
          <svg className="w-5 h-5 ml-0.5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 3v10.55A4 4 0 1 0 14 17V7h4V3h-6z" />
          </svg>
        )}
      </motion.button>
      {title && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2 }}
          className="absolute bottom-full right-0 mb-3 whitespace-nowrap"
        >
          <span className="text-[10px] tracking-wider text-white/30 uppercase bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/[0.06]">
            {title}
          </span>
        </motion.div>
      )}
    </div>
  );
}

/* ── 3D Parallax Section Wrapper ── */
function ParallaxSection({ children, speed = 0.5, className = "" }: { children: React.ReactNode; speed?: number; className?: string }) {
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], [100 * speed, -100 * speed]);
  const rotateX = useTransform(scrollYProgress, [0, 0.5, 1], [2, 0, -2]);
  return (
    <motion.div
      className={className}
      style={{ y, rotateX, transformPerspective: 1200, transformStyle: "preserve-3d" }}
    >
      {children}
    </motion.div>
  );
}

/* ── Drop Cap Paragraph ── */
function DropCapParagraph({ text, delay = 0, accentHex }: { text: string; delay?: number; accentHex: string }) {
  const firstChar = text.charAt(0);
  const rest = text.slice(1);
  return (
    <motion.p
      className="text-lg md:text-xl text-white/80 leading-[2] font-light"
      initial={{ y: 30, opacity: 0 }}
      whileInView={{ y: 0, opacity: 1 }}
      viewport={{ once: true, margin: "-10%" }}
      transition={{ duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      <span
        className="float-left font-serif-premium text-6xl md:text-7xl leading-[0.8] mr-3 mt-1 font-bold"
        style={{ color: accentHex }}
      >
        {firstChar}
      </span>
      {rest}
    </motion.p>
  );
}

/* ── Hero with 3D scroll + rose petals ── */
function HeroSection({ recipient, title, theme }: { recipient: string; title: string; theme: string }) {
  const colors = themeColors[theme] || themeColors.pink;
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 0.3], [0, -80]);
  const opacity = useTransform(scrollYProgress, [0, 0.25], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.3], [1, 0.95]);
  const rotateX = useTransform(scrollYProgress, [0, 0.3], [0, 5]);

  return (
    <motion.section
      className={`min-h-[110vh] flex flex-col items-center justify-center ${colors.bg} ${colors.text} relative overflow-hidden font-sans`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.2 }}
    >
      <RosePetals color={colors.accentHex} />
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70vw] h-[70vw] rounded-full opacity-15 blur-[140px] pointer-events-none"
        style={{ background: `radial-gradient(circle, ${colors.accentHex}, transparent)` }}
      />

      <motion.div
        style={{ y, opacity, scale, rotateX, transformPerspective: 1200 }}
        className="text-center z-10 px-6 max-w-4xl mx-auto"
      >
        <motion.div
          className="h-[1px] w-20 mx-auto mb-10"
          style={{ background: `linear-gradient(90deg, transparent, ${colors.accentHex}, transparent)` }}
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 0.5 }}
          transition={{ delay: 0.3, duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
        />

        <motion.p
          className={`text-[10px] md:text-xs tracking-[0.5em] uppercase mb-8 ${colors.accent} font-semibold`}
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          Sebuah Hadiah Untuk
        </motion.p>

        <motion.h1
          className="font-serif-premium text-5xl md:text-7xl lg:text-[6.5rem] font-light mb-8 tracking-tight leading-[1.05]"
          initial={{ y: 40, opacity: 0, filter: "blur(10px)" }}
          animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
          transition={{ delay: 0.7, duration: 1, ease: [0.22, 1, 0.36, 1] }}
        >
          {recipient}
        </motion.h1>

        <motion.div
          className="flex items-center justify-center gap-4 my-8"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1, duration: 0.8, ease: "easeOut" }}
        >
          <div className="w-10 h-[1px]" style={{ background: `linear-gradient(90deg, transparent, ${colors.accentHex}40)` }} />
          <div className="w-2 h-2 rotate-45 border" style={{ borderColor: `${colors.accentHex}40` }} />
          <div className="w-10 h-[1px]" style={{ background: `linear-gradient(90deg, ${colors.accentHex}40, transparent)` }} />
        </motion.div>

        <motion.p
          className="font-display-premium text-xl md:text-2xl lg:text-3xl font-light text-white/60 max-w-2xl mx-auto leading-relaxed italic"
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          {title}
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.5, duration: 1 }}
          className="absolute bottom-12 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="flex flex-col items-center gap-2"
          >
            <span className="text-[10px] tracking-[0.3em] uppercase text-white/25">Gulir</span>
            <div className="w-[1px] h-8" style={{ background: `linear-gradient(180deg, ${colors.accentHex}30, transparent)` }} />
          </motion.div>
        </motion.div>
      </motion.div>
    </motion.section>
  );
}

/* ── Emotional Letter Section with drop cap ── */
function OpeningSection({ message, theme }: { message: string; theme: string }) {
  const lines = message.split("\n").filter(l => l.trim().length > 0);
  const colors = themeColors[theme] || themeColors.pink;
  return (
    <section className={`min-h-screen flex items-center justify-center ${colors.bg} px-6 py-24 font-sans relative`}>
      <RosePetals color={colors.accentHex} />
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vw] h-[60vw] rounded-full opacity-10 blur-[120px] pointer-events-none"
        style={{ background: `radial-gradient(circle, ${colors.accentHex}, transparent)` }}
      />
      <ParallaxSection speed={0.15} className="max-w-3xl mx-auto w-full relative z-10">
        <div className={`text-center space-y-8 p-8 md:p-16 ${colors.cardBg} border rounded-[24px] backdrop-blur-[32px] shadow-glass-lg`}>
          <div className="flex gap-1.5 mb-8 justify-center opacity-30">
            <div className="w-2 h-2 rounded-full bg-white" />
            <div className="w-2 h-2 rounded-full bg-white" />
            <div className="w-2 h-2 rounded-full bg-white" />
          </div>
          {lines.map((line, i) => (
            i === 0 ? (
              <DropCapParagraph key={i} text={line} accentHex={colors.accentHex} />
            ) : (
              <motion.p
                key={i}
                className="font-display-premium text-lg md:text-xl text-white/85 leading-[1.8] font-light"
                initial={{ y: 30, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true, margin: "-10%" }}
                transition={{ duration: 0.8, delay: i * 0.15, ease: [0.22, 1, 0.36, 1] }}
              >
                {line}
              </motion.p>
            )
          ))}
        </div>
      </ParallaxSection>
    </section>
  );
}

/* ── Emotional Depth Section (new) ── */
function EmotionalDepthSection({ theme }: { theme: string }) {
  const colors = themeColors[theme] || themeColors.pink;
  const paragraphs = [
    "Ada kalanya aku bertanya-tanya, bagaimana mungkin satu orang bisa mengubah seluruh dunia seseorang. Bukan dengan kata-kata besar atau janji yang megah, tapi dengan cara sederhananya — tawa kecil di pagi hari, sentuhan lembut saat aku lelah, dan kehadiran yang tak pernah goyah walau badai datang.",
    "Kau bukan sekadar orang yang aku cintai. Kau adalah rumah yang selalu kutuju, pelabuhan yang menenangkan gelombang di dadaku, dan bintang yang menerangi jalan tergelapku. Setiap hari bersamamu adalah pengingat bahwa kebahagiaan sejati tersembunyi dalam hal-hal kecil.",
    "Aku belajar darimu tentang kesabaran, tentang bagaimana mencintai tanpa syarat, tentang bagaimana menjadi versi terbaik dari diriku sendiri. Kau melihatku — bukan hanya apa yang kulakukan, tapi siapa aku sebenarnya, dengan segala kekurangan dan kelebihanku.",
    "Dan di sini aku berdiri, dengan hati yang penuh syukur, menuliskan kata-kata yang mungkin tidak pernah cukup untuk menggambarkan betapa berharganya kau bagiku. Tapi aku akan terus mencoba, setiap hari, karena kau layak mendapatkan setiap kata baik yang bisa kutuliskan.",
  ];

  return (
    <section className={`min-h-screen ${colors.bg} px-6 py-32 font-sans relative`}>
      <RosePetals color={colors.accentHex} />
      <div
        className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[50vw] h-[50vw] rounded-full opacity-8 blur-[140px] pointer-events-none"
        style={{ background: `radial-gradient(circle, ${colors.accentHex}, transparent)` }}
      />
      <ParallaxSection speed={0.1} className="max-w-2xl mx-auto relative z-10">
        <motion.div
          className="text-center mb-16"
          initial={{ y: 30, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <p className={`text-[10px] tracking-[0.5em] uppercase mb-4 ${colors.accent} font-semibold`}>
            Perasaanku
          </p>
          <h2 className="font-serif-premium text-3xl md:text-4xl font-light text-white tracking-wide">
            Tentang Kita
          </h2>
          <div className="w-16 h-[1px] mx-auto mt-6" style={{ background: `linear-gradient(90deg, transparent, ${colors.accentHex}40, transparent)` }} />
        </motion.div>

        <div className="space-y-12">
          {paragraphs.map((p, i) => (
            <motion.div
              key={i}
              className="relative"
              initial={{ y: 40, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true, margin: "-5%" }}
              transition={{ duration: 0.8, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
            >
              <p className="font-display-premium text-lg md:text-xl text-white/75 leading-[2] font-light">
                {p}
              </p>
              {i < paragraphs.length - 1 && (
                <div className="flex justify-center mt-10">
                  <div className="w-1.5 h-1.5 rotate-45 border border-white/10" />
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </ParallaxSection>
    </section>
  );
}

/* ── Reasons Section (new) ── */
function ReasonsSection({ reasons, theme }: { reasons: string[]; theme: string }) {
  const colors = themeColors[theme] || themeColors.pink;
  return (
    <section className={`min-h-screen ${colors.bg} px-6 py-32 font-sans relative`}>
      <RosePetals color={colors.accentHex} />
      <ParallaxSection speed={0.12} className="max-w-4xl mx-auto relative z-10">
        <motion.div
          className="text-center mb-20"
          initial={{ y: 30, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <p className={`text-[10px] tracking-[0.5em] uppercase mb-4 ${colors.accent} font-semibold`}>
            Alasan
          </p>
          <h2 className="font-serif-premium text-3xl md:text-4xl font-light text-white tracking-wide">
            Mengapa Kau Spesial
          </h2>
          <div className="w-16 h-[1px] mx-auto mt-6" style={{ background: `linear-gradient(90deg, transparent, ${colors.accentHex}40, transparent)` }} />
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {reasons.map((reason, i) => (
            <motion.div
              key={i}
              className={`p-8 ${colors.cardBg} border rounded-[20px] backdrop-blur-[32px] shadow-glass-lg relative overflow-hidden`}
              initial={{ y: 40, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true, margin: "-5%" }}
              transition={{ delay: i * 0.1, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ y: -4, transition: { duration: 0.3 } }}
            >
              <div className="absolute top-0 right-0 w-24 h-24 opacity-5 pointer-events-none" style={{ background: `radial-gradient(circle at top right, ${colors.accentHex}, transparent)` }} />
              <span className="font-serif-premium text-4xl font-bold block mb-4" style={{ color: `${colors.accentHex}30` }}>
                {String(i + 1).padStart(2, "0")}
              </span>
              <p className="font-display-premium text-base md:text-lg text-white/80 leading-relaxed font-light">
                {reason}
              </p>
            </motion.div>
          ))}
        </div>
      </ParallaxSection>
    </section>
  );
}

/* ── Photo Gallery with 3D tilt ── */
function PhotoGrid({ photos, captions, theme }: { photos: string[]; captions: string[]; theme: string }) {
  const colors = themeColors[theme] || themeColors.pink;
  return (
    <section className={`min-h-screen ${colors.bg} px-6 py-24 font-sans relative`}>
      <RosePetals color={colors.accentHex} />
      <div className="max-w-5xl mx-auto relative z-10">
        <motion.div
          className="text-center mb-20"
          initial={{ y: 30, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <p className={`text-[10px] tracking-[0.5em] uppercase mb-4 ${colors.accent} font-semibold`}>Gallery</p>
          <h2 className="font-serif-premium text-3xl md:text-4xl font-light text-white tracking-wide">Momen Bersama</h2>
          <div className="w-16 h-[1px] mx-auto mt-6" style={{ background: `linear-gradient(90deg, transparent, ${colors.accentHex}40, transparent)` }} />
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {photos.map((photo, i) => (
            <motion.div
              key={i}
              className="relative group overflow-hidden rounded-[20px] aspect-[4/5] bg-white/[0.02] border border-white/[0.08] cursor-pointer"
              initial={{ y: 50, opacity: 0, rotateY: i % 2 === 0 ? 5 : -5 }}
              whileInView={{ y: 0, opacity: 1, rotateY: 0 }}
              viewport={{ once: true, margin: "-5%" }}
              transition={{ delay: i * 0.12, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              style={{ transformPerspective: 1000 }}
              whileHover={{ scale: 1.02, rotateY: i % 2 === 0 ? 2 : -2, transition: { duration: 0.4 } }}
            >
              <img
                src={`/${photo}`}
                alt={captions[i] || `Foto ${i + 1}`}
                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-500" />
              <div className="absolute inset-0 rounded-[20px] border border-white/[0.08] group-hover:border-white/[0.2] transition-colors duration-500" />
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
                style={{ background: `radial-gradient(circle at 50% 50%, ${colors.accentHex}15, transparent 70%)` }}
              />
              {captions[i] && (
                <div className="absolute bottom-0 inset-x-0 p-6 pt-16 translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                  <p className="font-display-premium text-white/90 text-base md:text-lg font-light tracking-wide italic">
                    {captions[i]}
                  </p>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── Closing Section ── */
function ClosingSection({ closing, sender, theme }: { closing: string; sender: string; theme: string }) {
  const colors = themeColors[theme] || themeColors.pink;
  return (
    <section className={`min-h-screen ${colors.bg} flex flex-col items-center justify-center px-6 py-24 font-sans relative`}>
      <RosePetals color={colors.accentHex} />
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[50vw] h-[50vw] rounded-full opacity-10 blur-[120px] pointer-events-none"
        style={{ background: `radial-gradient(circle, ${colors.accentHex}, transparent)` }}
      />
      <ParallaxSection speed={0.1} className="text-center max-w-2xl mx-auto relative z-10">
        <motion.div
          className="w-16 h-16 mx-auto mb-12 flex items-center justify-center rounded-full border border-white/[0.1] bg-white/[0.04] backdrop-blur-xl"
          initial={{ scale: 0, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ type: "spring", stiffness: 200, damping: 20, delay: 0.2 }}
        >
          <motion.svg
            className="w-6 h-6"
            fill="currentColor"
            viewBox="0 0 24 24"
            style={{ color: colors.accentHex }}
            animate={{ scale: [1, 1.15, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </motion.svg>
        </motion.div>

        <motion.p
          className="font-display-premium text-xl md:text-2xl text-white/85 leading-[1.8] font-light mb-14 italic"
          initial={{ y: 30, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          &ldquo;{closing}&rdquo;
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.8 }}
        >
          <div className="w-12 h-[1px] mx-auto mb-8" style={{ background: `linear-gradient(90deg, transparent, ${colors.accentHex}40, transparent)` }} />
          <p className={`text-[10px] tracking-[0.4em] uppercase mb-3 ${colors.accent} font-semibold`}>
            Dengan Seluruh Hati
          </p>
          <p className="font-serif-premium text-lg md:text-xl text-white font-light tracking-wide">
            {sender}
          </p>
        </motion.div>
      </ParallaxSection>
    </section>
  );
}

/* ── Main ── */
export default function HomePage() {
  const { config, loading: configLoading } = useConfigLoader<Config>("/config.json");
  const [phase, setPhase] = useState<"loading" | "countdown" | "revealed">("loading");

  useEffect(() => {
    if (!configLoading && config) {
      const timer = setTimeout(() => setPhase("countdown"), 2000);
      return () => clearTimeout(timer);
    }
  }, [configLoading, config]);

  if (configLoading || !config) {
    return <LoadingScreen theme="pink" />;
  }

  if (configLoading === false && !config) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0F0811]">
        <div className="text-center">
          <p className="text-white/60 mb-4 font-display-premium">Gagal memuat konfigurasi</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-white/10 text-white/80 rounded-full hover:bg-white/20 transition-colors border border-white/10 cursor-pointer"
          >
            Coba Lagi
          </button>
        </div>
      </div>
    );
  }

  const theme = config.theme || "pink";
  const colors = themeColors[theme] || themeColors.pink;

  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <title>{config.title} - EverLetter</title>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=Playfair+Display:ital,wght@0,400;0,500;0,600;1,400;1,500&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&display=swap"
          rel="stylesheet"
        />
      </Head>
      <div className="bg-[#0F0811] text-white antialiased selection:bg-white/20 overflow-x-hidden">
        <AnimatePresence mode="wait">
          {phase === "loading" && <LoadingScreen key="loading" theme={theme} />}
          {phase === "countdown" && (
            <CountdownScreen key="countdown" onComplete={() => setPhase("revealed")} theme={theme} />
          )}
        </AnimatePresence>

        {phase === "revealed" && (
          <motion.main
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.2, ease: "easeInOut" }}
          >
            {config.music && <MusicButton src={`/${config.music}`} title={config.musicTitle} />}
            <HeroSection recipient={config.recipient} title={config.title} theme={theme} />
            <OpeningSection message={config.message} theme={theme} />
            <EmotionalDepthSection theme={theme} />
            {config.reasons && config.reasons.length > 0 && (
              <ReasonsSection reasons={config.reasons} theme={theme} />
            )}
            {config.photos?.length > 0 && (
              <PhotoGrid photos={config.photos} captions={config.captions || []} theme={theme} />
            )}
            <ClosingSection closing={config.closing} sender={config.sender} theme={theme} />
          </motion.main>
        )}
      </div>
    </>
  );
}
