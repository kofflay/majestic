import { verifyToken } from '@/lib/discord';
import { isAdmin } from '@/lib/admins';
import { kv } from '@vercel/kv';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const user = verifyToken(req.cookies.token);
  
  if (!user || !isAdmin(user.id)) {
    return res.status(403).json({ error: 'Нет доступа' });
  }

  await kv.del('lspd:global:locked');
  await kv.del('lspd:global:requests');
  
  res.status(200).json({ success: true, message: 'Сайт разблокирован!' });
}
