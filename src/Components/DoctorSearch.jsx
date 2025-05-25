import React, { useEffect, useState } from "react";
import { Link } from "react-router";

const DoctorSearch = () => {
  const [doctors, setDoctors] = useState([]);
  const [specialties, setSpecialties] = useState([]);
  const [selectedSpecialty, setSelectedSpecialty] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch all doctors
    const fetchDoctors = async () => {
      setLoading(true);
      try {
        const res = await fetch("http://localhost:5000/api/doctors/all");
        const data = await res.json();
        if (res.ok) {
          setDoctors(data);
          // Extract unique specialties
          const uniqueSpecialties = [
            ...new Set(data.map((doc) => doc.specialization)),
          ];
          setSpecialties(uniqueSpecialties);
        }
      } catch {
        setDoctors([]);
      }
      setLoading(false);
    };
    fetchDoctors();
  }, []);

  // Filter doctors by selected specialty
  const filteredDoctors = selectedSpecialty
    ? doctors.filter((doc) => doc.specialization === selectedSpecialty)
    : doctors;

  return (
    <div className="bg-gray-100 min-h-screen font-sans">
      <header className="bg-white shadow-md py-6 px-8 md:px-16 lg:px-24 flex justify-between items-center">
        <div className="text-xl md:text-3xl font-semibold text-indigo-600 tracking-tight">
          Zap<span className="text-gray-800">Doc</span>
        </div>
        <nav>
          <ul className="flex items-center space-x-4 md:space-x-8">
            <li>
              <Link to="/" className="text-gray-700 hover:text-indigo-600">
                Home
              </Link>
            </li>
          </ul>
        </nav>
      </header>
      <section className="py-12 px-8 md:px-16 lg:px-24 bg-indigo-50">
        <div className="container mx-auto text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-indigo-800 mb-6">
            Search Doctors Based on Specialty
          </h1>
          <div className="mb-8 flex flex-col md:flex-row items-center justify-center gap-4">
            <label htmlFor="specialty" className="text-lg font-semibold">
              Filter by Specialty:
            </label>
            <select
              id="specialty"
              value={selectedSpecialty}
              onChange={(e) => setSelectedSpecialty(e.target.value)}
              className="p-2 rounded border focus:outline-none focus:ring-2 focus:ring-indigo-600"
            >
              <option value="">All Specialties</option>
              {specialties.map((spec) => (
                <option key={spec} value={spec}>
                  {spec}
                </option>
              ))}
            </select>
          </div>
          {loading ? (
            <div>Loading doctors...</div>
          ) : filteredDoctors.length === 0 ? (
            <div className="text-gray-600">No doctors found.</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredDoctors.map((doc) => (
                <div
                  key={doc._id}
                  className="bg-white rounded-lg shadow-md p-6 flex flex-col items-start"
                >
                  <h2 className="text-xl font-bold text-indigo-700 mb-2">
                    Dr. {doc.name}
                  </h2>
                  <div className="text-gray-700 mb-1">
                    <span className="font-semibold">Specialty:</span>{" "}
                    {doc.specialization}
                  </div>
                  <div className="text-gray-700 mb-1">
                    <span className="font-semibold">Clinic:</span>{" "}
                    {doc.clinicName}
                  </div>
                  <div className="text-gray-700 mb-1">
                    <span className="font-semibold">Address:</span>{" "}
                    {doc.clinicAddress}
                  </div>
                  <div className="text-gray-700 mb-1">
                    <span className="font-semibold">Phone:</span> {doc.phone}
                  </div>
                  <div className="text-gray-700 mb-1">
                    <span className="font-semibold">Qualifications:</span>{" "}
                    {doc.qualifications
                      .map(
                        (q) =>
                          `${q.degree} (${q.institution}, ${q.year})`
                      )
                      .join(", ")}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default DoctorSearch;