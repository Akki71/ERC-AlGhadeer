import React, { useState } from 'react';
import GetProducts from './GetProducts';

function ProductListPage() {
  const [products, setProducts] = useState([]);

  return (
    <div>
      <h1>Product List Page</h1>
      <GetProducts setProducts={setProducts} />
      <ul>
        {products.map(product => (
          <li key={product.ProductId}>{product.ProductNameA}</li>
        ))}
      </ul>
    </div>
  );
}

export default ProductListPage;
