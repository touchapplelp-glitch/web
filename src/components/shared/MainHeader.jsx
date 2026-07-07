import React from "react";
import { NavLink, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "../../services/firebase/firebaseConfig";
import Search from "./Search";

const MainHeader = () => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const categoriesRef = query(collection(db, "categories"), orderBy("order"));

    getDocs(categoriesRef).then((snapshot) => {
      const categoriesAdapted = snapshot.docs.map((doc) => {
        const data = doc.data();
        return { id: doc.id, ...data };
      });

      setCategories(categoriesAdapted);
    });
  }, []);

  return (
    <header>
      <div className="flex flex-col mb-6 md:flex-row md:justify-between md:items-center">
        <div>
          <img
            src="/AppleTisologoBLANCO-disbord.png"
            alt="logo"
            className="h-40 w-auto"
          />
        </div>

        <div>
          {/* 🟨 CAMBIO: Search ya no necesita onProductSelection */}
          <Search
            renderResult={(product) => (
              <Link to={`/item/${product.slug}`}>
                {product.name} -{" "}
                <span className="text-[#D4BEE4]">${product.price}</span>
              </Link>
            )}
          />
        </div>
      </div>

      <nav className="relative text-[#D4BEE4] text-xl flex items-center gap-4 justify-between border-b mb-6 md:justify-start md:gap-8">
        {categories.map((cat) => {
          return (
            <NavLink
              key={cat.id}
              to={`/${cat.slug}`}
              className={({ isActive }) =>
                `relative py-2 pr-4 text-[#D4BEE4] hover:text-[#9B7EBD] ${
                  isActive ? "text-[#9B7EBD]" : ""
                } hover:before:content-[''] hover:before:w-1/2 hover:before:h-[2px] hover:before:absolute hover:before:bg-[#9B7EBD] hover:before:left-0 hover:before:rounded-full hover:before:-bottom-[1px] ${
                  isActive
                    ? "before:content-[''] before:w-1/2 before:h-[2px] before:absolute before:bg-[#9B7EBD] before:left-0 before:rounded-full before:-bottom-[1px]"
                    : ""
                }`
              }
            >
              {cat.label}
            </NavLink>
          );
        })}
      </nav>
    </header>
  );
};

export default MainHeader;
