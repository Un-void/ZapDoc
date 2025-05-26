import React, { useEffect, useState, useRef } from "react";
import { Link, useParams } from "react-router";

const DoctorSearch = () => {
  const { specialtyName } = useParams();
  const [doctors, setDoctors] = useState([]);
  const [specialties, setSpecialties] = useState([]);
  const [selectedSpecialty, setSelectedSpecialty] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const fetchDoctors = async () => {
      setLoading(true);
      try {
        const res = await fetch("http://localhost:5000/api/doctors/all");
        const data = await res.json();
        if (res.ok) {
          setDoctors(data);
          const uniqueSpecialties = [
            ...new Set(data.map((doc) => doc.specialization)),
          ];
          setSpecialties(uniqueSpecialties);

          if (specialtyName) {
            const matchedSpecialty = uniqueSpecialties.find(
              (spec) => spec.toLowerCase() === specialtyName.toLowerCase()
            );
            if (matchedSpecialty) {
              setSelectedSpecialty(matchedSpecialty);
              setSearchInput(matchedSpecialty);
            } else {
              setSelectedSpecialty("");
              setSearchInput(specialtyName || "");
            }
          }
        }
      } catch {
        setDoctors([]);
      }
      setLoading(false);
    };
    fetchDoctors();
  }, [specialtyName]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredDoctors = specialtyName
    ? doctors.filter(
        (doc) =>
          doc.specialization.toLowerCase() === specialtyName.toLowerCase()
      )
    : selectedSpecialty
    ? doctors.filter(
        (doc) =>
          doc.specialization.toLowerCase() === selectedSpecialty.toLowerCase()
      )
    : doctors;

  const filteredSpecialties = specialties.filter((spec) =>
    spec.toLowerCase().includes(searchInput.toLowerCase())
  );

  const handleInputChange = (e) => {
    setSearchInput(e.target.value);
    setIsDropdownOpen(true);
    const matchedSpecialty = specialties.find(
      (spec) => spec.toLowerCase() === e.target.value.toLowerCase()
    );
    setSelectedSpecialty(matchedSpecialty || "");
  };

  const handleSpecialtySelect = (spec) => {
    setSelectedSpecialty(spec);
    setSearchInput(spec);
    setIsDropdownOpen(false);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
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
              <Link
                to="/"
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-full shadow-md transition duration-300 ease-in-out"
              >
                Back
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
          <div
            className="mb-8 flex flex-col md:flex-row items-center justify-center gap-4 relative"
            ref={dropdownRef}
          >
            <label htmlFor="specialty" className="text-lg font-semibold">
              Filter by Specialty:
            </label>
            <div className="relative w-64">
              <input
                id="specialty"
                type="text"
                value={searchInput}
                onChange={handleInputChange}
                onFocus={() => setIsDropdownOpen(true)}
                placeholder="Type or select a specialty"
                className="w-full p-2 rounded border focus:outline-none focus:ring-2 focus:ring-indigo-600"
              />
              <button
                type="button"
                onClick={toggleDropdown}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-600"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
              {isDropdownOpen && (
                <ul className="absolute z-10 w-full bg-white border rounded mt-1 max-h-60 overflow-y-auto shadow-lg">
                  <li
                    className="px-4 py-2 cursor-pointer hover:bg-indigo-100"
                    onClick={() => {
                      handleSpecialtySelect("");
                      setSearchInput("");
                    }}
                  >
                    All Specialties
                  </li>
                  {filteredSpecialties.length > 0 ? (
                    filteredSpecialties.map((spec) => (
                      <li
                        key={spec}
                        className="px-4 py-2 cursor-pointer hover:bg-indigo-100"
                        onClick={() => handleSpecialtySelect(spec)}
                      >
                        {spec}
                      </li>
                    ))
                  ) : (
                    <li className="px-4 py-2 text-gray-500">
                      No specialties found
                    </li>
                  )}
                </ul>
              )}
            </div>
          </div>
          {loading ? (
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-600"></div>
            </div>
          ) : filteredDoctors.length === 0 ? (
            <div className="text-gray-600 text-center">
              {specialtyName
                ? `No doctors found for ${specialtyName}.`
                : "No doctors found."}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredDoctors.map((doc) => (
                <div
                  key={doc._id}
                  className="bg-white rounded-lg shadow-md p-6 flex flex-col relative min-h-[200px]"
                >
                  <h2 className="text-xl font-bold text-indigo-700 mb-2">
                    Dr. {doc.name}
                  </h2>
                  <div className="text-gray-700 mb-1">
                    <span className="font-semibold">Specialty:</span>{" "}
                    {doc.specialization}
                  </div>
                  <div className="text-gray-700 mb-1">
                    <span className="font-semibold">Qualifications:</span>{" "}
                    {doc.qualifications
                      .map((q) => `${q.degree} (${q.institution}, ${q.year})`)
                      .join(", ")}
                  </div>
                  <Link
                    to={`/doctor/${encodeURIComponent(doc.name)}`} // Navigate using name
                    className="absolute bottom-4 right-4 text-indigo-600 hover:text-indigo-800 font-semibold text-sm transition duration-300"
                  >
                    View More...
                  </Link>
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