import { neon } from '@neondatabase/serverless';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const username = req.body?.username?.trim();
  const currentPassword = req.body?.currentPassword?.trim();
  const newPassword = req.body?.newPassword?.trim();

  if (!username || !currentPassword || !newPassword) {
    return res.status(400).json({ message: 'يرجى إدخال جميع الحقول' });
  }

  try {
    const connectionString = process.env.DATABASE_URL || process.env.POSTGRES_URL;
    if (!connectionString) {
      return res.status(500).json({ message: 'رابط الاتصال بقاعدة البيانات غير متوفر' });
    }

    const sql = neon(connectionString);

    const users = await sql`
      SELECT id, password
      FROM users
      WHERE LOWER(TRIM(username)) = LOWER(${username})
      LIMIT 1
    `;

    if (!users.length) {
      return res.status(404).json({ message: 'المستخدم غير موجود' });
    }

    const userRecord = users[0];
    if (userRecord.password !== currentPassword) {
      return res.status(401).json({ message: 'كلمة المرور الحالية غير صحيحة' });
    }

    await sql`
      UPDATE users
      SET password = ${newPassword}
      WHERE id = ${userRecord.id}
    `;

    return res.status(200).json({ success: true, message: 'تم تغيير كلمة المرور بنجاح' });
  } catch (error) {
    return res.status(500).json({ message: 'حدث خطأ أثناء تغيير كلمة المرور: ' + error.message });
  }
}
