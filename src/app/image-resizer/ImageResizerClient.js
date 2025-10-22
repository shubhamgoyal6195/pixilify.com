// src/app/image-resizer/ImageResizerClient.jsx
'use client';

import React, { useState, useCallback, useRef } from 'react';
import ReactCrop, { centerCrop, makeAspectCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css'; // Import the CSS

// Utility function (from your cropUtils.js)
import { getCroppedImg } from '../../utils/cropUtils'; 

// Helper function to center the crop when an image is loaded
function centerAspectCrop(mediaWidth, mediaHeight, aspect) {
    return centerCrop(
        makeAspectCrop(
            {
                unit: '%', // Use percentage units for the crop area
                width: 90,
                height: 90,
            },
            aspect,
            mediaWidth,
            mediaHeight,
        ),
        mediaWidth,
        mediaHeight,
    );
}

const ImageResizerClient = () => {
    const imgRef = useRef(null); // Reference to the actual image element
    const [imageSrc, setImageSrc] = useState(null);
    const [crop, setCrop] = useState(); // Holds the {unit, x, y, width, height} of the crop area
    const [completedCrop, setCompletedCrop] = useState(null); // Final crop area (used for canvas)
    const [aspect, setAspect] = useState(4 / 3); // Current aspect ratio (undefined for freeform)

    // 1. Handle File Upload
    const onFileChange = (e) => {
        if (e.target.files && e.target.files.length > 0) {
            setCompletedCrop(null); // Reset completed crop
            const reader = new FileReader();
            reader.addEventListener('load', () => {
                setImageSrc(reader.result);
            });
            reader.readAsDataURL(e.target.files[0]);
        }
    };

    // 2. Handle Image Load (set initial crop area)
    const onImageLoad = useCallback((e) => {
        imgRef.current = e.currentTarget;
        const { width, height } = e.currentTarget;
        
        // Center the crop area initially based on the current aspect
        const initialCrop = centerAspectCrop(width, height, aspect);
        setCrop(initialCrop);
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
    
    // 4. Handle Crop & Download
    const handleCropAndDownload = useCallback(async () => {
        if (!imageSrc || !completedCrop || !imgRef.current) return;

        try {
            // Use the utility function to process the crop
            const { file } = await getCroppedImg(
                imageSrc,
                imgRef.current, // Pass the image element ref
                completedCrop
            );

            if (file) {
                const fileUrl = URL.createObjectURL(file);
                const link = document.createElement('a');
                link.href = fileUrl;
                link.download = file.name;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                URL.revokeObjectURL(fileUrl);
            }
        } catch (e) {
            console.error(e);
            alert('Error during crop operation.');
        }
    }, [imageSrc, completedCrop]);

    const resetTool = () => {
        setImageSrc(null);
        setCrop(undefined);
        setCompletedCrop(null);
        setAspect(4 / 3);
    };

    return (
        <div className="p-8 max-w-6xl mx-auto">
            <h1 className="text-4xl font-bold text-gray-800 mb-8">Image Resizer & Cropper</h1>

            {/* 💡 UPDATED Upload Area/Placeholder */}
            {!imageSrc && (
                <label className="flex flex-col items-center justify-center w-full h-80 border-4 border-dashed rounded-md cursor-pointer bg-[#6e99f4] transition duration-300 border-[#5c85dc] shadow-inner">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        {/* SVG Icon for Upload */}
                        <svg className="w-12 h-12 mb-4 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 014 4.903H7zM12 11v6m-3-3h6"></path></svg>
                        <p className="mb-2 text-lg text-gray-700"><span className="font-bold  text-black">Click to upload</span> or drag and drop an image</p>
                        <p className="text-sm text-white">JPG, PNG, WEBP (100% Client-Side Processing)</p>
                    </div>
                    {/* Hidden Input */}
                    <input id="dropzone-file" type="file" className="hidden" accept="image/*" onChange={onFileChange} />
                </label>
            )}

            {/* Cropper/Controls Area */}
            {imageSrc && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Cropper */}
                    <div className="relative col-span-2 bg-gray-200 rounded-lg overflow-hidden shadow-lg p-2 flex justify-center items-center" style={{ minHeight: '500px' }}>
                        <ReactCrop
                            crop={crop}
                            onChange={c => setCrop(c)}
                            onComplete={c => setCompletedCrop(c)}
                            aspect={aspect} 
                            minWidth={50} 
                            circularCrop={false} 
                        >
                            <img
                                ref={imgRef}
                                alt="Crop me"
                                src={imageSrc}
                                // Adjusted style to ensure image is constrained within its container
                                style={{ display: 'block', maxWidth: '100%', maxHeight: '500px', height: 'auto', width: 'auto' }}
                                onLoad={onImageLoad}
                            />
                        </ReactCrop>
                    </div>

                    {/* Controls */}
                    <div className="col-span-1 flex flex-col space-y-4">
                        <h2 className="text-2xl font-semibold text-gray-700 border-b pb-2">Adjust Image</h2>
                        
                        {/* Aspect Ratio Selection */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Select Aspect Ratio</label>
                            <div className="flex flex-wrap gap-2">
                                {/* Buttons now call handleAspectChange */}
                                <button
                                    onClick={() => handleAspectChange(1 / 1)}
                                    className={`px-3 py-1 text-sm rounded-full transition ${aspect === 1/1 ? 'bg-indigo-600 text-white' : 'bg-gray-200 hover:bg-indigo-100 text-gray-700'}`}
                                >
                                    Square (1:1)
                                </button>
                                <button
                                    onClick={() => handleAspectChange(16 / 9)}
                                    className={`px-3 py-1 text-sm rounded-full transition ${aspect === 16/9 ? 'bg-indigo-600 text-white' : 'bg-gray-200 hover:bg-indigo-100 text-gray-700'}`}
                                >
                                    Widescreen (16:9)
                                </button>
                                <button
                                    onClick={() => handleAspectChange(4 / 3)}
                                    className={`px-3 py-1 text-sm rounded-full transition ${aspect === 4/3 ? 'bg-indigo-600 text-white' : 'bg-gray-200 hover:bg-indigo-100 text-gray-700'}`}
                                >
                                    Classic (4:3)
                                </button>
                                <button
                                    onClick={() => handleAspectChange(undefined)} // Undefined enables free-form resizing
                                    className={`px-3 py-1 text-sm rounded-full transition ${aspect === undefined ? 'bg-indigo-600 text-white' : 'bg-gray-200 hover:bg-indigo-100 text-gray-700'}`}
                                >
                                    Freeform
                                </button>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <button
                            onClick={handleCropAndDownload}
                            disabled={!completedCrop} // Disable if no crop selection is made
                            className={`mt-4 w-full px-6 py-3 text-lg font-medium rounded-md shadow-md text-white transition ${completedCrop ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-400 cursor-not-allowed'}`}
                        >
                            Crop & Download
                        </button>
                        
                        <button
                            onClick={resetTool}
                            className="w-full px-6 py-3 text-lg font-medium rounded-md shadow-sm text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 transition"
                        >
                            Upload New Image
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ImageResizerClient;