import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const TeacherDashboard = ({ setShowNavButtons }) => {
    const [papers, setPapers] = useState([]);
    const [totalTests, setTotalTests] = useState(0);
    const [totalStudents, setTotalStudents] = useState(0);
    const { username } = useParams();
    const navigate = useNavigate();
    const [topStudents, setTopStudents] = useState([]);
    const [studentTests, setStudentTests] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [dropdownOpen, setDropdownOpen] = useState(false);

    useEffect(() => {
        const fetchPapers = async () => {
            try {
                const response = await axios.get('https://papersystem.onrender.com/api/papers/count', {
                    params: {
                        username: username
                    }
                });
                setTotalTests(response.data.count);
            } catch (error) {
                console.error('Error fetching papers:', error);
            }
        };

        const fetchTotalStudents = async () => {
            try {
                const response = await axios.post('https://papersystem.onrender.com/api/students/countno', {
                    username: username
                });
                setTotalStudents(response.data.count);
            } catch (error) {
                console.error('Error fetching total students:', error);
            }
        };

        const fetchStudentTests = async () => {
            try {
                const response = await axios.post('https://papersystem.onrender.com/api/studenttestinfo', {
                    username: username
                });
                const updatedStudentTests = response.data.map(test => ({
                    ...test,
                    percentage: ((test.score / test.totalQuestions) * 100).toFixed(2)
                }));
                const sortedByScore = [...updatedStudentTests].sort((a, b) => b.score - a.score);
                setTopStudents(sortedByScore.slice(0, 3));
                setStudentTests(updatedStudentTests);
            } catch (error) {
                console.error('Error fetching student tests:', error);
            }
        };

        fetchPapers();
        fetchTotalStudents();
        fetchStudentTests();
    }, [username]);

    useEffect(() => {
        setShowNavButtons(false);
        return () => setShowNavButtons(true);
    }, [setShowNavButtons]);

    const handleLogout = () => {
        console.log('Logged out');
        sessionStorage.clear();
        navigate('/');
    };

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const filteredTests = studentTests.filter(test =>
        test.uniqueCode.toLowerCase().startsWith(searchTerm.toLowerCase())
    );

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
                        <a href={`/TeacherDashboard/${username}`} className="text-white hover:text-gray-200 transition duration-300 text-lg font-bold flex items-center">
                            <svg className="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path d="M12 12c2.761 0 5-2.239 5-5s-2.239-5-5-5-5 2.239-5 5 2.239 5 5 5zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                            </svg>
                            Dashboard
                        </a>
                        <a href={`/Profile/${username}`} className="text-white hover:text-gray-200 transition duration-300 text-lg font-bold flex items-center">
                            <svg className="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path d="M12 0C5.372 0 0 5.372 0 12c0 6.627 5.372 12 12 12s12-5.373 12-12S18.628 0 12 0zm0 22C6.48 22 2 17.52 2 12S6.48 2 12 2s10 4.48 10 10-4.48 10-10 10z" />
                                <path d="M12 6c-3.313 0-6 2.688-6 6s2.688 6 6 6 6-2.688 6-6-2.688-6-6-6zm0 10c-2.211 0-4-1.789-4-4s1.789-4 4-4 4 1.789 4 4-1.789 4-4 4z" />
                            </svg>
                            Change Password
                        </a>
                        <a href={`/Test/${username}`} className="text-white hover:text-gray-200 transition duration-300 text-lg font-bold flex items-center">
                            <svg className="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm0 22C6.48 22 2 17.52 2 12S6.48 2 12 2s10 4.48 10 10-4.48 10-10 10z" />
                                <path d="M12 4c-.55 0-1 .45-1 1v6H7c-.55 0-1 .45-1 1s.45 1 1 1h4v6c0 .55.45 1 1 1s1-.45 1-1v-6h4c.55 0 1-.45 1-1s-.45-1-1-1h-4V5c0-.55-.45-1-1-1z" />
                            </svg>
                            Create Test
                        </a>
                    </div>
                </div>

                {/* Username and Logout Button for larger screens */}
                <div className="hidden sm:flex items-center gap-4">
                    <div className="flex items-center gap-2 group">
                        <svg className="w-6 h-6 text-white group-hover:text-gray-200 transition duration-300" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 12c2.761 0 5-2.239 5-5s-2.239-5-5-5-5 2.239-5 5 2.239 5 5 5zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                        </svg>
                        <h2 className="text-xl font-bold group-hover:text-gray-200 transition duration-300">{username}</h2>
                    </div>
                    <button
                        className="flex items-center bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition duration-300 shadow-md"
                        onClick={handleLogout}
                    >
                        <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path d="M16 13v-2h-8v2h8zm-6-6h-2v12h2v-12zm8-4v16h-12v-16h12zm0-2h-12c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2v-16c0-1.1-.9-2-2-2z" />
                        </svg>
                        Logout
                    </button>
                </div>

                {/* Dropdown for smaller screens */}
                <div className="sm:hidden">
                    <button onClick={toggleDropdown} className="text-white flex items-center">
                        Menu
                        <svg className={`w-4 h-4 ml-1 transition-transform duration-300 ${dropdownOpen ? 'transform rotate-90' : ''}`} fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path d="M7 10l5 5 5-5H7z" />
                        </svg>
                    </button>
                    {dropdownOpen && (
                        <div className="absolute bg-gray-800 mt-2 rounded-lg shadow-lg p-4">
                            <a href={`/TeacherDashboard/${username}`} className="block text-white hover:text-gray-200 transition duration-300 text-lg font-bold">
                                Dashboard
                            </a>
                            <a href={`/Profile/${username}`} className="block text-white hover:text-gray-200 transition duration-300 text-lg font-bold">
                                Change Password
                            </a>
                            <a href={`/Test/${username}`} className="block text-white hover:text-gray-200 transition duration-300 text-lg font-bold">
                                Create Test
                            </a>
                            <button
                                className="flex items-center bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition duration-300 shadow-md mt-2 w-full"
                                onClick={handleLogout}
                            >
                                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M16 13v-2h-8v2h8zm-6-6h-2v12h2v-12zm8-4v16h-12v-16h12zm0-2h-12c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2v-16c0-1.1-.9-2-2-2z" />
                                </svg>
                                Logout
                            </button>
                        </div>
                    )}
                </div>
            </div>

            <div className="flex flex-col md:flex-row flex-grow p-4 gap-4">
                <div className='bg-white rounded-lg shadow-md p-4 flex flex-col justify-center items-center w-full'>
                    <h2 className='text-3xl font-bold mb-4'>Dashboard Overview</h2>
                    <div className='flex justify-around w-full'>
                        <div className='bg-blue-200 rounded-lg p-4 flex flex-col items-center'>
                            <h3 className='text-2xl font-bold'>{totalTests}</h3>
                            <p className='text-lg'>Total Tests Created</p>
                        </div>
                        <div className='bg-green-200 rounded-lg p-4 flex flex-col items-center'>
                            <h3 className='text-2xl font-bold'>{totalStudents}</h3>
                            <p className='text-lg'>Total Students</p>
                        </div>
                    </div>
                </div>

                <div className='bg-white rounded-lg shadow-md p-4 flex flex-col justify-center items-center w-full'>
                    <h2 className='text-3xl font-bold mb-4'>Top Students</h2>
                    {topStudents.map((student, index) => (
                        <div key={index} className="flex justify-between items-center bg-white rounded-lg shadow-md p-4 my-2 w-full">
                            <span className="text-lg font-semibold">{student.studentUsername}</span>
                            <span className="text-xl font-bold text-teal-700">{student.score}/{student.totalQuestions}</span>
                        </div>
                    ))}
                </div>
            </div>

            <div className='col-span-2 row-span-2 bg-white rounded-lg shadow-md p-4'>
                <h2 className='text-3xl font-bold mb-4'>Student Test Information</h2>
                <input
                    type="text"
                    value={searchTerm}
                    onChange={handleSearchChange}
                    placeholder="Search by Unique Code"
                    className="border border-gray-300 rounded-lg p-2 mb-4 w-full"
                />
                <div className="overflow-x-auto">
                    <table className="min-w-full border-collapse border border-gray-200">
                        <thead>
                            <tr>
                                <th className="border border-gray-200 px-10 py-4 text-left">#</th>
                                <th className="border border-gray-200 px-5 py-4 text-left">Username</th>
                                <th className="border border-gray-200 px-5 py-4 text-left">Score</th>
                                <th className="border border-gray-200 px-5 py-4 text-left">Date</th>
                                <th className="border border-gray-200 px-5 py-4 text-left">Unique Code</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredTests.length > 0 ? (
                                filteredTests.map((test, index) => (
                                    <tr key={test._id} className="hover:bg-gray-100">
                                        <td className="px-10 py-4 text-sm text-gray-900">{index + 1}</td>
                                        <td className="px-5 py-4 text-sm text-gray-900">{test.studentUsername}</td>
                                        <td className="px-5 py-4 text-sm text-gray-900">{test.score}/{test.totalQuestions}</td>
                                        <td className="px-5 py-4 text-sm text-gray-900">{new Date(test.testDate).toLocaleDateString()}</td>
                                        <td className="px-5 py-4 text-sm text-gray-900">{test.uniqueCode}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="text-center px-10 py-4 text-sm text-gray-500">No tests found for the search criteria.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
);
};

export default TeacherDashboard;
