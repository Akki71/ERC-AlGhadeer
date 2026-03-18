import BASE_PATH from '../serviceurls';

const HandleAddToCart = async (product, quantitya, language, tokenlogin, UserID, navigate, toast, setActiveCartProducts) => {
    // console.log(quantitya);
    // console.log(product);
    // console.log( product.ProductSizeList[0].ProductSizeId);
    // console.log("Adding to Cart - Product Details:", product);
    try {
    // console.log("OrderQuantity",quantitya);

        const apiUrl = `${BASE_PATH}Order/AddOrderInCart`;
        const requestOptions = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${tokenlogin}`,
            },
            body: JSON.stringify({
                ProductId: product.ProductId,
                CategoryId: product.CategoryId,
                SubCategoryId: product.SubCategoryId,
                UserID: UserID,
                ProductSizeId : product.ProductSizeList[0].ProductSizeId,
                OrderPrice:product.ProductSizeList[0].ProductPrice,
                OrderQuantity: quantitya,
                TotalAmount: product.ProductSizeList[0].ProductPrice * 1,
                Status: "",
            
            }),
        };
        const response = await fetch(apiUrl, requestOptions);

        if (response.ok) {
            // const data = await response.json();
            setActiveCartProducts(prevProducts => [...prevProducts, product.ProductId]);
            
            // console.log("Add to Cart Response:", data.ProductId);
            // // existingProductIds.push(data.ProductId);
            // console.log("Add to Cart OrderQuantity:", data.OrderQuantity);
             
            // localStorage.setItem("Cart_Response", JSON.stringify(existingProductIds));
                  
            
            toast.success(
                language === "en"
                    ? "Product added to cart successfully!"
                    : "تمت إضافة المنتج إلى سلة التسوق بنجاح!"
            );
                    // useCounter.getState().incrCounter();
        } else if (response.status === 401 ) {
            localStorage.removeItem("loginToken");
            localStorage.removeItem("UserID");
            // Unauthorized or Bad Request - Redirect to login page or handle the error accordingly
            toast.error(
                language === "en"
                    ? "Please Login to access your cart !"
                    : "الرجاء تسجيل الدخول للوصول إلى سلة التسوق الخاصة بك!"
            );
            setTimeout(() => {
                navigate("/login")
            }, 3000);

        } else {
            // Handle other error cases
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
    } catch (error) {
        console.error("Error adding to cart:", error);
        toast.error(
            language === "en"
                ? "Failed to add the product to the cart."
                : "لم نستطع إضافة المنتج إلى سلة التسوق."
        );

    }
  
};

export default HandleAddToCart;
