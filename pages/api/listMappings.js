import { kv } from '../../lib/kv';

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).end();
  // list all keys under mapping:
  const all = await kv.keys('mapping:*');
  const entries = await Promise.all(
    all.map(async key => {
      const id = key.split(':')[1];
      const { englishUrl, koreanUrl } = await kv.get(key);
      return { id, englishUrl, koreanUrl };
    })
  );
  res.status(200).json(entries);
}
