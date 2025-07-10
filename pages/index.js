import { useState, useEffect } from 'react';

export default function Dashboard() {
  const [list, setList] = useState([]);
  const [en, setEn] = useState('');
  const [ko, setKo] = useState('');

  async function fetchList() {
    const res = await fetch('/api/listMappings');
    setList(await res.json());
  }

  useEffect(() => { fetchList(); }, []);

  async function create() {
    await fetch('/api/createMapping', {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({ englishUrl: en, koreanUrl: ko })
    });
    setEn(''); setKo('');
    fetchList();
  }

  async function del(id) {
    await fetch('/api/deleteMapping', {
      method: 'DELETE',
      headers:{'Content-Type':'application/json'},
      body: JSON.stringify({ id })
    });
    fetchList();
  }

  return (
    <div style={{ maxWidth: 600, margin: '2rem auto', fontFamily: 'sans-serif' }}>
      <h1>Link Dashboard</h1>

      <div style={{ marginBottom: '1rem' }}>
        <input
          placeholder="English URL"
          value={en} onChange={e=>setEn(e.target.value)}
          style={{ width:'100%', padding:8, marginBottom:4 }}
        />
        <input
          placeholder="Korean URL"
          value={ko} onChange={e=>setKo(e.target.value)}
          style={{ width:'100%', padding:8 }}
        />
        <button onClick={create} style={{ marginTop:8, padding:'8px 16px' }}>
          Create Link
        </button>
      </div>

      <table width="100%" border="1" cellPadding="8">
        <thead>
          <tr>
            <th>ID</th><th>EN</th><th>KO</th><th>Shortlink</th><th>Del</th>
          </tr>
        </thead>
        <tbody>
          {list.map(m => (
            <tr key={m.id}>
              <td>{m.id}</td>
              <td><code>{m.englishUrl}</code></td>
              <td><code>{m.koreanUrl}</code></td>
              <td>
                <a
                  href={`${window.location.origin}/${m.id}`}
                  target="_blank" rel="noopener"
                >
                  /{m.id}
                </a>
              </td>
              <td>
                <button onClick={()=>del(m.id)}>❌</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
