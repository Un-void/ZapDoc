import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { MapPin } from "lucide-react";
import Logo from "../assets/Doc_Logo.png";

const DocCard = () => {
  const { name } = useParams();
  const decodedName = decodeURIComponent(name);
  const navigate = useNavigate();
  const [doctor, setDoctor] = useState(null);
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [error, setError] = useState(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState("");
  const [bookingError, setBookingError] = useState(null);
  const [bookingSuccess, setBookingSuccess] = useState(null);

  useEffect(() => {
    const fetchDoctor = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(
          `http://localhost:5000/api/doctors/name/${encodeURIComponent(decodedName)}`
        );
        const data = await res.json();
        if (res.ok) {
          setDoctor({
            ...data,
            rating: 4.55,
            reviews: 917,
            insuranceLink: "See if they’re in network",
            appointmentStatus: "New patient appointments – Excellent wait time",
          });
        } else {
          setError("Doctor not found.");
        }
      } catch (err) {
        setError("An error occurred while fetching doctor data.");
      } finally {
        setLoading(false);
      }
    };
    fetchDoctor();
  }, [decodedName]);

  const fetchSlots = async (date) => {
    if (!doctor) return;
    setLoadingSlots(true);
    try {
      const res = await fetch(
        `http://localhost:5000/api/appointments/doctor/${doctor._id}?date=${date}`
      );
      const data = await res.json();
      if (res.ok) {
        setSlots(data.availableSlots);
      } else {
        setSlots([]);
      }
    } catch (error) {
      console.error(error);
      setSlots([]);
    }
    setLoadingSlots(false);
  };

  const handleDateChange = (e) => {
    const date = e.target.value;
    setSelectedDate(date);
    fetchSlots(date);
  };

  const handleBack = () => {
    const specialty = window.location.pathname.split("/search/")[1]?.split("/")[0];
    navigate(specialty ? `/search/${specialty}` : "/search");
  };

  const handleSlotClick = (slot) => {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      alert("Please log in to book an appointment.");
      navigate("/login");
      return;
    }
    setSelectedSlot(slot);
    setBookingError(null);
    setBookingSuccess(null);
    setModalOpen(true);
  };

  const confirmBooking = async () => {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      alert("Please log in to book an appointment.");
      navigate("/login");
      return;
    }
    try {
      const res = await fetch("http://localhost:5000/api/appointments/book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          doctorId: doctor._id,
          userId,
          date: selectedDate,
          slot: selectedSlot,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setBookingSuccess("Appointment booked successfully!");
        setTimeout(() => {
          setModalOpen(false);
          setBookingSuccess(null);
          fetchSlots(selectedDate);
        }, 2000);
      } else {
        setBookingError(data.message || "Failed to book appointment.");
      }
    } catch (err) {
      setBookingError("An error occurred while booking the appointment.");
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen font-sans">
      <header className="bg-white shadow-md py-6 px-8 md:px-16 lg:px-24 flex justify-between items-center">
        <div className="text-xl md:text-3xl font-semibold text-indigo-600 tracking-tight">
          Zap<span className="text-gray-800">Doc</span>
        </div>
        <nav>
          <ul className="flex items-center space-x-4 md:space-x-8">
            <li>
              <button
                onClick={handleBack}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-full shadow-md transition duration-300 ease-in-out"
              >
                Back
              </button>
            </li>
          </ul>
        </nav>
      </header>
      <section className="py-12 px-8 md:px-16 lg:px-24 bg-indigo-50">
        <div className="container mx-auto">
          {loading ? (
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-600"></div>
            </div>
          ) : error ? (
            <div className="text-center text-gray-600">{error}</div>
          ) : doctor ? (
            <div className="bg-white rounded-lg shadow-md p-8 max-w-3xl mx-auto">
              <div className="flex flex-col md:flex-row items-start gap-6 mb-8">
                <div className="relative">
                  <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center">
                    <img src={Logo} alt="Doctor" className="rounded-full" />
                  </div>
                </div>
                <div className="flex-1">
                  <h1 className="text-3xl font-bold text-indigo-700 mb-1">
                    Dr. {doctor.name}
                  </h1>
                  <h1 className="text-xl font-bold text-indigo-500 my-3">{doctor.clinicName}</h1>
                  <div className="w-full text-right ml-auto text-md my-3">
                    Contact - {doctor.email}
                  </div>
                  <p className="text-gray-700 font-semibold text-lg mb-2">
                    {doctor.specialization}
                  </p>
                  <div className="flex items-center mb-2">
                    <MapPin className="w-5 h-5 text-gray-600 mr-1" />
                    <span className="text-gray-700">{doctor.clinicAddress}</span>
                  </div>
                  <a
                    href="#"
                    className="text-indigo-600 hover:underline text-sm mb-2 inline-block"
                  >
                    {doctor.insuranceLink}
                  </a>
                  <p className="text-gray-600 text-sm italic">
                    {doctor.appointmentStatus}
                  </p>
                </div>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-indigo-800 mb-4">
                  Appointment Slots
                </h2>
                <div className="mb-4">
                  <label
                    htmlFor="appointmentDate"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Select Appointment Date:
                  </label>
                  <input
                    type="date"
                    id="appointmentDate"
                    value={selectedDate}
                    onChange={handleDateChange}
                    min={new Date().toISOString().split("T")[0]}
                    className="mt-1 block border-gray-300 rounded-md shadow-sm focus:ring-indigo-600 focus:border-indigo-600"
                  />
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {loadingSlots ? (
                    <p>Loading slots...</p>
                  ) : slots && slots.length > 0 ? (
                    slots.map((slot, idx) => (
                      <button
                        key={idx}
                        className="px-4 py-2 bg-yellow-200 text-gray-800 rounded hover:bg-yellow-300 transition duration-300"
                        onClick={() => handleSlotClick(slot)}
                      >
                        {slot}
                      </button>
                    ))
                  ) : (
                    <p>No available slots for this date.</p>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center text-gray-600">Doctor not found.</div>
          )}
        </div>
      </section>
      {modalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg w-80">
            <h3 className="text-xl font-bold text-indigo-700 mb-4">
              Confirm Appointment
            </h3>
            <p className="mb-4">
              You are about to book an appointment with Dr. {doctor?.name} on{" "}
              <strong>{selectedDate}</strong> at <strong>{selectedSlot}</strong>.
            </p>
            {bookingSuccess && (
              <p className="text-green-600 mb-4">{bookingSuccess}</p>
            )}
            {bookingError && (
              <p className="text-red-600 mb-4">{bookingError}</p>
            )}
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setModalOpen(false)}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={confirmBooking}
                className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
                disabled={bookingSuccess} // Disable Confirm button after success
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DocCard;