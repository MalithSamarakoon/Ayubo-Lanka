// src/components/FilterSidebar.jsx
import React from "react";

const FilterSidebar = ({
  searchQuery,
  setSearchQuery,
  activeSpec,
  handleFilterClick,
  specialityList,
  showAvailableOnly,
  setShowAvailableOnly,
  selectedRating,
  setSelectedRating,
  clearAllFilters,
  resultsCount,
}) => {
  return (
    <div className="lg:w-80 flex-shrink-0">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 sticky top-6">
        {/* Search */}
        <div className="p-6 border-b border-gray-200">
          <div className="relative">
            {/* Search Icon */}
            <input
              type="text"
              placeholder="Search doctors, specialties..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm"
            />
          </div>
        </div>

        {/* Filter Header */}
        <div className="px-6 py-4 border-b border-green-400 bg-emerald-500">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white flex items-center">
              Filters
            </h2>
            <button
              onClick={clearAllFilters}
              className="text-xs text-green-100 hover:text-white underline"
            >
              Clear All
            </button>
          </div>
        </div>

        {/* Filter Controls */}
        <div className="p-6 space-y-6">
          <div>
            <h3 className="font-medium text-gray-900 mb-3">
              Medical Specialties
            </h3>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {specialityList.map((spec) => (
                <button
                  key={spec}
                  onClick={() => handleFilterClick(spec)}
                  className={`w-full text-left px-3 py-2 rounded-lg border text-sm ${
                    activeSpec === spec
                      ? "bg-blue-50 border-green-200 text-green-700 font-medium"
                      : "border-gray-200 text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  {spec === "All" ? "All Departments" : spec}
                </button>
              ))}
            </div>
          </div>
          
          
        </div>

        {/* Stats Footer */}
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 rounded-b-xl">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Showing Results:</span>
            <span className="font-semibold text-blue-600 bg-green-100 px-2 py-1 rounded-full">
              {resultsCount}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterSidebar;
