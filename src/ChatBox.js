import React, { useState, useEffect } from 'react';
import MainComponent from './MainComponent';
import KYCCompletedPopup from './KYCCompletedPopup';

const ChatBox = () => {
  const [messages, setMessages] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [options, setOptions] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [showCapturePhoto, setShowCapturePhoto] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState(null); // State to manage verification status
  const [showKYCCompletedPopup, setShowKYCCompletedPopup] = useState(false);

  const questions = [
    { type: "text", text: "To begin with, could you provide me with your name?" },
    { type: "text", text: "Hey there, can you tell me your date of birth? (dd/mm/yyyy)" },
    { type: "text", text: "Now, your address as well..." },
    { type: "info", text: "Now, you will have to show your document through the webcam for verification. When you are ready, click on the capture button to capture your document and upload it." },
    { type: "info", text: "Please wait a moment, your verification is in progress." }
  ];

  useEffect(() => {
    if (currentQuestionIndex < questions.length) {
      const currentQuestion = questions[currentQuestionIndex];
      setMessages([
        ...messages,
        { sender: 'bot', text: currentQuestion.text }
      ]);
      if (currentQuestion.type === "options") {
        setOptions(currentQuestion.options);
      }
      if (currentQuestionIndex === 3) {
        setShowCapturePhoto(true);
      }
    }
  }, [currentQuestionIndex]);

  const handleAnswer = (answer) => {
    setAnswers({ ...answers, [questions[currentQuestionIndex].text]: answer });
    setMessages([
      ...messages,
      { sender: 'user', text: answer }
    ]);
    setCurrentQuestionIndex(currentQuestionIndex + 1);
    setInputValue('');
    setShowCalendar(false);
    setShowCapturePhoto(false);
    setOptions([]);
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
    setInputValue(date.toLocaleDateString());
    setShowCalendar(false);
  };

  const handleSend = () => {
    if (currentQuestionIndex < questions.length) {
      const currentQuestion = questions[currentQuestionIndex];
      setMessages([
        ...messages,
        { sender: 'bot', text: currentQuestion.text }
      ]);
      if (currentQuestion.type === "options") {
        setOptions(currentQuestion.options);
      }
      if (currentQuestionIndex === 3) {
        setShowCapturePhoto(true);
      }
    }
  };

  // Function to handle document verification completion
  const handleDocumentVerified = () => {
    setVerificationStatus('Document Verified');
    setShowKYCCompletedPopup(true);
  };

  // Function to close KYC completed popup
  const handleCloseKYCCompletedPopup = () => {
    setShowKYCCompletedPopup(false);
  };

  return (
    <div className="h-full rounded-2xl w-[420px] border-4 ml-40 bg-gray-100 flex overflow-hidden flex-col justify-end">
      <div className="flex flex-col flex-grow p-4">
        {messages.map((message, index) => (
          <div key={index} className={`flex justify-${message.sender === 'user' ? 'end' : 'start'} mb-2`}>
            <div className={`rounded-lg p-2 ${message.sender === 'user' ? 'bg-blue-500 text-white self-end' : 'bg-white text-black self-start'}`}>
              {message.text}
            </div>
          </div>
        ))}
      </div>
      <div className="p-4">
        {questions[currentQuestionIndex] && questions[currentQuestionIndex].type === "text" && (
          <div className="flex justify-center gap-2">
            <input
              type="text"
              className="border border-gray-400 rounded-lg px-4 py-2"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Type your answer here..."
            />
            <button className="bg-blue-500 text-white px-4 py-2 rounded-lg" onClick={() => handleAnswer(inputValue)}>Send</button>
          </div>
        )}
        {questions[currentQuestionIndex] && questions[currentQuestionIndex].type === "info" && (
          <div className="flex justify-center gap-2">
            <button className="bg-blue-500 text-white px-4 py-2 rounded-lg" onClick={handleSend}>Send</button>
          </div>
        )}
      </div>
      {showCapturePhoto && (
        <div className="flex justify-center items-center">
          <MainComponent onDocumentAnalyzed={handleDocumentVerified} /> {/* Pass the handleDocumentVerified function */}
        </div>
      )}
      {verificationStatus && ( // Render the verification status if available
        <div className="mt-4 text-green-500">
          {verificationStatus}
        </div>
      )}
      {showKYCCompletedPopup && ( // Render KYC completed popup
        <KYCCompletedPopup onClose={handleCloseKYCCompletedPopup} />
      )}
    </div>
  );
};

export default ChatBox;
