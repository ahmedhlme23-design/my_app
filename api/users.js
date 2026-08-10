import { neon } from '@neondatabase/serverless';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    const connectionString = process.env.DATABASE_URL || process.env.POSTGRES_URL;
    if (!connectionString) {
      return res.status(500).json({ message: 'رابط الاتصال بقاعدة البيانات غير متوفر' });
    }

    const sql = neon(connectionString);
    const users = await sql`SELECT id, username FROM users ORDER BY id ASC`;

    return res.status(200).json({ success: true, users });
  } catch (error) {
    return res.status(500).json({ message: 'حدث خطأ أثناء جلب المستخدمين: ' + error.message });
  }
}
