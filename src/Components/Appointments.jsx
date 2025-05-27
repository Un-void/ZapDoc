import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";

const Appointments = ({ userId, role }) => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
  const fetchAppointments = async () => {
    setLoading(true);
    setError("");
    try {
      const token = role === "doctor" 
        ? localStorage.getItem("doctorToken") 
        : localStorage.getItem("token");
      console.log("Fetching appointments with:", { userId, role, token }); // Debug log
      if (!token) {
        setError("Please log in to view appointments.");
        return;
      }
      if (!userId) {
        setError("User ID is missing. Please log in again.");
        return;
      }
      const endpoint = role === "doctor" 
        ? `http://localhost:5000/api/appointments/doctor/${userId}/appointments`
        : `http://localhost:5000/api/appointments/user/${userId}`;
      const res = await fetch(endpoint, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (res.ok) {
        setAppointments(data);
      } else {
        setError(data.message || "Failed to fetch appointments.");
      }
    } catch (err) {
      setError("An error occurred while fetching appointments.");
    } finally {
      setLoading(false);
    }
  };

  if (userId) {
    fetchAppointments();
  } else {
    setError("User ID is missing. Please log in again.");
  }
}, [userId, role]);

  const handleCancel = async (appointmentId) => {
    try {
      const token = localStorage.getItem("token") || localStorage.getItem("doctorToken");
      const res = await fetch(`http://localhost:5000/api/appointments/cancel/${appointmentId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (res.ok) {
        setAppointments(appointments.map((appt) => 
          appt._id === appointmentId ? { ...appt, status: "cancelled" } : appt
        ));
      } else {
        setError(data.message || "Failed to cancel appointment.");
      }
    } catch (err) {
      setError("An error occurred while cancelling the appointment.");
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold text-indigo-800 mb-4">
        {role === "doctor" ? "Your Scheduled Appointments" : "Your Booked Appointments"}
      </h2>
      {error && (
        <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
          {error}
        </div>
      )}
      {loading ? (
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-600"></div>
        </div>
      ) : appointments.length === 0 ? (
        <p className="text-gray-600">No appointments found.</p>
      ) : (
        <div className="grid gap-4">
          {appointments.map((appt) => (
            <div
              key={appt._id}
              className="bg-white p-4 rounded-lg shadow-md flex justify-between items-center"
            >
              <div>
                <p className="text-gray-800 font-semibold">
                  {role === "doctor" ? `Patient: ${appt.userId?.name || "Unknown"}` : `Doctor: ${appt.doctorId?.name || "Unknown"}`}
                </p>
                <p className="text-gray-600">
                  Date: {new Date(appt.date).toLocaleDateString()}
                </p>
                <p className="text-gray-600">Slot: {appt.slot}</p>
                <p className="text-gray-600">Status: {appt.status}</p>
              </div>
              {appt.status === "booked" && (
                <button
                  onClick={() => handleCancel(appt._id)}
                  className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition duration-300"
                >
                  Cancel
                </button>
              )}
            </div>
         ))}
        </div>
      )}
    </div>
  );
};

export default Appointments;