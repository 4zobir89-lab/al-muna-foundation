import React from 'react';
import api from '../services/api';

export default function About() {
  const [settings, setSettings] = React.useState<Record<string, string>>({});

  React.useEffect(() => {
    api.get('/settings/public').then((res) => setSettings(res.data || {})).catch(console.error);
  }, []);

  return (
    <>
      <section className="py-20 bg-surface" dir="rtl">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-amiri font-bold text-neutral-50 mb-8 text-center">عن المؤسسة</h1>
          <div className="bg-surface-card rounded-xl border border-neutral-800 p-8 md:p-12">
            <div className="prose prose-lg max-w-none font-tajawal leading-relaxed text-neutral-200 prose-headings:text-accent-400">
              <p className="text-lg">{settings.about_text || 'مؤسسة المنى الإبداعية هي منصة ثقافية أدبية تهدف إلى نشر الإبداع العربي في مجالات الشعر والقصة والرواية والمقال والنثر. نسعى إلى توفير فضاء رحب للمبدعين العرب لعرض أعمالهم والتواصل مع جمهور القرّاء.'}</p>
              <h2 className="text-2xl font-amiri font-bold mt-8 mb-4">رؤيتنا</h2>
              <p>{settings.vision_text || 'أن نكون المنصة الأولى في العالم العربي للإبداع الأدبي والثقافي، ونساهم في إحياء التراث الأدبي العربي ودعم المواهب الشابة.'}</p>
              <h2 className="text-2xl font-amiri font-bold mt-8 mb-4">رسالتنا</h2>
              <p>{settings.mission_text || 'نشر الثقافة والأدب العربي بجودة عالية، وتوفير منصة تفاعلية تجمع بين الكتّاب والقرّاء، ودعم الإبداع الشبابي والمواهب الواعدة.'}</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
