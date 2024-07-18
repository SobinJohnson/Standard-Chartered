import React, { useState, useEffect } from "react";
import MainComponent from "./MainComponent";
import KYCCompletedPopup from "./KYCCompletedPopup";

const ChatBox = () => {
  const [messages, setMessages] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [options, setOptions] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [showCapturePhoto, setShowCapturePhoto] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState(null); // State to manage verification status
  const [showKYCCompletedPopup, setShowKYCCompletedPopup] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const questions = [
    {
      type: "text",
      text: "To begin with, could you provide me with your name?",
      validation: /^[a-zA-Z\s]+$/, // Only allow letters and spaces
      error: "Please enter a valid name.",
    },
    {
      type: "text",
      text: "Hey there, can you tell me your date of birth? (dd/mm/yyyy)",
      validation: /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/(19|20)\d\d$/, // Date format dd/mm/yyyy
      error: "Please enter a valid date of birth in the format dd/mm/yyyy.",
    },
    {
      type: "text",
      text: "Now, your address as well...",
      validation: /.+/, // Non-empty input
      error: "Please enter a valid address.",
    },
    {
      type: "text",
      text: "What is your Aadhaar number? (12 digits without any spaces)", // Added Aadhaar number question
      validation: /^\d{12}$/, // 12 digit number
      error: "Please enter a valid 12-digit Aadhaar number.",
    },
    {
      type: "info",
      text: "Grant access for webcam.", // Added Aadhaar number question
    },
  ];

  useEffect(() => {
    if (currentQuestionIndex < questions.length) {
      const currentQuestion = questions[currentQuestionIndex];
      setMessages([...messages, { sender: "bot", text: currentQuestion.text }]);
      if (currentQuestion.type === "options") {
        setOptions(currentQuestion.options);
      }
      if (currentQuestionIndex === 4) {
        setShowCapturePhoto(true);
      }
    }
  }, [currentQuestionIndex]);

  const handleAnswer = (answer) => {
    const currentQuestion = questions[currentQuestionIndex];
    if (
      currentQuestion.validation &&
      !currentQuestion.validation.test(answer)
    ) {
      setErrorMessage(currentQuestion.error);
      return;
    }
    setErrorMessage("");
    setAnswers({ ...answers, [questions[currentQuestionIndex].text]: answer });
    setMessages([...messages, { sender: "user", text: answer }]);
    setCurrentQuestionIndex(currentQuestionIndex + 1);
    setInputValue("");
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
      setMessages([...messages, { sender: "bot", text: currentQuestion.text }]);
      if (currentQuestion.type === "options") {
        setOptions(currentQuestion.options);
      }
      if (currentQuestionIndex === 4) {
        setShowCapturePhoto(true);
      }
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleAnswer(inputValue);
    }
  };
  // Function to handle document verification completion
  const handleDocumentVerified = () => {
    setVerificationStatus("Document Verified");
    setShowKYCCompletedPopup(true);
  };

  // Function to close KYC completed popup
  const handleCloseKYCCompletedPopup = () => {
    setShowKYCCompletedPopup(false);
    window.location.reload(); // Refresh the page
  };

  return (
    <div className="h-full sm:rounded-2xl sm:w-[420px] sm:pt-8 border-4 sm:ml-40 bg-gray-100 flex overflow-hidden flex-col justify-end">
        <h1 className="  block sm:hidden text-center pt-10 text-xl font-bold opacity-40">KYC Bot</h1>
      <div className="flex flex-col flex-grow overflow-scroll w-full overflow-x-hidden p-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex justify-${
              message.sender === "user" ? "end" : "start"
            } mb-2`}
          >
            <div
              className={`rounded-lg p-2 ${
                message.sender === "user"
                  ? "bg-blue-500 text-white self-end"
                  : "bg-white text-black self-start"
              }`}
            >
              {message.text}
            </div>
          </div>
        ))}
      </div>
      <div className="p-4">
        {questions[currentQuestionIndex] &&
          questions[currentQuestionIndex].type === "text" && (
            <div className="flex flex-col justify-center gap-2">
              <input
                type="text"
                className="border border-gray-400 rounded-lg px-4 py-2"
                value={inputValue}
                onKeyDown={handleKeyDown}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Type your answer here..."
              />
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded-lg"
                onClick={() => handleAnswer(inputValue)}
              >
                Send
              </button>
              {errorMessage && (
                <p className="text-red-500 text-sm mt-2">{errorMessage}</p>
              )}
            </div>
          )}
        {questions[currentQuestionIndex] &&
          questions[currentQuestionIndex].type === "info" && (
            <div className="flex justify-center gap-2">
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded-lg"
                onClick={handleSend}
              >
                Send
              </button>
            </div>
          )}
      </div>
      {showCapturePhoto && (
        <div className="flex justify-center items-center">
          <MainComponent onDocumentAnalyzed={handleDocumentVerified} />{" "}
          {/* Pass the handleDocumentVerified function */}
        </div>
      )}
      {verificationStatus && ( // Render the verification status if available
        <div className="mt-4 text-green-500">{verificationStatus}</div>
      )}
      {showKYCCompletedPopup && ( // Render KYC completed popup
        <KYCCompletedPopup onClose={handleCloseKYCCompletedPopup} />
      )}
    </div>
  );
};

export default ChatBox;
