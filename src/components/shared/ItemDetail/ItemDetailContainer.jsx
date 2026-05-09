import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { getProductBySlug } from "../../../services/firebase/firestore/products";
import ItemDetail from "./ItemDetail";
import DynamicMetadata from "../../SEO/dynamicMetadata";
import Spinner from "../../animation/Spinner/Spinner.jsx"; // 🟨 CAMBIO

const ItemDetailContainer = () => {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;

    setLoading(true);

    getProductBySlug(slug)
      .then((p) => setProduct(p))
      .catch(console.log)
      .finally(() => setLoading(false));
  }, [slug]);

  // 🟨 CAMBIO: loading consistente con catálogo
  if (loading) {
    return (
    <div className="flex justify-center items-center py-32">
  <Spinner />
</div>
    );
  }

  // 🟨 CAMBIO: empty state consistente con catálogo
  if (!product) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4 md:px-8">
  <div className="bg-[#1f1d2b] border border-[#3b2a57] rounded-2xl p-8 md:p-10 text-center shadow-md w-full max-w-xl">
        <h3 className="text-[#D4BEE4] text-2xl md:text-3xl font-semibold mb-3">
          Producto no encontrado
        </h3>

        <p className="text-gray-400 max-w-xl mx-auto">
          El producto que estás buscando no existe o fue eliminado.
        </p>
      </div>
      </div>
    );
  }

  const images = Array.isArray(product.images) ? product.images : [];
  const mainImage = images[0] || "";

  return (
    <div>
      <DynamicMetadata
        productName={product.name}
        productCategory={product.category}
        productPrice={product.price}
        image={mainImage}
        description={
          product.description ||
          `Compra ${product.name} al mejor precio`
        }
      />

      <ItemDetail {...product} images={images} />
    </div>
  );
};

export default ItemDetailContainer;