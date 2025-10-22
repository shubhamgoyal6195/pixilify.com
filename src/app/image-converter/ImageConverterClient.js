// src/app/image-converter/ImageConverterClient.jsx
'use client';

import React, { useState } from 'react';

const ImageConverterClient = () => {
  const [imageSrc, setImageSrc] = useState(null);
  const [outputFormat, setOutputFormat] = useState('image/png');
  const [quality, setQuality] = useState(0.9); // Used for JPEG/WEBP
  const [fileName, setFileName] = useState('');

  // Helper to create an image element from a data URL
  const createImage = (url) =>
    new Promise((resolve, reject) => {
      const image = new Image();
      image.onload = () => resolve(image);
      image.onerror = (error) => reject(error);
      image.src = url;
    });

  // 1. Handle File Upload
  const onFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      // Set filename without extension
      setFileName(file.name.split('.').slice(0, -1).join('.'));

      const reader = new FileReader();
      reader.onload = (event) => setImageSrc(event.target.result);
      reader.readAsDataURL(file);
    }
  };

  // 2. Perform Conversion and Download
  const handleConvertAndDownload = async () => {
    if (!imageSrc) return;

    try {
      const image = await createImage(imageSrc);
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      canvas.width = image.naturalWidth;
      canvas.height = image.naturalHeight;
      ctx.drawImage(image, 0, 0);

      // Convert Canvas content to the selected Blob format
      canvas.toBlob((blob) => {
        if (!blob) {
          // Using console.error instead of alert as per general instruction
          console.error('Error converting image: Canvas output failed.');
          return;
        }

        const extension = outputFormat.split('/')[1];
        const fileUrl = URL.createObjectURL(blob);
        const link = document.createElement('a');
        
        link.href = fileUrl;
        link.download = `${fileName}-pixilify-converted.${extension}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(fileUrl);
        
      }, outputFormat, outputFormat.includes('jpeg') || outputFormat.includes('webp') ? quality : undefined);

    } catch (e) {
      console.error("Conversion error:", e);
      // Using console.error instead of alert
    }
  };

  const resetTool = () => {
    setImageSrc(null);
    setFileName('');
    setOutputFormat('image/png');
    setQuality(0.9);
  };

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h1 className="text-4xl font-bold text-gray-800 mb-8">Image Converter (JPG, PNG, WEBP)</h1>

      {/* 💡 CORRECTED Upload Area with SVG and Text */}
      {!imageSrc && (
        <label className="flex flex-col items-center justify-center w-full h-80 border-4 border-dashed rounded-md cursor-pointer bg-[#6e99f4] transition duration-300 border-[#5c85dc] shadow-inner">
             <div className="flex flex-col items-center justify-center pt-5 pb-6">
                {/* SVG Icon for Upload */}
                <svg className="w-12 h-12 mb-4 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 014 4.903H7zM12 11v6m-3-3h6"></path></svg>
                <p className="mb-2 text-lg text-gray-700"><span className="font-bold text-black">Click to upload</span> or drag and drop an image</p>
                <p className="text-sm text-white">JPG, PNG, WEBP (Supports all formats)</p>
            </div>
            <input type="file" className="hidden" accept="image/*" onChange={onFileChange} />
        </label>
      )}

      {/* Conversion Interface */}
      {imageSrc && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Image Preview (Simple) */}
          <div className="col-span-2 bg-gray-200 rounded-lg shadow-lg p-4 flex justify-center items-center h-full">
            <img src={imageSrc} alt="Preview" className="max-w-full max-h-[500px] rounded" />
          </div>

          {/* Controls */}
          <div className="col-span-1 flex flex-col space-y-4">
            <h2 className="text-2xl font-semibold text-gray-700 border-b pb-2">Conversion Settings</h2>

            {/* Format Selector */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Convert To</label>
              <select
                value={outputFormat}
                onChange={(e) => setOutputFormat(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="image/png">PNG (Lossless)</option>
                <option value="image/jpeg">JPG/JPEG (Lossy)</option>
                <option value="image/webp">WEBP (Modern Format)</option>
              </select>
            </div>

            {/* Quality Slider (Visible for Lossy formats) */}
            {(outputFormat === 'image/jpeg' || outputFormat === 'image/webp') && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Quality: {(quality * 100).toFixed(0)}%</label>
                <input
                  type="range"
                  min={0.1}
                  max={1.0}
                  step={0.05}
                  value={quality}
                  onChange={(e) => setQuality(Number(e.target.value))}
                  className="w-full h-2 bg-indigo-100 rounded-lg appearance-none cursor-pointer"
                />
              </div>
            )}
            
            {/* Action Buttons */}
            <button
              onClick={handleConvertAndDownload}
              className="mt-4 w-full px-6 py-3 text-lg font-medium rounded-md shadow-md text-white bg-green-600 hover:bg-green-700 transition"
            >
              Convert & Download
            </button>
            
            <button
              onClick={resetTool}
              className="w-full px-6 py-3 text-lg font-medium rounded-md shadow-sm text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 transition"
            >
              Convert New Image
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageConverterClient;