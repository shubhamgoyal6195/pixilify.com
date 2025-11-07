'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
// Mocking secondaryTools since the external file cannot be resolved
const secondaryTools = [
    { name: 'Compress PDF', link: '#', icon: '🔗' },
    { name: 'Merge PDF', link: '#', icon: '🔗' },
    { name: 'Edit Image', link: '#', icon: '🔗' },
];

export default function PdftoImages() {
    // State to hold the dynamically loaded PDF library and components
    const [pdfjsAssets, setPdfjsAssets] = useState(null); 
    
    // Viewer states integrated from the old PdfViewer component
    const [numPages, setNumPages] = useState(null); 
    const [isViewerLoading, setIsViewerLoading] = useState(true);

    const [pdfFile, setPdfFile] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [convertedImages, setConvertedImages] = useState([]);
    const [imageFormat, setImageFormat] = useState('jpeg'); // 'jpeg' or 'png'
    const [imageResolution, setImageResolution] = useState(150); // DPI-like value

    const fileInputRef = useRef(null);
    const viewerContainerRef = useRef(null);

    // 🚀 Dynamic Import of react-pdf assets and worker setup
    // This is the fix for the runtime and compilation errors.
    useEffect(() => {
        async function loadPdfjs() {
            if (typeof window === 'undefined') return;
            try {
                // Dynamically import the core library and components at runtime
                const { pdfjs: lib, Document, Page } = await import('react-pdf');
                
                // Set the worker source using the loaded object's version for CDN
                lib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${lib.version}/pdf.worker.min.js`;
                
                // Store all assets in state
                setPdfjsAssets({ lib, Document, Page });
                setIsViewerLoading(false);
            } catch (error) {
                console.error("Failed to dynamically load PDF processor:", error);
                setIsViewerLoading(false);
            }
        }
        loadPdfjs();
        
        return () => {}; 
    }, []); 

    // --- Merged Viewer Component (Eliminates the separate PdfViewer file) ---
    const MergedPdfViewer = ({ file }) => {
        // Use the assets stored in state
        if (isViewerLoading || !pdfjsAssets) {
            return (
                <div className="w-full h-96 flex items-center justify-center border border-gray-300 rounded-lg bg-gray-100">
                    <p className="text-gray-500">Loading PDF Viewer...</p>
                </div>
            );
        }

        const { Document, Page } = pdfjsAssets;

        function onDocumentLoadSuccess({ numPages }) {
            setNumPages(numPages);  
        }

        if (!file) {
            return null;
        }

        return (
            <div ref={viewerContainerRef} className="w-full h-96 overflow-y-scroll border border-gray-300 rounded-lg bg-gray-100 p-2">
                <Document
                    file={file}
                    onLoadSuccess={onDocumentLoadSuccess}
                    className="flex flex-col items-center"
                    loading="Loading PDF preview..."
                    error="Failed to load PDF preview."
                >
                    {Array.from(new Array(numPages), (el, index) => (
                        <Page 
                            key={`page_${index + 1}`} 
                            pageNumber={index + 1} 
                            renderTextLayer={false}
                            renderAnnotationLayer={false}
                            className="mb-4 shadow-lg border border-gray-200"
                            // Set dynamic width to prevent overflow and reflow issues
                            width={viewerContainerRef.current?.clientWidth * 0.9} 
                        />
                    ))}
                </Document>
                <p className="text-center text-sm text-gray-500 mt-2">Showing {numPages} pages.</p>
            </div>
        );
    };

    // --- File Handling ---
    const onFileChange = useCallback((e) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];
            if (file.type === 'application/pdf') {
                setPdfFile({ file, name: file.name });
                setConvertedImages([]);
                setNumPages(null); // Reset page count on new file upload
            } else {
                console.error('Please upload a PDF file.');
            }
            e.target.value = null;
        }
    }, []);

    const removeFile = useCallback(() => {
        setPdfFile(null);
        setConvertedImages([]);
        setIsProcessing(false);
        setNumPages(null); 
    }, []);

    // --- PDF to Image Conversion Logic ---
    const handleConvert = async () => {
        const lib = pdfjsAssets?.lib; // Use the core pdfjs object from the loaded state

        // Check if the library is fully loaded
        if (!lib) {
            console.error('PDF processor not initialized. Cannot convert.');
            // This case should be handled by disabling the button
            return;
        }
        if (!pdfFile) {
            return;
        }

        setIsProcessing(true);
        setConvertedImages([]);

        try {
            const arrayBuffer = await pdfFile.file.arrayBuffer();
            // Use the dynamically loaded pdfjs object
            const pdfDocument = await lib.getDocument({ data: arrayBuffer }).promise;
            const numPages = pdfDocument.numPages;
            const images = [];

            for (let i = 1; i <= numPages; i++) {
                const page = await pdfDocument.getPage(i);
                
                // Calculate scale based on DPI (72 DPI is 1.0 scale)
                const scale = imageResolution / 72;
                const viewport = page.getViewport({ scale: scale });
                const canvas = document.createElement('canvas');
                const context = canvas.getContext('2d');
                canvas.height = viewport.height;
                canvas.width = viewport.width;

                await page.render({ canvasContext: context, viewport: viewport }).promise;

                let filename;
                
                // Using canvas.toDataURL to get a Data URL (base64)
                const dataUrl = canvas.toDataURL(`image/${imageFormat}`, imageFormat === 'jpeg' ? 0.9 : 1.0);
                filename = `${pdfFile.name.replace(/\.pdf$/i, '')}_page_${i}.${imageFormat}`;

                images.push({ url: dataUrl, name: filename });
            }
            setConvertedImages(images);

        } catch (error) {
            console.error('Error converting PDF to images:', error);
            // In a real app, show a friendly error message here
        } finally {
            setIsProcessing(false);
        }
    };

    // --- Reset Tool ---
    const resetTool = useCallback(() => {
        removeFile();
    }, [removeFile]);

    // --- Sub-Components for Rendering UI ---

    const InitialUploadScreen = () => (
        <div className="relative">
            {/* <button
                onClick={() => window.history.back()}
                className="text-gray-600 hover:text-red-600 transition duration-150 absolute top-4 left-4 p-2 rounded-full hover:bg-gray-200"
                title="Go back to the previous page"
            >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
            </button> */}
            <section className="text-center px-4 py-12 bg-gradient-to-b from-blue-100 to-blue-50 border-b border-blue-200">
                <h1 className="text-3xl md:text-5xl font-bold mb-2">PDF to Image Converter</h1>
                <p className="text-gray-700 text-lg">Convert PDF pages to JPG or PNG images, right in your browser.</p>
            </section>
            <div className="max-w-6xl mx-auto p-8">
                <div className="flex justify-center py-12">
                    <label className="flex flex-col items-center justify-center w-full max-w-4xl h-48 border-4 border-dashed rounded-md cursor-pointer bg-blue-100 transition duration-300 border-blue-400 shadow-lg hover:bg-blue-200">
                        <div className="flex flex-col items-center text-center justify-center pt-5 pb-6">
                            <svg className="w-10 h-10 mb-2 text-gray-800" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6zM6 20V4h7v5h5v11H6zM13 14H8v-2h5v2zm3-4H8V8h8v2z" />
                            </svg>
                            <p className="mb-1 text-lg text-gray-800 font-medium"><span className="font-bold">Click to upload</span><br /> <span className='text-sm'>or drag and drop a PDF</span></p>
                            <p className="text-sm text-gray-600">Only one PDF file is needed</p>
                        </div>
                        <input id="dropzone-file" type="file" className="hidden" accept="application/pdf" onChange={onFileChange} ref={fileInputRef} />
                    </label>
                </div>
            </div>
            <footer className="p-8 mt-12 bg-gray-50 rounded-lg shadow-inner">
                <p className="text-gray-600 mb-3">Pixilify's <strong>PDF to Image Tool</strong> operates with <strong>uncompromised privacy</strong>. The entire conversion process occurs <strong>100% within your browser</strong>, ensuring your documents are never uploaded to a server.</p>
            </footer>
        </div>
    );

    const FileActionScreen = () => (
        <div className="flex justify-center w-full mt-4 relative">
             <button
                onClick={() => window.history.back()}
                className="text-gray-600 hover:text-red-600 transition duration-150 absolute top-4 left-4 p-2 rounded-full hover:bg-gray-200"
                title="Go back to the previous page"
            >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
            </button>
            <div className="max-w-7xl w-full flex flex-col md:flex-row gap-6">
                
                <div className="flex-grow flex flex-col p-6">
                    <div className="flex justify-between w-full mb-4">
                        <h2 className="text-xl md:text-2xl font-bold text-gray-800">
                            PDF Ready for Conversion
                        </h2>
                        <button
                            onClick={removeFile}
                            className="flex items-center space-x-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                            <span>Remove PDF</span>
                        </button>
                    </div>
                    
                    <div className="w-full min-h-[400px] p-8 bg-white border border-gray-200 rounded-lg shadow-inner flex flex-col items-center justify-center">
                        {pdfFile ? (
                           // Use the merged viewer component
                           <MergedPdfViewer file={pdfFile.file} />
                        ) : (
                            <p className="text-gray-500">Upload a PDF to get started.</p>
                        )}
                        
                        {/* Check if library is loaded */}
                        {(pdfFile && isViewerLoading) && (
                            <p className="mt-4 text-orange-500 font-medium">
                                <span className="animate-spin inline-block mr-2">⚙️</span>Loading PDF processor...
                            </p>
                        )}
                    </div>
                </div>

                <div className="md:w-80 flex-shrink-0 p-6 bg-white border rounded-xl shadow-lg self-stretch flex flex-col relative">
                    <h3 className="text-xl font-semibold mb-4 text-gray-800 border-b pb-2">
                        Conversion Settings
                    </h3>
                    
                    <div className="flex-grow space-y-4">
                        {/* Image Format */}
                        <div>
                            <label htmlFor="imageFormat" className="block text-sm font-medium text-gray-700 mb-1">Output Format:</label>
                            <select
                                id="imageFormat"
                                value={imageFormat}
                                onChange={(e) => setImageFormat(e.target.value)}
                                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                            >
                                <option value="jpeg">JPG</option>
                                <option value="png">PNG</option>
                            </select>
                        </div>

                        {/* Image Resolution */}
                        <div>
                            <label htmlFor="imageResolution" className="block text-sm font-medium text-gray-700 mb-1">Resolution (DPI):</label>
                            <input
                                type="number"
                                id="imageResolution"
                                min="72"
                                max="600"
                                step="50"
                                value={imageResolution}
                                onChange={(e) => setImageResolution(parseInt(e.target.value, 10))}
                                className="mt-1 block w-full pl-3 pr-3 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                            />
                            <p className="text-xs text-gray-500 mt-1">Controls output scale/quality. (72 DPI = 1.0 scale)</p>
                        </div>
                    </div>
                    
                    {/* Convert Button */}
                    <div className="mt-4 pt-4 border-t border-gray-200">
                        <button
                            onClick={handleConvert}
                            disabled={!pdfFile || isProcessing || !pdfjsAssets} // Disable if library hasn't loaded
                            className={`w-full px-6 py-3 text-lg font-bold rounded-lg shadow-xl text-white transition transform ${pdfFile && !isProcessing && pdfjsAssets
                                ? 'bg-blue-600 hover:bg-blue-700'
                                : 'bg-gray-400 cursor-not-allowed'
                                }`}
                        >
                            {isProcessing ? (
                                <>
                                    <span className="animate-spin inline-block mr-2">🔄</span>Converting...
                                </>
                            ) : (
                                `Convert to Image`
                            )}
                        </button>
                        <button
                            onClick={resetTool}
                            className="mt-3 w-full px-6 py-2 text-sm font-medium rounded-lg text-gray-600 bg-white border border-gray-300 hover:bg-gray-50 transition"
                        >
                            Start Over
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );

    const ResultScreen = ({ convertedImages, onBack, onConvertAgain }) => (
        <div className="flex flex-col items-center justify-start p-8 min-h-[500px] bg-gray-50">
            <div className="max-w-4xl w-full text-center py-12">
                <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800 mb-6">
                    PDF converted to Images!
                </h1>

                <div className="flex items-center justify-center space-x-4 mb-10">
                    <button
                        onClick={onBack}
                        className="w-12 h-12 bg-gray-300 text-gray-800 rounded-full flex items-center justify-center hover:bg-gray-400 transition"
                        title="Start Over"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                    </button>

                    <button
                        onClick={onConvertAgain}
                        className="flex items-center space-x-3 px-10 py-4 bg-blue-600 text-white text-xl font-bold rounded-lg shadow-xl hover:bg-blue-700 transition transform hover:scale-[1.02]"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h5M9 4H5a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2V9m-4-4l-4-4m0 0l-4 4m4-4v11" /></svg>
                        <span>Convert Again</span>
                    </button>
                </div>

                {convertedImages.length > 0 && (
                    <div className="max-w-4xl w-full mt-8 p-8 bg-white border border-gray-200 rounded-lg shadow-lg mx-auto">
                         <h2 className="text-xl font-semibold text-gray-700 mb-4 border-b pb-2">
                            Your Images
                        </h2>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 max-h-[50vh] overflow-y-auto p-2">
                            {convertedImages.map((img, index) => (
                                <div key={index} className="flex flex-col items-center p-2 border border-gray-200 rounded-md bg-gray-50">
                                    <img src={img.url} alt={`Page ${index + 1}`} className="max-w-full h-auto object-contain max-h-32 mb-2" />
                                    <p className="text-xs text-gray-600 truncate w-full text-center">{img.name}</p>
                                    <a href={img.url} download={img.name} className="mt-2 text-blue-600 hover:underline text-sm font-medium">Download</a>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
                
                <div className="max-w-4xl w-full mt-8 p-8 bg-white border border-gray-200 rounded-lg shadow-lg mx-auto">
                    <h2 className="text-xl font-semibold text-gray-700 mb-4 border-b pb-2">
                        Continue to...
                    </h2>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                        {secondaryTools.map((tool) => (
                            <a
                                key={tool.name}
                                href={tool.link}
                                className="flex items-center p-3 rounded-lg bg-white border border-gray-200 shadow-sm hover:shadow-md hover:bg-gray-50 text-gray-700 hover:text-red-600 transition-all duration-200"
                            >
                                <span className="mr-2 text-xl text-blue-600">{tool.icon}</span>
                                <span className="flex-1 font-medium truncate">{tool.name}</span>
                                <svg
                                    className="w-4 h-4 ml-1 text-blue-400 shrink-0"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M9 5l7 7-7 7"
                                    />
                                </svg>
                            </a>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );

    // --- Main Render Logic ---
    if (convertedImages.length > 0) {
        return <ResultScreen convertedImages={convertedImages} onBack={resetTool} onConvertAgain={() => setConvertedImages([])} />;
    }

    return (
        <div className="w-full min-h-[500px]">
            {pdfFile === null ? <InitialUploadScreen /> : <FileActionScreen />}
        </div>
    );
}