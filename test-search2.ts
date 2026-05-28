import { collegeMatchesSearch, buildSearchTokens } from './src/utils/search';
import fs from 'fs';

const db = JSON.parse(fs.readFileSync('./server/db.json', 'utf-8'));
const colleges = db.colleges as any[];

const queries = ['iit', 'iit delhi', 'delhi', 'computer', 'cs', 'nit'];
for (const q of queries) {
  const matches = colleges.filter((c) => collegeMatchesSearch(c, q));
  console.log(q, '->', matches.length, matches.map(m=>m.id).slice(0,10));
}
