import { useEffect, useMemo, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import GamaFilter from "./GamaFilter.jsx";
import ItemList from "./ItemList.jsx";
import { getProducts } from "../../../services/firebase/firestore/products.js";
import Spinner from "../../animation/Spinner/Spinner.jsx";

const CatalogSection = () => {
  const { categoryId } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const searchQuery = String(searchParams.get("search") || "")
    .toLowerCase()
    .trim();

  const gamaQuery = String(searchParams.get("gama") || "")
    .toLowerCase()
    .trim();

  const normalizeText = (text) =>
    String(text || "")
      .toLowerCase()
      .trim();

  const matchesSearch = (product, query) => {
    if (!query) return true;

    const nameMatch = normalizeText(product.name).includes(query);

    const tokenMatch = Array.isArray(product.searchTokens)
      ? product.searchTokens.some((token) =>
          normalizeText(token).includes(query)
        )
      : false;

    return nameMatch || tokenMatch;
  };

  useEffect(() => {
    setLoading(true);

    // 🟨 CAMBIO: si hay búsqueda, la carga es global; si no, respeta categoría
    const shouldSearchGlobally = searchQuery.length > 0;
    const productsRequest = shouldSearchGlobally
      ? getProducts()
      : getProducts(categoryId);

    productsRequest
      .then((products) => {
        setProducts(Array.isArray(products) ? products : []);
      })
      .catch((error) => {
        console.log(error);
        setProducts([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [categoryId, searchQuery]);

  // 🟨 CAMBIO: conjunto base antes de aplicar gama
  const baseProducts = useMemo(() => {
    if (!searchQuery) return products;

    return products.filter((product) => matchesSearch(product, searchQuery));
  }, [products, searchQuery]);

  // 🟨 CAMBIO: gamas disponibles calculadas sobre el conjunto base
  const availableGamas = useMemo(() => {
    return new Set(
      baseProducts
        .map((product) => String(product.gama || "").toLowerCase().trim())
        .filter(Boolean)
    );
  }, [baseProducts]);

  // 🟨 CAMBIO: listado final luego de aplicar gama
  const filteredProducts = useMemo(() => {
    if (!gamaQuery) return baseProducts;

    return baseProducts.filter(
      (product) =>
        String(product.gama || "").toLowerCase().trim() === gamaQuery
    );
  }, [baseProducts, gamaQuery]);

  const handleGamaChange = (event) => {
    const value = event.target.value;
    const params = new URLSearchParams(searchParams);

    if (value) {
      params.set("gama", value);
    } else {
      params.delete("gama");
    }

    setSearchParams(params);
  };

  const catalogTitle = searchQuery
    ? `Resultados para "${searchQuery}"`
    : categoryId
      ? "Productos de la categoría"
      : "Productos";

  if (loading) {
    return <Spinner />;
  }

  return (
    <section>
      {/* 🟨 CAMBIO: cabecera del catálogo movida desde MainContext */}
      <div className="flex items-center justify-between mb-12 gap-4 flex-wrap">
        <div>
          <h2 className="text-xl text-gray-300">{catalogTitle}</h2>

          {gamaQuery && (
            <p className="text-sm text-[#D4BEE4] mt-1">
              Filtro aplicado: {gamaQuery}
            </p>
          )}
        </div>

        <GamaFilter
          gamaQuery={gamaQuery}
          availableGamas={availableGamas}
          onGamaChange={handleGamaChange}
        />
      </div>

      {filteredProducts.length === 0 ? (
        // 🟨 CAMBIO: empty state con estilos consistentes
        <div className="bg-[#1f1d2b] border border-[#3b2a57] rounded-2xl p-6 md:p-10 text-center shadow-md">
          <h3 className="text-[#D4BEE4] text-2xl md:text-3xl font-semibold mb-3">
            No se encontraron productos
          </h3>

          <p className="text-gray-400 max-w-xl mx-auto">
            Probá cambiar la búsqueda, seleccionar otra gama o volver al catálogo general.
          </p>
        </div>
      ) : (
        <ItemList products={filteredProducts} />
      )}
    </section>
  );
};

export default CatalogSection;