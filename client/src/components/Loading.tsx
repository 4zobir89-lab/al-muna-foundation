import React from 'react';

export default function Loading({ text = 'جارٍ التحميل...' }: { text?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-20" dir="rtl">
      <div className="w-12 h-12 border-4 border-brown-200 border-t-gold-600 rounded-full animate-spin mb-4" />
      <p className="text-dark-400 text-sm">{text}</p>
    </div>
  );
}
