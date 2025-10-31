'use client';

import React, { useState } from 'react';
// 💡 Import the necessary libraries
import { jsPDF } from 'jspdf';
// We'll use a direct image drawing approach, so we might not need html2canvas here,
// but it's good to know for more complex rendering. For simple image placement, jspdf is enough.

/**
 * Utility function to load an image and return its dimensions and data URL.
 * @param {File} file - The image file object.
 * @returns {Promise<{imgData: string, width: number, height: number}>}
 */
const loadImage = (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
                resolve({
                    imgData: e.target.result,
                    width: img.naturalWidth,
                    height: img.naturalHeight,
                    name: file.name
                });
            };
            img.onerror = reject;
            img.src = e.target.result;
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
};

const PhotoToPdfClient = () => {
    // State to hold the list of selected files/images (unchanged)
    const [imageFiles, setImageFiles] = useState([]);
    const [isProcessing, setIsProcessing] = useState(false);

    // 1. Handle File Upload (unchanged)
    const onFileChange = (e) => {
        if (e.target.files && e.target.files.length > 0) {
            const newFiles = Array.from(e.target.files)
                .filter(file => file.type.startsWith('image/')) // Basic image file check
                .map(file => ({
                    id: URL.createObjectURL(file), 
                    file: file,
                    name: file.name,
                }));
            setImageFiles(prev => [...prev, ...newFiles]);
        }
    };
    
    // 2. 💡 Actual conversion logic using jsPDF
    const handleConvertAndDownload = async () => {
        if (imageFiles.length === 0) return;
        setIsProcessing(true);

        const pdf = new jsPDF('portrait', 'mm', 'a4'); // Initialize PDF (A4 size)
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();
        let firstPage = true;

        try {
            // Load all images data first
            const loadedImages = await Promise.all(
                imageFiles.map(item => loadImage(item.file))
            );

            for (const { imgData, width, height } of loadedImages) {
                // Add a new page for every image except the very first one
                if (!firstPage) {
                    pdf.addPage();
                }
                firstPage = false;
                
                // Calculate dimensions to fit image within the PDF page
                const ratio = Math.min(pdfWidth / width, pdfHeight / height);
                const imgDisplayWidth = width * ratio;
                const imgDisplayHeight = height * ratio;

                // Center the image on the page
                const x = (pdfWidth - imgDisplayWidth) / 2;
                const y = (pdfHeight - imgDisplayHeight) / 2;

                // Add image to the PDF
                // NOTE: jspdf automatically determines image type from the data URL
                pdf.addImage(imgData, x, y, imgDisplayWidth, imgDisplayHeight);
            }

            // Save the PDF
            pdf.save('pixilify-images-to-pdf.pdf');
            
            // Clean up and reset
            resetTool();
            
        } catch (error) {
            console.error('Error during PDF conversion:', error);
            alert('PDF conversion failed. Check console for details.');
        } finally {
            setIsProcessing(false);
        }
    };
    
    // 3. Reset Tool (unchanged)
    const resetTool = () => {
        imageFiles.forEach(f => URL.revokeObjectURL(f.id)); 
        setImageFiles([]);
        setIsProcessing(false);
    };

    return (
        <div className="p-8 max-w-6xl mx-auto">
            <h1 className="text-4xl font-bold text-gray-800 mb-8">Image to PDF Converter</h1>

            {/* Upload Area (unchanged) */}
            <label className="flex flex-col items-center justify-center w-full h-40 border-4 border-dashed rounded-md cursor-pointer bg-[#f4e66e] transition duration-300 border-[#dccf5c] shadow-inner hover:bg-[#ffe88a]">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <svg className="w-12 h-12 mb-4 text-gray-800" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6zM6 20V4h7v5h5v11H6zM13 14H8v-2h5v2zm3-4H8V8h8v2z"/></svg>
                    <p className="mb-2 text-lg text-gray-700"><span className="font-bold text-gray-800">Click to upload</span> or drag and drop images</p>
                    <p className="text-sm text-gray-600">JPG, PNG, WEBP (Select Multiple)</p>
                </div>
                <input id="dropzone-file" type="file" className="hidden" accept="image/*" multiple onChange={onFileChange} />
            </label>
            
            {/* Image List and Controls (unchanged) */}
            {imageFiles.length > 0 && (
                <div className="mt-8">
                    <h2 className="text-2xl font-semibold text-gray-700 mb-4">Images to Convert ({imageFiles.length})</h2>
                    
                    {/* Placeholder for Draggable Image List */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 p-4 border rounded-md bg-white">
                        {imageFiles.map((file, index) => (
                            <div key={file.id} className="relative p-2 border rounded-md shadow-sm">
                                <img src={file.id} alt={`Page ${index + 1}`} className="w-full h-24 object-contain rounded-md mb-2" />
                                <p className="text-xs truncate text-gray-600">{file.name}</p>
                                <span className="absolute top-1 left-1 bg-indigo-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">{index + 1}</span>
                            </div>
                        ))}
                    </div>

                    {/* Action Buttons */}
                    <button
                        onClick={handleConvertAndDownload}
                        disabled={imageFiles.length === 0 || isProcessing}
                        className={`mt-6 w-full px-6 py-3 text-lg font-medium rounded-md shadow-md text-white transition ${imageFiles.length > 0 && !isProcessing ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-400 cursor-not-allowed'}`}
                    >
                        {isProcessing ? (
                            <>
                                <span className="animate-spin inline-block mr-2">⚙️</span>
                                Generating PDF...
                            </>
                        ) : `Convert ${imageFiles.length} Images to PDF`}
                    </button>
                    
                    <button
                        onClick={resetTool}
                        className="mt-3 w-full px-6 py-3 text-lg font-medium rounded-md shadow-sm text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 transition"
                    >
                        Start Over
                    </button>
                </div>
            )}
        </div>
    );
};

export default PhotoToPdfClient;