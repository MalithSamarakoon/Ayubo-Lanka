import React from "react";
import { useNavigate } from "react-router-dom";

const Doctorlist = ({ doctors }) => {
  const navigate = useNavigate();

  const handleClick = (doctorId) => {
    navigate(`/Doctor/${doctorId}`);
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {doctors?.map((item) => (
        <div
          key={item._id}
          onClick={() => handleClick(item._id)}
          className="bg-white border border-gray-200 rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden cursor-pointer"
        >
          <img
            className="w-full h-48 object-cover"
            src={item.image}
            alt={item.name}
          />
          <div className="p-4 flex flex-col justify-between">
            <div className="mb-4">
              <h3 className="text-xl font-semibold text-gray-900 mb-1">
                {item.name}
              </h3>
              <p className="text-gray-600">{item.speciality}</p>
            </div>
            <span
              className={`text-sm font-medium px-3 py-1 rounded-full w-fit ${
                item.available
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {item.available ? "Available" : "Not Available"}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Doctorlist;
