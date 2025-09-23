
import { Clock } from "lucide-react";

const BookingTimeSelector = ({ timeSlots, selectedTime, setSelectedTime }) => (
  <div className="mb-8">
    <h3 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
      <Clock className="w-5 h-5 text-gray-600" />
      Select time
    </h3>

    <div className="flex flex-wrap gap-3">
      {timeSlots.map((time) => {
        const isSelected = selectedTime === time;

        return (
          <button
            key={time}
            type="button"
            onClick={() => setSelectedTime(time)}
            aria-pressed={isSelected}
            className={`px-4 sm:px-5 py-2 sm:py-2.5 rounded-full border text-sm font-medium transition-colors
              ${
                isSelected
                  ? "bg-emerald-500 text-white border-emerald-500 shadow"
                  : "bg-white text-gray-600 border-gray-300 hover:border-gray-400"
              }`}
          >
            {time}
          </button>
        );
      })}
    </div>
  </div>
);

export default BookingTimeSelector;
