import { useState, useEffect } from "react";
import { getProducts } from "../../services/firebase/firestore/products";
import { RiSearch2Line } from "react-icons/ri";
import { useNavigate } from "react-router-dom";

const Search = ({ renderResult }) => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [loading, setLoading] = useState(false);

  // 🟨 CAMBIO: navegación programática para Enter
  const navigate = useNavigate();

  // Entrada: texto cualquiera
  // Salida: texto normalizado para comparar
  // Consumido por: búsqueda parcial y coincidencia exacta
  const normalizeText = (text) =>
    String(text || "").toLowerCase().trim();

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const productsList = await getProducts();
        setProducts(productsList);
      } catch (error) {
        console.log("error al cargar los productos", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
    // 🟨 CAMBIO: getProducts no va en dependencias
  }, []);

  // Entrada: evento de input
  // Salida: actualiza searchInput y filteredProducts
  // Consumido por: input del buscador
  const handleSearchChange = (event) => {
    const rawValue = event.target.value;
    const query = normalizeText(rawValue);

    setSearchInput(rawValue);

    if (query === "") {
      setFilteredProducts([]);
      return;
    }

    const filtered = products.filter((product) => {
      const nameMatch = normalizeText(product.name).includes(query);

      const tokenMatch = Array.isArray(product.searchTokens)
        ? product.searchTokens.some((token) =>
            normalizeText(token).includes(query)
          )
        : false;

      return nameMatch || tokenMatch;
    });

    setFilteredProducts(filtered);
  };

  // Entrada: query normalizada
  // Salida: producto exacto o null
  // Consumido por: handleSubmit
  const findExactMatch = (query) => {
    const exactMatches = products.filter((product) => {
      const normalizedName = normalizeText(product.name);
      const normalizedSlug = normalizeText(product.slug);

      return normalizedName === query || normalizedSlug === query;
    });

    return exactMatches.length === 1 ? exactMatches[0] : null;
  };

  // Entrada: submit del form
  // Salida:
  // - si hay match exacto único: navega al producto
  // - si no: navega a resultados globales /?search=
  // Consumido por: form del buscador
  const handleSubmit = (event) => {
    event.preventDefault();

    const query = normalizeText(searchInput);

    if (query === "") return;

    const exactMatch = findExactMatch(query);

    if (exactMatch) {
      // 🟨 CAMBIO: coincidencia exacta única → detalle
      navigate(`/item/${exactMatch.slug}`);
      setSearchInput("");
      setFilteredProducts([]);
      return;
    }

    // 🟨 CAMBIO: búsqueda general → catálogo global con query param
    navigate(`/?search=${encodeURIComponent(query)}`);
    setSearchInput("");
    setFilteredProducts([]);
  };

  return (
    <div className="w-full max-w-md mx-auto">
      {/* 🟨 CAMBIO: el form ahora maneja Enter */}
      <form onSubmit={handleSubmit}>
        <div className="w-full relative">
          <RiSearch2Line className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300" />
          <input
            type="text"
            className="bg-[#1f1d28] w-full py-2 pl-10 pr-4 rounded-lg text-gray-300 outline-none"
            placeholder="Buscar"
            value={searchInput}
            onChange={handleSearchChange}
          />
        </div>
      </form>

      <div
        className={`absolute z-10 bg-[#1f1d28] rounded-lg p-4 transition-all duration-500 ${
          searchInput.trim() === "" ? "hidden" : "max-h-screen"
        }`}
      >
        {loading ? (
          <p className="text-gray-400">Cargando productos...</p>
        ) : filteredProducts.length > 0 ? (
          <ul className="text-gray-300 space-y-2">
            {filteredProducts.map((product) => (
              <li key={product.id}>
                {renderResult(product)}
              </li>
            ))}
          </ul>
        ) : (
          searchInput.trim() !== "" && (
            <p className="text-gray-400">No se encontraron productos.</p>
          )
        )}
      </div>
    </div>
  );
};

export default Search;