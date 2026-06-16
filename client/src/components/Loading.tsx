import React from 'react';

export default function Loading({ text = 'جارٍ التحميل...' }: { text?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-20" dir="rtl">
      <div className="w-10 h-10 border-2 border-neutral-800 border-t-accent-500 rounded-full animate-spin mb-4" />
      <p className="text-neutral-400 text-sm">{text}</p>
    </div>
  );
}
