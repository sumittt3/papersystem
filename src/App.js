import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { FaBars, FaTimes } from 'react-icons/fa'; // Import icons for toggle button
import FileUploadPage from './components/FileUpload';
import StudentLoginPage from './components/StudentLoginPage';
import TeacherLoginPage from './components/TeacherLoginPage';
import Profile from './components/Profile';
import TeacherDashboard from './components/TeacherDashboard';
import Test from './components/Test';
import ProtectedRoute from './components/ProtectedRoute';
import StudentDashboard from './components/StudentDashboard';
import Profile2 from './components/Profile2';
import TestCollection from './components/TestCollection';
import ProtectedRoute2 from './components/ProtectedRoute2';
import TestPageEntrance from './components/TestPageEntrance';
import TestPage from './components/TestPage';

const App = () => {
  const [showNavButtons, setShowNavButtons] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // State to toggle mobile menu

  const handleFileUpload = (file) => {
    console.log('Processing Excel file:', file);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <Router>
      <div className="min-h-screen bg-gray-300 flex flex-col justify-center items-center">
        <Routes>
          <Route path="/" element={<FileUploadPage onFileUpload={handleFileUpload} />} />
          <Route path="/teacher-login" element={<TeacherLoginPage />} />
          <Route path="/student-login" element={<StudentLoginPage />} />
          <Route
            path="/TeacherDashboard/:username"
            element={
              <ProtectedRoute>
                <TeacherDashboard setShowNavButtons={setShowNavButtons} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/Profile/:username"
            element={
              <ProtectedRoute>
                <Profile setShowNavButtons={setShowNavButtons} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/Test/:username"
            element={
              <ProtectedRoute>
                <Test setShowNavButtons={setShowNavButtons} />
              </ProtectedRoute>
            }
          />
          <Route
            path="StudentDashboard/:username"
            element={
              <ProtectedRoute2>
                <StudentDashboard setShowNavButtons={setShowNavButtons} />
              </ProtectedRoute2>
            }
          />
          <Route
            path="/Profile2/:username"
            element={
              <ProtectedRoute2>
                <Profile2 setShowNavButtons={setShowNavButtons} />
              </ProtectedRoute2>
            }
          />
          <Route
            path="/TestCollection/:username"
            element={
              <ProtectedRoute2>
                <TestCollection setShowNavButtons={setShowNavButtons} />
              </ProtectedRoute2>
            }
          />
          <Route
            path="/TestPageEntrance"
            element={<TestPageEntrance setShowNavButtons={setShowNavButtons} />}
          />
          <Route
            path="/TestPage"
            element={<TestPage setShowNavButtons={setShowNavButtons} />}
          />
        </Routes>

        {/* Navigation Buttons */}
        {showNavButtons && (
          <div className="fixed top-4 right-4 sm:right-12">
            {/* Mobile Menu Toggle */}
            <button
              onClick={toggleMobileMenu}
              className="sm:hidden bg-gray-500 text-white p-2 rounded-full focus:outline-none"
            >
              {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
            </button>

            {/* Navigation Links */}
            <div
              className={`${isMobileMenuOpen ? 'block' : 'hidden'
                } sm:flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4 mt-2 sm:mt-0`}
            >
              <Link to="/" onClick={() => setIsMobileMenuOpen(false)}>
                <button className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-3 rounded w-full sm:w-auto text-center">
                  Home
                </button>
              </Link>
              <Link to="/teacher-login" onClick={() => setIsMobileMenuOpen(false)}>
                <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full sm:w-auto text-center">
                  Teacher Login
                </button>
              </Link>
              <Link to="/student-login" onClick={() => setIsMobileMenuOpen(false)}>
                <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded w-full sm:w-auto text-center">
                  Student Login
                </button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </Router>
  );
};

export default App;
