import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams, useLocation } from 'react-router-dom';

const Profile2 = ({ setShowNavButtons }) => {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [isDropdownOpen, setIsDropdownOpen] = useState(false); // State for mobile dropdown
    const navigate = useNavigate();
    const location = useLocation();

    const { username } = useParams();
    const params = new URLSearchParams(location.search);
    const email = params.get('email');

    // Function to handle password change
    const handleChangePassword = async (event) => {
        event.preventDefault();

        try {
            const response = await axios.post('https://papersystem.onrender.com/api/student/change-password', {
                username,
                currentPassword,
                newPassword,
            });

            setSuccessMessage(response.data.message);
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
            setError(''); // Clear any previous error messages
            setTimeout(() => {
                setSuccessMessage('');
            }, 2000);
        } catch (error) {
            if (error.response && error.response.data && error.response.data.message) {
                setError(error.response.data.message);
            } else {
                setError('Failed to change password. Please try again later.');
            }
        }
    };

    // Effect to manage navigation buttons visibility
    useEffect(() => {
        setShowNavButtons(false); // Hide navigation buttons when profile page is active
        return () => setShowNavButtons(true); // Reset when component unmounts
    }, [setShowNavButtons]);

    const handleLogout = () => {
        console.log('Logged out');
        sessionStorage.clear();
        navigate('/');
    };

    return (
        <div className="min-h-screen w-screen bg-teal-800 flex flex-col">
            <div className="bg-gray-800 text-white flex justify-between items-center px-6 py-4 shadow-lg">
                {/* Left Side: Logo and Navigation Links */}
                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2 bg-gradient-to-r from-blue-300 to-green-300 p-2 rounded-lg shadow-lg">
                        <span className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-green-600">
                            Question <span className="text-green-700">Craft</span>
                        </span>
                    </div>
                    {/* Navigation Links */}
                    <div className="hidden md:flex flex-row gap-6 mt-0">
                        <a href={`/StudentDashboard/${username}?email=${email}`} className="flex items-center text-white hover:text-gray-200 transition duration-300 text-lg font-bold">
                            <svg className="w-5 h-5 mr-1" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path d="M12 12c2.761 0 5-2.239 5-5s-2.239-5-5-5-5 2.239-5 5 2.239 5 5 5zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                            </svg>
                            Dashboard
                        </a>
                        <a href={`/Profile2/${username}?email=${email}`} className="flex items-center text-white hover:text-gray-200 transition duration-300 text-lg font-bold">
                            <svg className="w-5 h-5 mr-1" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path d="M16 13v-2h-8v2h8zm-6-6h-2v12h2v-12zm8-4v16h-12v-16h12zm0-2h-12c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2v-16c0-1.1-.9-2-2-2z" />
                            </svg>
                            Change Password
                        </a>
                        <a href={`/TestCollection/${username}?email=${email}`} className="flex items-center text-white hover:text-gray-200 transition duration-300 text-lg font-bold">
                            <svg className="w-5 h-5 mr-1" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path d="M16 7h-8c-1.1 0-2 .9-2 2v4c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2v-4c0-1.1-.9-2-2-2zm0 6h-8v-4h8v4z" />
                            </svg>
                            Test Collection
                        </a>
                    </div>
                    {/* Mobile Dropdown Toggle */}
                    <div className="md:hidden relative">
                        <button
                            className="flex items-center text-white focus:outline-none"
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        >
                            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path d="M3 12h18v-2H3v2zm0 4h18v-2H3v2zm0-8v2h18V8H3z" />
                            </svg>
                        </button>
                        {isDropdownOpen && (
                            <div className="absolute right-0 mt-2 w-48 bg-gray-800 text-white rounded-md shadow-lg z-10">
                                <a href={`/StudentDashboard/${username}?email=${email}`} className="block px-4 py-2 hover:bg-gray-700">Dashboard</a>
                                <a href={`/Profile2/${username}?email=${email}`} className="block px-4 py-2 hover:bg-gray-700">Change Password</a>
                                <a href={`/TestCollection/${username}?email=${email}`} className="block px-4 py-2 hover:bg-gray-700">Test Collection</a>
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Side: User Info and Logout */}
                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2 group">
                        <svg className="w-6 h-6 text-white group-hover:text-gray-200 transition duration-300" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 12c2.761 0 5-2.239 5-5s-2.239-5-5-5-5 2.239-5 5 2.239 5 5 5zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                        </svg>
                        <h2 className="text-xl font-bold group-hover:text-gray-200 transition duration-300">{username}</h2>
                    </div>
                    <div>
                        <button className="flex items-center bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition duration-300 shadow-md" onClick={handleLogout}>
                            <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path d="M16 13v-2h-8v2h8zm-6-6h-2v12h2v-12zm8-4v16h-12v-16h12zm0-2h-12c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2v-16c0-1.1-.9-2-2-2z" />
                            </svg>
                            Logout
                        </button>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-grow flex items-center justify-center bg-gray-100">
                <div className="bg-white rounded-lg shadow-lg p-8">
                    <h1 className="text-2xl font-bold mb-6 text-center">Change Password</h1>
                    {successMessage && <p className="text-green-500 mb-4">{successMessage}</p>}
                    {error && <p className="text-red-500 mb-4">{error}</p>}
                    <form onSubmit={handleChangePassword}>
                        <div className="mb-4">
                            <label className="block text-gray-700 font-bold mb-2" htmlFor="currentPassword">Current Password</label>
                            <input
                                type="password"
                                id="currentPassword"
                                value={currentPassword}
                                onChange={(e) => setCurrentPassword(e.target.value)}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 font-bold mb-2" htmlFor="newPassword">New Password</label>
                            <input
                                type="password"
                                id="newPassword"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 font-bold mb-2" htmlFor="confirmPassword">Confirm Password</label>
                            <input
                                type="password"
                                id="confirmPassword"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            className="bg-teal-500 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
                        >
                            Change Password
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Profile2;
