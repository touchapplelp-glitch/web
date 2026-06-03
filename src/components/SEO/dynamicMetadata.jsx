import { Helmet } from "react-helmet-async";

/**
 * DynamicMetadata
 *
 * Entradas:
 * - title
 * - description
 * - image
 * - productName
 * - productBrand
 * - productCategory
 * - productPrice
 * - structuredData
 *
 * Salidas:
 * - Metadatos SEO dinámicos
 * - Open Graph
 * - Twitter Cards
 * - Canonical
 * - Structured Data (Schema.org)
 *
 * Consumido por:
 * - ItemDetailContainer
 * - Futuras páginas Home / Categorías / Ofertas
 */

function DynamicMetadata({
  title,
  description,
  image,
  productName,
  productBrand,
  productCategory,
  productPrice,
  structuredData = {},
}) {
  // =========================
  // STORE CONFIG FROM ENV
  // =========================
  const storeName = import.meta.env.VITE_STORE_NAME || "Touch Argentina";
  const storeDomain = import.meta.env.VITE_STORE_DOMAIN || "";
  const city = import.meta.env.VITE_STORE_CITY || "La Plata";
  const region = import.meta.env.VITE_STORE_REGION || "AR-B";
  const country = import.meta.env.VITE_STORE_COUNTRY || "Argentina";

  const phone = import.meta.env.VITE_STORE_PHONE || "";
  const address = import.meta.env.VITE_STORE_ADDRESS || "";
  const postalCode = import.meta.env.VITE_STORE_POSTAL_CODE || "";

  const latitude = import.meta.env.VITE_STORE_LAT || "";
  const longitude = import.meta.env.VITE_STORE_LNG || "";

  const storeLogo = import.meta.env.VITE_STORE_LOGO || "";

  // =========================
  // PAGE TITLE
  // =========================
  const pageTitle = productName
    ? `${productName}${productBrand ? ` | ${productBrand}` : ""} | ${storeName}`
    : title || storeName;

  // =========================
  // PAGE DESCRIPTION
  // =========================
  const pageDescription = productName
    ? `Compra ${productName} al mejor precio en ${city}. Envíos a todo el país. Celulares, tablets y notebooks de las mejores marcas.`
    : description ||
      `Tienda online de celulares, tablets y notebooks en ${city}. Envíos a todo ${country}.`;

  // =========================
  // CANONICAL URL
  // =========================
  const canonicalUrl = storeDomain
    ? `${storeDomain}${window.location.pathname}`
    : window.location.href.split("?")[0];

  // =========================
  // PRODUCT STRUCTURED DATA
  // =========================
  const productStructuredData = productName
    ? {
        "@context": "https://schema.org",
        "@type": "Product",
        name: productName,
        image: image,
        description: pageDescription,
        brand: productBrand
          ? {
              "@type": "Brand",
              name: productBrand,
            }
          : undefined,
        offers: {
          "@type": "Offer",
          priceCurrency: "ARS",
          price: productPrice,
          availability: "https://schema.org/InStock",
          seller: {
            "@type": "Organization",
            name: storeName,
          },
        },
      }
    : null;

  // =========================
  // LOCAL BUSINESS STRUCTURED DATA
  // =========================
  const localBusinessData = {
    "@context": "https://schema.org",
    "@type": "Store",
    name: storeName,
    image: storeLogo,
    telephone: phone,
    address: {
      "@type": "PostalAddress",
      streetAddress: address,
      addressLocality: city,
      addressRegion: "Buenos Aires",
      postalCode: postalCode,
      addressCountry: country,
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: latitude,
      longitude: longitude,
    },
    priceRange: "$$",
    openingHours: "Mo-Sa 09:00-18:00",
  };

  return (
    <Helmet>
      {/* =========================
          BASIC SEO
      ========================= */}
      <title>{pageTitle}</title>
      <meta name="description" content={pageDescription} />
      <link rel="canonical" href={canonicalUrl} />

      {/* =========================
          LOCAL GEO SEO
      ========================= */}
      <meta name="geo.region" content={region} />
      <meta name="geo.placename" content={city} />
      <meta name="geo.position" content={`${latitude};${longitude}`} />
      <meta name="ICBM" content={`${latitude}, ${longitude}`} />

      {/* =========================
          OPEN GRAPH
      ========================= */}
      <meta property="og:title" content={pageTitle} />
      <meta property="og:description" content={pageDescription} />
      <meta property="og:type" content={productName ? "product" : "website"} />
      <meta property="og:url" content={canonicalUrl} />
      {image && <meta property="og:image" content={image} />}
      <meta property="og:site_name" content={storeName} />
      <meta property="og:locale" content="es_AR" />

      {/* =========================
          TWITTER
      ========================= */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={pageTitle} />
      <meta name="twitter:description" content={pageDescription} />
      {image && <meta name="twitter:image" content={image} />}

      {/* =========================
          KEYWORDS
      ========================= */}
      <meta
        name="keywords"
        content={`
          ${productName || ""}
          ${productBrand || ""}
          ${productCategory || ""}
          celulares, tablets, notebooks,
          ${city},
          tecnología,
          compra online,
          envíos,
          Buenos Aires,
          Argentina
        `}
      />

      {/* =========================
          PRODUCT JSON-LD
      ========================= */}
      {productName && (
        <script type="application/ld+json">
          {JSON.stringify(productStructuredData)}
        </script>
      )}

      {/* =========================
          LOCAL BUSINESS JSON-LD
      ========================= */}
      <script type="application/ld+json">
        {JSON.stringify(localBusinessData)}
      </script>

      {/* =========================
          EXTRA STRUCTURED DATA
      ========================= */}
      {Object.keys(structuredData).length > 0 && (
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      )}
    </Helmet>
  );
}

export default DynamicMetadata;