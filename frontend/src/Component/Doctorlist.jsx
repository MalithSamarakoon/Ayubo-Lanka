import React from "react";
// Import the exported doctors array from your assets file
import { doctors } from "../assets/frontend_assets/assets"

const Doctorlist = () => {
  return (
    <div className="flex flex-col items-center gap-4 my-16 text-gray-900 md:mx-10">
      <h1 className="text-3xl font-medium">Top Doctors to Book</h1>
      <p className="sm:w-1/3 text-center text-sm">
        Simply browse through our extensive list of trusted doctors.
      </p>

      {/* This div will contain the grid of doctors */}
      <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 pt-5 px-3 sm:px-0">
        {doctors.slice(0, 10).map((item) => {
          // FIX 1: You must 'return' the JSX from the map function
          return (
            // FIX 2: Each item in a list needs a unique 'key' prop
            <div
              key={item._id}
              className="border border-gray-200 rounded-lg shadow-sm overflow-hidden transform transition-transform duration-300 hover:scale-105"
            >
              <img
                className="bg-blue-50 w-full h-48 object-cover"
                src={item.image}
                alt={item.name} // Good practice to add alt text for accessibility
              />
              <div className="p-4">
                <div className="flex items-center gap-2 text-sm mb-2">
                  {item.available ? (
                    <>
                      <p className="w-2 h-2 bg-green-500 rounded-full"></p>
                      <p className="text-green-500 font-semibold">Available</p>
                    </>
                  ) : (
                    <>
                      <p className="w-2 h-2 bg-red-500 rounded-full"></p>
                      <p className="text-red-500 font-semibold">
                        Not Available
                      </p>
                    </>
                  )}
                </div>
                <p className="text-gray-900 text-lg font-medium">{item.name}</p>
                <p className="text-gray-600 text-sm">{item.speciality}</p>
              </div>
            </div>
          );
        })}
      </div>

      <button className="mt-8 bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors">
        Show More
      </button>
    </div>
  );
};

export default Doctorlist;
