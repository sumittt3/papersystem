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

    useEffect(() => {
        const fetchPapers = async () => {
            try {
                const response = await axios.get(`http://localhost:3001/api/papers/count`, {
                    params: {
                        username: username // Assuming 'username' is defined somewhere in your component
                    }
                });
                setTotalTests(response.data.count); // Assuming your backend sends the count as { count: <number> }
            } catch (error) {
                console.error('Error fetching papers:', error);
            }
        };

        const fetchTotalStudents = async () => {
            try {
                const response = await axios.post(`http://localhost:3001/api/students/countno`, {
                    username: username // Assuming 'username' is defined somewhere in your component
                });
                setTotalStudents(response.data.count); // Assuming your backend sends the count as { count: <number> }
            } catch (error) {
                console.error('Error fetching total students:', error);
            }
        };
        const fetchStudentTests = async () => {
            try {
                const response = await axios.post(`http://localhost:3001/api/studenttestinfo`, {
                        username: username // Send the username to match in student tests
                    });
                console.log(response.data);
                setStudentTests(response.data); // Assuming your backend sends an array of student tests
                const updatedStudentTests = response.data.map(test => ({
                    ...test,
                    percentage: ((test.score / test.totalQuestions) * 100).toFixed(2) // Calculate percentage and round to 2 decimal places
                }));
                const sortedByScore = [...updatedStudentTests].sort((a, b) => b.score - a.score);
                setTopStudents(sortedByScore.slice(0, 3)); 
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

    return (
        <div className="min-h-screen w-screen bg-teal-700 flex flex-col">
            <div className="bg-gray-800 text-white flex justify-between items-center px-6 py-4 shadow-lg">
                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2 bg-gradient-to-r from-blue-300 to-green-300 p-2 rounded-lg shadow-lg">
                        <span className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-green-600">
                            Question <span className="text-green-700">Craft</span>
                        </span>
                    </div>
                    <div className="flex flex-row gap-6 mt-0">
                        <a href={`/TeacherDashboard/${username}`} className="text-white hover:text-gray-200 transition duration-300 text-lg font-bold">Dashboard</a>
                        <a href={`/Profile/${username}`} className="text-white hover:text-gray-200 transition duration-300 text-lg font-bold">Change Password</a>
                        <a href={`/Test/${username}`} className="text-white hover:text-gray-200 transition duration-300 text-lg font-bold">Create Test</a>
                    </div>
                </div>

                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2 group">
                        <svg className="w-6 h-6 text-white group-hover:text-gray-200 transition duration-300" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 12c2.761 0 5-2.239 5-5s-2.239-5-5-5-5 2.239-5 5 2.239 5 5 5zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                        </svg>
                        <h2 className="text-xl font-bold group-hover:text-gray-200 transition duration-300">{username}</h2>
                    </div>
                    <div>
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
                </div>
            </div>
            <div className="grid grid-cols-4 grid-rows-3 gap-x-28 text-white p-4 pt-6">
                <div className='col-span-2 row-span-1'>
                    <h1 className="text-5xl font-serif font-bold text-white outline-white pl-4 pt-3">Welcome back, {username}</h1>
                </div>

                <div className='row-span-3 col-span-2 bg-slate-700'>
                    <section id="top-performing-students" className="flex flex-wrap">
                        <h2 className='text-3xl font-bold pl-56 pt-1'>Top Student </h2>
                        {topStudents.map((student, index) => (
                            <div key={index} className="bg-white rounded-lg shadow-md p-4 pt-0 m-1 mt-3 w-96 h-20 ">
                                <h3 className="text-lg font-bold text-black">{index + 1}. {student.studentUsername}</h3>
                                <p className="text-gray-600">Test Score: {student.score}/{student.totalQuestions}</p>
                                <p className="text-gray-600">Percentage: {student.percentage}%</p>
                            </div>
                        ))}
                    </section>
                </div>
                <div className='row-span-1 col-span-2 -mt-3'>
                    <section id="tests-generated" className="mb-8 text-center row-span-2 col-span-2">
                        <div className="bg-gray-700 rounded-full shadow-lg p-2 mx-auto flex flex-col items-center justify-center">
                            <h2 className="text-2xl font-bold mb-2 text-white">Total Test Created</h2>
                            <p className="text-gray-200 text-3xl">{totalTests}</p>
                        </div>
                    </section>
                </div>
                <div className='row-span-1 col-span-2 -mt-5'><section id="students-taking-tests" className="mb-8 text-center">
                    <div className="bg-gray-700 rounded-full shadow-lg p-2 mx-auto flex flex-col items-center justify-center">
                        <h2 className="text-2xl font-bold mb-2 text-white">Total Students Taking Tests</h2>
                        <p className="text-gray-200 text-3xl">{totalStudents}</p>
                    </div>
                </section></div>
            </div>
            <div className='bg-slate-50'>
                <h2 className="text-2xl font-bold text-gray-900 mx-auto max-w-7xl px-4 py-6">Student Test Information</h2>
                <div className="overflow-x-auto">
                    <table className="w-screen mx-auto divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr className="text-left">
                                <th scope="col" className="px-10 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Sr.No</th>
                                <th scope="col" className="px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Student UserName</th>
                                <th scope="col" className="px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Paper Name</th>
                                <th scope="col" className="px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Score</th>
                                <th scope="col" className="px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Date of Test</th>
                                <th scope="col" className="px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Set Unique Code</th>

                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {studentTests.map((test, index) => (
                                <tr key={index}>
                                    <td className="px-10 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{index + 1}</td>
                                    <td className="px-5 py-4 whitespace-nowrap text-sm text-gray-500">{test.studentUsername}</td>
                                    <td className="px-5 py-4 whitespace-nowrap text-sm text-gray-500">{test.testName}</td>
                                    <td className="px-5 py-4 whitespace-nowrap text-sm text-gray-500">{test.score}/{test.totalQuestions}</td>
                                    <td className="px-5 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(test.testDate).toLocaleDateString()}</td>
                                    <td className="px-5 py-4 whitespace-nowrap text-sm text-gray-500">{test.uniqueCode}</td>

                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

        </div>
    );
};

export default TeacherDashboard;
