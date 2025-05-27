import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import SpecialtyGrid from './SpecialtyGrid';
import Appointments from './Appointments';

const LandingPage = () => {
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isDoctorSectionOpen, setIsDoctorSectionOpen] = useState(false);
    const [isAdminSectionOpen, setIsAdminSectionOpen] = useState(false);
    const [showAppointments, setShowAppointments] = useState(false);

    const isLoggedIn = localStorage.getItem('userId') || localStorage.getItem('doctorToken') || localStorage.getItem('adminToken');
    const userId = localStorage.getItem('userId') || localStorage.getItem('doctorId');
    const role = localStorage.getItem('doctorToken') ? 'doctor' : 'user';

    const handleLogout = () => {
        localStorage.removeItem('userId');
        localStorage.removeItem('doctorToken');
        localStorage.removeItem('doctorId');
        localStorage.removeItem('adminToken');
        navigate('/');
    };

    const toggleMenu = () => {
        setIsMenuOpen((prev) => !prev);
    };

    const toggleDoctorSection = () => {
        setIsDoctorSectionOpen((prev) => !prev);
    };

    const toggleAdminSection = () => {
        setIsAdminSectionOpen((prev) => !prev);
    };

    return (
        <div className="bg-gray-100 min-h-screen font-sans">
            <header className="bg-white shadow-md py-6 px-8 md:px-16 lg:px-24 flex justify-between items-center">
                <div className="text-xl md:text-3xl font-semibold text-indigo-600 tracking-tight">
                    Zap<span className="text-gray-800">Doc</span>
                </div>
                <div className="flex items-center">
                    <button
                        onClick={toggleMenu}
                        className="text-gray-700 hover:text-indigo-600 focus:outline-none"
                        aria-label="Toggle navigation menu"
                    >
                        <svg
                            className="w-8 h-8"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
                            />
                        </svg>
                    </button>
                </div>
                <nav
                    className={`absolute top-16 right-0 w-full bg-gradient-to-b from-white to-gray-50 shadow-lg border-t border-gray-200 transition-all duration-300 ease-in-out z-50 ${isMenuOpen ? 'opacity-100 max-h-screen' : 'opacity-0 max-h-0 overflow-hidden'
                        } md:w-64 md:top-20 md:right-8`}
                >
                    <ul className="flex flex-col items-center space-y-5 py-8 md:items-start md:px-8">
                        <li className="relative group w-full">
                            <Link
                                to="/login"
                                className="text-gray-800 hover:text-indigo-700 font-medium transition duration-300 ease-in-out transform hover:scale-105"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                Log In
                            </Link>
                            <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-indigo-600 transition-all duration-300 group-hover:w-full"></span>
                        </li>
                        <li className="relative group w-full">
                            <Link
                                to="/contact"
                                className="text-gray-800 hover:text-indigo-700 font-medium transition duration-300 ease-in-out transform hover:scale-105"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                Contact us
                            </Link>
                            <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-indigo-600 transition-all duration-300 group-hover:w-full"></span>
                        </li>
                        <li className="w-full">
                            <button
                                onClick={toggleDoctorSection}
                                className="flex items-center justify-between w-full text-gray-800 font-semibold py-2 px-3 rounded-md hover:bg-indigo-50 transition duration-300 ease-in-out"
                            >
                                <span>Doctor Section</span>
                                <svg
                                    className={`w-5 h-5 transform transition-transform duration-300 ${isDoctorSectionOpen ? 'rotate-90' : ''
                                        }`}
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M9 5l7 7-7 7"
                                    />
                                </svg>
                            </button>
                            <ul
                                className={`flex flex-col space-y-3 mt-2 pl-4 transition-all duration-300 ease-in-out ${isDoctorSectionOpen ? 'opacity-100 max-h-40' : 'opacity-0 max-h-0 overflow-hidden'
                                    }`}
                            >
                                <li className="relative group">
                                    <Link
                                        to="/doclog"
                                        className="text-gray-800 hover:text-indigo-700 font-medium transition duration-300 ease-in-out transform hover:scale-105"
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        Doc_LogIn
                                    </Link>
                                    <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-indigo-600 transition-all duration-300 group-hover:w-full"></span>
                                </li>
                                <li className="relative group">
                                    <Link
                                        to="/docreg"
                                        className="text-gray-800 hover:text-indigo-700 font-medium transition duration-300 ease-in-out transform hover:scale-105"
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        Doc_Register
                                    </Link>
                                    <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-indigo-600 transition-all duration-300 group-hover:w-full"></span>
                                </li>
                            </ul>
                        </li>
                        <li className="w-full">
                            <button
                                onClick={toggleAdminSection}
                                className="flex items-center justify-between w-full text-gray-800 font-semibold py-2 px-3 rounded-md hover:bg-indigo-50 transition duration-300 ease-in-out"
                            >
                                <span>Admin Section</span>
                                <svg
                                    className={`w-5 h-5 transform transition-transform duration-300 ${isAdminSectionOpen ? 'rotate-90' : ''
                                        }`}
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M9 5l7 7-7 7"
                                    />
                                </svg>
                            </button>
                            <ul
                                className={`flex flex-col space-y-3 mt-2 pl-4 transition-all duration-300 ease-in-out ${isAdminSectionOpen ? 'opacity-100 max-h-40' : 'opacity-0 max-h-0 overflow-hidden'
                                    }`}
                            >
                                <li className="relative group">
                                    <Link
                                        to="/admin/login"
                                        className="text-gray-800 hover:text-indigo-700 font-medium transition duration-300 ease-in-out transform hover:scale-105"
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        Admin_log
                                    </Link>
                                    <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-indigo-600 transition-all duration-300 group-hover:w-full"></span>
                                </li>
                                <li className="relative group">
                                    <Link
                                        to="/admin/dashboard"
                                        className="text-gray-800 hover:text-indigo-700 font-medium transition duration-300 ease-in-out transform hover:scale-105"
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        Admin_dash
                                    </Link>
                                    <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-indigo-600 transition-all duration-300 group-hover:w-full"></span>
                                </li>
                            </ul>
                        </li>
                        {!isLoggedIn && (
                            <li className="w-full">
                                <Link
                                    to="/signup"
                                    className="block text-center bg-gradient-to-r from-indigo-600 to-indigo-700 text-white font-semibold py-3 px-6 rounded-full shadow-sm transition duration-300 ease-in-out transform hover:-translate-y-0.5 hover:shadow-md"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    Sign Up
                                </Link>
                            </li>
                        )}
                        {isLoggedIn && (
                            <li className="w-full">
                                <button
                                    onClick={() => {
                                        handleLogout();
                                        setIsMenuOpen(false);
                                    }}
                                    className="w-full bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold py-3 px-6 rounded-full shadow-sm transition duration-300 ease-in-out transform hover:-translate-y-0.5 hover:shadow-md"
                                >
                                    Logout
                                </button>
                            </li>
                        )}
                    </ul>
                </nav>
            </header>
            {isLoggedIn && (
                <div className="container mx-auto px-8 md:px-16 lg:px-24 py-4">
                    <button
                        onClick={() => setShowAppointments(!showAppointments)}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-full shadow-md transition duration-300 ease-in-out"
                    >
                        {showAppointments ? "Hide Appointments" : "View Appointments"}
                    </button>
                </div>
            )}
            {isLoggedIn && showAppointments && userId && (
                <Appointments userId={userId} role={role} />
            )}
            <section className="bg-indigo-50 py-20 md:py-32 px-8 md:px-16 lg:px-24">
                <div className="container mx-auto text-center">
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-indigo-800 mb-6">
                        Your Health, Simplified.
                    </h1>
                    <p className="text-lg md:text-xl text-gray-700 mb-12">
                        Find the right doctor and book appointments effortlessly.
                    </p>
                    <Link to="/search" className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-4 px-8 rounded-full shadow-lg transition duration-300 ease-in-out">
                        Find a Doctor
                    </Link>
                </div>
            </section>
            <section className="py-16 px-8 md:px-16 lg:px-24 bg-white">
                <div className="mx-auto items-center">
                    <div className="order-2 md:order-1">
                        <h2 className="text-3xl font-bold text-gray-800 mb-4">
                            Wide Network of Specialists
                        </h2>
                        <p className="font-semibold text-gray-600 leading-relaxed mb-6">
                            Access a diverse range of highly qualified doctors across various specializations. From cardiology to dermatology, find the expert you need.
                        </p>
                        <ul className="list-disc list-inside text-gray-600">
                            <SpecialtyGrid />
                        </ul>
                    </div>
                </div>
            </section>
            <section className="py-16 px-8 md:px-16 lg:px-24 bg-gray-50">
                <div className="mx-auto items-center">
                    <div>
                        <h2 className="text-4xl font-semibold mb-4 text-indigo-600">
                            Effortless Appointment Booking
                        </h2>
                        <p className="text-gray-600 leading-relaxed mb-6 text-2xl">
                            Say goodbye to long waiting times and phone calls. Our intuitive platform allows you to book appointments online at your convenience.
                        </p>
                        <ul className="list-disc list-inside text-gray-600 flex flex-col space-y-4 text-xl">
                            <li>View doctor availability</li>
                            <li>Select your preferred time slot</li>
                            <li>Receive instant confirmation</li>
                            <li>Manage your appointments easily</li>
                        </ul>
                    </div>
                </div>
            </section>
            <section className="py-24 bg-indigo-100 px-8 md:px-16 lg:px-24">
                <div className="container mx-auto text-center">
                    <h2 className="text-3xl font-semibold text-indigo-800 mb-8">Ready to Find Your Doctor?</h2>
                    <Link to="/search" className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-4 px-10 rounded-full shadow-lg transition duration-300 ease-in-out">Book Your Appointment Today</Link>
                </div>
            </section>
            <section className="py-24 mt-10 px-8 md:px-16 lg:px-24 bg-indigo-50">
                <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex-1 text-center">
                        <h2 className="text-3xl md:text-4xl font-semibold text-indigo-600 mb-3 animate-fade-in">
                            Are You a Doctor?
                        </h2>
                        <p className="text-lg md:text-xl text-gray-700 mb-6 leading-relaxed animate-fade-in-delayed">
                            Reach more patients and grow your practice with ZapDoc.
                        </p>
                        <Link
                            to="/docreg"
                            className="inline-block bg-indigo-600 text-white font-semibold py-3 px-6 rounded-full shadow-sm transition duration-300 ease-in-out transform hover:-translate-y-0.5 hover:shadow-md hover:bg-indigo-700"
                        >
                            Join Now
                        </Link>
                    </div>
                </div>
            </section>
            <footer className="bg-gray-200 py-8 px-8 md:px-16 lg:px-24 text-center text-gray-600 text-sm">
                <p>© {new Date().getFullYear()} ZapDoc. All rights reserved.</p>
                <ul className="flex justify-center space-x-4 mt-2">
                    <li><Link to="/privacy" className="hover:text-indigo-600 transition duration-300 ease-in-out">Privacy Policy</Link></li>
                    <li><Link to="/terms" className="hover:text-indigo-600 transition duration-300 ease-in-out">Terms of Service</Link></li>
                    <li><Link to="/contact" className="hover:text-indigo-600 transition duration-300 ease-in-out">Contact Us</Link></li>
                </ul>
            </footer>
        </div>
    );
};

export default LandingPage;