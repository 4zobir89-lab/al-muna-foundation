import React from 'react';

interface HeroSectionProps {
  title: string;
  subtitle?: string;
  height?: string;
  backgroundImage?: string;
}

export default function HeroSection({ title, subtitle, height = 'h-[60vh]', backgroundImage }: HeroSectionProps) {
  return (
    <section className={`relative ${height} min-h-[400px] flex items-center justify-center overflow-hidden`} dir="rtl">
      <div className="absolute inset-0 bg-gradient-to-b from-surface-DEFAULT/90 via-surface-DEFAULT/70 to-surface-DEFAULT/90 z-10" />
      {backgroundImage && (
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${backgroundImage})` }} />
      )}
      <div className="relative z-20 text-center px-4 animate-fade-in max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-6xl lg:text-7xl xl:text-8xl font-amiri text-neutral-50 leading-tight mb-6 drop-shadow-lg">{title}</h1>
        {subtitle && (
          <p className="text-lg md:text-xl lg:text-2xl text-accent-500/90 max-w-2xl mx-auto leading-relaxed">{subtitle}</p>
        )}
      </div>
    </section>
  );
}
