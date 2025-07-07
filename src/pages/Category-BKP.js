import React from 'react';

const CategoryComponent = ({
  language,
  allCategory,
  selectedCategoryId,
  handleCategoryChange,
  mainSubCategories,
  selectedSubCategoryIds,
  handleSubCategoryChange,
}) => {
  return (
    <div>
      <div className="categoeryTitle">
        {language === "en" ? "Categories" : "فئات"}
      </div>

      <div className="accordion filter-accordion" id="accordionExample">
        <div>
          {allCategory.map((category) => (
            <div className="accordion-item" key={category.CategoryId}>
              <h2
                className="accordion-header"
                id={`heading_${category.CategoryId}`}
              >
                <button
                  className="accordion-button"
                  
                  type="button"
                  data-bs-toggle="collapse"
                  onClick={() => handleCategoryChange(category)}
                  data-bs-target={`#collapse_${category.CategoryId}`}
                  aria-expanded={selectedCategoryId === category.CategoryId}
                >
                  {language === "en"
                    ? category.CategoryNameE
                    : category.CategoryNameA}
                </button>
              </h2>
              {/* <div
                id={`collapse_${category.CategoryId}`}
                className={`accordion-collapse collapse ${
                  selectedCategoryId === category.CategoryId ? "show" : ""
                }`}
                aria-labelledby={`heading_${category.CategoryId}`}
                data-bs-parent="#accordionExample"
              >
                <div className="accordion-body">
                  <ul className="list-inline mb-0">
                    {mainSubCategories
                      .filter(
                        (subCategory) =>
                          subCategory.CategoryId === category.CategoryId
                      )
                      .map((subCategory) => (
                        <li
                          className="list-block-item"
                          key={subCategory.SubCategoryId}
                        >
                          <div className="categoeryLink">
                            <input
                              type="checkbox"
                              id={`productCheckbox_${subCategory.SubCategoryId}`}
                              checked={selectedSubCategoryIds.includes(
                                subCategory.SubCategoryId
                              )}
                              onChange={() =>
                                handleSubCategoryChange(
                                  subCategory.SubCategoryId
                                )
                              }
                            />
                            <label
                              htmlFor={`productCheckbox_${subCategory.SubCategoryId}`}
                            >
                              {language === "en"
                                ? subCategory.SubCategoryNameE
                                : subCategory.SubCategoryNameA}
                            </label>
                          </div>
                        </li>
                      ))}
                  </ul>
                </div>
              </div> */}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategoryComponent;
