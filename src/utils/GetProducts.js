import  {  useEffect } from 'react';
import BASE_PATH from '../serviceurls';

function GetProducts({ setProducts }) {
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) {
      console.error('Token not found.');
      return;
    }

    const fetchProducts = async () => {
      try {
        const response = await fetch(`${BASE_PATH}Product/GetAllProducts`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'accept': '*/*',
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }

        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, [token, setProducts]);



  return null;
}

export default GetProducts;
