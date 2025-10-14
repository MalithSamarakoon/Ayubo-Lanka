import React from 'react';
import { X } from 'lucide-react';

const ProductFilterSidebar = ({
  categories,
  priceRanges,
  selectedCategories,
  selectedPriceRanges,
  onCategoryChange,
  onPriceRangeChange,
  onClearFilters
}) => {
  const hasActiveFilters = selectedCategories.length > 0 || selectedPriceRanges.length > 0;

  return (
    <div className="w-full lg:w-64 bg-white p-6 rounded-lg shadow-sm border border-gray-200 h-fit sticky top-20">
      
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-800">Filters</h3>
        {hasActiveFilters && (
          <button
            onClick={onClearFilters}
            className="text-sm text-red-500 hover:text-red-700 flex items-center gap-1"
          >
            <X className="w-4 h-4" />
            Clear
          </button>
        )}
      </div>

      
      <div className="mb-8">
        <h4 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">
          Category
        </h4>
        <div className="space-y-2">
          {categories.map((category) => (
            <label
              key={category}
              className="flex items-center space-x-3 cursor-pointer group"
            >
              <input
                type="checkbox"
                checked={selectedCategories.includes(category)}
                onChange={() => onCategoryChange(category)}
                className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500 cursor-pointer"
              />
              <span className="text-sm text-gray-700 group-hover:text-green-600 transition-colors">
                {category}
              </span>
            </label>
          ))}
        </div>
      </div>

      
      <div className="border-t border-gray-200 mb-6"></div>

      
      <div>
        <h4 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">
          Price Range (Rs)
        </h4>
        <div className="space-y-2">
          {priceRanges.map((range) => (
            <label
              key={range.id}
              className="flex items-center space-x-3 cursor-pointer group"
            >
              <input
                type="checkbox"
                checked={selectedPriceRanges.some(r => r.id === range.id)}
                onChange={() => onPriceRangeChange(range)}
                className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500 cursor-pointer"
              />
              <span className="text-sm text-gray-700 group-hover:text-green-600 transition-colors">
                {range.label}
              </span>
            </label>
          ))}
        </div>
      </div>

      
      {hasActiveFilters && (
        <div className="mt-6 pt-6 border-t border-gray-200">
          <p className="text-xs text-gray-600">
            {selectedCategories.length + selectedPriceRanges.length} filter(s) active
          </p>
        </div>
      )}
    </div>
  );
};

export default ProductFilterSidebar;
