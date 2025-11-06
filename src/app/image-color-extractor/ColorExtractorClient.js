'use client';

import React, { useState, useRef, useCallback } from 'react';

// Utility to convert RGB to HEX (for display)
const rgbToHex = (r, g, b) => '#' + [r, g, b].map(x => {
    const hex = x.toString(16);
    return hex.length === 1 ? '0' + hex : hex;
}).join('');

const ColorExtractorClient = () => {
    const imgRef = useRef(null);
    const [imageSrc, setImageSrc] = useState(null);
    const [extractedColors, setExtractedColors] = useState([]);
    const [isAnalyzing, setIsAnalyzing] = useState(false);

    // 1. Handle File Upload
    const onFileChange = (e) => {
        if (e.target.files && e.target.files.length > 0) {
            setExtractedColors([]); // Reset results
            const reader = new FileReader();
            reader.addEventListener('load', () => {
                setImageSrc(reader.result);
            });
            reader.readAsDataURL(e.target.files[0]);
        }
    };

    // 2. Handle Image Load & Analysis (The core logic)
    const onImageLoad = useCallback((e) => {
        imgRef.current = e.currentTarget;
        setIsAnalyzing(true);
        const img = e.currentTarget;
        
        // Use a slight delay to ensure the component has rendered the image element
        setTimeout(() => {
            try {
                const canvas = document.createElement('canvas');
                // Limit size for performance, while preserving ratio
                const MAX_SIZE = 256; 
                let { naturalWidth: w, naturalHeight: h } = img;
                if (w > h) {
                    h = Math.round(h * (MAX_SIZE / w));
                    w = MAX_SIZE;
                } else {
                    w = Math.round(w * (MAX_SIZE / h));
                    h = MAX_SIZE;
                }
                
                canvas.width = w;
                canvas.height = h;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, w, h);

                // Get pixel data
                const imageData = ctx.getImageData(0, 0, w, h).data;
                const colorMap = {}; // { 'r,g,b': count }

                // Iterate over all pixels
                for (let i = 0; i < imageData.length; i += 4) {
                    // Extract RGB values
                    const r = imageData[i];
                    const g = imageData[i + 1];
                    const b = imageData[i + 2];
                    
                    // Simple logic to count the frequency of each color
                    // Note: You'd typically want to "cluster" similar colors for a better palette.
                    const key = `${r},${g},${b}`;
                    colorMap[key] = (colorMap[key] || 0) + 1;
                }

                // Convert map to array, sort by count, and take the top 10
                const topColors = Object.entries(colorMap)
                    .sort(([, countA], [, countB]) => countB - countA)
                    .slice(0, 10)
                    .map(([rgbStr]) => {
                        const [r, g, b] = rgbStr.split(',').map(Number);
                        const hex = rgbToHex(r, g, b);
                        return { rgb: `rgb(${r}, ${g}, ${b})`, hex, count: colorMap[rgbStr] };
                    });

                setExtractedColors(topColors);
            } catch (error) {
                console.error("Color analysis failed:", error);
                alert("Could not analyze image. Check console for details.");
            } finally {
                setIsAnalyzing(false);
            }
        }, 100); // Small timeout to allow the DOM to settle

    }, []);

    const resetTool = () => {
        setImageSrc(null);
        setExtractedColors([]);
        setIsAnalyzing(false);
    };

    return (
        <div className="p-8 max-w-6xl mx-auto">
            <h1 className="text-4xl font-bold text-gray-800 mb-8">Image Color Extractor</h1>

            {/* 💡 Upload Area/Placeholder */}
            {!imageSrc && (
                <label className="flex flex-col items-center justify-center w-full h-80 border-4 border-dashed rounded-md cursor-pointer bg-[#e56ef4] transition duration-300 border-[#c45cdc] shadow-inner hover:bg-[#f397ff]">
                    <div className="flex flex-col text-center items-center justify-center pt-5 pb-6">
                        {/* SVG Icon for Color Palette */}
                        <svg className="w-12 h-12 mb-4 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h14a2 2 0 012 2v12a4 4 0 01-4 4H7zM17 9H7m10 4H7m8 4H7"/></svg>
                        <p className="mb-2 text-lg text-gray-700"><span className="font-bold text-gray-800">Click to upload</span> or drag and drop an image</p>
                        <p className="text-sm text-gray-600">JPG, PNG, WEBP (100% Client-Side Analysis)</p>
                    </div>
                    {/* Hidden Input */}
                    <input id="dropzone-file" type="file" className="hidden" accept="image/*" onChange={onFileChange} />
                </label>
            )}

            {/* Content Area */}
            {imageSrc && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Image & Status Area */}
                    <div className="relative col-span-2 flex flex-col items-center">
                        <h2 className="text-2xl font-semibold text-gray-700 mb-4">Original Image</h2>
                        <img
                            ref={imgRef}
                            alt="Image for color extraction"
                            src={imageSrc}
                            style={{ display: 'block', maxWidth: '100%', maxHeight: '500px', height: 'auto', width: 'auto' }}
                            onLoad={onImageLoad}
                            className="rounded-lg shadow-lg"
                        />
                        {isAnalyzing && (
                            <p className="mt-4 text-lg text-indigo-600 font-medium">Analyzing colors, please wait...</p>
                        )}
                        <button
                            onClick={resetTool}
                            className="mt-6 w-full lg:w-1/2 px-6 py-3 text-lg font-medium rounded-md shadow-sm text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 transition"
                        >
                            Upload New Image
                        </button>
                    </div>

                    {/* Results/Palette */}
                    <div className="col-span-1 flex flex-col space-y-4">
                        <h2 className="text-2xl font-semibold text-gray-700 border-b pb-2">Extracted Palette</h2>

                        {extractedColors.length > 0 ? (
                            <div className="space-y-3">
                                {extractedColors.map((color, index) => (
                                    <div key={index} className="flex items-center p-3 bg-white rounded-lg shadow-sm border">
                                        {/* Color Swatch */}
                                        <div 
                                            className="w-10 h-10 rounded-full mr-4 border-2 border-gray-300 flex-shrink-0" 
                                            style={{ backgroundColor: color.hex }}
                                            title={`Count: ${color.count}`}
                                        />
                                        
                                        {/* Color Codes */}
                                        <div className="flex flex-col text-sm font-mono flex-grow">
                                            <span className="font-bold text-gray-800">{color.hex}</span>
                                            <span className="text-gray-600">{color.rgb}</span>
                                        </div>
                                        
                                        {/* Rank */}
                                        <span className="text-xl font-bold text-indigo-600 ml-4">{index + 1}</span>
                                    </div>
                                ))}
                            </div>
                        ) : !isAnalyzing && imageSrc && (
                            <p className="text-gray-500">Upload an image to see the extracted color palette here.</p>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ColorExtractorClient;