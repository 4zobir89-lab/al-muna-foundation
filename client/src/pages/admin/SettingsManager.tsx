import React from 'react';
import api from '../../services/api';

export default function SettingsManager() {
  const [settings, setSettings] = React.useState<Record<string, string>>({});
  const [saving, setSaving] = React.useState(false);

  React.useEffect(() => { api.get('/settings').then((r) => setSettings(r.data || {})).catch(console.error); }, []);

  const handleSave = async () => {
    setSaving(true);
    try { await api.put('/settings', settings); alert('تم الحفظ'); } catch (err) { alert('خطأ في الحفظ'); } finally { setSaving(false); }
  };

  const handleChange = (key: string, value: string) => setSettings((prev) => ({ ...prev, [key]: value }));

  const fields = [
    { key: 'site_name', label: 'اسم الموقع', type: 'text' },
    { key: 'site_description', label: 'وصف الموقع', type: 'textarea' },
    { key: 'about_text', label: 'نص صفحة عن المؤسسة', type: 'textarea' },
    { key: 'vision_text', label: 'الرؤية', type: 'textarea' },
    { key: 'mission_text', label: 'الرسالة', type: 'textarea' },
    { key: 'email', label: 'البريد الإلكتروني', type: 'text' },
    { key: 'phone', label: 'الهاتف', type: 'text' },
    { key: 'address', label: 'العنوان', type: 'text' },
  ];

  return (
    <div dir="rtl">
      <h1 className="text-2xl font-amiri font-bold text-dark-900 mb-6">الإعدادات</h1>
      <div className="bg-white rounded-xl shadow-sm border border-brown-100 p-6 max-w-2xl">
        <div className="space-y-5">
          {fields.map((f) => (
            <div key={f.key}>
              <label className="block text-sm font-medium text-dark-700 mb-1">{f.label}</label>
              {f.type === 'textarea' ? (
                <textarea rows={4} value={settings[f.key] || ''} onChange={(e) => handleChange(f.key, e.target.value)} className="w-full px-3 py-2 border border-brown-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-400" />
              ) : (
                <input type="text" value={settings[f.key] || ''} onChange={(e) => handleChange(f.key, e.target.value)} className="w-full px-3 py-2 border border-brown-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-400" />
              )}
            </div>
          ))}
          <button onClick={handleSave} disabled={saving} className="px-6 py-2 bg-gold-600 text-white rounded-lg hover:bg-gold-700 disabled:opacity-50">{saving ? 'جارٍ الحفظ...' : 'حفظ الإعدادات'}</button>
        </div>
      </div>
    </div>
  );
}
