import React from 'react';

interface HeroSectionProps {
  title: string;
  subtitle?: string;
  height?: string;
  backgroundImage?: string;
}

export default function HeroSection({ title, subtitle, height = 'h-[60vh]', backgroundImage }: HeroSectionProps) {
  return (
    <section className={`relative ${height} flex items-center justify-center overflow-hidden`} dir="rtl">
      <div className="absolute inset-0 bg-gradient-to-b from-dark-900/80 via-dark-900/60 to-dark-900/80 z-10" />
      {backgroundImage && (
        <div className="absolute inset-0 bg-cover bg-center bg-fixed" style={{ backgroundImage: `url(${backgroundImage})` }} />
      )}
      <div className="relative z-20 text-center px-4 animate-fade-in">
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-amiri text-cream-100 text-shadow mb-4">{title}</h1>
        {subtitle && <p className="text-lg md:text-xl text-gold-300/90 max-w-2xl mx-auto">{subtitle}</p>}
      </div>
    </section>
  );
}
