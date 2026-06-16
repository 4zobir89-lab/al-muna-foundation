import React from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const navItems = [
  { to: '/admin/dashboard', label: 'الإحصائيات', icon: '📊' },
  { to: '/admin/texts', label: 'النصوص', icon: '📝' },
  { to: '/admin/authors', label: 'الكتّاب', icon: '✍️' },
  { to: '/admin/categories', label: 'التصنيفات', icon: '📂' },
  { to: '/admin/events', label: 'الفعاليات', icon: '📅' },
  { to: '/admin/messages', label: 'الرسائل', icon: '✉️' },
  { to: '/admin/media', label: 'الوسائط', icon: '🖼️' },
  { to: '/admin/settings', label: 'الإعدادات', icon: '⚙️' },
];

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [expanded, setExpanded] = React.useState(false);

  const handleLogout = () => { logout(); navigate('/admin/login'); };

  return (
    <div className="min-h-screen bg-cream-50 flex" dir="rtl">
      <aside className={`${expanded ? 'w-64' : 'w-16'} bg-dark-900 text-white transition-all duration-300 flex flex-col fixed h-full z-30`} onMouseEnter={() => setExpanded(true)} onMouseLeave={() => setExpanded(false)}>
        <div className="p-4 border-b border-dark-700">
          <h2 className={`font-amiri font-bold text-gold-400 text-lg transition-opacity ${expanded ? '' : 'opacity-0 hidden'}`}>لوحة التحكم</h2>
        </div>
        <nav className="flex-1 py-4">
          {navItems.map((item) => (
            <NavLink key={item.to} to={item.to} end={item.to === '/admin/dashboard'} className={({ isActive }) => `flex items-center gap-3 px-4 py-3 transition-colors ${isActive ? 'bg-gold-700 text-white' : 'text-dark-200 hover:bg-dark-700'}`}>
              <span className="text-xl shrink-0">{item.icon}</span>
              <span className={`text-sm transition-opacity ${expanded ? '' : 'opacity-0 hidden'}`}>{item.label}</span>
            </NavLink>
          ))}
        </nav>
        <div className="p-4 border-t border-dark-700">
          <div className={`mb-3 ${expanded ? '' : 'hidden'}`}>
            <p className="text-xs text-dark-400 truncate">{user?.email}</p>
          </div>
          <button onClick={handleLogout} className="flex items-center gap-3 text-dark-300 hover:text-red-400 transition-colors text-sm w-full px-4 py-2">
            <span>🚪</span>
            <span className={`${expanded ? '' : 'hidden'}`}>تسجيل الخروج</span>
          </button>
        </div>
      </aside>
      <main className={`flex-1 ${expanded ? 'mr-64' : 'mr-16'} transition-all duration-300`}>
        <div className="p-6 md:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
