const fs = require('fs');
const files = [
  'src/app/actions.ts',
  'src/app/transaction/[type]/page.tsx',
  'src/app/report/page.tsx',
  'src/app/rekening/page.tsx',
  'src/app/transaction/edit/[noTransaksi]/page.tsx',
  'src/app/page.tsx',
  'src/app/history/page.tsx',
  'src/app/chart/page.tsx'
];

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  content = content.replace(/import \{ db \} from [\"']@\/db[\"'];/g, 'import { getDb } from "@/db";');
  
  if (!content.includes("export const runtime = 'edge';")) {
    content = content.replace(/^import /m, "export const runtime = 'edge';\nimport ");
  }

  content = content.replace(/\bdb\./g, 'getDb().');
  
  fs.writeFileSync(file, content);
});
console.log('Done refactoring db to getDb()');
