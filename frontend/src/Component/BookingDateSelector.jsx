import { Calendar } from "lucide-react";

const BookingDateSelector = ({ bookingSlots, selectedDay, setSelectedDay }) => (
  <div className="mb-8">
    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
      <Calendar className="w-5 h-5 text-emerald-600" />
      Select Date
    </h3>
    <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
      {bookingSlots.map((slot) => (
        <button
          key={slot.day}
          onClick={() => setSelectedDay(slot.day)}
          className={`group relative p-4 rounded-xl border-2 transition-all duration-200 ${
            selectedDay === slot.day
              ? "bg-gradient-to-br from-green-500 to-emerald-600 text-white border-green-500 shadow-lg transform scale-105"
              : "bg-white text-gray-700 border-green-200 hover:border-emerald-400 hover:shadow-md hover:bg-green-50"
          }`}
        >
          <div className="text-center">
            <div
              className={`text-sm font-medium ${
                selectedDay === slot.day ? "text-green-100" : "text-emerald-600"
              }`}
            >
              {slot.label}
            </div>
            <div
              className={`text-xl font-bold mt-1 ${
                selectedDay === slot.day ? "text-white" : "text-gray-800"
              }`}
            >
              {slot.date}
            </div>
            <div
              className={`text-xs ${
                selectedDay === slot.day ? "text-green-100" : "text-green-600"
              }`}
            >
              {slot.fullDate}
            </div>
          </div>
          {selectedDay === slot.day && (
            <div className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full border-2 border-white flex items-center justify-center shadow-md">
              <svg
                className="w-3 h-3 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
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

export default BookingDateSelector;
