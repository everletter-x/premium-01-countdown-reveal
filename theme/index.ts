export const THEME_IDS = [
  'pink', 'rose', 'lavender', 'warm-white',
  'ultra-cinematic', 'ultra-signature',
] as const;
export type ThemeId = (typeof THEME_IDS)[number];

export interface ThemeTokens {
  bg: string;
  cardBg: string;
  accent: string;
  text: string;
  glow: string;
  divider: string;
}

const themeMap: Record<ThemeId, ThemeTokens> = {
  pink: {
    bg: 'bg-gradient-to-br from-[#0F0811] via-[#1A0B1A] to-[#250E20]',
    cardBg: 'bg-white/[0.06] border-white/[0.12]',
    accent: 'text-[#F6B3D0]',
    text: 'text-[#F9F5F6]',
    glow: 'shadow-pink-500/20',
    divider: 'bg-white/20',
  },
  rose: {
    bg: 'bg-gradient-to-br from-[#1A080A] via-[#2D1216] to-[#1A080A]',
    cardBg: 'bg-white/[0.06] border-white/[0.12]',
    accent: 'text-[#FDA4AF]',
    text: 'text-[#FFE4E6]',
    glow: 'shadow-rose-500/20',
    divider: 'bg-white/20',
  },
  lavender: {
    bg: 'bg-gradient-to-br from-[#080711] via-[#0D0A1C] to-[#150F2A]',
    cardBg: 'bg-white/[0.06] border-white/[0.12]',
    accent: 'text-[#C5B3E6]',
    text: 'text-[#F5F3F7]',
    glow: 'shadow-purple-500/20',
    divider: 'bg-white/20',
  },
  'warm-white': {
    bg: 'bg-gradient-to-br from-[#12110F] via-[#1E1915] to-[#2B2118]',
    cardBg: 'bg-white/[0.06] border-white/[0.12]',
    accent: 'text-[#E6C29E]',
    text: 'text-[#FBFBF9]',
    glow: 'shadow-stone-500/20',
    divider: 'bg-white/20',
  },
  'ultra-cinematic': {
    bg: 'bg-gradient-to-br from-[#000000] via-[#050505] to-[#0A0A0A]',
    cardBg: 'bg-white/[0.04] border-yellow-600/20',
    accent: 'text-[#D4AF37]',
    text: 'text-[#F8F6F3]',
    glow: 'shadow-yellow-600/20',
    divider: 'bg-yellow-600/30',
  },
  'ultra-signature': {
    bg: 'bg-gradient-to-br from-[#05050A] via-[#0A0A14] to-[#0F0F19]',
    cardBg: 'bg-white/[0.04] border-white/[0.08]',
    accent: 'text-[#C8C8D2]',
    text: 'text-[#F0F0F5]',
    glow: 'shadow-slate-400/10',
    divider: 'bg-white/10',
  },
};

export function getThemeClasses(theme: string): ThemeTokens {
  return themeMap[theme as ThemeId] || themeMap.pink;
}

export function setThemeAttribute(theme: string) {
  if (typeof document !== 'undefined') {
    document.documentElement.setAttribute('data-theme', theme);
  }
}

export function isValidTheme(theme: string): theme is ThemeId {
  return THEME_IDS.includes(theme as ThemeId);
}
