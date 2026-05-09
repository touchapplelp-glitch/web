import { db } from "../firebaseConfig";
import {
  addDoc,
  deleteDoc,
  doc,
  collection,
  updateDoc,
  getDocs,
  query,
  where,
  orderBy,
  writeBatch,
  limit
} from "firebase/firestore";
// Normalizacion
function normalizeSearchTokens(searchTokens) {
  if (Array.isArray(searchTokens)) {
    return searchTokens.map((t) => String(t).trim()).filter(Boolean);
  }
  if (typeof searchTokens === "string") {
    return searchTokens
      .split(" ")
      .map((t) => t.trim())
      .filter(Boolean);
  }
  return [];
}

function normalizeImages(images) {
  if (!Array.isArray(images)) return [];
  return images.map((u) => String(u).trim()).filter(Boolean);
}

// =========================
// Categories
// =========================
//valida slug manual para rutas
function validateCategorySlug(slug) {
  const s = String(slug || "").trim();

  if (!s) return { ok: false, reason: "Slug vacío" };
  if (s !== s.toLowerCase()) return { ok: false, reason: "Debe ser minúsculas" };
  if (/\s/.test(s)) return { ok: false, reason: "No puede tener espacios" };
  // evita acentos/ñ y cualquier cosa fuera de a-z0-9-
  if (!/^[a-z0-9-]+$/.test(s)) return { ok: false, reason: "Solo a-z, 0-9 y guiones" };

  return { ok: true, value: s };
}

// getter
export const getCategories = async () => {
  try {
    const q = query(collection(db, "categories"), orderBy("order", "asc"));
    const snap = await getDocs(q);

    return snap.docs.map((d) => {
      const data = d.data() || {};
      return {
        id: d.id,
        label: data.label,
        slug: data.slug,
        order: data.order,
      };
    });
  } catch (err) {
    console.log("getCategories error:", err);
    return [];
  }
};


//  CAMBIO: slug + order manual, con corrimiento por order
export const addCategory = async ({ label, slug, order }) => {
  try {
    const cleanLabel = String(label || "").trim();
    const cleanOrder = Number(order);

    if (!cleanLabel) throw new Error("Label vacío");
    if (!Number.isInteger(cleanOrder) || cleanOrder <= 0) {
      throw new Error("Order inválido (entero > 0)");
    }

    const slugCheck = validateCategorySlug(slug);
    if (!slugCheck.ok) throw new Error(`Slug inválido: ${slugCheck.reason}`);
    const cleanSlug = slugCheck.value;

    //  Evita duplicar slug (clave funcional)
    const slugQ = query(collection(db, "categories"), where("slug", "==", cleanSlug));
    const slugSnap = await getDocs(slugQ);
    if (!slugSnap.empty) throw new Error(`Ya existe una categoría con slug "${cleanSlug}"`);

    //  Corrimiento: order >= cleanOrder => +1
    const shiftQ = query(
      collection(db, "categories"),
      where("order", ">=", cleanOrder),
      orderBy("order", "asc")
    );
    const shiftSnap = await getDocs(shiftQ);

    const batch = writeBatch(db);

    shiftSnap.docs.forEach((d) => {
      const current = d.data()?.order;
      batch.update(doc(db, "categories", d.id), { order: Number(current) + 1 });
    });

    //  Insertar nueva en el hueco
    const newRef = doc(collection(db, "categories"));
    batch.set(newRef, { label: cleanLabel, slug: cleanSlug, order: cleanOrder });

    await batch.commit();
    return "category added successfully";
  } catch (error) {
    console.log(error, "la categoria no pudo agregarse");
    throw error;
  }
};


