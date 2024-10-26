import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import PaperGen from './PaperGen'; // Adjust the path as necessary

const StudentDashboard = ({ setShowNavButtons }) => {
    const [papers, setPapers] = useState([]);
    const { username } = useParams();
    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const email = params.get('email');
    const navigate = useNavigate();
    const [dropdownOpen, setDropdownOpen] = useState(false);

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

    return (
        <div className="min-h-screen w-screen bg-teal-700 flex flex-col">
            <div className="bg-gray-800 text-white flex justify-between items-center px-4 py-2 sm:px-6 sm:py-4 shadow-lg">
                <div className="flex items-center gap-4 sm:gap-6">
                    <div className="flex items-center gap-2 bg-gradient-to-r from-blue-300 to-green-300 p-2 rounded-lg shadow-lg">
                        <span className="text-xl sm:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-green-600">
                            Question <span className="text-green-700">Craft</span>
                        </span>
                    </div>

                    {/* Navigation Links for larger screens */}
                    <div className="hidden sm:flex gap-6">
                        <a href={`/StudentDashboard/${username}?email=${email}`} className="text-white hover:text-gray-200 transition duration-300 text-lg font-bold flex items-center">
                            <svg className="w-6 h-6 mr-1" fill="currentColor" viewBox="0 0 24 24"><path d="M3 3h18v18H3V3zm2 2v14h14V5H5z" /></svg>
                            Dashboard
                        </a>
                        <a href={`/Profile2/${username}?email=${email}`} className="text-white hover:text-gray-200 transition duration-300 text-lg font-bold flex items-center">
                            <svg className="w-6 h-6 mr-1" fill="currentColor" viewBox="0 0 24 24"><path d="M16 4H8v4h8V4zm0 8H8v4h8v-4zm0 8H8v4h8v-4z" /></svg>
                            Change Password
                        </a>
                        <a href={`/TestCollection/${username}?email=${email}`} className="text-white hover:text-gray-200 transition duration-300 text-lg font-bold flex items-center">
                            <svg className="w-6 h-6 mr-1" fill="currentColor" viewBox="0 0 24 24"><path d="M3 3h18v2H3V3zm0 4h18v2H3V7zm0 4h18v2H3v-2zm0 4h18v2H3v-2zm0 4h18v2H3v-2z" /></svg>
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

                {/* Dropdown Menu for Mobile Devices */}
                <div className="relative sm:hidden">
                    <button
                        onClick={toggleDropdown}
                        className="flex items-center text-white hover:text-gray-200 transition duration-300"
                    >
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 16l-4-4h8z" />
                        </svg>
                    </button>

                    {dropdownOpen && (
                        <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-md shadow-lg z-10">
                            <a href={`/StudentDashboard/${username}?email=${email}`} className="flex items-center block text-left px-4 py-2 text-white hover:bg-gray-700">
                                <svg className="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M3 3h18v2H3V3zm0 4h18v2H3V7zm0 4h18v2H3v-2zm0 4h18v2H3v-2zm0 4h18v2H3v-2z" />
                                </svg>
                                Dashboard
                            </a>
                            <a href={`/Profile2/${username}?email=${email}`} className="flex items-center block text-left px-4 py-2 text-white hover:bg-gray-700">
                                <svg className="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M16 4H8v4h8V4zm0 8H8v4h8v-4zm0 8H8v4h8v-4z" />
                                </svg>
                                Change Password
                            </a>
                            <a href={`/TestCollection/${username}?email=${email}`} className="flex items-center block text-left px-4 py-2 text-white hover:bg-gray-700">
                                <svg className="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M3 3h18v2H3V3zm0 4h18v2H3V7zm0 4h18v2H3v-2zm0 4h18v2H3v-2zm0 4h18v2H3v-2z" />
                                </svg>
                                Test Collection
                            </a>
                            <button
                                className="flex items-center block w-full text-left px-4 py-2 text-white hover:bg-gray-700"
                                onClick={handleLogout}
                            >
                                <svg className="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M16 13v-2h-8v2h8zm-6-6h-2v12h2v-12zm8-4v16h-12v-16h12zm0-2h-12c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2v-16c0-1.1-.9-2-2-2z" />
                                </svg>
                                Logout
                            </button>
                        </div>
                    )}
                </div>
            </div>

            <div className="flex flex-col gap-4 text-white p-4 pt-6">
                <div>
                    <h1 className="text-3xl sm:text-5xl font-serif font-bold text-white outline-white pl-2 pt-3">
                        Welcome back, {username}
                    </h1>
                </div>

                {/* Render PaperGen Component */}
                <div className="flex justify-center place-content-center mt-10">
                    <PaperGen username={username} email={email} />
                </div>
            </div>
        </div>
    );
};

export default StudentDashboard;
