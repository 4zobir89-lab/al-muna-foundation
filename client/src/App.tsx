import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import AdminLayout from './pages/admin/AdminLayout';
import Login from './pages/admin/Login';
import ProtectedRoute from './pages/admin/ProtectedRoute';
import Home from './pages/Home';
import Texts from './pages/Texts';
import TextDetail from './pages/TextDetail';
import Authors from './pages/Authors';
import AuthorDetail from './pages/AuthorDetail';
import Events from './pages/Events';
import EventDetail from './pages/EventDetail';
import About from './pages/About';
import Contact from './pages/Contact';
import Archive from './pages/Archive';
import Creators from './pages/Creators';
import Search from './pages/Search';
import Magazine from './pages/Magazine';
import Dashboard from './pages/admin/Dashboard';
import TextManager from './pages/admin/TextManager';
import AuthorsManager from './pages/admin/AuthorsManager';
import CategoriesManager from './pages/admin/CategoriesManager';
import EventsManager from './pages/admin/EventsManager';
import MessagesManager from './pages/admin/MessagesManager';
import SettingsManager from './pages/admin/SettingsManager';
import MediaManager from './pages/admin/MediaManager';

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/texts" element={<Texts />} />
        <Route path="/texts/:id" element={<TextDetail />} />
        <Route path="/authors" element={<Authors />} />
        <Route path="/authors/:id" element={<AuthorDetail />} />
        <Route path="/events" element={<Events />} />
        <Route path="/events/:id" element={<EventDetail />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/archive" element={<Archive />} />
        <Route path="/creators" element={<Creators />} />
        <Route path="/creators/:id" element={<AuthorDetail />} />
        <Route path="/search" element={<Search />} />
        <Route path="/magazine" element={<Magazine />} />
      </Route>
      <Route path="/login" element={<Login />} />
      <Route path="/admin" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
        <Route index element={<Dashboard />} />
        <Route path="texts" element={<TextManager />} />
        <Route path="authors" element={<AuthorsManager />} />
        <Route path="categories" element={<CategoriesManager />} />
        <Route path="events" element={<EventsManager />} />
        <Route path="messages" element={<MessagesManager />} />
        <Route path="settings" element={<SettingsManager />} />
        <Route path="media" element={<MediaManager />} />
      </Route>
    </Routes>
  );
}
