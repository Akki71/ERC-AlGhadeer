import React from 'react'
 
 const GuestLogin = (product, toast,quantitya, language) => {
  //  console.log(product.ProductSizeList[0]);
   const productdetails = {
     ProductId: product.ProductId,
     CategoryId: product.CategoryId,
     SubCategoryId: product.SubCategoryId,
     CategoryNameE: product.CategoryNameE,
     SubCategoryId: product.SubCategoryId,
     SubCategoryNameE: product.SubCategoryNameE,
     SubCategoryNameA: product.SubCategoryNameA,
     ProductAvailableQuantity: product.ProductSizeList[0].Quantity,
     ProductNameE: product.ProductNameE,
     ProductNameA: product.ProductNameA,
     IsProductActive: product.IsProductActive,
     ProductSizeNameE: product.ProductSizeList[0].ProductSizeNameE,
     ProductSizeNameA: product.ProductSizeList[0].ProductSizeNameA,
     ProductCurrentPrice: product.ProductSizeList[0].ProductPrice,
     ProductSizeId: product.ProductSizeList[0].ProductSizeId,
     OrderPrice: product.ProductSizeList[0].ProductPrice,
     OrderQuantity: quantitya,
     TotalAmount: product.ProductSizeList[0].ProductPrice * quantitya,
     Status: "",
   };
  //  console.log(productdetails);
   let products = JSON.parse(localStorage.getItem("guestProduct")) || [];
 
   const productExists = products.some(
     (item) => item.ProductId === productdetails.ProductId
   );
 
   if (!productExists) {
     products.push(productdetails);
     localStorage.setItem("guestProduct", JSON.stringify(products));
 
    
   }
   toast.success(
    language === "en"
      ? "Product added to cart successfully!"
       : "تمت إضافة المنتج إلى سلة التسوق بنجاح!"
  );
  //  console.log(products);
 };
 
export default GuestLogin;