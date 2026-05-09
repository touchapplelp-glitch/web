const createAdaptedProductFromFirestore = (doc) => {
  const data = doc.data() || {}; // 🟨 CAMBIO: fallback seguro

  const productAdapted = {
    id: doc.id,
    slug: data.slug,
    name: data.name ?? "",
    price: data.price ?? 0,
    stock: data.stock ?? 0,
    gama: data.gama,
    searchTokens: data.searchTokens,
    category: data.category ?? "",
    description: data.description ?? "",
    videoLink: data.videoLink,

    // 🟨 NUEVO: soporta el nuevo modelo
    images: Array.isArray(data.images) ? data.images : [],

  };

  return productAdapted;
};

export default createAdaptedProductFromFirestore;
