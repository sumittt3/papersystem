import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
const TestPage = ({ setShowNavButtons}) => {
    const location = useLocation();
    const navigate = useNavigate();
    const [paperDetails, setPaperDetails] = useState(null);
    const [timeLeft, setTimeLeft] = useState(0);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedAnswers, setSelectedAnswers] = useState([]);
    const [username,setUsername]=useState('');
    const [uniqueCode, setUniqueCode] = useState(''); 
    const [teacherUsername, setTeacherUsername] = useState('');
    const [showWarning, setShowWarning] = useState(true); 

    useEffect(() => {
        console.log(uniqueCode);
    }, [uniqueCode])
    useEffect(() => {
        console.log(username);
    }, [username])
    useEffect(() => {
        console.log({username});
        // Retrieve paper details from state or session storage
        if (location.state?.paperDetails) {
            sessionStorage.setItem('paperDetails', JSON.stringify(location.state.paperDetails));
            setPaperDetails(location.state.paperDetails);
        } else {
            const storedPaperDetails = sessionStorage.getItem('paperDetails');
            if (storedPaperDetails) {
                setPaperDetails(JSON.parse(storedPaperDetails));
            }
        }

        if (location.state?.username) {
            const name = location.state.username;
            sessionStorage.setItem('username', name);
            setUsername(name);
        } else {
            const storedUsername = sessionStorage.getItem('username');
            if (storedUsername) {
                setUsername(storedUsername);
            }
        }

         if (location.state?.uniqueCode) {
            const code = location.state.uniqueCode;
            sessionStorage.setItem('uniqueCode', code);
            setUniqueCode(code);
        } else {
            const storedCode = sessionStorage.getItem('uniqueCode');
            if (storedCode) {
                setUniqueCode(storedCode);
            }
        }
        if (location.state?.teacherUsername) {
            const teacher = location.state.teacherUsername;
            sessionStorage.setItem('teacherUsername', teacher);
            setTeacherUsername(teacher);
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
                    handleSubmit();
                    navigate('/student-login');
            }
        };

        const handleBeforeUnload = (event) => {
            const confirmationMessage = 'Are you sure you want to leave? Your progress will be lost.';
            event.returnValue = confirmationMessage; // Standard for most browsers
            return confirmationMessage; // Required for Safari
        };

        const handleKeyDown = (event) => {
            if (event.key === 'F5' || (event.ctrlKey && event.key === 'r') || (event.metaKey && event.key === 'r')) {
                event.preventDefault();
                event.stopPropagation();
            }
        };

        const handleContextMenu = (event) => {
            event.preventDefault();
        };

        document.addEventListener('fullscreenchange', handleFullscreenChange);
        document.addEventListener('mozfullscreenchange', handleFullscreenChange);
        document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
        document.addEventListener('msfullscreenchange', handleFullscreenChange);
        window.addEventListener('beforeunload', handleBeforeUnload);
        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('contextmenu', handleContextMenu);

        return () => {
            document.removeEventListener('fullscreenchange', handleFullscreenChange);
            document.removeEventListener('mozfullscreenchange', handleFullscreenChange);
            document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
            document.removeEventListener('msfullscreenchange', handleFullscreenChange);
            window.removeEventListener('beforeunload', handleBeforeUnload);
            window.removeEventListener('keydown', handleKeyDown);
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
                        handleSubmit();
                        return 0;
                    }
                    return prevTime - 1;
                });
            }, 1000);

            return () => clearInterval(timer);
        }
    }, [paperDetails]);

    useEffect(() => {
        setShowNavButtons(false); // Hide nav buttons when component mounts
        return () => {
            setShowNavButtons(true); // Show nav buttons when component unmounts
        };
    }, [setShowNavButtons]);

    const handleAnswerSelect = (questionIndex, option) => {
        if (selectedAnswers[questionIndex] === option) {
            // If it is selected, deselect it
            const newSelectedAnswers = [...selectedAnswers];
            newSelectedAnswers[questionIndex] = null; // or ''
            setSelectedAnswers(newSelectedAnswers);
        } else {
            // Otherwise, select the option
            const newSelectedAnswers = [...selectedAnswers];
            newSelectedAnswers[questionIndex] = option;
            setSelectedAnswers(newSelectedAnswers);
        }
        setCurrentQuestionIndex(questionIndex); 
        console.log('Selected Answers:', selectedAnswers); // Log selected answers
        console.log('Current Question Index:', questionIndex);
    };

    const handleNextQuestion = () => {
        setCurrentQuestionIndex(prevIndex => prevIndex + 1);
    };
    
    const handlePreviousQuestion = () => {
        setCurrentQuestionIndex(prevIndex => prevIndex - 1);
    };
    const handleSubmit = async () => {
        if (!paperDetails || !paperDetails.questions) {
            console.error('Paper details or questions are null or undefined.');
            return;
        }    
        const answersToSubmit = paperDetails.questions.map((question, index) => {
            const selectedOption = selectedAnswers[index] || 'none';
            const correctOption = question.Answer;
    
            return {
                questionId: question.QuestionId,
                questionTitle: question.QuestionTitle,
                selectedOption: selectedOption,
                correctOption: correctOption,
                isCorrect: selectedOption == correctOption,
            };
        });

        // Calculate score
        const score = answersToSubmit.reduce((totalScore, answer) => {
            return answer.isCorrect ? totalScore + 1 : totalScore;
        }, 0);
        // Prepare data to save
        const studentTest = {
            studentUsername: username, // Replace with actual username or fetch dynamically
            testName: paperDetails.paperName,
            testDate: new Date(),
            questions: answersToSubmit,
            Marks:score,
            uniqueCode:uniqueCode,
            teacherUsername: teacherUsername 
        };
        
        try {
            const response = await axios.post('http://localhost:3001/api/studentTests', studentTest);
            console.log('Test data saved:', response.data);
            alert('Test submitted successfully!');
            console.log(selectedAnswers);
            console.log(studentTest);
            // Implement your submission logic here
            console.log('Answers to submit:', answersToSubmit);
            console.log('score is ',score);
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

    return (
        <div className="min-h-screen bg-gray-500 p-8 w-screen">
            <div className="container mx-auto max-w-3xl">
                <h2 className="text-5xl font-bold mb-6 text-center font-serif text-white">{paperDetails.paperName}</h2>
                <p className="text-2xl mb-6 text-end font-mono text-white">Time Left: {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, '0')}</p>
                {showWarning && (
                    <div className="mb-6 bg-yellow-200 text-yellow-800 p-4 rounded-lg">
                        <p className="text-lg">Warning: Pressing ESC will submit the test. Do not press ESC again unless you want to submit.</p>
                    </div>
                )}
                <div className="mb-6">
                    <p className="text-lg mb-4 bg-white p-4 rounded-lg">{currentQuestion.QuestionTitle}</p>
                    {options.map((option, index) => (
                        <div
                            key={index}
                            className={`bg-white p-4 rounded-lg cursor-pointer mb-4 ${selectedAnswers[currentQuestionIndex] == option ? 'bg-green-400 text-yellow-500' : 'hover:bg-green-200 bg-blue-400'
                                }`}
                            onClick={() => handleAnswerSelect(currentQuestionIndex, option)}
                        >
                            <span className="text-lg font-medium">{String.fromCharCode(65 + index)}: {option}</span>
                        </div>
                    ))}

                </div>
                <div className="flex justify-between">
                    <button
                        onClick={handlePreviousQuestion}
                        disabled={isFirstQuestion}
                        className={`px-4 py-2 text-white ${isFirstQuestion ? 'bg-gray-500 opacity-50 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'}`}
                    >
                        Previous
                    </button>
                    {isLastQuestion ? (
                        <button
                            onClick={handleSubmit}
                            className="px-6 py-3 text-white bg-blue-500 rounded-md shadow-md hover:bg-blue-600 transition duration-300"
                        >
                            Submit Test
                        </button>
                    ) : (
                        <button
                            onClick={handleNextQuestion}
                            className="px-4 py-2 text-white bg-blue-500 rounded-md shadow-md hover:bg-blue-600 transition duration-300"
                        >
                            Next
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TestPage;
