import React from 'react';
import api from '../../services/api';

export default function MediaManager() {
  const [files, setFiles] = React.useState<{ id: number; filename: string; url: string; uploaded_at: string }[]>([]);
  const [uploading, setUploading] = React.useState(false);

  React.useEffect(() => { api.get('/media').then((r) => setFiles(r.data || [])).catch(console.error); }, []);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await api.post('/media/upload', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      setFiles((prev) => [...prev, res.data]);
    } catch (err) { alert('خطأ في الرفع'); } finally { setUploading(false); }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('هل أنت متأكد؟')) return;
    await api.delete(`/media/${id}`);
    setFiles((prev) => prev.filter((f) => f.id !== id));
  };

  const copyUrl = (url: string) => navigator.clipboard.writeText(url);

  return (
    <div dir="rtl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-amiri font-bold text-dark-900">مدير الوسائط</h1>
        <label className="px-4 py-2 bg-gold-600 text-white rounded-lg hover:bg-gold-700 cursor-pointer">
          {uploading ? 'جارٍ الرفع...' : 'رفع ملف'}
          <input type="file" className="hidden" onChange={handleUpload} disabled={uploading} />
        </label>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {files.map((f) => (
          <div key={f.id} className="bg-white rounded-xl border border-brown-100 shadow-sm overflow-hidden group">
            <div className="aspect-square bg-cream-50 flex items-center justify-center overflow-hidden">
              {f.url.match(/\.(jpg|jpeg|png|gif|webp|svg)$/i) ? (
                <img src={f.url} alt={f.filename} className="w-full h-full object-cover" />
              ) : (
                <span className="text-3xl">📄</span>
              )}
            </div>
            <div className="p-2">
              <p className="text-xs text-dark-500 truncate">{f.filename}</p>
              <div className="flex gap-2 mt-1">
                <button onClick={() => copyUrl(f.url)} className="text-blue-600 text-xs hover:text-blue-800">نسخ الرابط</button>
                <button onClick={() => handleDelete(f.id)} className="text-red-600 text-xs hover:text-red-800">حذف</button>
              </div>
            </div>
          </div>
        ))}
      </div>
      {files.length === 0 && <div className="text-center py-16 text-dark-400">لا توجد ملفات. ارفع ملفاً لبدء المكتبة.</div>}
    </div>
  );
}
