import React, { useEffect } from "react";
import BASE_PATH from "../serviceurls";

function GetAllCategories({ setAllCategory }) {
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`${BASE_PATH}Product/GetAllCategories`, {
          headers: {
            Authorization: `Bearer ${token}`,
            accept: "*/*",
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }

        const data = await response.json();
        setAllCategory(data); 
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, [token, setAllCategory]);

  return null;
}

export default GetAllCategories;
