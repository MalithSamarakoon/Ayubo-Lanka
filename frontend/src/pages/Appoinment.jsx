import React, { useContext, useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { AppContext } from "../Context/AppContext"; // Adjust path!
import { assets } from "../assets/frontend_assets/assets"; // Adjust path!

const Appointment = () => {
  const { docId } = useParams();
  const { doctors } = useContext(AppContext);

  const [docInfo, setDocInfo] = useState(null);

  useEffect(() => {
    if (doctors && docId) {
      const doc = doctors.find((d) => d._id === docId);
      setDocInfo(doc);
    }
  }, [doctors, docId]);

  if (!docInfo) return <div>Loading...</div>;

  return (
    <div>
      <img src={docInfo.image} alt={docInfo.name} />
      <h2>{docInfo.name}</h2>
      <p>
        {docInfo.degree} - {docInfo.speciality}
      </p>
      <p>{docInfo.about}</p>
      <p>Experience: {docInfo.experience}</p>
      <p>
        Address: {docInfo.address?.line1}, {docInfo.address?.line2}
      </p>
      <p>Fees: {docInfo.fees}</p>
      <span
        style={{
          background: docInfo.available ? "#D1FAE5" : "#FEE2E2",
          color: docInfo.available ? "#065F46" : "#991B1B",
          padding: "0.5em 1em",
          borderRadius: "999px",
          fontWeight: "500",
        }}
      >
        {docInfo.available ? "Available" : "Not Available"}
      </span>
    </div>
  );
};

export default Appointment;
