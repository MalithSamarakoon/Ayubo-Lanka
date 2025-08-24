import { Clock } from "lucide-react";

const BookingTimeSelector = ({ timeSlots, selectedTime, setSelectedTime }) => (
  <div className="mb-8">
    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
      <Clock className="w-5 h-5 text-emerald-600" />
      Select Time
    </h3>
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3">
      {timeSlots.map((time) => (
        <button
          key={time}
          onClick={() => setSelectedTime(time)}
          className={`group relative px-4 py-3 rounded-xl border-2 transition-all duration-200 ${
            selectedTime === time
              ? "bg-gradient-to-br from-green-500 to-emerald-600 text-white border-green-500 shadow-lg transform scale-105"
              : "bg-white text-gray-700 border-green-200 hover:border-emerald-400 hover:shadow-md hover:bg-green-50"
          }`}
        >
          <div
            className={`text-center font-medium ${
              selectedTime === time ? "text-white" : "text-emerald-700"
            }`}
          >
            {time}
          </div>
          {selectedTime === time && (
            <div className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full border-2 border-white flex items-center justify-center shadow-md">
              <svg
                className="w-2 h-2 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="3"
                  d="M5 13l4 4L19 7"
                ></path>
              </svg>
            </div>
          )}
        </button>
      ))}
    </div>
  </div>
);

export default BookingTimeSelector;
