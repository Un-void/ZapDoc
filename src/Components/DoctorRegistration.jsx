import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router';

const DoctorRegistration = () => {
    const [formData, setFormData] = useState({
        name: '',
        clinicName: '',
        clinicAddress: '',
        phone: '',
        email: '',
        specialization: '',
        qualifications: [{ degree: '', institution: '', year: '' }],
        certificate: null,
        password: '',
        confirmPassword: '', 
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const validateForm = () => {
        if (!formData.name.trim()) {
            setError('Name is required');
            return false;
        }
        if (!formData.email.match(/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/)) {
            setError('Please enter a valid email');
            return false;
        }
        if (!formData.phone.match(/^\+?\d{10,15}$/)) {
            setError('Please enter a valid phone number');
            return false;
        }
        if (!formData.clinicName.trim() || !formData.clinicAddress.trim()) {
            setError('Clinic name and address are required');
            return false;
        }
        if (!formData.specialization.trim()) {
            setError('Specialization is required');
            return false;
        }
        if (formData.qualifications.some(q => !q.degree || !q.institution || !q.year)) {
            setError('Complete all qualification fields');
            return false;
        }
        if (formData.password.length < 6) {
            setError('Password must be at least 6 characters');
            return false;
        }
        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return false;
        }
        return true;
    };

    const handleChange = (e, index) => {
        if (e.target.name.startsWith('qualification')) {
            const qualifications = [...formData.qualifications];
            const [_, field] = e.target.name.split('.');
            qualifications[index][field] = e.target.value;
            setFormData({ ...formData, qualifications });
        } else if (e.target.name === 'certificate') {
            setFormData({ ...formData, certificate: e.target.files[0] });
        } else {
            setFormData({ ...formData, [e.target.name]: e.target.value });
        }
    };

    const addQualification = () => {
        setFormData({
            ...formData,
            qualifications: [...formData.qualifications, { degree: '', institution: '', year: '' }],
        });
    };

    const removeQualification = (index) => {
        setFormData({
            ...formData,
            qualifications: formData.qualifications.filter((_, i) => i !== index),
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        setLoading(true);
        setError('');
        setSuccess('');

        const formDataToSend = new FormData();
        Object.keys(formData).forEach(key => {
            if (key === 'qualifications') {
                formDataToSend.append(key, JSON.stringify(formData[key]));
            } else if (key === 'certificate' && formData[key]) {
                formDataToSend.append(key, formData[key]);
            } else if (key !== 'confirmPassword') { 
                formDataToSend.append(key, formData[key]);
            }
        });

        try {
            const response = await fetch('http://localhost:5000/api/doctors/register', {
                method: 'POST',
                body: formDataToSend,
            });
            const data = await response.json();
            if (response.ok) {
                setSuccess('Application submitted successfully! Awaiting admin approval.');
                setShowModal(true);
                setTimeout(() => {
                    setShowModal(false);
                    navigate('/doclog');
                }, 3000);
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
        <div className="bg-gray-100 min-h-screen flex items-center justify-center font-sans">
            <div className="bg-white p-8 rounded-lg shadow-lg max-w-2xl w-full">
                <h2 className="text-2xl font-bold mb-6 text-center">
                    Apply for Doctor Registration on <Link className="text-indigo-600 text-3xl" to={'/'}>ZapDoc</Link>
                </h2>
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
                        <label className="block text-gray-700 mb-2" htmlFor="clinicName">Clinic Name</label>
                        <input
                            type="text"
                            name="clinicName"
                            value={formData.clinicName}
                            onChange={handleChange}
                            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 mb-2" htmlFor="clinicAddress">Clinic Address</label>
                        <textarea
                            name="clinicAddress"
                            value={formData.clinicAddress}
                            onChange={handleChange}
                            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 mb-2" htmlFor="phone">Phone Number</label>
                        <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
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
                        <label className="block text-gray-700 mb-2" htmlFor="specialization">Specialization</label>
                        <input
                            type="text"
                            name="specialization"
                            value={formData.specialization}
                            onChange={handleChange}
                            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
                            required
                        />
                    </div>
                    <div className="mb-4 relative">
                        <label className="block text-gray-700 mb-2" htmlFor="password">Password</label>
                        <input
                            type={showPassword ? 'text' : 'password'}
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
                            required
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-12 text-gray-600 hover:text-indigo-600"
                        >
                            {showPassword ? 'Hide' : 'Show'}
                        </button>
                    </div>
                    <div className="mb-4 relative">
                        <label className="block text-gray-700 mb-2" htmlFor="confirmPassword">Confirm Password</label>
                        <input
                            type={showPassword ? 'text' : 'password'}
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
                            required
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-12 text-gray-600 hover:text-indigo-600"
                        >
                            {showPassword ? 'Hide' : 'Show'}
                        </button>
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 mb-2">Educational Qualifications</label>
                        {formData.qualifications.map((qual, index) => (
                            <div key={index} className="mb-2 p-4 border rounded-lg">
                                <input
                                    type="text"
                                    name={`qualification.degree`}
                                    value={qual.degree}
                                    onChange={(e) => handleChange(e, index)}
                                    placeholder="Degree (e.g., MBBS, MD)"
                                    className="w-full p-3 border rounded-lg mb-2 focus:outline-none focus:ring-2 focus:ring-indigo-600"
                                    required
                                />
                                <input
                                    type="text"
                                    name={`qualification.institution`}
                                    value={qual.institution}
                                    onChange={(e) => handleChange(e, index)}
                                    placeholder="Institution"
                                    className="w-full p-3 border rounded-lg mb-2 focus:outline-none focus:ring-2 focus:ring-indigo-600"
                                    required
                                />
                                <input
                                    type="number"
                                    name={`qualification.year`}
                                    value={qual.year}
                                    onChange={(e) => handleChange(e, index)}
                                    placeholder="Year"
                                    className="w-full p-3 border rounded-lg mb-2 focus:outline-none focus:ring-2 focus:ring-indigo-600"
                                    required
                                />
                                {formData.qualifications.length > 1 && (
                                    <button
                                        type="button"
                                        onClick={() => removeQualification(index)}
                                        className="text-red-600 hover:underline"
                                    >
                                        Remove
                                    </button>
                                )}
                            </div>
                        ))}
                        <button
                            type="button"
                            onClick={addQualification}
                            className="text-indigo-600 hover:underline mt-2"
                        >
                            Add Qualification
                        </button>
                    </div>
                    <div className="mb-6">
                        <label className="block text-gray-700 mb-2" htmlFor="certificate">Upload Degree Certificate (PDF)</label>
                        <input
                            type="file"
                            name="certificate"
                            accept=".pdf"
                            onChange={handleChange}
                            className="w-full p-3 border rounded-lg"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-full shadow-lg transition duration-300 ease-in-out ${
                            loading ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                    >
                        {loading ? (
                            <span className="flex items-center justify-center">
                                <svg className="animate-spin h-5 w-5 mr-2 text-white" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                                </svg>
                                Submitting...
                            </span>
                        ) : (
                            'Submit Application'
                        )}
                    </button>
                </form>
                <p className="mt-4 text-center text-gray-600">
                    Already registered?{' '}
                    <Link to="/doclog" className="text-indigo-600 hover:underline">
                        Log In
                    </Link>
                </p>
            </div>
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
                        <h3 className="text-lg font-semibold mb-4">Application Submitted</h3>
                        <p className="text-gray-600 mb-4">
                            Your application has been submitted successfully. You will be notified once it is reviewed.
                        </p>
                        <button
                            onClick={() => setShowModal(false)}
                            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 rounded-full"
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DoctorRegistration;