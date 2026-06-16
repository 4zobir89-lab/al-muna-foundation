import React from 'react';
import api from '../../services/api';
import type { Event } from '../../types';

export default function EventsManager() {
  const [events, setEvents] = React.useState<Event[]>([]);
  const [editing, setEditing] = React.useState<Partial<Event> | null>(null);
  const [showForm, setShowForm] = React.useState(false);
  const fetch = () => { api.get('/events?limit=100').then((r) => setEvents(r.data.data || r.data || [])).catch(console.error); };
  React.useEffect(() => { fetch(); }, []);

  const handleSave = async () => {
    try {
      if (editing?.id) { await api.put(`/events/${editing.id}`, editing); } else { await api.post('/events', editing); }
      setShowForm(false); setEditing(null); fetch();
    } catch (err) { alert('خطأ في الحفظ'); }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('هل أنت متأكد؟')) return;
    await api.delete(`/events/${id}`); fetch();
  };

  return (
    <div dir="rtl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-amiri font-bold text-dark-900">إدارة الفعاليات</h1>
        <button onClick={() => { setEditing({ title: '', description: '', start_date: '', end_date: '' }); setShowForm(true); }} className="px-4 py-2 bg-gold-600 text-white rounded-lg hover:bg-gold-700">+ فعالية جديدة</button>
      </div>
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={() => setShowForm(false)}>
          <div className="bg-white rounded-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-xl font-amiri font-bold mb-4">{editing?.id ? 'تعديل الفعالية' : 'فعالية جديدة'}</h2>
            <div className="space-y-4">
              <div><label className="block text-sm font-medium text-dark-700 mb-1">العنوان</label><input type="text" value={editing?.title || ''} onChange={(e) => setEditing({ ...editing, title: e.target.value })} className="w-full px-3 py-2 border border-brown-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-400" /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-sm font-medium text-dark-700 mb-1">تاريخ البداية</label><input type="datetime-local" value={editing?.start_date ? editing.start_date.slice(0, 16) : ''} onChange={(e) => setEditing({ ...editing, start_date: e.target.value })} className="w-full px-3 py-2 border border-brown-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-400" /></div>
                <div><label className="block text-sm font-medium text-dark-700 mb-1">تاريخ النهاية</label><input type="datetime-local" value={editing?.end_date ? editing.end_date.slice(0, 16) : ''} onChange={(e) => setEditing({ ...editing, end_date: e.target.value })} className="w-full px-3 py-2 border border-brown-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-400" /></div>
              </div>
              <div><label className="block text-sm font-medium text-dark-700 mb-1">المكان</label><input type="text" value={editing?.location || ''} onChange={(e) => setEditing({ ...editing, location: e.target.value })} className="w-full px-3 py-2 border border-brown-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-400" /></div>
              <div><label className="block text-sm font-medium text-dark-700 mb-1">الصورة (رابط)</label><input type="text" value={editing?.image || ''} onChange={(e) => setEditing({ ...editing, image: e.target.value })} className="w-full px-3 py-2 border border-brown-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-400" /></div>
              <div><label className="block text-sm font-medium text-dark-700 mb-1">الوصف</label><textarea rows={5} value={editing?.description || ''} onChange={(e) => setEditing({ ...editing, description: e.target.value })} className="w-full px-3 py-2 border border-brown-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-400" /></div>
              <div className="flex gap-3 pt-2">
                <button onClick={handleSave} className="px-6 py-2 bg-gold-600 text-white rounded-lg hover:bg-gold-700">حفظ</button>
                <button onClick={() => { setShowForm(false); setEditing(null); }} className="px-6 py-2 bg-dark-100 text-dark-700 rounded-lg hover:bg-dark-200">إلغاء</button>
              </div>
            </div>
          </div>
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {events.map((ev) => (
          <div key={ev.id} className="bg-white rounded-xl border border-brown-100 shadow-sm overflow-hidden">
            {ev.image && <img src={ev.image} alt={ev.title} className="w-full h-40 object-cover" />}
            <div className="p-4">
              <h3 className="font-amiri font-bold text-dark-900">{ev.title}</h3>
              <p className="text-xs text-dark-400 mt-1">{new Date(ev.start_date).toLocaleDateString('ar-SA')}{ev.end_date ? ` - ${new Date(ev.end_date).toLocaleDateString('ar-SA')}` : ''}</p>
              <p className="text-sm text-dark-500 mt-2 line-clamp-2">{ev.description}</p>
              <div className="flex gap-3 mt-3 pt-3 border-t border-brown-50">
                <button onClick={() => { setEditing(ev); setShowForm(true); }} className="text-blue-600 hover:text-blue-800 text-sm">تعديل</button>
                <button onClick={() => handleDelete(ev.id)} className="text-red-600 hover:text-red-800 text-sm">حذف</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
