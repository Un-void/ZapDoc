import React from 'react';
import { Link } from 'react-router';
import SpecialtyGrid from './SpecialtyGrid';

const LandingPage = () => {
    return (
        <div className="bg-gray-100 min-h-screen font-sans">
            <header className="bg-white shadow-md py-6 px-8 md:px-16 lg:px-24 flex justify-between items-center">
                <div className="text-xl md:text-3xl font-semibold text-indigo-600 tracking-tight">
                    Zap<span className="text-gray-800">Doc</span>
                </div>
                <nav>
                    <ul className="flex items-center space-x-4 md:space-x-8">
                        <li><Link to="/login" className="text-gray-700 hover:text-indigo-600 transition duration-300 ease-in-out">Log In</Link></li>
                        <li><Link to="/signup" className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-full shadow-md transition duration-300 ease-in-out">Sign Up</Link></li>
                        <li><Link to="/contact" className="text-gray-700 hover:text-indigo-600 transition duration-300 ease-in-out">Contact us</Link></li>
                        <li><Link to="/doclog" className="text-gray-700 hover:text-indigo-600 transition duration-300 ease-in-out">Doc_LogIn</Link></li>
                        <li><Link to="/docreg" className="text-gray-700 hover:text-indigo-600 transition duration-300 ease-in-out">Doc_Register</Link></li>
                    </ul>
                </nav>
            </header>
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
                        <h2 className="text-4xl font-semibol mb-4 text-indigo-600">
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
            <section className="py-20 bg-indigo-100 px-8 md:px-16 lg:px-24">
                <div className="container mx-auto text-center">
                    <h2 className="text-3xl font-semibold text-indigo-800 mb-8">Ready to Find Your Doctor?</h2>
                    <Link to="/search" className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-4 px-10 rounded-full shadow-lg transition duration-300 ease-in-out">Book Your Appointment Today</Link>
                </div>
            </section>
            <footer className="bg-gray-200 py-8 px-8 md:px-16 lg:px-24 text-center text-gray-600 text-sm">
                <p>&copy; {new Date().getFullYear()} ZapDoc. All rights reserved.</p>
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