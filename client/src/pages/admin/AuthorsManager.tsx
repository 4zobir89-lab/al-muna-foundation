import React from 'react';
import api from '../../services/api';
import type { Author } from '../../types';

export default function AuthorsManager() {
  const [authors, setAuthors] = React.useState<Author[]>([]);
  const [editing, setEditing] = React.useState<Partial<Author> | null>(null);
  const [showForm, setShowForm] = React.useState(false);
  const fetch = () => { api.get('/authors?limit=100').then((r) => setAuthors(r.data.data || r.data || [])).catch(console.error); };
  React.useEffect(() => { fetch(); }, []);

  const handleSave = async () => {
    try {
      if (editing?.id) { await api.put(`/authors/${editing.id}`, editing); } else { await api.post('/authors', editing); }
      setShowForm(false); setEditing(null); fetch();
    } catch (err) { alert('خطأ في الحفظ'); }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('هل أنت متأكد؟')) return;
    await api.delete(`/authors/${id}`); fetch();
  };

  return (
    <div dir="rtl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-amiri font-bold text-dark-900">إدارة الكتّاب</h1>
        <button onClick={() => { setEditing({ name: '', bio: '' }); setShowForm(true); }} className="px-4 py-2 bg-gold-600 text-white rounded-lg hover:bg-gold-700">+ كاتب جديد</button>
      </div>
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={() => setShowForm(false)}>
          <div className="bg-white rounded-2xl p-6 w-full max-w-lg" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-xl font-amiri font-bold mb-4">{editing?.id ? 'تعديل الكاتب' : 'كاتب جديد'}</h2>
            <div className="space-y-4">
              <div><label className="block text-sm font-medium text-dark-700 mb-1">الاسم</label><input type="text" value={editing?.name || ''} onChange={(e) => setEditing({ ...editing, name: e.target.value })} className="w-full px-3 py-2 border border-brown-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-400" /></div>
              <div><label className="block text-sm font-medium text-dark-700 mb-1">السيرة</label><textarea rows={5} value={editing?.bio || ''} onChange={(e) => setEditing({ ...editing, bio: e.target.value })} className="w-full px-3 py-2 border border-brown-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-400" /></div>
              <div><label className="block text-sm font-medium text-dark-700 mb-1">الصورة (رابط)</label><input type="text" value={editing?.image || ''} onChange={(e) => setEditing({ ...editing, image: e.target.value })} className="w-full px-3 py-2 border border-brown-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-400" /></div>
              <div className="flex gap-3 pt-2">
                <button onClick={handleSave} className="px-6 py-2 bg-gold-600 text-white rounded-lg hover:bg-gold-700">حفظ</button>
                <button onClick={() => { setShowForm(false); setEditing(null); }} className="px-6 py-2 bg-dark-100 text-dark-700 rounded-lg hover:bg-dark-200">إلغاء</button>
              </div>
            </div>
          </div>
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {authors.map((a) => (
          <div key={a.id} className="bg-white rounded-xl p-5 border border-brown-100 shadow-sm">
            <div className="flex items-start gap-4">
              {a.image && <img src={a.image} alt={a.name} className="w-14 h-14 rounded-full object-cover" />}
              <div className="flex-1 min-w-0"><h3 className="font-amiri font-bold text-dark-900 text-lg">{a.name}</h3><p className="text-sm text-dark-400 truncate">{a.bio || 'لا توجد سيرة'}</p></div>
            </div>
            <div className="flex gap-3 mt-4 pt-3 border-t border-brown-50">
              <button onClick={() => { setEditing(a); setShowForm(true); }} className="text-blue-600 hover:text-blue-800 text-sm">تعديل</button>
              <button onClick={() => handleDelete(a.id)} className="text-red-600 hover:text-red-800 text-sm">حذف</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
