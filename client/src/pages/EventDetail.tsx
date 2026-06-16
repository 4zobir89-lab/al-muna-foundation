import React from 'react';
import Loading from '../components/Loading';
import api from '../services/api';
import type { Event as EventType } from '../types';
import { useParams } from 'react-router-dom';
import { useReveal } from '../hooks/useReveal';

export default function EventDetail() {
  const revealRef = useReveal<HTMLDivElement>();
  const { slug } = useParams<{ slug: string }>();
  const [event, setEvent] = React.useState<EventType | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    api.get(`/events/${slug}`).then((res) => setEvent(res.data)).catch(console.error).finally(() => setLoading(false));
  }, [slug]);

  if (loading) return <Loading />;
  if (!event) return <div className="text-center py-20 text-neutral-400" dir="rtl">الفعالية غير موجودة</div>;

  return (
    <>
      <article ref={revealRef} className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 bg-surface reveal" dir="rtl">
        {event.image && <img src={event.image} alt={event.title} className="w-full h-64 md:h-80 object-cover rounded-2xl mb-8" />}
        <h1 className="text-3xl md:text-5xl font-amiri font-bold text-neutral-50 mb-4">{event.title}</h1>
        <div className="flex flex-wrap gap-4 text-sm text-neutral-400 mb-6">
          <span>📅 {new Date(event.start_date).toLocaleDateString('ar-SA')}{event.end_date ? ` - ${new Date(event.end_date).toLocaleDateString('ar-SA')}` : ''}</span>
          {event.location && <span>📍 {event.location}</span>}
        </div>
        {event.description && <div className="prose prose-lg max-w-none font-tajawal leading-relaxed text-neutral-200 prose-headings:text-neutral-50 whitespace-pre-line">{event.description}</div>}
      </article>
    </>
  );
}
