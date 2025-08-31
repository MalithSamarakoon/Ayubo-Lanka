import React, { useState, useMemo } from "react";
import Doctorlist from "../Component/Doctorlist";
import { doctors } from "../assets/frontend_assets/assets";

const Doctor = () => {
  const [filterDoc, setFilterDoc] = useState(doctors);
  const [activeSpec, setActiveSpec] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [viewMode, setViewMode] = useState("grid");
  const [showAvailableOnly, setShowAvailableOnly] = useState(false);
  const [selectedRating, setSelectedRating] = useState("all");
  const [priceRange, setPriceRange] = useState("all");

  const specialityList = [
    "All",
    "Ayurveda Massage Therapist",
    "Ayurvedic Detox Specialist",
    "Ayurveda Yoga Consultant",
    "Ayurveda Panchakarma Specialist",
    "Ayurvedic Pulse Diagnostician",
    "Sri Lankan Herbal Medicine Expert",
    "Ayurveda Herbalist",
    "Ayurvedic Physician",
  ];

  const sortOptions = [
    { value: "name", label: "Name (A-Z)" },
    { value: "experience", label: "Experience" },
    { value: "rating", label: "Rating" },
    { value: "price", label: "Price (Low to High)" },
    { value: "availability", label: "Availability" },
  ];

  // Enhanced filtering and sorting logic
  const processedDoctors = useMemo(() => {
    let filtered = doctors;

    // Filter by specialty
    if (activeSpec !== "All") {
      filtered = filtered.filter(
        (doc) => doc.speciality.toLowerCase() === activeSpec.toLowerCase()
      );
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(
        (doc) =>
          doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          doc.speciality.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (doc.location &&
            doc.location.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Filter by availability
    if (showAvailableOnly) {
      filtered = filtered.filter((doc) => doc.available !== false);
    }

    // Filter by rating
    if (selectedRating !== "all") {
      const minRating = parseFloat(selectedRating);
      filtered = filtered.filter((doc) => (doc.rating || 4) >= minRating);
    }

    // Filter by price range
    if (priceRange !== "all") {
      filtered = filtered.filter((doc) => {
        const price = doc.fees || 50;
        switch (priceRange) {
          case "low":
            return price < 30;
          case "medium":
            return price >= 30 && price <= 60;
          case "high":
            return price > 60;
          default:
            return true;
        }
      });
    }

    // Sort results
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name);
        case "experience":
          return (b.experience || 5) - (a.experience || 5);
        case "rating":
          return (b.rating || 4) - (a.rating || 4);
        case "price":
          return (a.fees || 50) - (b.fees || 50);
        case "availability":
          return (
            (b.available === true ? 1 : 0) - (a.available === true ? 1 : 0)
          );
        default:
          return 0;
      }
    });

    return filtered;
  }, [
    activeSpec,
    searchQuery,
    sortBy,
    showAvailableOnly,
    selectedRating,
    priceRange,
  ]);

  const handleFilterClick = (spec) => {
    setActiveSpec(spec);
  };

  const clearAllFilters = () => {
    setActiveSpec("All");
    setSearchQuery("");
    setShowAvailableOnly(false);
    setSelectedRating("all");
    setPriceRange("all");
    setSortBy("name");
  };

  // Get statistics for dashboard
  const stats = useMemo(() => {
    const available = processedDoctors.filter(
      (doc) => doc.available !== false
    ).length;
    const avgRating =
      processedDoctors.reduce((sum, doc) => sum + (doc.rating || 4), 0) /
      processedDoctors.length;
    const specialties = new Set(processedDoctors.map((doc) => doc.speciality))
      .size;

    return {
      total: processedDoctors.length,
      available,
      avgRating: avgRating.toFixed(1),
      specialties,
    };
  }, [processedDoctors]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Enhanced Hospital Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg flex items-center justify-center shadow-md">
                <svg
                  className="w-7 h-7 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Medical Staff Directory
                </h1>
                <p className="text-gray-600">
                  Hospital Management System - Find Your Specialist
                </p>
              </div>
            </div>

            {/* Quick Stats Dashboard */}
            <div className="hidden md:flex items-center space-x-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {stats.total}
                </div>
                <div className="text-xs text-gray-500">Total Doctors</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {stats.available}
                </div>
                <div className="text-xs text-gray-500">Available</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-600">
                  {stats.avgRating}★
                </div>
                <div className="text-xs text-gray-500">Avg Rating</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {stats.specialties}
                </div>
                <div className="text-xs text-gray-500">Specialties</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Enhanced Sidebar */}
          <div className="lg:w-80 flex-shrink-0">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 sticky top-6">
              {/* Search Section */}
              <div className="p-6 border-b border-gray-200">
                <div className="relative">
                  <svg
                    className="absolute left-3 top-3 w-4 h-4 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                  <input
                    type="text"
                    placeholder="Search doctors, specialties..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  />
                </div>
              </div>

              {/* Filter Header */}
              <div className="px-6 py-4 border-b border-gray-200 bg-blue-600">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-white flex items-center">
                    <svg
                      className="w-5 h-5 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.207A1 1 0 013 6.5V4z"
                      />
                    </svg>
                    Filters
                  </h2>
                  <button
                    onClick={clearAllFilters}
                    className="text-xs text-blue-100 hover:text-white underline"
                  >
                    Clear All
                  </button>
                </div>
              </div>

              {/* Filter Options */}
              <div className="p-6 space-y-6">
                {/* Specialty Filter */}
                <div>
                  <h3 className="font-medium text-gray-900 mb-3">
                    Medical Specialties
                  </h3>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {specialityList.map((spec) => (
                      <button
                        key={spec}
                        onClick={() => handleFilterClick(spec)}
                        className={`w-full text-left px-3 py-2 rounded-lg transition-all duration-200 border text-sm ${
                          activeSpec === spec
                            ? "bg-blue-50 border-blue-200 text-blue-700 font-medium"
                            : "border-gray-200 text-gray-700 hover:bg-gray-50"
                        }`}
                      >
                        {spec === "All" ? "All Departments" : spec}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Availability Filter */}
                <div>
                  <h3 className="font-medium text-gray-900 mb-3">
                    Availability
                  </h3>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={showAvailableOnly}
                      onChange={(e) => setShowAvailableOnly(e.target.checked)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">
                      Available today only
                    </span>
                  </label>
                </div>

                {/* Rating Filter */}
                <div>
                  <h3 className="font-medium text-gray-900 mb-3">
                    Minimum Rating
                  </h3>
                  <select
                    value={selectedRating}
                    onChange={(e) => setSelectedRating(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                  >
                    <option value="all">All Ratings</option>
                    <option value="4.5">4.5+ Stars</option>
                    <option value="4.0">4.0+ Stars</option>
                    <option value="3.5">3.5+ Stars</option>
                    <option value="3.0">3.0+ Stars</option>
                  </select>
                </div>

                {/* Price Range Filter */}
                <div>
                  <h3 className="font-medium text-gray-900 mb-3">
                    Price Range
                  </h3>
                  <select
                    value={priceRange}
                    onChange={(e) => setPriceRange(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                  >
                    <option value="all">All Prices</option>
                    <option value="low">Under $30</option>
                    <option value="medium">$30 - $60</option>
                    <option value="high">Above $60</option>
                  </select>
                </div>
              </div>

              {/* Stats Section */}
              <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 rounded-b-xl">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Showing Results:</span>
                  <span className="font-semibold text-blue-600 bg-blue-100 px-2 py-1 rounded-full">
                    {processedDoctors.length}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Main Content */}
          <div className="flex-1">
            {/* Enhanced Results Header */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6">
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {activeSpec === "All"
                        ? "All Medical Professionals"
                        : activeSpec}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      {processedDoctors.length} doctor
                      {processedDoctors.length !== 1 ? "s" : ""} found
                      {searchQuery && ` for "${searchQuery}"`}
                    </p>
                  </div>

                  {/* View Controls */}
                  <div className="flex items-center space-x-4">
                    {/* Sort Dropdown */}
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                    >
                      {sortOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          Sort by {option.label}
                        </option>
                      ))}
                    </select>

                    {/* View Mode Toggle */}
                    <div className="flex items-center bg-gray-100 rounded-lg p-1">
                      <button
                        onClick={() => setViewMode("grid")}
                        className={`p-2 rounded-md transition-colors ${
                          viewMode === "grid"
                            ? "bg-white text-blue-600 shadow-sm"
                            : "text-gray-500 hover:text-gray-700"
                        }`}
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                          />
                        </svg>
                      </button>
                      <button
                        onClick={() => setViewMode("list")}
                        className={`p-2 rounded-md transition-colors ${
                          viewMode === "list"
                            ? "bg-white text-blue-600 shadow-sm"
                            : "text-gray-500 hover:text-gray-700"
                        }`}
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 6h16M4 10h16M4 14h16M4 18h16"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Active Filters Display */}
              {(searchQuery ||
                activeSpec !== "All" ||
                showAvailableOnly ||
                selectedRating !== "all" ||
                priceRange !== "all") && (
                <div className="px-6 py-3 bg-blue-50 border-b border-gray-200">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-sm text-blue-700 font-medium">
                      Active filters:
                    </span>

                    {searchQuery && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        Search: "{searchQuery}"
                        <button
                          onClick={() => setSearchQuery("")}
                          className="ml-1 hover:text-blue-600"
                        >
                          ×
                        </button>
                      </span>
                    )}

                    {activeSpec !== "All" && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {activeSpec}
                        <button
                          onClick={() => setActiveSpec("All")}
                          className="ml-1 hover:text-blue-600"
                        >
                          ×
                        </button>
                      </span>
                    )}

                    {showAvailableOnly && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Available Today
                        <button
                          onClick={() => setShowAvailableOnly(false)}
                          className="ml-1 hover:text-green-600"
                        >
                          ×
                        </button>
                      </span>
                    )}

                    {selectedRating !== "all" && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                        {selectedRating}+ Stars
                        <button
                          onClick={() => setSelectedRating("all")}
                          className="ml-1 hover:text-yellow-600"
                        >
                          ×
                        </button>
                      </span>
                    )}

                    {priceRange !== "all" && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                        {priceRange === "low"
                          ? "Under $30"
                          : priceRange === "medium"
                          ? "$30-$60"
                          : "Above $60"}
                        <button
                          onClick={() => setPriceRange("all")}
                          className="ml-1 hover:text-purple-600"
                        >
                          ×
                        </button>
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* Quick Info */}
              <div className="px-6 py-3 bg-gray-50">
                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse mr-2"></div>
                    Online Booking Available
                  </div>
                  <div className="flex items-center">
                    <svg
                      className="w-4 h-4 mr-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.031 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                      />
                    </svg>
                    Verified Professionals
                  </div>
                  <div className="flex items-center">
                    <svg
                      className="w-4 h-4 mr-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    Same Day Appointments
                  </div>
                </div>
              </div>
            </div>

            {/* Doctor Grid/List */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="p-6">
                {processedDoctors.length > 0 ? (
                  <Doctorlist doctors={processedDoctors} viewMode={viewMode} />
                ) : (
                  <div className="text-center py-12">
                    <svg
                      className="mx-auto h-12 w-12 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.291-1.007-5.824-2.709"
                      />
                    </svg>
                    <h3 className="mt-2 text-sm font-medium text-gray-900">
                      No doctors found
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Try adjusting your search criteria or clearing some
                      filters.
                    </p>
                    <div className="mt-6">
                      <button
                        onClick={clearAllFilters}
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
                      >
                        Clear all filters
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Doctor;
