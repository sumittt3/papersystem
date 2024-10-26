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
                        <a href={`/StudentDashboard/${username}?email=${email}`} className="text-white hover:text-gray-200 transition duration-300 text-lg font-bold">Dashboard</a>
                        <a href={`/Profile2/${username}?email=${email}`} className="text-white hover:text-gray-200 transition duration-300 text-lg font-bold">Change Password</a>
                        <a href={`/TestCollection/${username}?email=${email}`} className="text-white hover:text-gray-200 transition duration-300 text-lg font-bold">Test Collection</a>
                    </div>
                </div>

                {/* Dropdown Menu for Mobile Devices */}
                <div className="relative sm:hidden">
                    <button
                        onClick={toggleDropdown}
                        className="flex items-center text-white hover:text-gray-200 transition duration-300"
                    >
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 16l-4-4h8z" />
                        </svg>
                    </button>

                    {dropdownOpen && (
                        <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-md shadow-lg z-10">
                            <a href={`/StudentDashboard/${username}?email=${email}`} className="block text-left px-4 py-2 text-white hover:bg-gray-700">
                                Dashboard
                            </a>
                            <a href={`/Profile2/${username}?email=${email}`} className="block text-left px-4 py-2 text-white hover:bg-gray-700">
                                Change Password
                            </a>
                            <a href={`/TestCollection/${username}?email=${email}`} className="block text-left px-4 py-2 text-white hover:bg-gray-700">
                                Test Collection
                            </a>
                            <button
                                className="block w-full text-left px-4 py-2 text-white hover:bg-gray-700"
                                onClick={handleLogout}
                            >
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
