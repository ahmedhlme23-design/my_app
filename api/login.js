import { neon } from '@neondatabase/serverless';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const username = req.body?.username?.trim();
  const password = req.body?.password?.trim();

  if (!username || !password) {
    return res.status(400).json({ message: 'يرجى إدخال اسم المستخدم وكلمة السر' });
  }

  try {
    const connectionString = process.env.DATABASE_URL || process.env.POSTGRES_URL;
    if (!connectionString) {
      return res.status(500).json({ message: 'رابط الاتصال بقاعدة البيانات غير متوفر' });
    }

    const sql = neon(connectionString);

    const users = await sql`
      SELECT username, password
      FROM users
      WHERE LOWER(TRIM(username)) = LOWER(${username})
      LIMIT 1
    `;

    if (!users.length) {
      return res.status(401).json({ success: false, message: 'اسم المستخدم أو كلمة المرور غير صحيحة' });
    }

    const matchedUser = users.find(user => user.password === password);
    if (!matchedUser) {
      return res.status(401).json({ success: false, message: 'اسم المستخدم أو كلمة المرور غير صحيحة' });
    }

    return res.status(200).json({ success: true, username: matchedUser.username });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'حدث خطأ أثناء التحقق من المستخدم: ' + error.message });
  }
}
