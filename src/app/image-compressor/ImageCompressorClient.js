// src/app/image-compressor/ImageCompressorClient.jsx
'use client';

import React, { useState, useEffect } from 'react';

const ImageCompressorClient = () => {
    const [imageSrc, setImageSrc] = useState(null);
    const [originalSize, setOriginalSize] = useState(0);
    const [compressedSize, setCompressedSize] = useState(0);
    const [quality, setQuality] = useState(0.8);
    const [imageType, setImageType] = useState('image/jpeg'); // Default to JPEG for compression

    // Helper to create an image element and canvas for compression
    const processImage = (source, type, q) => new Promise((resolve, reject) => {
        const image = new Image();
        image.onload = () => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            canvas.width = image.naturalWidth;
            canvas.height = image.naturalHeight;
            ctx.drawImage(image, 0, 0);

            canvas.toBlob((blob) => {
                if (!blob) return reject(new Error('Canvas error.'));
                resolve(blob);
            }, type, q);
        };
        image.onerror = reject;
        image.src = source;
    });

    // Effect to recalculate compression when quality or image changes
    useEffect(() => {
        if (imageSrc) {
            processImage(imageSrc, imageType, quality)
                .then(blob => setCompressedSize(blob.size))
                .catch(console.error);
        }
    }, [imageSrc, quality, imageType]);

    // 1. Handle File Upload
    const onFileChange = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setOriginalSize(file.size);
        // Determine initial imageType for compression based on uploaded file
        if (file.type.includes('jpeg')) {
            setImageType('image/jpeg');
        } else if (file.type.includes('webp')) {
            setImageType('image/webp');
        } else {
            // If it's PNG or another type, we can't lossy compress it easily
            // You might want to display a message or offer to convert to JPEG/WEBP first
            alert("For best compression, please upload a JPG or WEBP image.");
            setImageType('image/jpeg'); // Default to JPEG if not suitable
        }
        

        const reader = new FileReader();
        reader.onload = (event) => setImageSrc(event.target.result);
        reader.readAsDataURL(file);
    };

    // Helper to format bytes to KB/MB
    const formatBytes = (bytes) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const dm = 2;
        const sizes = ['Bytes', 'KB', 'MB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
    };

    // 2. Download Compressed Image
    const handleDownload = async () => {
        const blob = await processImage(imageSrc, imageType, quality);
        
        const fileUrl = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = fileUrl;
        link.download = `pixilify-compressed.${imageType.split('/')[1]}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(fileUrl);
    };

    const resetTool = () => {
        setImageSrc(null);
        setOriginalSize(0);
        setCompressedSize(0);
        setQuality(0.8);
        setImageType('image/jpeg'); // Reset to default
    };

    const reductionPercentage = originalSize > 0 ? ((originalSize - compressedSize) / originalSize * 100).toFixed(1) : 0;

    return (
        <div className="p-8 max-w-6xl mx-auto">
            <h1 className="text-4xl font-bold text-gray-800 mb-8">Image Compressor (JPEG/WEBP)</h1>

            {/* 💡 CORRECTED Upload Area with SVG and Text */}
            {!imageSrc && (
                <label className="flex flex-col items-center justify-center w-full h-80 border-4 border-dashed rounded-md cursor-pointer bg-[#6e99f4] transition duration-300 border-[#5c85dc] shadow-inner">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        {/* SVG Icon for Upload */}
                        <svg className="w-12 h-12 mb-4 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 014 4.903H7zM12 11v6m-3-3h6"></path></svg>
                        <p className="mb-2 text-lg text-black"><span className="font-bold text-black">Click to upload</span> or drag and drop an image</p>
                        <p className="text-sm text-white">JPG, WEBP (Lossy Compression)</p>
                    </div>
                    {/* Hidden Input */}
                    <input type="file" className="hidden" accept="image/jpeg,image/webp" onChange={onFileChange} />
                </label>
            )}

            {/* Compression Interface */}
            {imageSrc && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    
                    {/* Preview Area */}
                    <div className="col-span-2 flex flex-col space-y-4">
                        <div className="bg-gray-200 rounded-lg shadow-lg p-4 flex justify-center items-center">
                            <img src={imageSrc} alt="Preview" className="max-w-full max-h-[400px] rounded" />
                        </div>
                        
                        {/* Status Bar */}
                        <div className="p-4 bg-white rounded-lg shadow border border-gray-200">
                            <p className="text-lg font-semibold text-gray-800">Status</p>
                            <div className="flex justify-between text-sm mt-2">
                                <span className="text-gray-600">Original Size: <strong className="text-indigo-600">{formatBytes(originalSize)}</strong></span>
                                <span className="text-gray-600">Compressed Size: <strong className="text-green-600">{formatBytes(compressedSize)}</strong></span>
                            </div>
                            <div className="mt-2 text-center text-xl font-bold">
                                {reductionPercentage > 0 ? (
                                    <span className="text-green-600">
                                        Saved {reductionPercentage}%
                                    </span>
                                ) : (
                                    <span className="text-gray-500">Adjust quality to compress</span>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Controls */}
                    <div className="col-span-1 flex flex-col space-y-4">
                        <h2 className="text-2xl font-semibold text-gray-700 border-b pb-2">Compression Settings</h2>

                        {/* Quality Slider */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Compression Quality: {(quality * 100).toFixed(0)}%</label>
                            <input
                                type="range"
                                min={0.1}
                                max={1.0}
                                step={0.05}
                                value={quality}
                                onChange={(e) => setQuality(Number(e.target.value))}
                                className="w-full h-2 bg-indigo-100 rounded-lg appearance-none cursor-pointer"
                            />
                            <p className="text-xs text-gray-500 mt-1">Lower quality means smaller file size, but more degradation.</p>
                        </div>
                        
                        {/* Action Buttons */}
                        <button
                            onClick={handleDownload}
                            className="mt-4 w-full px-6 py-3 text-lg font-medium rounded-md shadow-md text-white bg-green-600 hover:bg-green-700 transition"
                        >
                            Download Compressed ({formatBytes(compressedSize)})
                        </button>
                        
                        <button
                            onClick={resetTool}
                            className="w-full px-6 py-3 text-lg font-medium rounded-md shadow-sm text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 transition"
                        >
                            Compress New Image
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ImageCompressorClient;