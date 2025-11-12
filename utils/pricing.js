
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const embPath = path.join(__dirname, "..", "data", "embroidery_pricing.json");
const spPath  = path.join(__dirname, "..", "data", "screen_print_pricing.json");

export function loadEmbroidery() { return JSON.parse(fs.readFileSync(embPath, "utf8")); }
export function loadScreenPrint() { return JSON.parse(fs.readFileSync(spPath, "utf8")); }

export function embroideryCost(stitchCount, qty) {
  const data = loadEmbroidery();
  const br = data.qty_brackets;
  const rows = data.rows;
  let row = rows[0];
  for (const r of rows) {
    const m = /^(\d+)(?:\s*-\s*(\d+)K|K)?/i.exec(r.stitch_range);
    if (!m) continue;
    const low = parseInt(m[1]) * (r.stitch_range.includes("K")?1000:1);
    const high = m[2] ? parseInt(m[2])*1000 : low;
    if (stitchCount >= low && stitchCount <= high) { row = r; break; }
  }
  let idx = qty<=6?0:qty<=23?1:qty<=72?2:qty<=144?3:qty<=300?4:5;
  const price = row.prices[br[idx]] ?? null;
  return price;
}

export function screenPrintCost(colors, size, qty) {
  const data = loadScreenPrint();
  const key = `${colors}c|${size}`;
  const brackets = data.rows.map(r=>r.qty_bracket);
  let label = brackets[0];
  for(const b of brackets){
    const n = parseInt(String(b).replace(/\D/g,''))||0;
    if(qty>=n) label=b;
  }
  const row = data.rows.find(r=>r.qty_bracket===label) || { prices:{} };
  let price = row.prices[key];
  if(price==null){
    const base = (String(size).includes('12')?6:3) + (colors-1)*1.5;
    if(qty>144) price = base*0.8;
    else if(qty>72) price = base*0.9;
    else price = base;
  }
  return price;
}

export function garmentSalePrice(ssCost){ return Math.round(((ssCost * 1.12) / 0.7) * 100) / 100; }
