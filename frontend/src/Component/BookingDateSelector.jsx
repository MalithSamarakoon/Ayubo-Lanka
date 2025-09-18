import { Calendar } from "lucide-react";

// BookingDateSelector.jsx
const BookingDateSelector = ({ bookingSlots, selectedDay, setSelectedDay }) => (
  <div className="mb-8">
    <h3 className="text-sm font-semibold text-gray-700 mb-4">Booking slots</h3>

    {/* horizontal scroll on small screens, even spacing on large */}
    <div className="flex gap-3 overflow-x-auto pb-1">
      {bookingSlots.map((slot) => {
        const isSelected = selectedDay === slot.day;

        return (
          <button
            key={slot.day}
            onClick={() => setSelectedDay(slot.day)}
            aria-pressed={isSelected}
            className={`shrink-0 w-16 h-20 sm:w-20 sm:h-24 rounded-[28px] border transition-colors duration-150
              ${
                isSelected
                  ? "bg-emerald-500 text-white border-emerald-500 shadow"
                  : "bg-white text-gray-700 border-gray-300 hover:border-gray-400"
              }`}
          >
            <span
              className={`block text-xs font-semibold tracking-wide ${
                isSelected ? "text-white/90" : "text-gray-600"
              }`}
            >
              {slot.label}
            </span>
            <span
              className={`block mt-1 text-base sm:text-lg font-semibold ${
                isSelected ? "text-white" : "text-gray-700"
              }`}
            >
              {slot.date}
            </span>
          </button>
        );
      })}
    </div>
  </div>
);

export default BookingDateSelector;
