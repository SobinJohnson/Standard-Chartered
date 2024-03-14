import React, { useState } from 'react';

const ChatBox = () => {
  const [messages, setMessages] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [options, setOptions] = useState([]);

  const questions = [
    { text: "What is your name?", options: ["John", "Alice", "Bob"] },
    { text: "What is your email address?", options: ["example1@example.com", "example2@example.com"] },
    { text: "What is your age?", options: ["18-24", "25-34", "35-44", "45+"] },
    // Add more questions here as needed
  ];

  const handleAnswer = (answer) => {
    setAnswers({ ...answers, [questions[currentQuestionIndex].text]: answer });
    setMessages([
      ...messages,
      { sender: 'user', text: answer }
    ]);
    setCurrentQuestionIndex(currentQuestionIndex + 1);
    setOptions([]);
  };

  const handleSend = () => {
    if (currentQuestionIndex < questions.length) {
      const currentQuestion = questions[currentQuestionIndex];
      setMessages([
        ...messages,
        { sender: 'bot', text: currentQuestion.text }
      ]);
      setOptions(currentQuestion.options);
    }
  };

  return (
    <div className="h-screen w-[420px] border-4 bg-gray-100 flex flex-col justify-end">
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
        {options.length > 0 && (
          <div className="flex justify-center gap-2">
            {options.map((option, index) => (
              <button key={index} className="bg-blue-500 text-white px-4 py-2 rounded-lg" onClick={() => handleAnswer(option)}>{option}</button>
            ))}
          </div>
        )}
        {currentQuestionIndex < questions.length && (
          <div className="flex justify-center mt-4">
            <button className="bg-blue-500 text-white px-4 py-2 rounded-lg" onClick={handleSend}>Send</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatBox;
