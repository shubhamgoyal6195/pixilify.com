// src/app/image-resizer/AllInOneClient.jsx
'use client';

import React, { useState, useCallback, useRef } from 'react';
import ReactCrop, { centerCrop, makeAspectCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

// Import necessary utilities
import { getCroppedImg } from '../../utils/cropUtils';
import { formatBytes } from '../../utils/utils'; // We'll define this helper in a moment

// Helper functions (defined earlier)
function centerAspectCrop(mediaWidth, mediaHeight, aspect) {
    return centerCrop(
        makeAspectCrop({ unit: '%', width: 90, height: 90 }, aspect, mediaWidth, mediaHeight),
        mediaWidth,
        mediaHeight,
    );
}

// ------------------- Main Component -------------------

const AllInOneClient = () => {
    // --- Global State ---
    const imgRef = useRef(null); 
    const [imageSrc, setImageSrc] = useState(null);
    const [fileName, setFileName] = useState('');
    const [mode, setMode] = useState('resize'); // 'resize', 'convert', or 'compress'
    
    // --- Resize/Crop State ---
    const [crop, setCrop] = useState();
    const [completedCrop, setCompletedCrop] = useState(null);
    const [aspect, setAspect] = useState(4 / 3);

    // --- Convert/Compress State ---
    const [outputFormat, setOutputFormat] = useState('image/jpeg');
    const [quality, setQuality] = useState(0.8);
    const [originalSize, setOriginalSize] = useState(0);
    const [compressedSize, setCompressedSize] = useState(0);


    // Helper to create an image element and canvas for processing (used for Convert/Compress)
    const processImage = (source, type, q) => new Promise((resolve, reject) => {
        const image = new Image();
        image.onload = () => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            canvas.width = image.naturalWidth;
            canvas.height = image.naturalHeight;
            ctx.drawImage(image, 0, 0);

            // Use the Canvas toBlob method for conversion/compression
            canvas.toBlob((blob) => {
                if (!blob) return reject(new Error('Canvas output failed.'));
                resolve(blob);
            }, type, q);
        };
        image.onerror = reject;
        image.src = source;
    });

    // 1. Handle File Upload (Start of the workflow)
    const onFileChange = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setFileName(file.name.split('.').slice(0, -1).join('.'));
        setOriginalSize(file.size);
        setCompletedCrop(null); // Reset crop state

        const reader = new FileReader();
        reader.onload = (event) => setImageSrc(event.target.result);
        reader.readAsDataURL(file);
    };

    // 2. Handle Image Load (Initial crop area setup)
    const onImageLoad = useCallback((e) => {
        imgRef.current = e.currentTarget;
        const { width, height } = e.currentTarget;
        setCrop(centerAspectCrop(width, height, aspect));
    }, [aspect]);

    // 3. Handle Aspect Ratio Change
    const handleAspectChange = (newAspect) => {
        setAspect(newAspect);
        if (imgRef.current) {
            setCrop(centerAspectCrop(
                imgRef.current.naturalWidth,
                imgRef.current.naturalHeight,
                newAspect
            ));
        }
    };

    // 4. Master Download Handler
    const handleDownload = useCallback(async () => {
        let blob;
        let finalFileName;

        try {
            if (mode === 'resize') {
                if (!completedCrop || !imgRef.current) return;
                const result = await getCroppedImg(imageSrc, imgRef.current, completedCrop);
                blob = result.file; // getCroppedImg returns a File object which is also a Blob
                finalFileName = `${fileName}-pixilify-resized.png`;
            } else {
                // For Convert and Compress, use the simple canvas processor
                blob = await processImage(imageSrc, outputFormat, quality);
                
                if (mode === 'compress') {
                    finalFileName = `${fileName}-pixilify-compressed.${outputFormat.split('/')[1]}`;
                } else { // 'convert'
                    finalFileName = `${fileName}-pixilify-converted.${outputFormat.split('/')[1]}`;
                }
            }
            
            // Trigger browser download
            if (blob) {
                const fileUrl = URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = fileUrl;
                link.download = finalFileName;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                URL.revokeObjectURL(fileUrl);
            }

        } catch (e) {
            console.error('Download error:', e);
            alert('Operation failed. Check browser console.');
        }
    }, [imageSrc, completedCrop, mode, outputFormat, quality, fileName]);

    const resetTool = () => {
        setImageSrc(null);
        setFileName('');
        setCrop(undefined);
        setCompletedCrop(null);
        setAspect(4 / 3);
        setOutputFormat('image/jpeg');
        setQuality(0.8);
        setOriginalSize(0);
        setCompressedSize(0);
        setMode('resize');
    };
    
    // Calculate compression percentage (needed for compress mode UI)
    const reductionPercentage = originalSize > 0 ? ((originalSize - compressedSize) / originalSize * 100).toFixed(1) : 0;
    
    // Update compressed size when quality/mode changes
    React.useEffect(() => {
        if (imageSrc && mode === 'compress') {
            processImage(imageSrc, outputFormat, quality)
                .then(blob => setCompressedSize(blob.size))
                .catch(console.error);
        }
    }, [imageSrc, quality, outputFormat, mode]);


    // ------------------- UI RENDERING LOGIC -------------------

    const renderControls = () => {
        if (mode === 'resize') {
            return (
                <>
                    <h2 className="text-2xl font-semibold text-gray-700 border-b pb-2">Resize & Crop Settings</h2>
                    
                    {/* Aspect Ratio Selection */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Select Crop Aspect</label>
                        <div className="flex flex-wrap gap-2">
                            <button
                                onClick={() => handleAspectChange(1 / 1)}
                                className={`px-3 py-1 text-sm rounded-full transition ${aspect === 1/1 ? 'bg-indigo-600 text-white' : 'bg-gray-200 hover:bg-indigo-100 text-gray-700'}`}
                            >Square (1:1)</button>
                            <button
                                onClick={() => handleAspectChange(16 / 9)}
                                className={`px-3 py-1 text-sm rounded-full transition ${aspect === 16/9 ? 'bg-indigo-600 text-white' : 'bg-gray-200 hover:bg-indigo-100 text-gray-700'}`}
                            >Widescreen (16:9)</button>
                            <button
                                onClick={() => handleAspectChange(undefined)}
                                className={`px-3 py-1 text-sm rounded-full transition ${aspect === undefined ? 'bg-indigo-600 text-white' : 'bg-gray-200 hover:bg-indigo-100 text-gray-700'}`}
                            >Freeform</button>
                        </div>
                    </div>
                </>
            );
        } 
        
        if (mode === 'convert') {
            return (
                <>
                    <h2 className="text-2xl font-semibold text-gray-700 border-b pb-2">Conversion Settings</h2>
                    
                    {/* Format Selector */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Convert To</label>
                        <select
                            value={outputFormat}
                            onChange={(e) => setOutputFormat(e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-md shadow-sm"
                        >
                            <option value="image/png">PNG (Lossless)</option>
                            <option value="image/jpeg">JPG/JPEG (Lossy)</option>
                            <option value="image/webp">WEBP (Modern)</option>
                        </select>
                    </div>

                    {/* Quality Slider (for lossy formats) */}
                    {(outputFormat === 'image/jpeg' || outputFormat === 'image/webp') && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Quality: {(quality * 100).toFixed(0)}%</label>
                            <input
                                type="range" min={0.1} max={1.0} step={0.05} value={quality}
                                onChange={(e) => setQuality(Number(e.target.value))}
                                className="w-full h-2 bg-indigo-100 rounded-lg appearance-none cursor-pointer"
                            />
                        </div>
                    )}
                </>
            );
        }
        
        if (mode === 'compress') {
            return (
                <>
                    <h2 className="text-2xl font-semibold text-gray-700 border-b pb-2">Compression Settings</h2>
                    
                    {/* Quality Slider */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Compression Quality: {(quality * 100).toFixed(0)}%</label>
                        <input
                            type="range" min={0.1} max={1.0} step={0.05} value={quality}
                            onChange={(e) => setQuality(Number(e.target.value))}
                            className="w-full h-2 bg-indigo-100 rounded-lg appearance-none cursor-pointer"
                        />
                        <p className="text-xs text-gray-500 mt-1">Lower quality = smaller file size, but more degradation.</p>
                    </div>
                    
                    {/* Status Bar */}
                    <div className="p-3 bg-white rounded-lg shadow border border-gray-200">
                        <p className="text-sm font-semibold text-gray-800">File Size Reduction</p>
                        <div className="flex justify-between text-xs mt-1">
                            <span className="text-gray-600">Original: <strong className="text-indigo-600">{formatBytes(originalSize)}</strong></span>
                            <span className="text-gray-600">New Size: <strong className="text-green-600">{formatBytes(compressedSize)}</strong></span>
                        </div>
                        <div className="mt-2 text-center text-lg font-bold">
                            {reductionPercentage > 0 ? (
                                <span className="text-green-600">
                                    Saved {reductionPercentage}%
                                </span>
                            ) : (
                                <span className="text-gray-500">Adjust quality</span>
                            )}
                        </div>
                    </div>
                </>
            );
        }
    };


    return (
      <div className="w-full">
        {/* Upload Area */}
        {!imageSrc && (
          <label className="flex flex-col items-center justify-center w-full h-80 border-4 border-dashed rounded-md cursor-pointer bg-[#6e99f4] transition duration-300 border-[#5c85dc] shadow-inner">
            <div className="text-white mb-6">
              {/* Large Image Icon */}
              <svg
                className="w-16 h-16 mx-auto mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.5"
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-12 5h12a2 2 0 002-2V7a2 2 0 00-2-2H6a2 2 0 00-2 2v10a2 2 0 002 2z"
                ></path>
              </svg>
              <p className="text-2xl font-semibold">Select Images to Start</p>
            </div>
            <div className="flex flex-col text-center items-center justify-center pt-5 pb-6">
             
              <p className="mb-2 text-lg text-gray-700">
                <span className="font-bold text-black">
                  Click to upload
                </span>{" "}
                or drag and drop an image
              </p>
              <p className="text-sm text-white">
                JPG, PNG, WEBP (Maximum privacy, all processing is local)
              </p>
            </div>
            <input
              type="file"
              className="hidden"
              accept="image/*"
              onChange={onFileChange}
            />
          </label>
        )}

        {/* Main Interface */}
        {imageSrc && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cropper/Preview Area */}
            <div className="col-span-2 flex flex-col space-y-4">
              <div
                className="relative bg-gray-200 rounded-lg overflow-hidden shadow-lg p-2 flex justify-center items-center"
                style={{ minHeight: "470px" }}
              >
                {mode === "resize" ? (
                  <ReactCrop
                    crop={crop}
                    onChange={(c) => setCrop(c)}
                    onComplete={(c) => setCompletedCrop(c)}
                    aspect={aspect}
                  >
                    <img
                      ref={imgRef}
                      alt="Crop me"
                      src={imageSrc}
                      style={{
                        display: "block",
                        maxWidth: "100%",
                        maxHeight: "500px",
                        height: "auto",
                        width: "auto",
                      }}
                      onLoad={onImageLoad}
                    />
                  </ReactCrop>
                ) : (
                  // Simple preview for Convert/Compress modes
                  <img
                    src={imageSrc}
                    alt="Preview"
                    className="max-w-full max-h-[500px] rounded"
                  />
                )}
              </div>
            </div>

            {/* Controls Column */}
            <div className="col-span-1 flex flex-col space-y-4">
              {/* Mode Selector Tabs */}
              <div className="flex space-x-1 p-1 bg-gray-200 rounded-lg">
                <button
                  onClick={() => setMode("resize")}
                  className={`flex-1 py-2 text-sm font-semibold rounded-lg transition ${
                    mode === "resize"
                      ? "bg-white shadow text-indigo-600"
                      : "text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  Resize/Crop
                </button>
                <button
                  onClick={() => setMode("convert")}
                  className={`flex-1 py-2 text-sm font-semibold rounded-lg transition ${
                    mode === "convert"
                      ? "bg-white shadow text-indigo-600"
                      : "text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  Convert
                </button>
                <button
                  onClick={() => setMode("compress")}
                  className={`flex-1 py-2 text-sm font-semibold rounded-lg transition ${
                    mode === "compress"
                      ? "bg-white shadow text-indigo-600"
                      : "text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  Compress
                </button>
              </div>

              {/* RENDER DYNAMIC CONTROLS */}
              {renderControls()}

              {/* Action Buttons */}
              <button
                onClick={handleDownload}
                className={`mt-4 w-full px-6 py-3 text-lg font-medium rounded-md shadow-md text-white transition ${
                  imageSrc
                    ? "bg-green-600 hover:bg-green-700"
                    : "bg-gray-400 cursor-not-allowed"
                }`}
                disabled={!imageSrc}
              >
                {mode === "resize" && !completedCrop
                  ? "Crop Area Required"
                  : "Download Final Image"}
              </button>

              <button
                onClick={resetTool}
                className="w-full px-6 py-3 text-lg font-medium rounded-md shadow-sm text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 transition"
              >
                Start New Image
              </button>
            </div>
          </div>
        )}
      </div>
    );
};

export default AllInOneClient;