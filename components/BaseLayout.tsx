import React, { useEffect } from 'react';
import { getThemeClasses, setThemeAttribute } from '../theme';

interface BaseLayoutProps {
  children: React.ReactNode;
  className?: string;
  theme?: string;
  ultra?: boolean;
}

export function BaseLayout({ children, className = '', theme = 'pink', ultra = false }: BaseLayoutProps) {
  const tokens = getThemeClasses(theme);

  useEffect(() => {
    setThemeAttribute(theme);
  }, [theme]);

  return (
    <div
      className={`min-h-screen ${tokens.bg} ${tokens.text} antialiased selection:bg-white/20 overflow-x-hidden ${className}`}
    >
      {ultra && <div className="film-grain" />}
      {children}
    </div>
  );
}

export default BaseLayout;
