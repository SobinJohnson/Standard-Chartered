// MainComponent.js
import React, { useState, useRef } from "react";
import Webcam from "react-webcam";
import FileInput from "./FileInput";
import loader from "./images/loader.gif";
import {
  AzureKeyCredential,
  DocumentAnalysisClient,
} from "@azure/ai-form-recognizer";
import { BlobServiceClient } from "@azure/storage-blob";

const MainComponent = ({ onDocumentAnalyzed }) => {
  const webcamRef = useRef(null);
  const [file, setFile] = useState(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [showLoader, setShowLoader] = useState(false);

  const onFileChange = (selectedFile) => {
    setFile(selectedFile);
    setCapturedImage(null);
  };

  const capturePhoto = () => {
    const imageSrc = webcamRef.current.getScreenshot();
    setCapturedImage(imageSrc);
    setFile(null);
  };

  const analyzeDocument = async () => {
    try {
      setShowLoader(true);
      const endpoint =
        "https://aadharpan-data-extraction.cognitiveservices.azure.com/";
      const apiKey = "d7935cc898aa4d1888bdbd3d09403532";
      let blobUrl = "";

      if (capturedImage) {
        blobUrl = await uploadImageToBlob(capturedImage);
      } else {
        blobUrl = await uploadFileToBlob();
      }

      const client = new DocumentAnalysisClient(
        endpoint,
        new AzureKeyCredential(apiKey)
      );
      const poller = await client.beginAnalyzeDocument(
        "prebuilt-idDocument", //national id card
        blobUrl
      );

      const {
        documents: [result],
      } = await poller.pollUntilDone();
      setShowLoader(false);
      onDocumentAnalyzed(result);
      // Handle the result based on your application's requirements
      console.log(result);
    } catch (error) {
      console.error("An error occurred:", error);
    }
  };
  const uploadFileToBlob = async () => {
    try {
      const connectionString =
        "BlobEndpoint=https://aadharpandata.blob.core.windows.net/;QueueEndpoint=https://aadharpandata.queue.core.windows.net/;FileEndpoint=https://aadharpandata.file.core.windows.net/;TableEndpoint=https://aadharpandata.table.core.windows.net/;SharedAccessSignature=sv=2022-11-02&ss=bf&srt=sco&sp=rwdlaciytfx&se=2025-07-05T03:26:19Z&st=2024-07-04T19:26:19Z&spr=https,http&sig=y0G9rpGEZWDTygq8Mb4q%2FPx9ZbxlENrGNqxdgUnXwTQ%3D";
      const blobServiceClient =
        BlobServiceClient.fromConnectionString(connectionString);
      const containerName = "data"; // Replace with your actual container name
      const containerClient =
        blobServiceClient.getContainerClient(containerName);
      const blockBlobClient = containerClient.getBlockBlobClient(file.name);
      await blockBlobClient.uploadBrowserData(file);
      const blobUrl = blockBlobClient.url;
      return blobUrl;
    } catch (error) {
      console.error("Error uploading file to Azure Blob Storage:", error);
      throw error;
    }
  };

  const uploadImageToBlob = async (imageSrc) => {
    try {
      const connectionString =
        "BlobEndpoint=https://aadharpandata.blob.core.windows.net/;QueueEndpoint=https://aadharpandata.queue.core.windows.net/;FileEndpoint=https://aadharpandata.file.core.windows.net/;TableEndpoint=https://aadharpandata.table.core.windows.net/;SharedAccessSignature=sv=2022-11-02&ss=bf&srt=sco&sp=rwdlaciytfx&se=2025-07-05T03:26:19Z&st=2024-07-04T19:26:19Z&spr=https,http&sig=y0G9rpGEZWDTygq8Mb4q%2FPx9ZbxlENrGNqxdgUnXwTQ%3D";
      const blobServiceClient =
        BlobServiceClient.fromConnectionString(connectionString);
      const containerName = "data"; // Replace with your actual container name
      const containerClient =
        blobServiceClient.getContainerClient(containerName);

      // Generate a unique filename for the image
      const fileName = `captured_image_${Date.now()}.png`;

      // Convert data URI to Blob
      const response = await fetch(imageSrc);
      const blob = await response.blob();

      const blockBlobClient = containerClient.getBlockBlobClient(fileName);
      await blockBlobClient.uploadBrowserData(blob);

      const blobUrl = blockBlobClient.url;
      return blobUrl;
    } catch (error) {
      console.error("Error uploading image to Azure Blob Storage:", error);
      throw error;
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75 z-20   w-full">
      <div className=" bg-slate-100 p-8 rounded-lg shadow-lg text-center flex items-center justify-center flex-col  space-y-4">
        {!capturedImage && (
          <p className="text-left text-blue-400 font-bold text-3xl">
            Capture a photo of your document or upload a file
          </p>
        )}
        <Webcam
          audio={false}
          ref={webcamRef}
          screenshotFormat="image/png"
          className={`transition-all duration-700
          rounded-lg  object-cover ${
            capturedImage
              ? "absolute inset-6 w-72 shadow-xl shadow-slate-500"
              : "w-[800px] "
          }`}
          videoConstraints={{ width: 1280, height: 720 }}
        />
        {capturedImage && (
          <>
            <p className="text-left text-blue-400 font-bold text-3xl">
              Captured Photo :
            </p>
            <img
              src={capturedImage}
              alt="Captured"
              className="w-[800px] object-cover border-blue-300 rounded-lg border-4"
            />
          </>
        )}
        <div className="flex items-center justify-evenly w-full">
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded-lg"
            onClick={capturePhoto}
          >
            {capturedImage ? "Recapture Photo" : "Capture Photo"}
          </button>
          <div>
            <FileInput onFileChange={onFileChange} />
          </div>

          <button
            className="bg-blue-500 text-white px-4 py-2 rounded-lg"
            onClick={analyzeDocument}
          >
            Analyze Document
          </button>
          {showLoader && (
            <div className="absolute inset-0 text-white font-bold text-xl flex justify-center items-center bg-[#000000ca] z-30">
              <img src={loader} alt="Loader" />
              Please wait while we analyze your document...
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MainComponent;
