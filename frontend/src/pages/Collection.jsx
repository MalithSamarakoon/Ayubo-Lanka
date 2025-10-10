import React, { useEffect, useState, useMemo } from 'react'
import { useProductStore } from '../stores/useProductStore'
import Title from '../Component/Title';
import ProductItems from '../Component/ProductItems';
import ProductFilterSidebar from '../components/ProductFilterSidebar';

// Categories from CreateProductForm
const categories = ["Kasthausadhi", "Rasaushadhi", "Jangama", "Kwatha", "Kalka"];

// Price ranges for filtering
const priceRanges = [
  { id: 1, label: "Rs 1000 or below", min: 0, max: 1000 },
  { id: 2, label: "Rs 1000 - 2000", min: 1000, max: 2000 },
  { id: 3, label: "Rs 2000 - 3000", min: 2000, max: 3000 },
  { id: 4, label: "Rs 3000 - 4000", min: 3000, max: 4000 },
  { id: 5, label: "Rs 4000 - 5000", min: 4000, max: 5000 },
];

const Collection = () => {
  const { products, loading, fetchAllProducts } = useProductStore();
  
  // Filter states
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedPriceRanges, setSelectedPriceRanges] = useState([]);

  useEffect(() => {
    fetchAllProducts();
  }, [fetchAllProducts]);

  // Handle category filter change
  const handleCategoryChange = (category) => {
    setSelectedCategories(prev => {
      if (prev.includes(category)) {
        return prev.filter(c => c !== category);
      } else {
        return [...prev, category];
      }
    });
  };

  // Handle price range filter change
  const handlePriceRangeChange = (range) => {
    setSelectedPriceRanges(prev => {
      const exists = prev.find(r => r.id === range.id);
      if (exists) {
        return prev.filter(r => r.id !== range.id);
      } else {
        return [...prev, range];
      }
    });
  };

  // Clear all filters
  const clearAllFilters = () => {
    setSelectedCategories([]);
    setSelectedPriceRanges([]);
  };

  // Get filtered products based on selected filters
  const getFilteredProducts = useMemo(() => {
    let filtered = [...products];

    // Filter by category
    if (selectedCategories.length > 0) {
      filtered = filtered.filter(product => 
        selectedCategories.includes(product.category)
      );
    }

    // Filter by price range
    if (selectedPriceRanges.length > 0) {
      filtered = filtered.filter(product => {
        const productPrice = Number(product.price);
        return selectedPriceRanges.some(range => 
          productPrice >= range.min && productPrice <= range.max
        );
      });
    }

    return filtered;
  }, [products, selectedCategories, selectedPriceRanges]);


  if (loading) {
    return (
      <div className="my-10 px-4 sm:px-6 lg:px-8">
        <div className="text-center py-8 text-3xl">
          <Title text1={"ALL"} text2={"PRODUCTS"} />
          <p className="w-3/4 m-auto text-xs sm:text-sm md:text-base text-gray-600 mt-4">
            Browse our complete collection of authentic Ceylonese Ayurvedic medicines and herbal products.
          </p>
        </div>
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="my-10 px-4 sm:px-6 lg:px-8">
      {/* Title Section */}
      <div className="text-center py-8 text-3xl">
        <Title text1={"ALL"} text2={"PRODUCTS"} />
        <p className="w-3/4 m-auto text-xs sm:text-sm md:text-base text-gray-600 mt-4">
          Browse our complete collection of authentic Ceylonese Ayurvedic medicines and herbal products.
        </p>
      </div>

      {/* Main Content: Sidebar + Products Grid */}
      <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
        {/* Sidebar */}
        <aside className="w-full lg:w-auto">
          <ProductFilterSidebar
            categories={categories}
            priceRanges={priceRanges}
            selectedCategories={selectedCategories}
            selectedPriceRanges={selectedPriceRanges}
            onCategoryChange={handleCategoryChange}
            onPriceRangeChange={handlePriceRangeChange}
            onClearFilters={clearAllFilters}
          />
        </aside>

        {/* Products Section */}
        <main className="flex-1">
          {getFilteredProducts.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-500 text-lg">No products available</p>
              {(selectedCategories.length > 0 || selectedPriceRanges.length > 0) && (
                <p className="text-gray-400 text-sm mt-2">
                  Try adjusting your filters
                </p>
              )}
            </div>
          ) : (
            <>
              <div className="mb-6">
                <p className="text-sm text-gray-600">
                  Showing {getFilteredProducts.length} product{getFilteredProducts.length !== 1 ? 's' : ''}
                </p>
              </div>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-4 gap-y-6">
                {getFilteredProducts.map((item) => (
                  <ProductItems
                    key={item._id}
                    id={item._id}
                    image={[item.image]}
                    name={item.name}
                    price={item.price}
                  />
                ))}
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default Collection;