export const deleteCategory = async (categoryName) => {
  try {
    const categoryRef = collection(db, "categories");
    const categoryQuery = query(
      categoryRef,
      where("label", "==", categoryName)
    );
    const querySnapshot = await getDocs(categoryQuery);

    if (!querySnapshot.empty) {
      for (const docSnapshot of querySnapshot.docs) {
        await deleteDoc(doc(db, "categories", docSnapshot.id));
      }
      return "Category deleted successfully";
    } else {
      return "Category not found";
    }
  } catch (error) {
    console.error("Error deleting category:", error);
    throw error;
  }
};
// =========================
//  Product payload builder
// =========================
function buildProductPayload(data) {
  const purchaseMode =
    data.purchaseMode === "checkout"
      ? "checkout"
      : "whatsapp";
  return {
    name: data.name ?? "",
    slug: data.slug ?? "",
    price: Number(data.price) || 0,
    purchaseMode,
    stock: purchaseMode === "checkout"
      ? Number(data.stock) || 0
      : 0,
    images: normalizeImages(data.images),
    videoLink: data.videoLink ?? "",
    description: data.description ?? "",
    gama: data.gama ?? "",
    searchTokens: normalizeSearchTokens(data.searchTokens),
    category: data.category ?? "",
    changefreq: data.changefreq || "weekly",
    updatedAt: new Date().toISOString()
  };
}
// =========================
// Products
// =========================
export const addProduct = async (productData) => {
  try {
   

    const payload = buildProductPayload(productData)
    const productRef = collection(db, "products");
    await addDoc(productRef, payload);
    return "Product added successfully";
  } catch (error) {
    console.error("Error adding product:", error);
    throw error;
  }
};

export const updateProduct = async (editedProduct) => {
  try {
    if (!editedProduct.id){
        alert("invalid ID");
        throw new Error("id invalido")
    } 
    const productRef = doc(db, "products", editedProduct.id);
    const payload = buildProductPayload(editedProduct);
    await updateDoc(productRef, payload);
    console.log("producto acualizado correctamente");
  } catch (error) {
    console.log(error);
    throw error;
  }
};



export const deleteProduct = async (id) => {
  try {
    const productRef = doc(db, "products", id);
    await deleteDoc(productRef);
    alert("producto borrado correctamente");
  } catch (error) {
    alert("producto no borrado");
    console.log(error);
    throw error;
  }
};

// =========================
// Offers
// =========================
function buildOfferPayload(data) {
  const img = String(data?.img || "").trim();

  if (!img) {
    throw new Error("La imagen de la oferta está vacía");
  }

  return {
    img,
    active: true,
    createdAt: new Date().toISOString()
  };
}
export const addOffer = async (offerData) => {
  try {
    const payload = buildOfferPayload(offerData);
    const offerRef = collection(db, "offers");
    await addDoc(offerRef, payload);
    return "Offer added successfully";
  } catch (error) {
    console.error("Error adding offer:", error);
    throw error;
  }
};
//para cliente
export const getOffers = async () => {
  try {
    const q = query(collection(db, "offers"), orderBy("createdAt", "desc"));
    const snap = await getDocs(q);

    return snap.docs.map((d) => {
      const data = d.data() || {};
      return {
        id: d.id,
        img: String(data.img || "").trim(),
        active: data.active ?? true,
        createdAt: data.createdAt || ""
      };
    }).filter((offer) => offer.active && offer.img);
  } catch (error) {
    console.error("Error getting offers:", error);
    return [];
  }
};
//para admin
export const getAllOffers = async () => {
  try {
    const q = query(collection(db, "offers"), orderBy("createdAt", "desc"));
    const snap = await getDocs(q);

    return snap.docs.map((d) => {
      const data = d.data() || {};
      return {
        id: d.id,
        img: String(data.img || "").trim(),
        active: data.active ?? true,
        createdAt: data.createdAt || ""
      };
    });
  } catch (error) {
    console.error("Error getting all offers:", error);
    return [];
  }
};

export const deleteOffer = async (id) => {
  try {
    if (!id) {
      throw new Error("id de oferta inválido");
    }

    const offerRef = doc(db, "offers", id);
    await deleteDoc(offerRef);
    return "Offer deleted successfully";
  } catch (error) {
    console.error("Error deleting offer:", error);
    throw error;
  }
};

// 🟨 COMPROBACION PARA SIDEBOARD(BOTON SOLO VISIBLE SI HAY OFFERS)
export const hasActiveOffers = async () => {
  try {
    const q = query(
      collection(db, "offers"),
      where("active", "==", true),
      limit(1)
    );

    const snap = await getDocs(q);

    // true si encontró al menos 1 doc
    return !snap.empty;
  } catch (error) {
    console.error("Error checking offers:", error);
    return false;
  }
};

