import fs from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import admin from "firebase-admin";
import { SitemapStream, streamToPromise } from "sitemap";
import { Readable } from "stream";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log("🚀 Iniciando script de sitemap...");

// ================================
// 🔐 Configurar Firebase Admin
// ================================
let serviceAccount;

if (process.env.FIREBASE_SERVICE_ACCOUNT_JSON) {
  console.log("🔐 Usando credenciales desde FIREBASE_SERVICE_ACCOUNT_JSON");
  serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON);
} else {
  const serviceAccountPath = join(__dirname, "serviceAccountKey.json");
  console.log("📌 Buscando credenciales en:", serviceAccountPath);

  if (!fs.existsSync(serviceAccountPath)) {
    console.error("❌ No se encontró serviceAccountKey.json ni FIREBASE_SERVICE_ACCOUNT_JSON");
    process.exit(1);
  }

  serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, "utf8"));
}


if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

const db = admin.firestore();

// ================================
// 🌍 Config
// ================================
const DOMAIN = process.env.DOMAIN || "https://touch-argentina.com";
const PUBLIC_DIR = join(__dirname, "..", "public");
const SITEMAP_PATH = join(PUBLIC_DIR, "sitemap.xml");

const STATIC_LASTMOD = process.env.BUILD_DATE || null;

// ================================
// 📌 Rutas estáticas
// ================================
const staticUrls = [
  {
    url: "/",
    priority: 1.0,
    changefreq: "monthly",
    ...(STATIC_LASTMOD ? { lastmod: STATIC_LASTMOD } : {}),
  },
  {
    url: "/Ofertas",
    priority: 0.8,
    changefreq: "weekly",
    ...(STATIC_LASTMOD ? { lastmod: STATIC_LASTMOD } : {}),
  },
  {
    url: "/SobreNosotros",
    priority: 0.5,
    changefreq: "yearly",
    ...(STATIC_LASTMOD ? { lastmod: STATIC_LASTMOD } : {}),
  },
];

// ================================
// 🔍 Obtener productos
// ================================
let products = [];

try {
  console.log("📄 Consultando productos desde Firestore...");

  const productsSnapshot = await db
    .collection("products")
    .where("stock", ">", 0)
    .get();

  products = productsSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  console.log(`✔ Productos con stock: ${products.length}`);
} catch (err) {
  console.error("❌ Error al consultar Firestore:", err);
}

// ================================
// 🧩 Construcción sitemap
// ================================
const productUrls = products.map((p) => {
  const images = Array.isArray(p.images)
    ? p.images
        .map((u) => String(u || "").trim())
        .filter((u) => u && /^https?:\/\//i.test(u))
        .map((img) => ({
          url: img,
          title: p.name || "Producto",
        }))
    : [];

  return {
    url: `/item/${p.slug}`,
    priority: 0.7,
    changefreq: p.changefreq || "weekly",
    lastmod: p.updatedAt || new Date().toISOString(),
    images,
  };
});

const urls = [...staticUrls, ...productUrls];

console.log("📌 URLs totales:", urls.length);

// ================================
// 📝 Generar XML
// ================================
try {
  const stream = new SitemapStream({ hostname: DOMAIN });
  const xml = await streamToPromise(Readable.from(urls).pipe(stream));

  if (!fs.existsSync(PUBLIC_DIR)) {
    fs.mkdirSync(PUBLIC_DIR, { recursive: true });
  }

  fs.writeFileSync(SITEMAP_PATH, xml.toString());

  console.log("🎉 Sitemap generado correctamente");
  console.log(`📍 Archivo: ${SITEMAP_PATH}`);
} catch (err) {
  console.error("❌ Error generando sitemap:", err);
}
