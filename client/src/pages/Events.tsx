import React from 'react';
import HeroSection from '../components/HeroSection';
import api from '../services/api';
import type { Event as EventType } from '../types';
import { Link } from 'react-router-dom';

export default function Events() {
  const [events, setEvents] = React.useState<EventType[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    api.get('/events?limit=20').then((res) => setEvents(res.data.data || res.data || [])).catch(console.error).finally(() => setLoading(false));
  }, []);

  return (
    <>
      <HeroSection title="الفعاليات" subtitle="تابع فعالياتنا وأنشطتنا القادمة" height="h-[40vh]" />
      <section className="py-12 bg-cream-50" dir="rtl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? <div className="text-center py-16 text-dark-400">جارٍ التحميل...</div> : events.length === 0 ? (
            <div className="text-center py-16"><p className="text-dark-400 text-lg">لا توجد فعاليات حالياً</p></div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {events.map((ev) => (
                <Link key={ev.id} to={`/events/${ev.slug}`} className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all border border-brown-100">
                  {ev.image && <img src={ev.image} alt={ev.title} className="w-full h-48 object-cover" />}
                  <div className="p-5">
                    <h3 className="text-xl font-amiri font-bold text-dark-800 group-hover:text-gold-700 transition-colors mb-3">{ev.title}</h3>
                    <div className="flex flex-col gap-2 text-sm text-dark-400 mb-3">
                      <span>📅 {new Date(ev.start_date).toLocaleDateString('ar-SA')}{ev.end_date ? ` - ${new Date(ev.end_date).toLocaleDateString('ar-SA')}` : ''}</span>
                      {ev.location && <span>📍 {ev.location}</span>}
                    </div>
                    {ev.description && <p className="text-sm text-dark-500 line-clamp-2">{ev.description}</p>}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
