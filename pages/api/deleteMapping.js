import { kv } from '../../lib/kv';

export default async function handler(req, res) {
  if (req.method !== 'DELETE') return res.status(405).end();
  const { id } = req.body;
  if (!id) return res.status(400).json({ error: 'id required' });
  await kv.del(`mapping:${id}`);
  res.status(204).end();
}
