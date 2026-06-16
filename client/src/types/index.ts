export interface Text {
  id: number; title: string; slug: string; content: string; excerpt?: string;
  type: 'poem' | 'story' | 'article' | 'novel' | 'prose' | 'other';
  author_id?: number; author_name?: string; author_slug?: string; author_bio?: string;
  category_id?: number; category_name?: string; category_slug?: string;
  is_published: number; is_featured: number; published_at?: string;
  view_count: number; meta_description?: string; related?: Text[];
  created_at: string; updated_at: string;
}

export interface Author {
  id: number; name: string; slug: string; bio?: string; image?: string;
  birth_date?: string; death_date?: string; nationality?: string;
  is_featured: number; texts?: Text[];
  created_at: string; updated_at: string;
}

export interface Category {
  id: number; name: string; slug: string; description?: string; icon?: string;
  text_count?: number; texts?: Text[];
  created_at: string; updated_at: string;
}

export interface Event {
  id: number; title: string; slug: string; description?: string; content?: string;
  location?: string; start_date: string; end_date?: string; image?: string;
  is_published: number; created_at: string; updated_at: string;
}

export interface MediaItem {
  id: number; title?: string; filename: string; url: string;
  type: string; size: number; mime_type: string; created_at: string;
}

export interface ContactMessage {
  id: number; name: string; email: string; subject?: string; message: string;
  is_read: number; created_at: string;
}

export interface User {
  id: number; username: string; email: string; role: 'admin' | 'editor';
}

export interface DashboardStats {
  counts: {
    texts: number; published: number; authors: number; categories: number;
    events: number; messages: number; unreadMessages: number;
  };
  recentTexts: Text[]; recentMessages: ContactMessage[]; textsByType: { type: string; count: number }[];
}

export type TextType = 'poem' | 'story' | 'article' | 'novel' | 'prose' | 'other';
