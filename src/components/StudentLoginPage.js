import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const StudentLoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [formHeight, setFormHeight] = useState('h-80');
  const navigate = useNavigate();

  const handleLogin = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post('http://localhost:3001/api/student/login', { username, password });
      console.log('Login response:', response.data); // Log successful login message

      // Assuming your server returns a token upon successful login
      const token = response.data.token;

      // Store token and username in sessionStorage or localStorage
      sessionStorage.setItem('studentLoggedIn', 'true');
      sessionStorage.setItem('studentUsername', username);
      console.log("student log in");

      // Redirect to StudentDashboard or another page upon successful login
      navigate(`/StudentDashboard/${username}`);
    } catch (error) {
      console.error('Login error:', error);
      setError('Invalid username or password');
      setFormHeight('h-[350px]'); // Adjust form height for error message

      // Handle specific error messages from the server response
      if (error.response && error.response.data && error.response.data.message) {
        setError(error.response.data.message);
      } else {
        setError('Login failed. Please try again later.');
      }

      // Clear error message after 2 seconds
      setTimeout(() => {
        setError('');
        setFormHeight('h-80'); // Reset form height after clearing error
      }, 2000);
    }
  };

  const handleSignUp = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post('http://localhost:3001/api/student/signup', { username, email, password });
      console.log('Signup response:', response.data); // Log successful signup message
      alert('Account created successfully!');
      // Clear form fields after account creation
      setUsername('');
      setEmail('');
      setPassword('');
      toggleSignUp();

    } catch (error) {
      console.error('Signup error:', error);
      if (error.response && error.response.data && error.response.data.message) {
        setError(error.response.data.message);
      } else {
        setError('Error creating account');
      }
      setFormHeight('h-[480px]'); // Adjust form height for error message
      // Clear error message after 2 seconds
      setTimeout(() => {
        setError('');
        setFormHeight('h-[460px]'); // Reset form height after clearing error
      }, 2000);
    }
  };

  const toggleSignUp = () => {
    setIsSignUp(!isSignUp);
    setFormHeight(isSignUp ? 'h-80' : 'h-[460px]'); // Toggle form height for signup form
    setUsername('');
    setPassword('');
    setEmail('');
    setError('');
  };

  return (
    <div className="max-h-screen bg-gray-200 flex justify-center items-center">
      <div className={`w-96 max-w-md p-8 bg-white rounded-lg shadow-lg ${formHeight}`}>
        <h1 className="text-3xl font-extrabold text-center text-gray-800 mb-6">
          {isSignUp ? 'Create Student Account' : 'Student Login'}
        </h1>
        <form onSubmit={isSignUp ? handleSignUp : handleLogin} className="space-y-4">
          {error && (
            <p className="text-red-500 text-sm text-center mb-4">
              {error}
            </p>
          )}
          {isSignUp && (
            <div className="form-group">
              <label htmlFor="registerUsername" className="block text-sm font-medium text-gray-700">
                Username
              </label>
              <input
                type="text"
                id="registerUsername"
                className="form-input mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                required
              />
            </div>
          )}
          <div className="form-group">
            <label htmlFor="loginName" className="block text-sm font-medium text-gray-700">
              {isSignUp ? 'Email' : ' Username'}
            </label>
            <input
              type="text"
              id="loginName"
              className="form-input mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={isSignUp ? email : username}
              onChange={isSignUp ? (e) => setEmail(e.target.value) : (e) => setUsername(e.target.value)}
              placeholder={isSignUp ? 'Enter your email' : 'Enter your email or username'}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="loginPassword" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              id="loginPassword"
              className="form-input mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
          </div>
          <div className="flex items-center justify-between">
            <button
              type="submit"
              className="w-full bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50"
            >
              {isSignUp ? 'Create Account' : 'Log in'}
            </button>
            <button
              type="button"
              className="text-sm text-indigo-600 hover:text-indigo-800 focus:outline-none"
              onClick={toggleSignUp}
            >
              {isSignUp ? 'Already have an account? Log in' : 'Create a new account'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StudentLoginPage;
