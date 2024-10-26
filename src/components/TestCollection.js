import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams, useLocation } from 'react-router-dom';

const TestCollection = ({ setShowNavButtons }) => {
    const [testCollections, setTestCollections] = useState([]);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const location = useLocation();
    const { username } = useParams();
    const params = new URLSearchParams(location.search);
    const email = params.get('email');

    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);

    // Fetch test collections from the API
    useEffect(() => {
        const fetchTestCollections = async () => {
            try {
                const response = await axios.post('https://papersystem.onrender.com/api/student/test-collections');
                if (response.data && response.data.collections) {
                    setTestCollections(response.data.collections);
                } else {
                    setTestCollections([]);
                    setError('Failed to fetch test collections. Please try again later.');
                }
            } catch (error) {
                setError('Failed to fetch test collections. Please try again later.');
            }
        };

        fetchTestCollections();
    }, []);

    useEffect(() => {
        setShowNavButtons(false); // Hide navigation buttons when Test Collection page is active
        return () => setShowNavButtons(true); // Reset when component unmounts
    }, [setShowNavButtons]);

    const handleLogout = () => {
        sessionStorage.clear();
        navigate('/');
    };

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
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
                            <svg className="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path d="M12 12c2.761 0 5-2.239 5-5s-2.239-5-5-5-5 2.239-5 5 2.239 5 5 5zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                            </svg>
                            Dashboard
                        </a>
                        <a href={`/Profile2/${username}?email=${email}`} className="text-white hover:text-gray-200 transition duration-300 text-lg font-bold flex items-center">
                            <svg className="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path d="M12 0C5.372 0 0 5.372 0 12c0 6.627 5.372 12 12 12s12-5.373 12-12S18.628 0 12 0zm0 22C6.48 22 2 17.52 2 12S6.48 2 12 2s10 4.48 10 10-4.48 10-10 10z" />
                                <path d="M12 6c-3.313 0-6 2.688-6 6s2.688 6 6 6 6-2.688 6-6-2.688-6-6-6zm0 10c-2.211 0-4-1.789-4-4s1.789-4 4-4 4 1.789 4 4-1.789 4-4 4z" />
                            </svg>
                            Change Password
                        </a>
                        <a href={`/TestCollection/${username}?email=${email}`} className="text-white hover:text-gray-200 transition duration-300 text-lg font-bold flex items-center">
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

                {/* Dropdown Menu for Mobile Devices */}
                <div className="relative sm:hidden">
                    <button
                        onClick={toggleDropdown}
                        className="flex items-center text-white hover:text-gray-200 transition duration-300"
                    >
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M4 6h16v2H4zm0 5h16v2H4zm0 5h16v2H4z" />
                        </svg>
                    </button>

                    {dropdownOpen && (
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10">
                            <a href={`/StudentDashboard/${username}?email=${email}`} className="flex items-center block text-left px-4 py-2 text-gray-800 hover:bg-gray-700">
                                Dashboard
                            </a>
                            <a href={`/Profile2/${username}?email=${email}`} className="flex items-center block text-left px-4 py-2 text-gray-800 hover:bg-gray-700">
                                Change Password
                            </a>
                            <a href={`/TestCollection/${username}?email=${email}`} className="flex items-center block text-left px-4 py-2 text-gray-800 hover:bg-gray-700">
                                Test Collection
                            </a>
                            <button
                                className="flex items-center w-full text-left px-4 py-2 text-red-500 hover:bg-red-100"
                                onClick={handleLogout}
                            >
                                Logout
                            </button>
                        </div>
                    )}
                </div>
            </div>

            <div className="container mx-auto px-4 py-8">
                <h2 className="text-3xl font-bold mb-4 text-white">Test Collection</h2>
                {error && <div className="text-red-500 mb-4">{error}</div>}

                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 bg-white rounded-lg">
                        <thead className="bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sr. No.</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Test Paper Name</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Teacher Username</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Number of Questions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {testCollections.length > 0 ? (
                                testCollections.map((collection, index) => {
                                    // Split the paperName to get only the papername part
                                    const paperName = collection.paperName.split('_')[0];

                                    return (
                                        <tr key={index}>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{index + 1}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{paperName}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{collection.teacherUsername}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{collection.totalQuestions}</td>
                                        </tr>
                                    );
                                })
                            ) : (
                                <tr>
                                    <td colSpan="4" className="px-6 py-4 text-center text-gray-500">No test collections found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Responsive Stack for Mobile Devices */}
                <div className="block sm:hidden mt-4">
                    {testCollections.length > 0 ? (
                        testCollections.map((collection, index) => (
                            <div key={index} className="border rounded-lg mb-2 p-4 bg-white">
                                <h3 className="font-bold text-gray-900">Test {index + 1}</h3>
                                <p><strong>Test Paper Name:</strong> {collection.paperName.split('_')[0]}</p>
                                <p><strong>Teacher Username:</strong> {collection.teacherUsername}</p>
                                <p><strong>Number of Questions:</strong> {collection.totalQuestions}</p>
                            </div>
                        ))
                    ) : (
                        <div className="text-center text-gray-500">No test collections found.</div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TestCollection;
