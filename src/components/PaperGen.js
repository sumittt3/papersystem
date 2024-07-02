import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function PaperGen({username: initialUsername }) {
    const navigate = useNavigate();
    const [uniqueCode, setUniqueCode] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showTestButton, setShowTestButton] = useState(false);
    const [paperDetails, setPaperDetails] = useState({});
    const [username, setUsername] = useState(initialUsername);

    useEffect(() => {
        setUsername(initialUsername);
    }, [initialUsername]);

    const handleInputChange = (event) => {
        setUniqueCode(event.target.value);
    };

    const handleSubmit = async () => {
        if (uniqueCode.trim() === '') {
            setError('Code cannot be empty');
            setTimeout(() => setError(''), 3000); // Clear error after 3 seconds
            return;
        }

        setLoading(true);

        try {
            const response = await axios.post(`http://localhost:3001/api/check-code`, { uniqueCode,username });

            if (response.status === 200) {
                setPaperDetails({
                    paperName: response.data.paperName,
                    teacherUsername: response.data.teacherUsername,
                    questions: response.data.questions
                });
                setShowTestButton(true);
                setError(''); // Clear any previous errors on successful response
                setTimeout(() => setError(''), 3000); // Clear error after 3 seconds

            } else {
                setError('Unexpected error occurred'); // Handle unexpected statuses
                setPaperDetails({}); // Clear paper details on error
                setShowTestButton(false);
                setTimeout(() => setError(''), 3000); // Clear error after 3 seconds
            }
        } catch (error) {
            if (error.response && error.response.status === 404) {
                setError(error.response.data.error); // Handle specific 404 error message
            } else {
                console.error('Error checking code:', error);
                setError('An error occurred while checking the code');
            }
            setTimeout(() => setError(''), 3000); // Clear error after 3 seconds
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        console.log('Paper details updated:', paperDetails); // Log paperDetails when it updates
        console.log({username});
    }, [paperDetails]);

    const handleClear = () => {
        setUniqueCode('');
        setError('');
        setShowTestButton(false);
        setPaperDetails({});
    };

    const handleTestButtonClick = () => {
        console.log('Test button clicked!');
        console.log(paperDetails);

        // Navigate to '/TestPageEntrance' with paperDetails as state
        navigate('/TestPageEntrance', { state: { paperDetails,uniqueCode,username } });
    };

    return (
        <div className="flex flex-col items-center justify-center bg-white p-6 rounded-lg shadow-xl w-96">
            <h1 className="text-2xl font-bold text-gray-700 mb-4">Enter Unique Code</h1>
            <input
                type="text"
                value={uniqueCode}
                onChange={handleInputChange}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-md w-full text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Code"
            />
            {error && <p className="text-red-500 mt-2">{error}</p>}
            {showTestButton && (
                <button
                    onClick={handleTestButtonClick}
                    className="mt-4 px-4 py-2 text-2xl bg-blue-500 text-white font-semibold rounded-md shadow-md hover:bg-blue-600 transition duration-300"
                >
                    Test
                </button>
            )}
            {!showTestButton && (
                <div className="flex mt-4 gap-2">
                    <button
                        onClick={handleSubmit}
                        className="px-4 py-2 bg-purple-700 text-white font-semibold rounded-md shadow-md hover:bg-purple-800 transition duration-300"
                        disabled={loading}
                    >
                        {loading ? 'Submitting...' : 'Submit'}
                    </button>
                    <button
                        onClick={handleClear}
                        className="px-4 py-2 bg-gray-300 text-gray-700 font-semibold rounded-md shadow-md hover:bg-gray-400 transition duration-300"
                    >
                        Clear
                    </button>
                </div>
            )}
        </div>
    );
}

export default PaperGen;
