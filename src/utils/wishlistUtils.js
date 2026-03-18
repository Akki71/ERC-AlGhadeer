// wishlistUtils.js
import BASE_PATH from '../serviceurls';

const handleAddToWishlist = async (ProductId, SubCategoryId, CategoryId, UserID, tokenlogin, language, navigate, toast, setActiveWishlistProducts, setIsWishlist) => {
    const apiUrl = `${BASE_PATH}Wishlist/AddWishlist`;
    const wishlistData = {
        WishlistId: 0,
        UserId: parseInt(UserID),
        ProductId: ProductId,
        // ProductSizeId : ProductSizeId,

        CategoryId: CategoryId,
        SubCategoryId: SubCategoryId,
        CreatedBy: parseInt(UserID),
        UpdatedBy: parseInt(UserID),
        Active: true,
    };
    try {
        const response = await fetch(apiUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${tokenlogin}`,
            },
            body: JSON.stringify(wishlistData),
        });
    
        // console.log("Response Status Code:", response.status);
    
        if (response.status === 200) {
            const successMessage = language === "en" ?
                "Product added to Wishlist successfully!" :
                "تمت إضافة المنتج إلى قائمة الأمنيات بنجاح!";
            toast.success(successMessage);
            setActiveWishlistProducts(prevProducts => [...prevProducts, ProductId]);
        } else if (response.status === 401) {
            localStorage.removeItem("loginToken");
            localStorage.removeItem("UserID");
            toast.error(
                language === "en" ?
                "Please Login to access your wishlist !" :
                "الرجاء تسجيل الدخول للوصول إلى قائمة الرغبات الخاصة بك!"
            );
            setTimeout(() => {
                navigate("/login")
            }, 3000);
        } else if (response.status === 400) {
            toast.success(language === "en" ? "Product already in Wishlist!" : "المنتج موجود بالفعل في قائمة الأمنيات!");
            setActiveWishlistProducts(prevProducts => [...prevProducts, ProductId]);
        } else {
            setActiveWishlistProducts(prevProducts => prevProducts.filter(id => id !== ProductId));
        }
    
        // const data = await response.json();
        // console.log("Added to Wishlist:", data);
        setIsWishlist(true);
    } catch (error) {
        console.error("Error adding to Wishlist:", error);
    }
    
    
    
};

export default handleAddToWishlist;
