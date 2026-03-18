import React, { useState, useEffect } from "react";
import axiosInstance from "../axiosInstance";
import { useParams, Link } from "react-router-dom";
import { getAuthPayload } from "../serviceurls";
const SubCategory = () => {
  const { categoryId, subCategoryID } = useParams();

  const [mainSubCategories, setMainSubCategories] = useState([]);
  const [selectedSubcategoryIds, setSelectedSubcategoryIds] = useState([]);
  const [mainProducts, setMainProducts] = useState([]);
  const [token, setToken] = useState("");
  const [isMounted, setIsMounted] = useState(true);

  useEffect(() => {
    // console.log("categoryId:", categoryId);
    // console.log("subCategoryID:", subCategoryID);
    const fetchToken = async () => {
      try {
        const response = await axiosInstance.post(
          "/OwinToken",
          getAuthPayload(USERNAME, PASSWORD),
          {
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
            },
          }
        );

        if (isMounted) {
          const newToken = response.data.access_token;
          setToken(newToken);
          // console.log("Token successfully created:", newToken);
        }
      } catch (error) {
        console.error("Error fetching token:", error);
      }
    };

    fetchToken();

    return () => {
      setIsMounted(false);
    };
  }, [categoryId, subCategoryID]);

  useEffect(() => {
    const fetchMainSubCategories = async () => {
      try {
        if (token && categoryId) {
          const response = await axiosInstance.get(
            "/Ghadeer/getSubCategories",
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          if (isMounted) {
            const filteredSubcategories = response.data.filter(
              (subCategory) => subCategory.categoryID === parseInt(categoryId)
            );

            setMainSubCategories(filteredSubcategories);
            // console.log("Subcategories data:", filteredSubcategories);
          }
        }
      } catch (error) {
        console.error("Error fetching subcategories:", error);
      }
    };

    fetchMainSubCategories();

    return () => {
      setIsMounted(false);
    };
  }, [token, categoryId]);

  const handleProductSelection = (subCategoryId) => {
    if (selectedSubcategoryIds.includes(subCategoryId)) {
      setSelectedSubcategoryIds(
        selectedSubcategoryIds.filter((id) => id !== subCategoryId)
      );
    } else {
      setSelectedSubcategoryIds([...selectedSubcategoryIds, subCategoryId]);
    }
  };

  useEffect(() => {
    const fetchMainProducts = async () => {
      try {
        if (token && categoryId && subCategoryID) {
          const response = await axiosInstance.get("/Ghadeer/getMainProducts", {
            params: {
              categoryId,
              subCategoryID,
            },
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (isMounted) {
            setMainProducts(response.data);
            // console.log("Products data:", response.data);
          }
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchMainProducts();

    return () => {
      setIsMounted(false);
    };
  }, [token, categoryId, subCategoryID]);

  return (
    <div>
      <div>
        <div className="col-md-4 col-xl-2">
          <div className="filterBx">
            <div className="categoeryTitle">
              {language === "en"
                ? "SubCategory"
                : "تصنيف فرعي"}
            </div>
            <ul>
              {mainSubCategories.map((subCategory) => (
                <li key={subCategory.subCategoryID} className="list-block-item">
                  <input
                    type="checkbox"
                    id={`productCheckbox_${subCategory.subCategoryID}`}
                    checked={selectedSubcategoryIds.includes(
                      subCategory.subCategoryID
                    )}
                    onChange={() =>
                      handleProductSelection(subCategory.subCategoryID)
                    }
                  />
                  <Link
                    to={`/Product/${categoryId}/${subCategory.subCategoryID}`}
                    className="categoeryLink"
                  >
                    {subCategory.subCategoryNameE}
                  </Link>
                  {" - "}
                  {subCategory.subCategoryNameA}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div>
          <div>
            <div>
              <h2>Product 1</h2>
              <ul>
                {mainProducts.map((product) => (
                  <li key={product.productID}>{product.productNameA}</li>
                ))}
              </ul>
            </div>
          </div>

          <div>
            <div>
              <h2>Product 2</h2>
              <ul>
                {selectedSubcategoryIds.map((subCategoryId) => (
                  <li key={subCategoryId}>
                    Category ID: {categoryId}, Subcategory ID: {subCategoryId}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubCategory;
