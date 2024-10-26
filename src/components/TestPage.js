import React, { useEffect, useState, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

const TestPage = ({ setShowNavButtons }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const [paperDetails, setPaperDetails] = useState(null);
    const [timeLeft, setTimeLeft] = useState(0);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedAnswers, setSelectedAnswers] = useState([]);
    const [username, setUsername] = useState('');
    const [uniqueCode, setUniqueCode] = useState('');
    const [teacherUsername, setTeacherUsername] = useState('');
    const [showWarning, setShowWarning] = useState(true);
    const submitButtonRef = useRef(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const submitCountRef = useRef(0);

    useEffect(() => {
        // Retrieve paper details and user info from state or session storage
        const { paperDetails, username, uniqueCode, teacherUsername } = location.state || {};
        if (paperDetails) {
            sessionStorage.setItem('paperDetails', JSON.stringify(paperDetails));
            setPaperDetails(paperDetails);
        } else {
            const storedPaperDetails = sessionStorage.getItem('paperDetails');
            if (storedPaperDetails) {
                setPaperDetails(JSON.parse(storedPaperDetails));
            }
        }

        if (username) {
            sessionStorage.setItem('username', username);
            setUsername(username);
        } else {
            const storedUsername = sessionStorage.getItem('username');
            if (storedUsername) {
                setUsername(storedUsername);
            }
        }

        if (uniqueCode) {
            sessionStorage.setItem('uniqueCode', uniqueCode);
            setUniqueCode(uniqueCode);
        } else {
            const storedCode = sessionStorage.getItem('uniqueCode');
            if (storedCode) {
                setUniqueCode(storedCode);
            }
        }

        if (teacherUsername) {
            sessionStorage.setItem('teacherUsername', teacherUsername);
            setTeacherUsername(teacherUsername);
        } else {
            const storedTeacherUsername = sessionStorage.getItem('teacherUsername');
            if (storedTeacherUsername) {
                setTeacherUsername(storedTeacherUsername);
            }
        }

        console.log('Username:', username);
        console.log('Unique Code:', uniqueCode);

        const handleFullscreenChange = () => {
            if (!document.fullscreenElement) {
                if (submitButtonRef.current) {
                    submitButtonRef.current.click();
                }
            }
        };

        const handleBeforeUnload = (event) => {
            const confirmationMessage = 'Are you sure you want to leave? Your progress will be lost.';
            event.returnValue = confirmationMessage; // Standard for most browsers
            return confirmationMessage; // Required for Safari
        };

        const handleWindowBlur = () => {
            if (submitButtonRef.current) {
                submitButtonRef.current.click(); // Auto-submit the test
            }
        };

        const handleContextMenu = (event) => {
            event.preventDefault();
        };

        document.addEventListener('fullscreenchange', handleFullscreenChange);
        window.addEventListener('beforeunload', handleBeforeUnload);
        window.addEventListener('blur', handleWindowBlur);
        window.addEventListener('contextmenu', handleContextMenu);

        return () => {
            document.removeEventListener('fullscreenchange', handleFullscreenChange);
            window.removeEventListener('beforeunload', handleBeforeUnload);
            window.removeEventListener('blur', handleWindowBlur);
            window.removeEventListener('contextmenu', handleContextMenu);
        };
    }, [location.state, navigate]);

    useEffect(() => {
        if (paperDetails) {
            const totalTime = paperDetails.questions.length * 30; // Total time in seconds
            setTimeLeft(totalTime);

            const timer = setInterval(() => {
                setTimeLeft(prevTime => {
                    if (prevTime <= 1) {
                        clearInterval(timer);
                        if (submitButtonRef.current) {
                            submitButtonRef.current.focus();
                            submitButtonRef.current.click();
                        }
                        return 0;
                    } else {
                        return prevTime - 1;
                    }
                });
            }, 1000);

            return () => {
                clearInterval(timer);
            };
        }
    }, [paperDetails]);

    useEffect(() => {
        setShowNavButtons(false); // Hide nav buttons when component mounts
        return () => {
            setShowNavButtons(true); // Show nav buttons when component unmounts
        };  
    }, [setShowNavButtons]);

    const handleAnswerSelect = (questionIndex, option) => {
        const newSelectedAnswers = [...selectedAnswers];
        newSelectedAnswers[questionIndex] = newSelectedAnswers[questionIndex] === option ? null : option;
        setSelectedAnswers(newSelectedAnswers);
        setCurrentQuestionIndex(questionIndex);
    };

    const handleNextQuestion = () => {
        setCurrentQuestionIndex(prevIndex => prevIndex + 1);
    };

    const handlePreviousQuestion = () => {
        setCurrentQuestionIndex(prevIndex => prevIndex - 1);
    };

    const handleSubmit = async () => {
        if (isSubmitting || submitCountRef.current > 0) {
            return; // Prevent multiple submissions
        }

        setIsSubmitting(true); // Set submission in progress
        submitCountRef.current += 1;

        try {
            const answersToSubmit = paperDetails.questions.map((question, index) => {
                const selectedOption = selectedAnswers[index] || 'none';
                const correctOption = question.Answer;

                return {
                    questionId: question.QuestionId,
                    questionTitle: question.QuestionTitle,
                    selectedOption,
                    correctOption,
                    isCorrect: selectedOption === correctOption,
                };
            });

            const score = answersToSubmit.reduce((totalScore, answer) => totalScore + (answer.isCorrect ? 1 : 0), 0);

            const studentTest = {
                studentUsername: username,
                testName: paperDetails.paperName,
                testDate: new Date(),
                questions: answersToSubmit,
                Marks: score,
                uniqueCode,
                teacherUsername,
            };

            const response = await axios.post('https://papersystem.onrender.com/api/studentTests', studentTest);
            console.log('Test data saved:', response.data);
            alert('Test submitted successfully!');
            sessionStorage.clear();
            navigate('/student-login'); // Redirect after submission
        } catch (error) {
            console.error('Error saving test data:', error);
            alert('Failed to submit test. Please try again.');
        }
    };

    if (!paperDetails || !paperDetails.questions || paperDetails.questions.length === 0) {
        return (
            <div className="container mx-auto mt-8">
                <h2 className="text-2xl font-bold mb-4 text-center">Test Page</h2>
                <p className="text-lg">Loading paper details...</p>
            </div>
        );
    }

    const currentQuestion = paperDetails.questions[currentQuestionIndex];
    if (!currentQuestion) {
        return (
            <div className="container mx-auto mt-8">
                <h2 className="text-2xl font-bold mb-4 text-center">Test Page</h2>
                <p className="text-lg">Question details not available.</p>
            </div>
        );
    }

    const options = currentQuestion.QuestionOption.split(', ').map(option => option.substring(option.indexOf(': ') + 2));

    const totalQuestions = paperDetails.questions.length;
    const isFirstQuestion = currentQuestionIndex === 0;
    const isLastQuestion = currentQuestionIndex === totalQuestions - 1;
    const paperName = paperDetails.paperName.split('_')[0];

    return (
        <div className="min-h-screen bg-gray-500 p-4 w-full">
            <div className="container mx-auto max-w-3xl">
                <h2 className="text-3xl md:text-5xl font-bold mb-6 text-center font-serif text-white">{paperName}</h2>
                <p className="text-lg md:text-2xl mb-6 text-end font-mono text-white">Time Left: {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, '0')}</p>
                {showWarning && (
                    <div className="mb-6 bg-yellow-200 text-yellow-800 p-4 rounded-lg">
                        <p className="text-lg">Warning: Pressing ESC will submit the test. Do not press ESC again unless you want to submit. Additionally, switching to another window or application will also submit the test.</p>
                    </div>
                )}
                <div className="text-lg text-center mb-4 text-white">
                    <span>Question {currentQuestionIndex + 1} of {totalQuestions}</span>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-md mb-4">
                    <h3 className="text-xl font-semibold mb-2">{currentQuestion.QuestionTitle}</h3>
                    <ul className="list-disc list-inside">
                        {options.map((option, index) => (
                            <li key={index} className="mb-2">
                                <label className="cursor-pointer">
                                    <input
                                        type="radio"
                                        name={`question-${currentQuestionIndex}`}
                                        value={option}
                                        checked={selectedAnswers[currentQuestionIndex] === option}
                                        onChange={() => handleAnswerSelect(currentQuestionIndex, option)}
                                        className="mr-2"
                                    />
                                    {option}
                                </label>
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="flex justify-between mb-4">
                    <button
                        onClick={handlePreviousQuestion}
                        disabled={isFirstQuestion}
                        className={`px-4 py-2 bg-blue-500 text-white rounded-md ${isFirstQuestion ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        Previous
                    </button>
                    <button
                        onClick={handleNextQuestion}
                        disabled={isLastQuestion}
                        className={`px-4 py-2 bg-blue-500 text-white rounded-md ${isLastQuestion ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        Next
                    </button>
                </div>
                <button
                    onClick={handleSubmit}
                    ref={submitButtonRef}
                    className="w-full px-4 py-2 bg-green-500 text-white rounded-md"
                >
                    Submit Test
                </button>
            </div>
        </div>
    );
};

export default TestPage;
