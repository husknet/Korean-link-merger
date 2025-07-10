import { kv } from '../lib/kv';
import geoip from 'geoip-lite';

export async function getServerSideProps({ params, req, query }) {
  const { id } = params;
  const mapping = await kv.get(`mapping:${id}`);
  if (!mapping) return { notFound: true };

  // extract IP & UA
  const ip = (req.headers['x-forwarded-for'] || req.socket.remoteAddress)
    .split(',')[0].trim();
  const ua = req.headers['user-agent'] || '';

  // anti-bot call
  const botRes = await fetch(
    'https://bad-defender-production.up.railway.app/api/detect_bot',
    { method: 'POST', headers: {'Content-Type':'application/json'},
      body: JSON.stringify({ ip, ua }) }
  );
  const flags = await botRes.json();
  const isBot = flags.isBotUserAgent ||
                flags.isScraperISP ||
                flags.isIPAbuser ||
                flags.isSuspiciousTraffic ||
                flags.isDataCenterASN;
  if (isBot) {
    return {
      redirect: {
        destination: 'https://humansecurity.com',
        permanent: false
      }
    };
  }

  // geo lookup
  const geo = geoip.lookup(ip);
  const country = geo?.country;
  const base = country === 'KR'
    ? mapping.koreanUrl
    : mapping.englishUrl;
  const qs = new URLSearchParams(query).toString();
  return {
    redirect: {
      destination: qs ? `${base}?${qs}` : base,
      permanent: false
    }
  };
}

export default function RedirectPage() {
  return null;
}
