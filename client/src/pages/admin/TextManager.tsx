import React from 'react';
import api from '../../services/api';
import type { Text, Author, Category } from '../../types';

export default function TextManager() {
  const [texts, setTexts] = React.useState<Text[]>([]);
  const [authors, setAuthors] = React.useState<Author[]>([]);
  const [categories, setCategories] = React.useState<Category[]>([]);
  const [editing, setEditing] = React.useState<Partial<Text> | null>(null);
  const [showForm, setShowForm] = React.useState(false);

  const fetch = () => { api.get('/texts?limit=100').then((r) => setTexts(r.data.data || r.data || [])).catch(console.error); };
  React.useEffect(() => { fetch(); api.get('/authors?limit=100').then((r) => setAuthors(r.data.data || r.data || [])).catch(console.error); api.get('/categories').then((r) => setCategories(r.data || [])).catch(console.error); }, []);

  const handleSave = async () => {
    try {
      if (editing?.id) { await api.put(`/texts/${editing.id}`, editing); } else { await api.post('/texts', editing); }
      setShowForm(false); setEditing(null); fetch();
    } catch (err) { alert('خطأ في الحفظ'); }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('هل أنت متأكد؟')) return;
    await api.delete(`/texts/${id}`); fetch();
  };

  const openEdit = (text: Text) => { setEditing(text); setShowForm(true); };
  const openNew = () => { setEditing({ title: '', content: '', type: 'poem', author_id: undefined, category_id: undefined, published: true }); setShowForm(true); };

  return (
    <div dir="rtl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-amiri font-bold text-dark-900">إدارة النصوص</h1>
        <button onClick={openNew} className="px-4 py-2 bg-gold-600 text-white rounded-lg hover:bg-gold-700 transition-colors">+ نص جديد</button>
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={() => setShowForm(false)}>
          <div className="bg-white rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-xl font-amiri font-bold mb-4">{editing?.id ? 'تعديل النص' : 'نص جديد'}</h2>
            <div className="space-y-4">
              <div><label className="block text-sm font-medium text-dark-700 mb-1">العنوان</label><input type="text" value={editing?.title || ''} onChange={(e) => setEditing({ ...editing, title: e.target.value })} className="w-full px-3 py-2 border border-brown-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-400" /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-sm font-medium text-dark-700 mb-1">النوع</label><select value={editing?.type || 'poem'} onChange={(e) => setEditing({ ...editing, type: e.target.value })} className="w-full px-3 py-2 border border-brown-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-400"><option value="poem">شعر</option><option value="story">قصة</option><option value="novel">رواية</option><option value="article">مقال</option><option value="prose">نثر</option></select></div>
                <div><label className="block text-sm font-medium text-dark-700 mb-1">الكاتب</label><select value={editing?.author_id || ''} onChange={(e) => setEditing({ ...editing, author_id: Number(e.target.value) || undefined })} className="w-full px-3 py-2 border border-brown-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-400"><option value="">اختر...</option>{authors.map((a) => <option key={a.id} value={a.id}>{a.name}</option>)}</select></div>
              </div>
              <div><label className="block text-sm font-medium text-dark-700 mb-1">التصنيف</label><select value={editing?.category_id || ''} onChange={(e) => setEditing({ ...editing, category_id: Number(e.target.value) || undefined })} className="w-full px-3 py-2 border border-brown-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-400"><option value="">بدون تصنيف</option>{categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}</select></div>
              <div><label className="block text-sm font-medium text-dark-700 mb-1">المحتوى</label><textarea rows={10} value={editing?.content || ''} onChange={(e) => setEditing({ ...editing, content: e.target.value })} className="w-full px-3 py-2 border border-brown-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-400 font-noto" /></div>
              <div className="flex items-center gap-2"><input type="checkbox" checked={editing?.published ?? true} onChange={(e) => setEditing({ ...editing, published: e.target.checked })} /><label className="text-sm text-dark-700">منشور</label></div>
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
          <thead className="bg-dark-50"><tr>{['العنوان', 'النوع', 'الكاتب', 'التصنيف', 'حالة', 'تاريخ', 'إجراءات'].map((h) => <th key={h} className="px-4 py-3 text-sm font-medium text-dark-500">{h}</th>)}</tr></thead>
          <tbody>{texts.map((t) => (<tr key={t.id} className="border-t border-brown-50 hover:bg-cream-50"><td className="px-4 py-3 text-dark-800 font-medium">{t.title}</td><td className="px-4 py-3 text-sm text-dark-500">{t.type_label || t.type}</td><td className="px-4 py-3 text-sm text-dark-500">{t.author_name || '-'}</td><td className="px-4 py-3 text-sm text-dark-500">{t.category_name || '-'}</td><td className="px-4 py-3"><span className={`px-2 py-1 rounded-full text-xs ${t.published ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>{t.published ? 'منشور' : 'مسودة'}</span></td><td className="px-4 py-3 text-sm text-dark-400">{t.created_at ? new Date(t.created_at).toLocaleDateString('ar-SA') : '-'}</td><td className="px-4 py-3"><div className="flex gap-2"><button onClick={() => openEdit(t)} className="text-blue-600 hover:text-blue-800 text-sm">تعديل</button><button onClick={() => handleDelete(t.id)} className="text-red-600 hover:text-red-800 text-sm">حذف</button></div></td></tr>))}</tbody>
        </table>
      </div>
    </div>
  );
}
