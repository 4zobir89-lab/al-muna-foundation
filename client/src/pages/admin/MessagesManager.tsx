import React from 'react';
import api from '../../services/api';

export default function MessagesManager() {
  const [messages, setMessages] = React.useState<any[]>([]);
  const [selected, setSelected] = React.useState<any>(null);

  React.useEffect(() => { api.get('/contact').then((r) => setMessages(r.data || [])).catch(console.error); }, []);

  const handleDelete = async (id: number) => {
    if (!confirm('هل أنت متأكد؟')) return;
    await api.delete(`/contact/${id}`);
    setMessages((prev) => prev.filter((m) => m.id !== id));
    if (selected?.id === id) setSelected(null);
  };

  return (
    <div dir="rtl">
      <h1 className="text-2xl font-amiri font-bold text-dark-900 mb-6">الرسائل</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-brown-100 overflow-hidden">
          {messages.length === 0 ? <div className="p-8 text-center text-dark-400">لا توجد رسائل</div> : (
            <div className="divide-y divide-brown-50">{messages.map((m) => (<div key={m.id} className={`p-4 cursor-pointer hover:bg-cream-50 ${selected?.id === m.id ? 'bg-cream-100' : ''}`} onClick={() => setSelected(m)}><h3 className="font-medium text-dark-900">{m.name}</h3><p className="text-xs text-dark-400">{m.email}{m.subject ? ` · ${m.subject}` : ''}</p><p className="text-sm text-dark-500 mt-1 line-clamp-2">{m.message}</p><p className="text-xs text-dark-300 mt-1">{new Date(m.created_at).toLocaleDateString('ar-SA')}</p></div>))}</div>
          )}
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-brown-100 p-6">
          {selected ? (<><h2 className="text-xl font-amiri font-bold text-dark-900 mb-2">{selected.name}</h2><p className="text-sm text-dark-400 mb-4">{selected.email} · {new Date(selected.created_at).toLocaleString('ar-SA')}</p><p className="font-medium text-dark-700 mb-2">الموضوع: {selected.subject || 'بدون موضوع'}</p><div className="prose prose-sm max-w-none text-dark-700 whitespace-pre-line bg-cream-50 p-4 rounded-lg">{selected.message}</div><button onClick={() => handleDelete(selected.id)} className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm">حذف الرسالة</button></>) : (<div className="text-center py-16 text-dark-400"><p>اختر رسالة لعرضها</p></div>)}
        </div>
      </div>
    </div>
  );
}
