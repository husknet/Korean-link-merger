import { kv } from '../../lib/kv';
import { v4 as uuidv4 } from 'uuid';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  const { englishUrl, koreanUrl } = req.body;
  if (!englishUrl || !koreanUrl) {
    return res.status(400).json({ error: 'englishUrl & koreanUrl required' });
  }
  const id = uuidv4().split('-')[0];
  await kv.set(`mapping:${id}`, { englishUrl, koreanUrl });
  res.status(201).json({ id, link: `https://${process.env.APP_DOMAIN}/${id}` });
}
