import React, { useState, useEffect } from 'react';
import BASE_PATH from '../serviceurls';

function SubCategoryProducts({ setSubCategoryProducts }) {
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) {
      console.error('Token not found.');
      return;
    }

    const fetchProducts = async () => {
      try {
        const response = await fetch(`${BASE_PATH}Product/GetAllSubCategories`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'accept': '*/*',
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }

        const data = await response.json();

        setSubCategoryProducts(data);
        // console.log(data);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, [token, setSubCategoryProducts]);

  if (!token) {
    return <div></div>;
  }

  return null;
}

export default SubCategoryProducts;
