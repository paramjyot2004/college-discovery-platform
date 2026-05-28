import fetch from 'node-fetch';

async function run() {
  const queries = ['iit', 'iit delhi', 'delhi', 'nit', 'computer', 'cs'];
  for (const q of queries) {
    const url = `http://localhost:3000/api/colleges?search=${encodeURIComponent(q)}`;
    const res = await fetch(url);
    const data = await res.json();
    console.log(q, '->', (data.colleges || []).length);
  }
}

run().catch(console.error);
