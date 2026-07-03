const TOKEN = import.meta.env.VITE_GITHUB_TOKEN;
const REPO = 'david-farago/rezsi';
const FILE_PATH = 'public/data.csv';
const STORAGE_KEY = 'rezsi_data_csv';

export async function readData() {
  if (import.meta.env.DEV) {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return stored;
  }

  const base = import.meta.env.BASE_URL;
  const res = await fetch(`${base}data.csv`);
  if (!res.ok) throw new Error(`Failed to fetch data.csv: ${res.status}`);
  return res.text();
}

export async function writeData(csvText) {
  if (import.meta.env.DEV) {
    localStorage.setItem(STORAGE_KEY, csvText);
    return;
  }

  if (!TOKEN) throw new Error('VITE_GITHUB_TOKEN must be set');

  const apiBase = `https://api.github.com/repos/${REPO}/contents/${FILE_PATH}`;
  const headers = { Authorization: `Bearer ${TOKEN}`, 'Content-Type': 'application/json' };

  const current = await fetch(apiBase, { headers });
  if (!current.ok) throw new Error(`GitHub API error: ${current.status}`);
  const { sha } = await current.json();

  const content = btoa(String.fromCharCode(...new TextEncoder().encode(csvText)));

  const update = await fetch(apiBase, {
    method: 'PUT',
    headers,
    body: JSON.stringify({ message: 'add utility data entry', content, sha }),
  });

  if (!update.ok) {
    const body = await update.json().catch(() => ({}));
    throw new Error(`GitHub write failed: ${update.status} ${body.message ?? ''}`);
  }
}
