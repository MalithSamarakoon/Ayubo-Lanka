import { Award, User, Calendar, Star } from "lucide-react";

/**
 * Optional props:
 *  - onBook?: () => void   -> show CTA if provided (e.g., scroll to booking section)
 */
const DoctorProfileCard = ({ docInfo, onBook }) => {
  return (
    <div className="bg-white rounded-3xl shadow-xl border border-green-100 mb-8 overflow-hidden transform hover:shadow-2xl transition-all duration-500">
      <div className="flex flex-col lg:flex-row">
        {/* Left Section - Doctor Image */}
        <div className="relative lg:w-80">
          <div className="absolute inset-0 bg-gradient-to-br from-green-400 to-emerald-500 "></div>
          <div className="relative p-8 flex flex-col items-center justify-center h-full min-h-[320px]">
            <div className="relative mb-6">
              <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg">
                <svg
                  className="w-10 h-10 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </div>

              <div className="absolute -bottom-3 -right-3 w-10 h-10 bg-gradient-to-r from-emerald-400 to-green-500 rounded-full border-4 border-white flex items-center justify-center shadow-lg">
                <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
              </div>
            </div>
            <div className="text-center text-white">
              <div className="w-20 h-1.5 bg-gradient-to-r from-white/40 to-emerald-200/60 rounded-full mx-auto mb-3"></div>
              <p className="text-sm font-medium opacity-95 bg-white/10 px-3 py-1 rounded-full">
                Available for Consultation
              </p>
              
            </div>
          </div>
        </div>

        {/* Right Section - Doctor Details */}
        <div className="flex-1 p-8 lg:p-10">
          <div className="flex flex-col h-full">
            <div className="flex-1">
              {/* Header Section */}
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between mb-6">
                <div className="mb-4 lg:mb-0">
                  <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-3 leading-tight">
                     {docInfo.name}
                  </h2>
                  <div className="flex items-center gap-2 text-emerald-700 font-semibold mb-2">
                    <Award className="w-5 h-5" />
                    <span className="text-lg">{docInfo.speciality}</span>
                  </div>
                  <div className="text-gray-600 font-medium">
                    {docInfo.degree}
                  </div>
                </div>
                <div className="bg-gradient-to-br from-emerald-50 to-green-100 border border-emerald-200 px-6 py-4 rounded-2xl text-center shadow-sm">
                  <p className="text-3xl font-bold bg-gradient-to-r from-emerald-500 to-green-400 bg-clip-text text-transparent">
                    Rs. {docInfo.fees}
                  </p>
                  <p className="text-sm text-emerald-700 font-medium mt-1">
                    Consultation Fee
                  </p>
                </div>
              </div>

              {/* Professional Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                <div className="flex items-center gap-3 text-gray-700 bg-green-50 p-3 rounded-xl">
                  <User className="w-5 h-5 text-emerald-600" />
                  <span className="font-medium">{docInfo.experience}</span>
                </div>
                <div className="flex items-center gap-3 text-gray-700 bg-emerald-50 p-3 rounded-xl">
                  <Calendar className="w-5 h-5 text-green-600" />
                  <span className="font-medium">Mon - Sat Available</span>
                </div>
              </div>

              {/* About Section */}
              <div className="bg-gradient-to-r from-gray-50 to-green-25 border border-gray-200 rounded-2xl p-6 mb-6">
                <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                  About  {docInfo.name}
                </h3>
                <p className="text-gray-700 leading-relaxed text-justify">
                  {docInfo.about}
                </p>
              </div>
            </div>

            {/* Footer Section - Reviews */}
            <div className="flex items-center justify-between pt-6 border-t-2 border-gradient-to-r from-green-200 to-emerald-200">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-5 h-5 text-yellow-400 fill-current"
                    />
                  ))}
                </div>
                <span className="text-gray-600 font-medium">
                  4.9 (127+ reviews)
                </span>
              </div>
              <div className="text-right">
                <p className="text-emerald-600 font-semibold text-sm">
                  Trusted Ayurveda Specialist
                </p>
                <p className="text-gray-500 text-xs">Verified Professional</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorProfileCard;
