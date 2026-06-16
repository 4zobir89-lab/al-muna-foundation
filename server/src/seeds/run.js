import bcrypt from 'bcryptjs';
import db from '../config/database.js';

function seed() {
  const userExists = db.prepare("SELECT id FROM users LIMIT 1").get();
  if (!userExists) {
    const hash = bcrypt.hashSync('admin123', 10);
    db.prepare("INSERT INTO users (username, email, password_hash, role) VALUES (?, ?, ?, ?)").run(
      'admin', 'admin@almuna.com', hash, 'admin'
    );
    console.log('  Created default admin user (admin / admin123)');
  }

  const cats = db.prepare("SELECT id FROM categories LIMIT 1").get();
  if (!cats) {
    const categories = [
      ['شعر', 'shier', 'قصائد وأشعار عربية'],
      ['قصة', 'qissa', 'قصص قصيرة ونصوص سردية'],
      ['مقال', 'maqal', 'مقالات أدبية وفكرية'],
      ['رواية', 'riwaya', 'مقتطفات روائية'],
      ['خاطرة', 'khatira', 'خواطر نثرية'],
    ];
    const ins = db.prepare("INSERT INTO categories (name, slug, description) VALUES (?, ?, ?)");
    for (const c of categories) ins.run(...c);
    console.log('  Created default categories');
  }

  const settings = [
    ['site_name', 'مؤسسة المنى الإبداعية'],
    ['site_description', 'مؤسسة أدبية ثقافية تهتم بنشر الإبداع العربي في الشعر والقصة والرواية'],
    ['logo_text', 'المنى الإبداعية'],
    ['footer_text', 'جميع الحقوق محفوظة © مؤسسة المنى الإبداعية'],
    ['email', 'info@almuna.com'],
    ['phone', ''],
    ['address', ''],
    ['about_text', 'مؤسسة المنى الإبداعية هي مؤسسة أدبية ثقافية تسعى إلى نشر وتطوير الإبداع العربي في مختلف المجالات الأدبية.'],
  ];
  const insS = db.prepare("INSERT OR IGNORE INTO settings (key, value) VALUES (?, ?)");
  for (const s of settings) insS.run(...s);
  console.log('  Created default settings');

  console.log('Seed complete.');
}

if (process.argv[1] && (process.argv[1].endsWith('run.js') || process.argv[1].endsWith('seeds/run'))) {
  console.log('Running seeds...');
  seed();
}

export { seed };
