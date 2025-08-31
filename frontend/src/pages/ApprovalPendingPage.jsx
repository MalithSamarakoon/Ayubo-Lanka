import React from "react";
import { Clock } from "lucide-react";
import { Link } from "react-router-dom"; // Import Link for navigation

const ApprovalPendingPage = () => {
  return (
    <div className="max-w-md w-full bg-black/10 backdrop-blur-xl rounded-2xl shadow-2xl overflow-hidden border border-white/20">
      <div className="bg-white/20 backdrop-blur-xl border border-white/30 p-8 rounded-2xl shadow-2xl text-center max-w-md">
        <Clock className="w-12 h-12 mx-auto text-green-400 mb-4 drop-shadow-lg" />
        <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-500 to-emerald-500 mb-2">
          Approval Pending
        </h1>
        <p className="text-gray-700">
          Your account is under review by the admin.  
          You’ll be notified once it gets approved.
        </p>
        
        {/* Back to Login Button */}
        <Link to="/login">
          <button className="mt-5 w-full py-3 px-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-lg shadow-2xl hover:from-green-600 hover:to-emerald-700 transition duration-200">
            Back to Login
          </button>
        </Link>
      </div>
    </div>
  );
};

export default ApprovalPendingPage;

