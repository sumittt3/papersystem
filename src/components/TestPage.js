import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useRef } from 'react';

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
        console.log(uniqueCode);
    }, [uniqueCode]);

    useEffect(() => {
        console.log(username);
    }, [username]);

    useEffect(() => {
        console.log({ username });
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

        // Handle fullscreen change, before unload, keydown, etc.
        const handleFullscreenChange = () => {
            if (!document.fullscreenElement && 
                !document.webkitIsFullScreen && 
                !document.mozFullScreen && 
                !document.msFullscreenElement) {
                if (submitButtonRef.current) {
                    submitButtonRef.current.click();
                }
            }
        };

        const handleBeforeUnload = (event) => {
            const confirmationMessage = 'Are you sure you want to leave? Your progress will be lost.';
            event.returnValue = confirmationMessage; 
            return confirmationMessage; 
        };

        const handleKeyDown = (event) => {
            event.preventDefault();
            event.stopPropagation();
            event.cancelBubble = true;
            return false;
        };

        const handleWindowBlur = () => {
            if (submitButtonRef.current) {
                submitButtonRef.current.click(); 
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
        window.addEventListener('blur', handleWindowBlur);
        window.addEventListener('contextmenu', handleContextMenu);

        return () => {
            document.removeEventListener('fullscreenchange', handleFullscreenChange);
            document.removeEventListener('mozfullscreenchange', handleFullscreenChange);
            document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
            document.removeEventListener('msfullscreenchange', handleFullscreenChange);
            window.removeEventListener('beforeunload', handleBeforeUnload);
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('blur', handleWindowBlur);
            window.removeEventListener('contextmenu', handleContextMenu);
        };
    }, [location.state, navigate]);

    useEffect(() => {
        let submissionCompleted = false; 
        
        if (paperDetails) {
            const totalTime = paperDetails.questions.length * 30; 
            setTimeLeft(totalTime);
        
            const timer = setInterval(() => {
                setTimeLeft(prevTime => {
                    if (prevTime <= 1 && !submissionCompleted) {
                        clearInterval(timer);
                        if (submitButtonRef.current) {
                            submitButtonRef.current.focus(); 
                            submitButtonRef.current.click(); 
                        }
                        submissionCompleted = true; 
                        return 0;
                    } else if (prevTime > 1) {
                        return prevTime - 1;
                    }
                    return prevTime;
                });
            }, 1000);
        
            return () => {
                clearInterval(timer);
            };
        }
    }, [paperDetails, submitButtonRef]);

    useEffect(() => {
        setShowNavButtons(false); 
        return () => {
            setShowNavButtons(true); 
        };  
    }, [setShowNavButtons]);

    const handleAnswerSelect = (questionIndex, option) => {
        if (selectedAnswers[questionIndex] === option) {
            const newSelectedAnswers = [...selectedAnswers];
            newSelectedAnswers[questionIndex] = null; 
            setSelectedAnswers(newSelectedAnswers);
        } else {
            const newSelectedAnswers = [...selectedAnswers];
            newSelectedAnswers[questionIndex] = option;
            setSelectedAnswers(newSelectedAnswers);
        }
        setCurrentQuestionIndex(questionIndex);
        console.log('Selected Answers:', selectedAnswers); 
        console.log('Current Question Index:', questionIndex);
    };

    const handleNextQuestion = () => {
        setCurrentQuestionIndex(prevIndex => prevIndex + 1);
    };

    const handlePreviousQuestion = () => {
        setCurrentQuestionIndex(prevIndex => prevIndex - 1);
    };

    const handleSubmit = async () => {
        if (isSubmitting || submitCountRef.current > 0) {
            return; 
        }

        setIsSubmitting(true); 
        submitCountRef.current += 1;

        try {
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

            const score = answersToSubmit.reduce((totalScore, answer) => {
                return answer.isCorrect ? totalScore + 1 : totalScore;
            }, 0);

            const studentTest = {
                studentUsername: username,
                testName: paperDetails.paperName,
                testDate: new Date(),
                questions: answersToSubmit,
                Marks: score,
                uniqueCode: uniqueCode,
                teacherUsername: teacherUsername
            };    

            const response = await axios.post('https://papersystem.onrender.com/api/studentTests', studentTest);
            console.log('Test data saved:', response.data);
            alert('Test submitted successfully!');
            console.log(selectedAnswers);
            console.log(studentTest);
            console.log('Answers to submit:', answersToSubmit);
            console.log('score is ', score);
            sessionStorage.clear();
            navigate('/student-login'); 
        } catch (error) {
            if (error.code === 11000 && error.keyPattern && error.keyPattern.studentUsername === 1 && error.keyPattern.uniqueCode === 1) {
                console.log('Duplicate key error:', error.keyValue);
            } 
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

    return (
        <div className="flex flex-col justify-center items-center w-full p-4 sm:p-8 lg:p-12">
            <h2 className="text-3xl font-bold mb-4">{paperDetails.paperName}</h2>
            <p className="text-lg mb-4">Time Left: {Math.floor(timeLeft / 60)}:{('0' + (timeLeft % 60)).slice(-2)}</p>
            <div className="bg-white shadow-lg rounded-lg p-4 w-full md:w-1/2">
                <h3 className="text-xl font-semibold mb-2">{currentQuestion.QuestionTitle}</h3>
                <div className="flex flex-col space-y-4 mb-4">
                    {currentQuestion.AnswerOptions.map((option, index) => (
                        <button
                            key={index}
                            className={`border-2 rounded-lg py-2 px-4 transition duration-200 ease-in-out focus:outline-none ${
                                selectedAnswers[currentQuestionIndex] === option ? 'bg-blue-500 text-white border-blue-500' : 'bg-gray-100 text-black border-gray-300'
                            }`}
                            onClick={() => handleAnswerSelect(currentQuestionIndex, option)}
                        >
                            {option}
                        </button>
                    ))}
                </div>
                <div className="flex justify-between">
                    {currentQuestionIndex > 0 && (
                        <button className="bg-gray-300 hover:bg-gray-400 text-black py-2 px-4 rounded" onClick={handlePreviousQuestion}>
                            Previous
                        </button>
                    )}
                    {currentQuestionIndex < paperDetails.questions.length - 1 ? (
                        <button className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded" onClick={handleNextQuestion}>
                            Next
                        </button>
                    ) : (
                        <button
                            className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded"
                            onClick={handleSubmit}
                            ref={submitButtonRef}
                        >
                            Submit Test
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TestPage;
