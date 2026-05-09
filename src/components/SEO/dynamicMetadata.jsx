import { Helmet } from "react-helmet-async";

/**
 * Componente para gestionar metadatos SEO dinámicos
 * @param {Object} props - Propiedades del componente
 * @param {string} props.title - Título de la página
 * @param {string} props.description - Descripción corta de la página
 * @param {string} props.image - URL de la imagen para compartir (opcional)
 * @param {string} props.productName - Nombre del producto (opcional)
 * @param {string} props.productBrand - Marca del producto (opcional)
 * @param {string} props.productCategory - Categoría del producto (opcional)
 * @param {string} props.productPrice - Precio del producto (opcional)
 * @param {Object} props.structuredData - Datos estructurados adicionales (opcional)
 */
function DynamicMetadata({
  title,
  description,
  image,
  productName,
  productBrand,
  productCategory,
  productPrice,
  structuredData = {}
}) {
  // Nombre de la tienda y ubicación
  const storeName = "Apple Touch La Plata";
  const city = "La Plata";
  const region = "AR-B"; 
  const country = "Argentina";
  console.log("DynamicMetadata mounted");
  // Ajusta el título si hay información de producto
  const pageTitle = productName 
    ? `${productName} ${productBrand ? `| ${productBrand}` : ""} | ${storeName}`
    : title || storeName;
  
  // Ajusta la descripción si hay información de producto
  const pageDescription = productName
    ? `Compra ${productName} al mejor precio en ${city}. Envíos a todo el país. Celulares, tablets y notebooks de las mejores marcas.`
    : description || `Tienda online de celulares, tablets y notebooks en ${city}. Envíos a todo ${country}.`;

  // Construir URL canónica
  const canonicalUrl = window.location.href.split('?')[0]; // Elimina parámetros de consulta

  // Construir datos estructurados para productos
  const productStructuredData = productName ? {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": productName,
    "image": image,
    "description": pageDescription,
    "brand": {
      "@type": "Brand",
      "name": productBrand
    },
    "offers": {
      "@type": "Offer",
      "priceCurrency": "ARS",
      "price": productPrice,
      "availability": "https://schema.org/InStock",
      "seller": {
        "@type": "Organization",
        "name": storeName
      }
    }
  } : null;

  // Construir datos estructurados para tienda local
const localBusinessData = {
  "@context": "https://schema.org",
  "@type": "Store",
  "name": storeName,
  "image": import.meta.env.VITE_STORE_LOGO,
  "telephone": import.meta.env.VITE_STORE_PHONE,
  "address": {
    "@type": "PostalAddress",
    "streetAddress": import.meta.env.VITE_STORE_ADDRESS,
    "addressLocality": city,
    "addressRegion": "Buenos Aires",
    "postalCode": import.meta.env.VITE_STORE_POSTAL_CODE,
    "addressCountry": country
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": import.meta.env.VITE_STORE_LAT,
    "longitude": import.meta.env.VITE_STORE_LNG
  },
  "priceRange": "$$",
  "openingHours": "Mo-Sa 09:00-18:00"
};
  return (
    <Helmet>
      {/* Metadatos básicos */}
      <title>{pageTitle}</title>
      <meta name="description" content={pageDescription} />
      <link rel="canonical" href={canonicalUrl} />
      
      {/* Metadatos locales */}
      <meta name="geo.region" content={region} />
      <meta name="geo.placename" content={city} />
      <meta name="geo.position" content="-34.9214;-57.9544" />
      <meta name="ICBM" content="-34.9214, -57.9544" />
      
      {/* Metadatos de Open Graph para redes sociales */}
      <meta property="og:title" content={pageTitle} />
      <meta property="og:description" content={pageDescription} />
      <meta property="og:type" content={productName ? "product" : "website"} />
      <meta property="og:url" content={canonicalUrl} />
      {image && <meta property="og:image" content={image} />}
      <meta property="og:site_name" content={storeName} />
      <meta property="og:locale" content="es_AR" />
      
      {/* Metadatos de Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={pageTitle} />
      <meta name="twitter:description" content={pageDescription} />
      {image && <meta name="twitter:image" content={image} />}
      
      {/* Keywords */}
      <meta name="keywords" content={`${productName || ''} ${productBrand || ''} ${productCategory || ''} celulares, tablets, notebooks, La Plata, tecnología, compra online, envíos, Buenos Aires, Argentina`} />
      
      {/* Datos estructurados */}
      {productName && (
        <script type="application/ld+json">
          {JSON.stringify(productStructuredData)}
        </script>
      )}
      
      <script type="application/ld+json">
        {JSON.stringify(localBusinessData)}
      </script>
      
      {/* Datos estructurados adicionales */}
      {Object.keys(structuredData).length > 0 && (
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      )}
    </Helmet>
    
  );
  
}

export default DynamicMetadata;