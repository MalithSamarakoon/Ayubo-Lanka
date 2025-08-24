import React from "react";
import { Clock } from "lucide-react";

const ApprovalPendingPage = () => {
  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="bg-gray-800 p-8 rounded-2xl shadow-xl text-center max-w-md">
        <Clock className="w-12 h-12 mx-auto text-yellow-400 mb-4" />
        <h1 className="text-2xl font-bold text-white mb-2">Approval Pending</h1>
        <p className="text-gray-400">
          Your account is under review by the admin.  
          You’ll be notified once it gets approved.
        </p>
      </div>
    </div>
  );
};

export default ApprovalPendingPage;

