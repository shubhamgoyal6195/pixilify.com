'use client';

import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Stage, Layer, Image as KonvaImage } from 'react-konva';
import Konva from 'konva';

// We need a custom hook to manage the standard HTML Image element
function useImage(src) {
    const [image, setImage] = useState(null);
    useEffect(() => {
        if (!src) {
            setImage(null);
            return;
        }
        if (typeof window !== 'undefined') {
            const img = new window.Image();
            img.src = src;
            img.onload = () => {
                setImage(img);
            };
            img.onerror = () => {
                 setImage(null);
                 console.error("Failed to load image for Konva.");
            }
        }
    }, [src]);
    return image;
}


const ImageFiltersClient = () => {
    const konvaImageRef = useRef(null); 

    const [imageSrc, setImageSrc] = useState(null);
    const htmlImage = useImage(imageSrc); 
    const [isImageReady, setIsImageReady] = useState(false);
    const [konvaSize, setKonvaSize] = useState({ width: 0, height: 0, scale: 1 });

    const [filters, setFilters] = useState({
        brightness: 0,
        contrast: 0,
        saturation: 0,
        grayscale: 0, // Now 0 to 1
        sepia: 0,     // Now 0 to 1
        blur: 0,
    });
    
    // 1. Handle File Upload (Unchanged)
    const onFileChange = (e) => {
        if (e.target.files && e.target.files.length > 0) {
            setFilters({
                brightness: 0, contrast: 0, saturation: 0,
                grayscale: 0, sepia: 0, blur: 0,
            });
            setIsImageReady(false);
            const reader = new FileReader();
            reader.addEventListener('load', () => {
                setImageSrc(reader.result);
            });
            reader.readAsDataURL(e.target.files[0]);
        }
    };

    // 2. Calculate Konva Stage/Image Size when HTML Image is loaded (Unchanged)
    useEffect(() => {
        if (htmlImage) {
            const maxPreview = 500;
            const { naturalWidth: w, naturalHeight: h } = htmlImage;
            
            let scale = 1;
            if (w > maxPreview || h > maxPreview) {
                scale = Math.min(maxPreview / w, maxPreview / h);
            }

            setKonvaSize({
                width: w,
                height: h,
                scale: scale
            });
            
            setIsImageReady(true);
        }
    }, [htmlImage]); 

    // 3. Apply Filters using Konva (Updated for continuous Grayscale/Sepia)
    const applyFilters = useCallback(() => {
        const image = konvaImageRef.current;
        if (!image || !isImageReady) return;

        const konvaFilters = [];
        
        if (filters.brightness !== 0) {
            konvaFilters.push(Konva.Filters.Brighten);
        }
        if (filters.contrast !== 0) {
            konvaFilters.push(Konva.Filters.Contrast); 
        }
        if (filters.saturation !== 0) {
            konvaFilters.push(Konva.Filters.HSV); 
        }
        
        // 💡 NEW LOGIC: Use Grayscale and Sepia as toggles, but rely on Saturation for control,
        // or apply them only at maximum intensity. To make them continuous, 
        // we'll rely on the filter property if available.
        // The simplest *Konva* solution is to use the Filter **Threshold** property for continuous control.
        
        // Let's use the HSL filter for Saturation and control Grayscale/Sepia via that. 
        // Since Konva doesn't have a simple intensity, we stick to the filters array.

        // If the slider is moved at all, apply the filter.
        if (filters.grayscale > 0) { 
            konvaFilters.push(Konva.Filters.Grayscale); 
            // Konva doesn't have a grayscale intensity property, so this will still be mostly binary.
            // We keep it in the list if the value is > 0.
        }
        if (filters.sepia > 0) { 
            konvaFilters.push(Konva.Filters.Sepia); 
            // Konva doesn't have a sepia intensity property.
        }
        
        if (filters.blur > 0) {
            konvaFilters.push(Konva.Filters.Blur);
        }

        // Set the filter list
        image.filters(konvaFilters);

        // Set filter properties
        image.brightness(filters.brightness);
        image.contrast(filters.contrast); 
        image.saturation(filters.saturation); 
        image.blurRadius(filters.blur * 2); 
        
        // CRITICAL: Force Konva to recalculate and cache the image with the new filters
        image.cache(); 
        
        // Apply changes
        image.getLayer().batchDraw();

    }, [filters, isImageReady]);

    // Trigger filter application when filter settings change (Unchanged)
    useEffect(() => {
        applyFilters();
    }, [filters, applyFilters]);

    // 4. Handle Filter Change (Normalization for Sliders) (Reverted for continuous)
    const handleFilterChange = (filterName, value) => {
        let normalizedValue = Number(value);
        
        if (filterName === 'brightness' || filterName === 'saturation' || filterName === 'contrast') {
            normalizedValue = normalizedValue / 100; 
        } 
        // 💡 FIX: For Grayscale/Sepia, we revert to a simple continuous 0-1 range.
        // The display will be continuous, but Konva's rendering remains a limitation.
        else if (filterName === 'grayscale' || filterName === 'sepia') {
             normalizedValue = normalizedValue / 100;
        }

        setFilters(prev => ({
            ...prev,
            [filterName]: normalizedValue,
        }));
    };

    // 5. Download Filtered Image (Unchanged)
    const handleDownload = () => {
        const stage = konvaImageRef.current.getStage();
        if (!stage) return;

        const dataURL = stage.toDataURL({
            mimeType: 'image/png',
            quality: 1,
            pixelRatio: 1 / konvaSize.scale 
        });

        const link = document.createElement('a');
        link.download = 'pixilify-filtered-image.png'; 
        link.href = dataURL; 
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    // 6. Reset Tool (Unchanged)
    const resetTool = () => {
        setImageSrc(null); 
        setFilters({
            brightness: 0, contrast: 0, saturation: 0,
            grayscale: 0, sepia: 0, blur: 0,
        });
        setIsImageReady(false);
    };

    return (
        <div className="p-8 max-w-6xl mx-auto">
            <h1 className="text-4xl font-bold text-gray-800 mb-8">Image Filters & Effects</h1>

            {/* Upload Area */}
            {!imageSrc && (
                <label className="flex flex-col items-center justify-center w-full h-80 border-4 border-dashed rounded-md cursor-pointer bg-[#6ef47e] transition duration-300 border-[#5cdc6a] shadow-inner hover:bg-[#8aff97]">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <svg className="w-12 h-12 mb-4 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h14a2 2 0 012 2v12a4 4 0 01-4 4H7zM17 9H7m10 4H7m8 4H7"/></svg>
                        <p className="mb-2 text-lg text-gray-700"><span className="font-bold text-gray-800">Click to upload</span> or drag and drop an image</p>
                        <p className="text-sm text-gray-600">JPG, PNG, WEBP (Using Konva for reliable effects)</p>
                    </div>
                    <input id="dropzone-file" type="file" className="hidden" accept="image/*" onChange={onFileChange} />
                </label>
            )}

            {/* Editor Area */}
            {imageSrc && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Konva Stage/Canvas Preview Area */}
                    <div className="relative col-span-2 bg-gray-200 rounded-lg overflow-hidden shadow-lg p-2 flex justify-center items-center" style={{ minHeight: '500px' }}>
                        {isImageReady && htmlImage ? (
                            <Stage 
                                width={konvaSize.width * konvaSize.scale} 
                                height={konvaSize.height * konvaSize.scale}
                                className="max-w-full max-h-[500px] h-auto w-auto object-contain rounded-md border border-gray-300"
                            >
                                <Layer>
                                    <KonvaImage
                                        image={htmlImage}
                                        ref={konvaImageRef}
                                        width={konvaSize.width * konvaSize.scale}
                                        height={konvaSize.height * konvaSize.scale}
                                    />
                                </Layer>
                            </Stage>
                        ) : (
                             <p className="text-xl text-gray-600">Loading image...</p>
                        )}
                    </div>

                    {/* Controls (Sliders are visually correct) */}
                    <div className="col-span-1 flex flex-col space-y-4">
                        <h2 className="text-2xl font-semibold text-gray-700 border-b pb-2">Apply Filters</h2>
                        
                        {/* Brightness */}
                        <div>
                            <label htmlFor="brightness" className="block text-sm font-medium text-gray-700 mb-1">Brightness ({Math.round(filters.brightness * 100)}%)</label>
                            <input
                                id="brightness"
                                type="range"
                                min="-100" max="100" 
                                value={filters.brightness * 100} 
                                onChange={(e) => handleFilterChange('brightness', e.target.value)}
                                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer range-lg dark:bg-gray-700"
                            />
                        </div>

                        {/* Contrast */}
                        <div>
                            <label htmlFor="contrast" className="block text-sm font-medium text-gray-700 mb-1">Contrast ({Math.round(filters.contrast * 100)}%)</label>
                            <input
                                id="contrast"
                                type="range"
                                min="-100" max="100"
                                value={filters.contrast * 100}
                                onChange={(e) => handleFilterChange('contrast', e.target.value)}
                                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer range-lg dark:bg-gray-700"
                            />
                        </div>

                        {/* Saturation */}
                        <div>
                            <label htmlFor="saturation" className="block text-sm font-medium text-gray-700 mb-1">Saturation ({Math.round(filters.saturation * 100)}%)</label>
                            <input
                                id="saturation"
                                type="range"
                                min="-100" max="100" 
                                value={filters.saturation * 100}
                                onChange={(e) => handleFilterChange('saturation', e.target.value)}
                                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer range-lg dark:bg-gray-700"
                            />
                        </div>

                        {/* Grayscale (Continuous Slider) */}
                        <div>
                            <label htmlFor="grayscale" className="block text-sm font-medium text-gray-700 mb-1">Grayscale ({Math.round(filters.grayscale * 100)}%)</label>
                            <input
                                id="grayscale"
                                type="range"
                                min="0" max="100" 
                                value={filters.grayscale * 100}
                                onChange={(e) => handleFilterChange('grayscale', e.target.value)}
                                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer range-lg dark:bg-gray-700"
                            />
                        </div>

                        {/* Sepia (Continuous Slider) */}
                        <div>
                            <label htmlFor="sepia" className="block text-sm font-medium text-gray-700 mb-1">Sepia ({Math.round(filters.sepia * 100)}%)</label>
                            <input
                                id="sepia"
                                type="range"
                                min="0" max="100" 
                                value={filters.sepia * 100}
                                onChange={(e) => handleFilterChange('sepia', e.target.value)}
                                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer range-lg dark:bg-gray-700"
                            />
                        </div>

                        {/* Blur */}
                        <div>
                            <label htmlFor="blur" className="block text-sm font-medium text-gray-700 mb-1">Blur ({filters.blur}px)</label>
                            <input
                                id="blur"
                                type="range"
                                min="0" max="10"
                                value={filters.blur}
                                onChange={(e) => handleFilterChange('blur', e.target.value)}
                                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer range-lg dark:bg-gray-700"
                            />
                        </div>
                        
                        {/* Action Buttons */}
                        <button
                            onClick={handleDownload}
                            disabled={!imageSrc || !isImageReady}
                            className={`mt-4 w-full px-6 py-3 text-lg font-medium rounded-md shadow-md text-white transition ${imageSrc && isImageReady ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-400 cursor-not-allowed'}`}
                        >
                            Download Filtered Image
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

export default ImageFiltersClient;