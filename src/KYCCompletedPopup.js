import React from 'react';

const KYCCompletedPopup = ({ onClose }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75 z-50">
      <div className="bg-white p-8 rounded-lg shadow-lg text-center">
        <h2 className="text-2xl font-bold text-green-500 mb-4">KYC Completed!</h2>
        <p className="text-lg">Your document has been verified successfully.</p>
        <button className="bg-blue-500 text-white px-4 py-2 rounded-lg mt-4" onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default KYCCompletedPopup;
