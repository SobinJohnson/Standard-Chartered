// MainComponent.js
import React, { useState, useRef } from 'react';
import Webcam from 'react-webcam';
import FileInput from './FileInput';
import { AzureKeyCredential, DocumentAnalysisClient } from '@azure/ai-form-recognizer';
import { BlobServiceClient } from '@azure/storage-blob';

const MainComponent = ({ onDocumentAnalyzed }) => {
  const webcamRef = useRef(null);
  const [file, setFile] = useState(null);
  const [capturedImage, setCapturedImage] = useState(null);


  const onFileChange = (selectedFile) => {
    setFile(selectedFile);
  };

  const capturePhoto = () => {
    const imageSrc = webcamRef.current.getScreenshot();
    setCapturedImage(imageSrc);
  };

  const uploadFileToBlob = async () => {
    try {

      const connectionString = 'BlobEndpoint=https://aadharpandata.blob.core.windows.net/;QueueEndpoint=https://aadharpandata.queue.core.windows.net/;FileEndpoint=https://aadharpandata.file.core.windows.net/;TableEndpoint=https://aadharpandata.table.core.windows.net/;SharedAccessSignature=sv=2022-11-02&ss=bfqt&srt=sco&sp=rwdlacupiytfx&se=2024-03-28T03:15:25Z&st=2024-03-13T19:15:25Z&spr=https,http&sig=MPKNCKMcNe3Ey1yq%2FCsnQEul%2BYZE8kdxS37to6pY3p4%3D';
      const blobServiceClient = BlobServiceClient.fromConnectionString(connectionString);
      const containerName = 'data'; // Replace with your actual container name
      const containerClient = blobServiceClient.getContainerClient(containerName);

      const blockBlobClient = containerClient.getBlockBlobClient(file.name);
      await blockBlobClient.uploadBrowserData(file);

      const blobUrl = blockBlobClient.url;
      return blobUrl;
    } catch (error) {
      console.error('Error uploading file to Azure Blob Storage:', error);
      throw error;
    }
  };

  const analyzeDocument = async () => {
    try {
        const endpoint = 'https://aadharpan-data-extraction.cognitiveservices.azure.com/';
        const apiKey = 'd7935cc898aa4d1888bdbd3d09403532';
        let blobUrl=""

      if (capturedImage) {
        blobUrl = await uploadImageToBlob(capturedImage);
      
      }
      else{
        blobUrl = await uploadFileToBlob();
      }

      const client = new DocumentAnalysisClient(endpoint, new AzureKeyCredential(apiKey));
      const poller = await client.beginAnalyzeDocument('prebuilt-idDocument', blobUrl);

      const {
        documents: [result],
      } = await poller.pollUntilDone();
      onDocumentAnalyzed(result)
      // Handle the result based on your application's requirements
      console.log(result);
    } catch (error) {
      console.error('An error occurred:', error);
    }
  };

  const uploadImageToBlob = async (imageSrc) => {
    try {
      const connectionString = 'BlobEndpoint=https://aadharpandata.blob.core.windows.net/;QueueEndpoint=https://aadharpandata.queue.core.windows.net/;FileEndpoint=https://aadharpandata.file.core.windows.net/;TableEndpoint=https://aadharpandata.table.core.windows.net/;SharedAccessSignature=sv=2022-11-02&ss=bfqt&srt=sco&sp=rwdlacupiytfx&se=2024-03-28T03:15:25Z&st=2024-03-13T19:15:25Z&spr=https,http&sig=MPKNCKMcNe3Ey1yq%2FCsnQEul%2BYZE8kdxS37to6pY3p4%3D'; // Replace with your actual connection string
      const blobServiceClient = BlobServiceClient.fromConnectionString(connectionString);
      const containerName = 'data'; // Replace with your actual container name
      const containerClient = blobServiceClient.getContainerClient(containerName);

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
    console.error('Error uploading image to Azure Blob Storage:', error);
    throw error;
  }
};

  return (
    <div className='bg-white'>
      <Webcam 
        audio={false}
        ref={webcamRef}
        screenshotFormat="image/png"
        className='w-80 h-40 rounded-lg border-4'
        videoConstraints={{ width: 1280, height: 720 }}
      />
      <button onClick={capturePhoto}>Capture Photo</button>
      {capturedImage && <img src={capturedImage} alt="Captured" className='w-80 h-40 rounded-lg border-4'
 />}
      <FileInput onFileChange={onFileChange} />
      <button onClick={analyzeDocument}>Analyze Document</button>
    </div>
  );
};

export default MainComponent;




