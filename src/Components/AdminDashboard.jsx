import React, { useEffect, useState } from 'react';
import { Link } from 'react-router';
const AdminDashboard = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchApplications = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('http://localhost:5000/api/doctors/applications', {
        headers: { Authorization: 'Bearer ' + localStorage.getItem('adminToken'),},
      });
      const data = await res.json();
      if (res.ok) setApplications(data);
      else setError(data.message || 'Failed to fetch applications');
    } catch {
      setError('Server error');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const handleAction = async (id, action) => {
    setError('');
    try {
      const res = await fetch(`http://localhost:5000/api/doctors/${action}/${id}`, { method: 'POST',headers: {Authorization: 'Bearer ' + localStorage.getItem('adminToken'),},});
      const data = await res.json();
      if (res.ok) {
        setApplications(applications.filter(app => app._id !== id));
      } else {
        setError(data.message || 'Action failed');
      }
    } catch {
      setError('Server error');
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div style={{ color: 'red' }}>{error}</div>;

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-6xl mx-auto bg-white shadow-lg rounded-2xl p-6">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Doctor Applications</h2>
        
        <Link to="/" className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-full shadow-md transition duration-300 ease-in-out">Back</Link>
        {applications.length === 0 ? (
          <div className="text-center text-gray-500">No pending applications.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto border-collapse">
              <thead className="bg-blue-100 text-gray-700">
                <tr>
                  <th className="px-4 py-2 text-left">Name</th>
                  <th className="px-4 py-2 text-left">Email</th>
                  <th className="px-4 py-2 text-left">Specialty</th>
                  <th className="px-4 py-2 text-left">Certificate</th>
                  <th className="px-4 py-2 text-left">Actions</th>
                </tr>
              </thead>
              <tbody className="text-gray-700">
                {applications.map(app => (
                  <tr key={app._id} className="border-t hover:bg-gray-50">
                    <td className="px-4 py-2">{app.name}</td>
                    <td className="px-4 py-2">{app.email}</td>
                    <td className="px-4 py-2">{app.specialty}</td>
                    <td className="px-4 py-2">
                      <a href={`http://localhost:5000/${app.certificate}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline" >View</a>
                    </td>
                    <td className="px-4 py-2 space-x-2">
                      <button className="px-3 py-1 rounded bg-green-600 text-white hover:bg-green-700 disabled:opacity-50" onClick={() => handleAction(app._id, 'approve')}>Approve</button>
                      <button className="px-3 py-1 rounded bg-red-600 text-white hover:bg-red-700 disabled:opacity-50"onClick={() => handleAction(app._id, 'reject')}>Reject</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
