const BookingSummary = ({
  docInfo,
  bookingSlots,
  selectedDay,
  selectedTime,
}) => {
  const selectedSlot = bookingSlots.find((s) => s.day === selectedDay);

  if (!selectedDay || !selectedTime) return null;

  return (
    <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-xl p-6 mb-8 shadow-sm">
      <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
        <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
        Booking Summary
      </h3>
      <div className="space-y-3 text-gray-700">
        <div className="flex justify-between items-center py-2">
          <span className="text-green-700 font-medium">Doctor:</span>
          <span className="font-semibold text-gray-800">
            Dr. {docInfo.name}
          </span>
        </div>
        <div className="flex justify-between items-center py-2">
          <span className="text-green-700 font-medium">Date:</span>
          <span className="font-semibold text-gray-800">
            {selectedSlot?.fullDate}
          </span>
        </div>
        <div className="flex justify-between items-center py-2">
          <span className="text-green-700 font-medium">Time:</span>
          <span className="font-semibold text-gray-800">{selectedTime}</span>
        </div>
        <div className="flex justify-between items-center pt-3 border-t-2 border-gradient-to-r from-green-200 to-emerald-200">
          <span className="font-bold text-emerald-700">Consultation Fee:</span>
          <span className="font-bold text-lg bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
            Rs. {docInfo.fees}.00
          </span>
        </div>
      </div>
    </div>
  );
};

export default BookingSummary;
