import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams, useLocation } from 'react-router-dom';

const Profile2 = ({ setShowNavButtons }) => {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    const { username } = useParams();
    const params = new URLSearchParams(location.search);
    const email = params.get('email');

    // Function to handle password change
    const handleChangePassword = async (event) => {
        event.preventDefault();

        if (newPassword !== confirmPassword) {
            setError('New password and confirmation do not match.');
            return;
        }

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
            }, 5000); // Show success message for longer duration
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
                    {/* Navigation Links for larger screens */}
                    <div className="hidden sm:flex gap-6">
                        <a href={`/StudentDashboard/${username}?email=${email}`} className="text-white hover:text-gray-200 transition duration-300 text-lg font-bold flex items-center">
                            {/* Dashboard Icon */}
                            <svg className="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path d="M12 12c2.761 0 5-2.239 5-5s-2.239-5-5-5-5 2.239-5 5 2.239 5 5 5zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                            </svg>
                            Dashboard
                        </a>
                        <a href={`/Profile2/${username}?email=${email}`} className="text-white hover:text-gray-200 transition duration-300 text-lg font-bold flex items-center">
                            {/* Change Password Icon */}
                            <svg className="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path d="M12 0C5.372 0 0 5.372 0 12c0 6.627 5.372 12 12 12s12-5.373 12-12S18.628 0 12 0zm0 22C6.48 22 2 17.52 2 12S6.48 2 12 2s10 4.48 10 10-4.48 10-10 10z" />
                                <path d="M12 6c-3.313 0-6 2.688-6 6s2.688 6 6 6 6-2.688 6-6-2.688-6-6-6zm0 10c-2.211 0-4-1.789-4-4s1.789-4 4-4 4 1.789 4 4-1.789 4-4 4z" />
                            </svg>
                            Change Password
                        </a>
                        <a href={`/TestCollection/${username}?email=${email}`} className="text-white hover:text-gray-200 transition duration-300 text-lg font-bold flex items-center">
                            {/* Test Collection Icon */}
                            <svg className="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm0 22C6.48 22 2 17.52 2 12S6.48 2 12 2s10 4.48 10 10-4.48 10-10 10z" />
                                <path d="M12 4c-.55 0-1 .45-1 1v6H7c-.55 0-1 .45-1 1s.45 1 1 1h4v6c0 .55.45 1 1 1s1-.45 1-1v-6h4c.55 0 1-.45 1-1s-.45-1-1-1h-4V5c0-.55-.45-1-1-1z" />
                            </svg>
                            Test Collection
                        </a>
                    </div>
                </div>

                {/* Username and Logout Button for larger screens */}
                <div className="hidden sm:flex items-center gap-4">
                    <h2 className="text-xl font-bold">{username}</h2>
                    <button
                        className="flex items-center bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition duration-300 shadow-md"
                        onClick={handleLogout}
                    >
                        <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M16 13v-2h-8v2h8zm-6-6h-2v12h2v-12zm8-4v16h-12v-16h12zm0-2h-12c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2v-16c0-1.1-.9-2-2-2z" />
                        </svg>
                        Logout
                    </button>
                </div>
                
                {/* Mobile Dropdown Button */}
                <div className="md:hidden">
                    <button
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        className="text-white hover:text-gray-200 focus:outline-none"
                    >
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M4 6h16v2H4zm0 5h16v2H4zm0 5h16v2H4z" />
                        </svg>
                    </button>
                    {isDropdownOpen && (
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-20">
                            <a
                                href={`/StudentDashboard/${username}?email=${email}`}
                                className="block px-4 py-2 text-gray-800 hover:bg-gray-200"
                            >
                                Dashboard
                            </a>
                            <a
                                href={`/Profile2/${username}?email=${email}`}
                                className="block px-4 py-2 text-gray-800 hover:bg-gray-200"
                            >
                                Change Password
                            </a>
                            <a
                                href={`/TestCollection/${username}?email=${email}`}
                                className="block px-4 py-2 text-gray-800 hover:bg-gray-200"
                            >
                                Test Collection
                            </a>
                            <button
                                onClick={handleLogout}
                                className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-200"
                            >
                                Logout
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Main Content */}
            <div className="flex flex-col items-center justify-center flex-grow bg-teal-700 p-6">
                <h2 className="text-3xl font-semibold text-white">Change Password</h2>
                <form onSubmit={handleChangePassword} className="w-full max-w-md mt-4">
                    <div className="mb-4">
                        <label className="block text-white font-bold mb-2" htmlFor="currentPassword">
                            Current Password
                        </label>
                        <input
                            type="password"
                            id="currentPassword"
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-white font-bold mb-2" htmlFor="newPassword">
                            New Password
                        </label>
                        <input
                            type="password"
                            id="newPassword"
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-white font-bold mb-2" htmlFor="confirmPassword">
                            Confirm New Password
                        </label>
                        <input
                            type="password"
                            id="confirmPassword"
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                    </div>
                    {error && <p className="text-red-500 text-xs italic">{error}</p>}
                    {successMessage && <p className="text-green-500 text-xs italic" aria-live="polite">{successMessage}</p>}
                    <button
                        type="submit"
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-300 mt-4"
                    >
                        Change Password
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Profile2;
