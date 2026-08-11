import { neon } from '@neondatabase/serverless';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const name = req.body?.name?.trim();
  const email = req.body?.email?.trim();
  const subject = req.body?.subject?.trim();
  const message = req.body?.message?.trim();

  if (!name || !email || !subject || !message) {
    return res.status(400).json({ message: 'يرجى إدخال جميع الحقول' });
  }

  try {
    const connectionString = process.env.DATABASE_URL || process.env.POSTGRES_URL;
    if (!connectionString) {
      return res.status(500).json({ message: 'رابط الاتصال بقاعدة البيانات غير متوفر' });
    }

    const sql = neon(connectionString);

    await sql`
      INSERT INTO contacts (name, email, subject, message)
      VALUES (${name}, ${email}, ${subject}, ${message})
    `;

    return res.status(200).json({ success: true, message: 'تم إرسال الرسالة بنجاح' });
  } catch (error) {
    return res.status(500).json({ message: 'حدث خطأ أثناء حفظ الرسالة: ' + error.message });
  }
}
