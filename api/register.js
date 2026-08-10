import { neon } from '@neondatabase/serverless';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const username = req.body.username?.trim();
  const password = req.body.password?.trim();

  if (!username || !password) {
    return res.status(400).json({ message: 'يرجى إدخال اسم المستخدم وكلمة السر' });
  }

  try {
    const connectionString = process.env.DATABASE_URL || process.env.POSTGRES_URL;
    if (!connectionString) {
      return res.status(500).json({ message: 'رابط الاتصال بقاعدة البيانات غير متوفر' });
    }

    const sql = neon(connectionString);

    // التحقق مما إذا كان اسم المستخدم موجوداً بالفعل
    const existingUser = await sql`SELECT id FROM users WHERE TRIM(username) = ${username}`;
    if (existingUser.length > 0) {
      return res.status(400).json({ message: 'اسم المستخدم هذا مستخدم بالفعل!' });
    }

    // إدخال المستخدم الجديد في قاعدة البيانات
    await sql`INSERT INTO users (username, password) VALUES (${username}, ${password})`;

    return res.status(200).json({ success: true, message: 'تم إنشاء الحساب بنجاح!' });
  } catch (error) {
    return res.status(500).json({ message: 'حدث خطأ أثناء إنشاء الحساب: ' + error.message });
  }
}