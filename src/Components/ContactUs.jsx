import React, { useState } from 'react';
import { Link } from 'react-router';

const ContactUs = () => {
    const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        try {
            const response = await fetch('http://localhost:5000/api/contact/submit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });
            const data = await response.json();
            if (response.ok) {
                setSuccess(data.message);
                setFormData({ name: '', email: '', subject: '', message: '' });
            } else {
                setError(data.message);
            }
        } catch (err) {
            setError('Failed to connect to the server');
        } finally {
            setLoading(false);
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
                        <li><Link to="/login" className="text-gray-700 hover:text-indigo-600 transition duration-300 ease-in-out">Log In</Link></li>
                        <li><Link to="/signup" className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-full shadow-md transition duration-300 ease-in-out">Sign Up</Link></li>
                    </ul>
                </nav>
            </header>
            <section className="py-16 px-8 md:px-16 lg:px-24 bg-indigo-50">
                <div className="container mx-auto text-center">
                    <h1 className="text-4xl md:text-5xl font-bold text-indigo-800 mb-6">Contact Us</h1>
                    <p className="text-lg md:text-xl text-gray-700 mb-12">Have a question or need assistance? Reach out to us!</p>
                </div>
                <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-lg">
                    {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}
                    {success && <div className="bg-green-100 text-green-700 p-3 rounded mb-4">{success}</div>}
                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label className="block text-gray-700 mb-2" htmlFor="name">Full Name</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 mb-2" htmlFor="email">Email</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 mb-2" htmlFor="subject">Subject</label>
                            <input
                                type="text"
                                name="subject"
                                value={formData.subject}
                                onChange={handleChange}
                                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
                                required
                            />
                        </div>
                        <div className="mb-6">
                            <label className="block text-gray-700 mb-2" htmlFor="message">Message</label>
                            <textarea
                                name="message"
                                value={formData.message}
                                onChange={handleChange}
                                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
                                rows="5"
                                required
                            ></textarea>
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-full shadow-lg transition duration-300 ease-in-out ${
                                loading ? 'opacity-50 cursor-not-allowed' : ''
                            }`}
                        >
                            {loading ? 'Sending...' : 'Send Message'}
                        </button>
                    </form>
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

export default ContactUs;