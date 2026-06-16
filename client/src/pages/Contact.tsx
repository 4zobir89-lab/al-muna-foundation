import React from 'react';
import api from '../services/api';

export default function Contact() {
  const [form, setForm] = React.useState({ name: '', email: '', subject: '', message: '' });
  const [sending, setSending] = React.useState(false);
  const [done, setDone] = React.useState(false);
  const [error, setError] = React.useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) { setError('يرجى ملء الحقول المطلوبة'); return; }
    setSending(true); setError('');
    try {
      await api.post('/contact', form);
      setDone(true);
      setForm({ name: '', email: '', subject: '', message: '' });
    } catch (err: any) {
      setError(err.response?.data?.error || 'حدث خطأ، حاول مرة أخرى');
    } finally { setSending(false); }
  };

  return (
    <>
      <section className="py-20 bg-surface" dir="rtl">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-amiri font-bold text-neutral-50 mb-8 text-center">اتصل بنا</h1>
          <div className="bg-surface-card rounded-xl border border-neutral-800 p-8 md:p-12">
            {done ? (
              <div className="text-center py-8">
                <div className="text-5xl mb-4">✅</div>
                <h3 className="text-2xl font-amiri font-bold text-neutral-50 mb-2">تم إرسال رسالتك</h3>
                <p className="text-neutral-400">سنرد عليك في أقرب وقت ممكن</p>
                <button onClick={() => setDone(false)} className="mt-6 px-6 py-3 bg-accent-600 text-white rounded-lg hover:bg-accent-700 transition-all font-medium">إرسال رسالة أخرى</button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                {error && <div className="p-4 bg-red-500/10 text-red-400 rounded-lg border border-red-500/20 text-sm">{error}</div>}
                <div><label className="block text-neutral-200 font-medium mb-2">الاسم *</label><input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full bg-surface-card border-neutral-800 rounded-lg px-4 py-3 text-neutral-50 focus:border-accent-500 focus:ring-1 focus:ring-accent-500/30 outline-none" /></div>
                <div><label className="block text-neutral-200 font-medium mb-2">البريد الإلكتروني *</label><input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full bg-surface-card border-neutral-800 rounded-lg px-4 py-3 text-neutral-50 focus:border-accent-500 focus:ring-1 focus:ring-accent-500/30 outline-none" /></div>
                <div><label className="block text-neutral-200 font-medium mb-2">الموضوع</label><input type="text" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} className="w-full bg-surface-card border-neutral-800 rounded-lg px-4 py-3 text-neutral-50 focus:border-accent-500 focus:ring-1 focus:ring-accent-500/30 outline-none" /></div>
                <div><label className="block text-neutral-200 font-medium mb-2">الرسالة *</label><textarea rows={6} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} className="w-full bg-surface-card border-neutral-800 rounded-lg px-4 py-3 text-neutral-50 focus:border-accent-500 focus:ring-1 focus:ring-accent-500/30 outline-none" /></div>
                <button type="submit" disabled={sending} className="w-full py-3 bg-accent-600 text-white rounded-lg hover:bg-accent-700 transition-all font-medium disabled:opacity-50">{sending ? 'جارٍ الإرسال...' : 'إرسال'}</button>
              </form>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
