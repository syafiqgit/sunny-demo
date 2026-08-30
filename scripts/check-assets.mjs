/**
 * Memastikan setiap path aset lokal di setiap tema benar-benar ada di public/.
 *
 * Ini menutup satu-satunya celah yang tidak ditangkap `next build`: TypeScript
 * memeriksa bentuk config-nya, bukan apakah berkasnya ada, jadi satu typo di
 * `app/templates/*.ts` dulu baru ketahuan saat halamannya dibuka di browser.
 *
 * Sengaja node polos tanpa test runner - proyek ini belum punya, dan menambah
 * satu dependency demi satu pemeriksaan tidak sepadan. Berkas tema dimuat
 * langsung (node menghapus anotasi tipenya sendiri); `index.ts` dilewati
 * karena impornya tanpa ekstensi dan itu hanya bisa diselesaikan bundler.
 *
 *   npm run check:assets
 */
import { existsSync, readdirSync } from "node:fs";
import { fileURLToPath, pathToFileURL } from "node:url";
import path from "node:path";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const PUBLIC_DIR = path.join(ROOT, "public");
const TEMPLATES_DIR = path.join(ROOT, "app", "templates");

/** Menelusuri objek config dan mengumpulkan setiap string yang berupa path lokal. */
function collectLocalPaths(value, trail, found) {
  if (typeof value === "string") {
    if (value.startsWith("/")) found.push({ path: value, at: trail });
    return found;
  }
  if (Array.isArray(value)) {
    value.forEach((item, i) => collectLocalPaths(item, `${trail}[${i}]`, found));
    return found;
  }
  if (value && typeof value === "object") {
    for (const [key, child] of Object.entries(value)) {
      collectLocalPaths(child, trail ? `${trail}.${key}` : key, found);
    }
  }
  return found;
}

const files = readdirSync(TEMPLATES_DIR)
  .filter((name) => name.endsWith(".ts") && name !== "index.ts")
  .sort();

const templates = [];
for (const file of files) {
  const mod = await import(pathToFileURL(path.join(TEMPLATES_DIR, file)).href);
  for (const value of Object.values(mod)) {
    if (value && typeof value === "object" && "slug" in value) {
      templates.push(value);
    }
  }
}

if (templates.length === 0) {
  console.error(`Tidak ada tema yang ditemukan di ${TEMPLATES_DIR}`);
  process.exit(1);
}

let checked = 0;
const missing = [];

for (const template of templates) {
  for (const entry of collectLocalPaths(template, "", [])) {
    checked += 1;
    // decodeURIComponent: path di config ditulis apa adanya, sedangkan nama
    // berkas di disk bisa mengandung karakter yang ter-encode di URL.
    const onDisk = path.join(PUBLIC_DIR, decodeURIComponent(entry.path));
    if (!existsSync(onDisk)) {
      missing.push(`  ${template.slug}.${entry.at}  ->  ${entry.path}`);
    }
  }
}

if (missing.length > 0) {
  console.error(`Aset tidak ditemukan di public/ (${missing.length}):`);
  console.error(missing.join("\n"));
  process.exit(1);
}

console.log(
  `OK - ${checked} path aset di ${templates.length} tema semuanya ada di public/.`,
);
