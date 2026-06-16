import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = React.useState({ email: '', password: '' });
  const [error, setError] = React.useState('');

  React.useEffect(() => { if (isAuthenticated) navigate('/admin/dashboard'); }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try { await login(form.email, form.password); navigate('/admin/dashboard'); }
    catch (err: any) { setError(err.response?.data?.error || 'فشل تسجيل الدخول'); }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cream-50 via-brown-50 to-cream-100 flex items-center justify-center p-4" dir="rtl">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md border border-brown-100">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-amiri font-bold text-dark-900">لوحة التحكم</h1>
          <p className="text-dark-400 mt-2">مؤسسة المنى الإبداعية</p>
        </div>
        {error && <div className="p-4 bg-red-50 text-red-700 rounded-lg border border-red-200 text-sm mb-4">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-dark-700 font-medium mb-2">البريد الإلكتروني</label>
            <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full px-4 py-3 border border-brown-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-400" />
          </div>
          <div>
            <label className="block text-dark-700 font-medium mb-2">كلمة المرور</label>
            <input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className="w-full px-4 py-3 border border-brown-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-400" />
          </div>
          <button type="submit" className="w-full py-3 bg-gold-600 text-white rounded-lg hover:bg-gold-700 transition-colors font-medium">تسجيل الدخول</button>
        </form>
      </div>
    </div>
  );
}
