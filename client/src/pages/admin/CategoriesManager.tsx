import React from 'react';
import api from '../../services/api';
import type { Category } from '../../types';

export default function CategoriesManager() {
  const [categories, setCategories] = React.useState<Category[]>([]);
  const [editing, setEditing] = React.useState<Partial<Category> | null>(null);
  const [showForm, setShowForm] = React.useState(false);

  const fetch = () => { api.get('/categories').then((r) => setCategories(r.data || [])).catch(console.error); };
  React.useEffect(() => { fetch(); }, []);

  const handleSave = async () => {
    try {
      if (editing?.id) { await api.put(`/categories/${editing.id}`, editing); } else { await api.post('/categories', editing); }
      setShowForm(false); setEditing(null); fetch();
    } catch (err) { alert('خطأ في الحفظ'); }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('هل أنت متأكد؟')) return;
    await api.delete(`/categories/${id}`); fetch();
  };

  return (
    <div dir="rtl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-amiri font-bold text-dark-900">إدارة التصنيفات</h1>
        <button onClick={() => { setEditing({ name: '' }); setShowForm(true); }} className="px-4 py-2 bg-gold-600 text-white rounded-lg hover:bg-gold-700">+ تصنيف جديد</button>
      </div>
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={() => setShowForm(false)}>
          <div className="bg-white rounded-2xl p-6 w-full max-w-md" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-xl font-amiri font-bold mb-4">{editing?.id ? 'تعديل التصنيف' : 'تصنيف جديد'}</h2>
            <div className="space-y-4">
              <div><label className="block text-sm font-medium text-dark-700 mb-1">الاسم</label><input type="text" value={editing?.name || ''} onChange={(e) => setEditing({ ...editing, name: e.target.value })} className="w-full px-3 py-2 border border-brown-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-400" /></div>
              <div><label className="block text-sm font-medium text-dark-700 mb-1">الوصف</label><input type="text" value={editing?.description || ''} onChange={(e) => setEditing({ ...editing, description: e.target.value })} className="w-full px-3 py-2 border border-brown-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-400" /></div>
              <div className="flex gap-3 pt-2">
                <button onClick={handleSave} className="px-6 py-2 bg-gold-600 text-white rounded-lg hover:bg-gold-700">حفظ</button>
                <button onClick={() => { setShowForm(false); setEditing(null); }} className="px-6 py-2 bg-dark-100 text-dark-700 rounded-lg hover:bg-dark-200">إلغاء</button>
              </div>
            </div>
          </div>
        </div>
      )}
      <div className="bg-white rounded-xl shadow-sm border border-brown-100 overflow-hidden">
        <table className="w-full text-right">
          <thead className="bg-dark-50"><tr><th className="px-4 py-3 text-sm font-medium text-dark-500">الاسم</th><th className="px-4 py-3 text-sm font-medium text-dark-500">الوصف</th><th className="px-4 py-3 text-sm font-medium text-dark-500">slug</th><th className="px-4 py-3 text-sm font-medium text-dark-500">إجراءات</th></tr></thead>
          <tbody>{categories.map((c) => (<tr key={c.id} className="border-t border-brown-50 hover:bg-cream-50"><td className="px-4 py-3 text-dark-800">{c.name}</td><td className="px-4 py-3 text-sm text-dark-500">{c.description || '-'}</td><td className="px-4 py-3 text-sm text-dark-400">{c.slug}</td><td className="px-4 py-3"><div className="flex gap-2"><button onClick={() => { setEditing(c); setShowForm(true); }} className="text-blue-600 hover:text-blue-800 text-sm">تعديل</button><button onClick={() => handleDelete(c.id)} className="text-red-600 hover:text-red-800 text-sm">حذف</button></div></td></tr>))}</tbody>
        </table>
      </div>
    </div>
  );
}
