import React from 'react';
import api from '../../services/api';

export default function Dashboard() {
  const [stats, setStats] = React.useState<any>({});

  React.useEffect(() => {
    api.get('/admin/stats').then((res) => setStats(res.data)).catch(console.error);
  }, []);

  const cards = [
    { label: 'النصوص', value: stats.textsCount ?? '...', icon: '📝', color: 'bg-blue-50 border-blue-200' },
    { label: 'الكتّاب', value: stats.authorsCount ?? '...', icon: '✍️', color: 'bg-green-50 border-green-200' },
    { label: 'التصنيفات', value: stats.categoriesCount ?? '...', icon: '📂', color: 'bg-purple-50 border-purple-200' },
    { label: 'الفعاليات', value: stats.eventsCount ?? '...', icon: '📅', color: 'bg-orange-50 border-orange-200' },
    { label: 'الرسائل', value: stats.messagesCount ?? '...', icon: '✉️', color: 'bg-pink-50 border-pink-200' },
  ];

  return (
    <div dir="rtl">
      <h1 className="text-3xl font-amiri font-bold text-dark-900 mb-8">لوحة الإحصائيات</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5">
        {cards.map((card) => (
          <div key={card.label} className={`${card.color} border rounded-xl p-6`}>
            <div className="text-3xl mb-2">{card.icon}</div>
            <div className="text-2xl font-bold text-dark-900">{card.value}</div>
            <div className="text-sm text-dark-500 mt-1">{card.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
