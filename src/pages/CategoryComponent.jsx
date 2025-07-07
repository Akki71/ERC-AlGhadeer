import React, { useEffect } from 'react';

const CategoryComponent = ({
  language,
  allCategory,
  selectedCategoryId,
  handleCategoryChange,
  mainSubCategories,
  selectedSubCategoryIds,
  handleSubCategoryChange,
}) => {

  // Re-run handleCategoryChange when language changes to update selected category's language-specific details
  useEffect(() => {
    const selectedCategory = allCategory.find(category => category.CategoryId === selectedCategoryId);
    if (selectedCategory) {
      // Update title and description to reflect the new language without toggling selection
      handleCategoryChange(selectedCategory, false); // Passing false to prevent deselecting
    }
  }, [language, selectedCategoryId]); // Only re-run when language or selectedCategoryId changes

  return (
    <div>
      <div className="categoeryTitle">
        {language === "en" ? "Categories" : "فئات"}
      </div>

      <div id="accordionExample">
        <div>
          {allCategory.map((category) => (
            <div className="accordion-item" key={category.CategoryId}>
              <div id={`heading_${category.CategoryId}`}>
                <button
                  className={`categoeryLink btn d-block ${selectedCategoryId === category.CategoryId ? 'active' : ''}`}
                  type="button"
                  data-bs-toggle="collapse"
                  onClick={() => handleCategoryChange(category, true)} 
                  aria-expanded={selectedCategoryId === category.CategoryId}
                >
                  {language === "en"
                    ? category.CategoryNameE
                    : category.CategoryNameA}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategoryComponent;
