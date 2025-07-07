import React, { useState, useEffect } from "react";
import BASE_PATH from "../serviceurls";

const categoryOrderMap = {
  "Sadu": 0,
  "Khous": 1,
  "Clay": 2,
  "Talli": 3,
  "Stationery Products": 4,
  "AlGhadeer Dates": 5,
  "Others": 6,
  "VIP": 7
};


function reorderCategories(categories) {
  return categories.sort((a, b) => {
    const orderA = categoryOrderMap[a.CategoryNameE] ?? 999;
    const orderB = categoryOrderMap[b.CategoryNameE] ?? 999;
    return orderA - orderB;
  });
}


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
        console.log(data);
        
        const orderedData = reorderCategories(data);
        setAllCategory(orderedData);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, [token, setAllCategory]);

  return null;
}

export default GetAllCategories;
