import React, { useEffect, useState } from "react";
import axios from "axios";

const URL = "http://localhost:3000/api/patients";

const PatientDetails = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch all patients
  const fetchHandler = async () => {
    try {
      const response = await axios.get(URL);
      console.log("API Response:", response.data);

      if (response.data.patients) {
        setPatients(response.data.patients);
      } else {
        setPatients(response.data);
      }
    } catch (err) {
      console.error("Error fetching patients:", err);
      setError("Failed to fetch patients. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Delete patient by id
  const handleDelete = async (id) => {
    try {
      await axios.delete(`${URL}/${id}`);
      setPatients(patients.filter((p) => p.id !== id)); // Remove locally
    } catch (err) {
      console.error("Error deleting patient:", err);
      alert("Failed to delete patient.");
    }
  };

  // Update patient by id (simple example: increment age by 1)
  const handleUpdate = async (patient) => {
    try {
      const updatedData = { ...patient, age: patient.age + 1 }; // Example change
      const response = await axios.put(`${URL}/${patient.id}`, updatedData);

      // Update state locally
      setPatients(
        patients.map((p) => (p.id === patient.id ? response.data : p))
      );
    } catch (err) {
      console.error("Error updating patient:", err);
      alert("Failed to update patient.");
    }
  };

  // Run fetchHandler when component loads
  useEffect(() => {
    fetchHandler();
  }, []);

  return (
    <div>
      <h2>Patient Details</h2>

      {/* Loading state */}
      {loading && <p>Loading...</p>}

      {/* Error state */}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* Patients list */}
      {!loading &&
        !error &&
        (patients.length > 0 ? (
          <ul>
            {patients.map((patient) => (
              <li key={patient.id || patient._id}>
                <strong>{patient.name}</strong> - {patient.age} years
                <div style={{ marginTop: "5px" }}>
                  <button
                    onClick={() => handleUpdate(patient)}
                    style={{ marginRight: "10px" }}
                  >
                    Update
                  </button>
                  <button
                    onClick={() => handleDelete(patient.id || patient._id)}
                    style={{ color: "red" }}
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p>No patients found.</p>
        ))}

      {/* Refresh button */}
      <button onClick={fetchHandler} style={{ marginTop: "20px" }}>
        Refresh Patients
      </button>
    </div>
  );
};

export default PatientDetails;
