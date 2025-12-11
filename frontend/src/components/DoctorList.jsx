// src/components/DoctorList.jsx
import React from "react";
import DoctorCard from "./DoctorCard";

const LoadingSpinner = () => (
  <div className="text-center py-12">
    <div className="inline-flex items-center px-4 py-2 font-semibold text-sm text-gray-600">
      <svg
        className="animate-spin -ml-1 mr-3 h-5 w-5 text-gray-600"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        ></circle>
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        ></path>
      </svg>
      Loading doctors...
    </div>
  </div>
);

const NoResults = ({ onClearFilters }) => (
  <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-200">
    <h3 className="text-lg font-medium text-gray-900 mb-2">No doctors found</h3>
    <p className="text-gray-500 mb-4">
      Try adjusting your search criteria or filters.
    </p>
    <button
      onClick={onClearFilters}
      className="inline-flex items-center px-4 py-2 bg-emerald-500 text-white text-sm font-medium rounded-lg hover:bg-emerald-600"
    >
      Clear All Filters
    </button>
  </div>
);

const DoctorList = ({
  doctors,
  isLoading,
  sortBy,
  setSortBy,
  handleBook,
  handleDoctorDetails,
  clearAllFilters,
}) => {
  return (
    <div className="flex-1">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Our Medical Professionals
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                Showing {doctors.length} verified doctors
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 text-sm"
              >
                <option value="name">Sort by Name</option>
                <option value="specialization">Sort by Specialty</option>
                <option value="approved">Sort by Status</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {isLoading ? (
        <LoadingSpinner />
      ) : doctors.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {doctors.map((doctor) => (
            <DoctorCard
              key={doctor._id}
              doctor={doctor}
              onBook={handleBook}
              onViewDetails={handleDoctorDetails}
            />
          ))}
        </div>
      ) : (
        <NoResults onClearFilters={clearAllFilters} />
      )}
    </div>
  );
};

export default DoctorList;
