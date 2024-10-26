import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';

const Profile2 = ({ setShowNavButtons }) => {
    const { username } = useParams();
    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const email = params.get('email');
    const navigate = useNavigate();

    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    useEffect(() => {
        setShowNavButtons(false);
        return () => setShowNavButtons(true);
    }, [setShowNavButtons]);

    const handleLogout = () => {
        console.log('Logged out');
        sessionStorage.clear();
        navigate('/');
    };

    const toggleDropdown = () => {
        setDropdownOpen(!dropdownOpen);
    };

    const handleChangePassword = async (e) => {
        e.preventDefault();
        setError('');
        setSuccessMessage('');

        if (newPassword !== confirmPassword) {
            setError('New password and confirmation do not match');
            return;
        }

        try {
            // Make API call to change password here
            const response = await fetch('https://papersystem.onrender.com/api/student/change-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    username,
                    currentPassword,
                    newPassword,
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to change password');
            }

            const data = await response.json();
            setSuccessMessage(data.message);
            // Optionally clear the fields
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="min-h-screen w-screen bg-teal-700 flex flex-col">
            <div className="bg-gray-800 text-white flex justify-between items-center px-4 py-2 sm:px-6 sm:py-4 shadow-lg">
                <h2 className="text-xl font-bold">{username}</h2>
                <div className="relative sm:hidden">
                    <button onClick={toggleDropdown} className="text-white">
                        &#9776; {/* Hamburger icon */}
                    </button>
                    {dropdownOpen && (
                        <div className="absolute right-0 bg-gray-800 text-white shadow-lg rounded-md">
                            <a href={`/StudentDashboard/${username}?email=${email}`} className="block px-4 py-2 hover:bg-gray-700">Dashboard</a>
                            <a href={`/Profile2/${username}?email=${email}`} className="block px-4 py-2 hover:bg-gray-700">Change Password</a>
                            <a href={`/TestCollection/${username}?email=${email}`} className="block px-4 py-2 hover:bg-gray-700">Test Collection</a>
                            <button onClick={handleLogout} className="block px-4 py-2 hover:bg-gray-700 w-full text-left">Logout</button>
                        </div>
                    )}
                </div>
                <button onClick={handleLogout} className="bg-red-500 hover:bg-red-700 text-white py-2 px-4 rounded hidden sm:block">
                    Logout
                </button>
            </div>

            {/* Profile Content */}
            <div className="container mx-auto px-4 py-8">
                <h2 className="text-3xl font-bold mb-4 text-white">Change Password</h2>
                {error && <div className="text-red-500 mb-4">{error}</div>}
                {successMessage && <div className="text-green-500 mb-4">{successMessage}</div>}

                {/* Password Change Form */}
                <form onSubmit={handleChangePassword}>
                    <div className="mb-4">
                        <label htmlFor="currentPassword" className="block text-sm font-medium text-white">
                            Current Password
                        </label>
                        <input
                            type="password"
                            id="currentPassword"
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="newPassword" className="block text-sm font-medium text-white">
                            New Password
                        </label>
                        <input
                            type="password"
                            id="newPassword"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="confirmPassword" className="block text-sm font-medium text-white">
                            Confirm New Password
                        </label>
                        <input
                            type="password"
                            id="confirmPassword"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="inline-block bg-slate-900 hover:bg-blue-200 hover:text-black text-white px-4 py-2 font-semibold rounded-md transition duration-300"
                    >
                        Change Password
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Profile2;
