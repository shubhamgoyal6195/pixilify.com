'use client';

import { useState, useEffect } from 'react';
import { PDFDocument } from 'pdf-lib';
import {secondaryTools} from '../../utils/master';

export default function SplitPdfPage() {
    const [pdfFile, setPdfFile] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);
    // Stores the URLs of the resulting split files
    const [splitUrls, setSplitUrls] = useState([]); 
    const [splitMode, setSplitMode] = useState('custom-ranges');
    // Stores the user-defined ranges: [{ from: 1, to: 5 }, ...]
    const [pageRanges, setPageRanges] = useState([{ from: 1, to: 1 }]); 
    const [numOriginalPages, setNumOriginalPages] = useState(0); 
    const [mergeAllRanges, setMergeAllRanges] = useState(false);

    // --- Effect: Load PDF Metadata (Page Count) ---
    useEffect(() => {
        const loadPdfPages = async () => {
            if (pdfFile) {
                try {
                    const fileBytes = await pdfFile.file.arrayBuffer();
                    const pdfDoc = await PDFDocument.load(fileBytes);
                    const pageCount = pdfDoc.getPageCount();
                    setNumOriginalPages(pageCount);
                    // Set default range to cover the whole document when loaded
                    setPageRanges([{ from: 1, to: pageCount }]);
                } catch (error) {
                    console.error("Error loading PDF to get page count:", error);
                    setNumOriginalPages(0);
                }
            } else {
                setNumOriginalPages(0);
                setPageRanges([{ from: 1, to: 1 }]);
            }
        };
        loadPdfPages();
    }, [pdfFile]);


    // --- File Handling Functions ---
    const onFileChange = (e) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];
            if (file.type === 'application/pdf') {
                if (pdfFile) {
                    URL.revokeObjectURL(pdfFile.id);
                }
                setPdfFile({
                    id: URL.createObjectURL(file), 
                    file,
                    name: file.name,
                });
            }
            e.target.value = null; 
        }
    };

    const removeFile = () => {
        if (pdfFile) {
            URL.revokeObjectURL(pdfFile.id);
        }
        setPdfFile(null);
        setNumOriginalPages(0);
        setPageRanges([{ from: 1, to: 1 }]);
    };


    // --- Range Management Functions ---
    const addRange = () => {
        const lastRange = pageRanges[pageRanges.length - 1];
        const nextFrom = lastRange ? lastRange.to + 1 : 1;
        // Suggest a new range starting one page after the last, up to the max pages
        const nextTo = lastRange ? Math.min(nextFrom + 0, numOriginalPages) : Math.min(1, numOriginalPages); 
        setPageRanges([...pageRanges, { from: nextFrom, to: nextTo }]);
    };

    const updateRange = (index, field, value) => {
        const newValue = Math.max(1, parseInt(value, 10) || 1);
        setPageRanges((prevRanges) =>
            prevRanges.map((range, i) =>
                i === index ? { ...range, [field]: Math.min(newValue, numOriginalPages || Infinity) } : range
            )
        );
    };

    const removeRange = (index) => {
        if (pageRanges.length > 1) {
            setPageRanges((prevRanges) => prevRanges.filter((_, i) => i !== index));
        } else {
            alert("You must have at least one page range defined.");
        }
    };


    // --- Core Split Logic ---
    const handleSplit = async () => {
        if (!pdfFile) {
            alert('Please select a PDF to split.');
            return;
        }

        // Input validation
        for (const range of pageRanges) {
            if (range.from < 1 || range.to > numOriginalPages || range.from > range.to) {
                alert(`Invalid page range: From ${range.from} to ${range.to}. Please ensure pages are within 1 to ${numOriginalPages} and 'from' is not greater than 'to'.`);
                return;
            }
        }

        setIsProcessing(true);
        setSplitUrls([]);

        try {
            const fileBytes = await pdfFile.file.arrayBuffer();
            const originalPdf = await PDFDocument.load(fileBytes);
            const newSplitUrls = [];

            if (mergeAllRanges) {
                // Scenario 1: Merge all ranges into a single output PDF
                const mergedSplitPdf = await PDFDocument.create();
                for (const range of pageRanges) {
                    const startPage = range.from - 1;
                    const endPage = range.to - 1;
                    const pageIndicesToCopy = Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);
                    const copiedPages = await mergedSplitPdf.copyPages(originalPdf, pageIndicesToCopy);
                    copiedPages.forEach((page) => mergedSplitPdf.addPage(page));
                }

                const mergedBytes = await mergedSplitPdf.save();
                const blob = new Blob([mergedBytes], { type: 'application/pdf' });
                const url = URL.createObjectURL(blob);
                const baseName = pdfFile.name.replace(/\.pdf$/i, '');
                newSplitUrls.push({ name: `${baseName}_extracted_merged.pdf`, url: url });

            } else {
                // Scenario 2: Create a separate PDF for each defined range
                for (let i = 0; i < pageRanges.length; i++) {
                    const range = pageRanges[i];
                    const newPdf = await PDFDocument.create();

                    const startPage = range.from - 1; // 0-based index
                    const endPage = range.to - 1;
                    const pageIndicesToCopy = Array.from({ length: endPage - startPage + 1 }, (_, idx) => startPage + idx);

                    const copiedPages = await newPdf.copyPages(originalPdf, pageIndicesToCopy);
                    copiedPages.forEach((page) => newPdf.addPage(page));

                    const splitBytes = await newPdf.save();
                    const blob = new Blob([splitBytes], { type: 'application/pdf' });
                    const url = URL.createObjectURL(blob);

                    const baseName = pdfFile.name.replace(/\.pdf$/i, '');
                    const newFileName = `${baseName}_range_${range.from}-${range.to}.pdf`;
                    newSplitUrls.push({ name: newFileName, url: url });
                }
            }


            setSplitUrls(newSplitUrls);
        } catch (error) {
            console.error('Error splitting PDF:', error);
            alert('Failed to split PDF. Check console for details.');
        } finally {
            setIsProcessing(false);
        }
    };

    // Reset Tool
    const resetTool = () => {
        if (pdfFile) {
            URL.revokeObjectURL(pdfFile.id);
        }
        splitUrls.forEach((file) => URL.revokeObjectURL(file.url));

        setPdfFile(null);
        setSplitUrls([]);
        setIsProcessing(false);
        setSplitMode('custom-ranges');
        setPageRanges([{ from: 1, to: 1 }]);
        setNumOriginalPages(0);
        setMergeAllRanges(false);
    };


    // --- Result Component (REDESIGNED to match iLovePDF) ---
    const ResultScreen = ({ splitUrls, onBack }) => {
        
        // Logic for the main download button
        const isSingleFileDownload = mergeAllRanges || splitUrls.length === 1;
        const downloadAction = isSingleFileDownload 
            ? splitUrls[0]?.url || '#'
            : '#'; // Placeholder for ZIP download URL
        const downloadFileName = isSingleFileDownload 
            ? splitUrls[0]?.name || 'split-pixilify.pdf'
            : 'split-pixilify.zip'; // Placeholder for ZIP name

        // Fallback for downloading multiple files one by one if it's not a ZIP/single file
        const handleMultipleDownload = () => {
            if (!isSingleFileDownload) {
                // If it's a multi-file split, trigger downloads sequentially
                splitUrls.forEach((file, index) => {
                    setTimeout(() => {
                        const link = document.createElement('a');
                        link.href = file.url;
                        link.download = file.name;
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);
                    }, index * 500); // Small delay to avoid browser blocking
                });
                alert(`Starting download of ${splitUrls.length} files. Please check your browser's download queue.`);
            }
        };


        return (
            <div className="flex flex-col items-center justify-start p-8 min-h-[500px] bg-gray-50">
                <div className="max-w-4xl w-full text-center py-12">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800 mb-6">
                        PDF has been split!
                    </h1>

                    {/* Download Bar (Matching iLovePDF style) */}
                    <div className="flex items-center justify-center space-x-4 mb-10">
                        {/* Go Back/Start Over Button */}
                        <button
                            onClick={onBack}
                            className="w-12 h-12 bg-gray-300 text-gray-800 rounded-full flex items-center justify-center hover:bg-gray-400 transition"
                            title="Start Over"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
                        </button>

                        {/* Primary Download Button */}
                        <a
                            href={downloadAction}
                            download={downloadFileName}
                            onClick={isSingleFileDownload ? null : handleMultipleDownload}
                            className="flex items-center space-x-3 px-10 py-4 bg-red-600 text-white text-xl font-bold rounded-lg shadow-xl hover:bg-red-700 transition transform hover:scale-[1.02]"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                            <span>Download split PDF</span>
                        </a>
                    </div>

                    {/* Continue To Section */}
                     <div className="max-w-4xl w-full mt-8 p-8 bg-white border border-gray-200 rounded-lg shadow-lg">
                    <h2 className="text-xl font-semibold text-gray-700 mb-4 border-b pb-2">
                        Continue to...
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        {secondaryTools.map((tool) => (
                            <a
                                key={tool.name}
                                href={tool.link}
                                className="flex items-center p-3 rounded-lg bg-white border border-gray-200 shadow-sm hover:shadow-md hover:bg-gray-50 text-gray-700 hover:text-red-600 transition-all duration-200"
                            >
                                <span className="mr-2 text-xl">{tool.icon}</span>
                                <span className="flex-1 font-medium truncate">{tool.name}</span>
                                <svg
                                    className="w-4 h-4 ml-1 text-red-400 shrink-0"
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
                
                {/* Social Share Footer */}
                <div className="text-center mt-12 text-gray-600">
                    <p className="mb-4">How can you thank us? **Spread the word!**</p>
                    <div className="flex justify-center space-x-6">
                        <a href="#" className="flex items-center space-x-1 text-gray-700 hover:text-red-600 transition">
                            <span className="text-blue-600 text-xl">f</span>
                            <span className="font-semibold">Facebook</span>
                        </a>
                        <a href="#" className="flex items-center space-x-1 text-gray-700 hover:text-red-600 transition">
                            <span className="text-black text-xl">X</span>
                            <span className="font-semibold">Twitter</span>
                        </a>
                        <a href="#" className="flex items-center space-x-1 text-gray-700 hover:text-red-600 transition">
                            <span className="text-blue-700 text-xl">in</span>
                            <span className="font-semibold">LinkedIn</span>
                        </a>
                    </div>
                </div>
            </div>
        );
    };
    
    // --- Initial Upload Screen ---
    const InitialUploadScreen = () => (
        <div>
            <section className="text-center px-4 py-12 bg-gradient-to-b from-red-100 to-red-50 border-b border-red-200">
                <h1 className="text-3xl md:text-5xl font-bold mb-2">Split PDF Files Online</h1>
                <p className="text-gray-700 text-lg">Separate one PDF into multiple files securely and privately — right in your browser.</p>
            </section>
            <div className="max-w-6xl mx-auto p-8">
                <div className="flex justify-center py-12">
                    <label className="flex flex-col items-center justify-center w-full max-w-4xl h-48 border-4 border-dashed rounded-md cursor-pointer bg-red-100 transition duration-300 border-red-400 shadow-lg hover:bg-red-200">
                        <div className="flex flex-col items-center text-center justify-center pt-5 pb-6">
                            <svg className="w-10 h-10 mb-2 text-gray-800" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6zM6 20V4h7v5h5v11H6zM13 14H8v-2h5v2zm3-4H8V8h8v2z" />
                            </svg>
                            <p className="mb-1 text-lg text-gray-800 font-medium"><span className="font-bold">Click to upload</span><br /> <span className='text-sm'>or drag and drop a PDF</span></p>
                            <p className="text-sm text-gray-600">Select only one PDF file</p>
                        </div>
                        <input id="dropzone-file" type="file" className="hidden" accept="application/pdf" onChange={onFileChange} />
                    </label>
                </div>
            </div>
            <footer className="p-8 mt-12 bg-gray-50 rounded-lg shadow-inner">
                <h2 className="text-2xl font-semibold mb-4 text-gray-800">Why Choose Pixilify PDF Splitter?</h2>
                <p className="text-gray-600 mb-3">Pixilify's <strong>PDF Splitter Tool</strong> is designed with<strong> privacy</strong> in mind — all splitting happens<strong> 100% locally</strong> in your browser. That means your file is <strong>never uploaded</strong> or stored anywhere.</p>
                <ul className="list-disc list-inside text-gray-600 space-y-1"><li>💻 Split PDFs instantly in your browser.</li><li>🔒 No file uploads — everything stays on your device.</li><li>🪶 Lightweight, responsive, and mobile-friendly.</li><li>📁 Download your final split PDFs in one click.</li></ul>
                {/* <p className="text-gray-500 mt-4 text-sm">© {new Date().getFullYear()} Pixilify — Free Online PDF Tools</p> */}
            </footer>
        </div>
    );
    
    // --- File Action Screen (With Right Sidebar) ---
    const FileActionScreen = () => (
        <div className="flex justify-center w-full mt-4">
            <div className="max-w-7xl w-full flex flex-col md:flex-row gap-6">
                
                {/* 1. Main Content Area (File Preview) */}
                <div className="flex-grow flex flex-col p-6">
                    <div className="flex justify-between w-full mb-4">
                        <h2 className="text-xl md:text-2xl font-bold text-gray-800">PDF to Split</h2>
                        <label className="flex items-center justify-center w-10 h-10 rounded-full bg-red-500 text-white shadow-md cursor-pointer hover:bg-red-600 transition" title='Select a new PDF'>
                            <svg
                                className="w-5 h-5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M12 6v12m6-6H6"
                                ></path>
                            </svg>
                            <input
                                type="file"
                                className="hidden"
                                accept="application/pdf"
                                onChange={onFileChange}
                            />
                        </label>
                    </div>
                    
                    {/* File Card in the main area */}
                    <div className="w-full min-h-[400px] p-8 bg-white border border-gray-200 rounded-lg shadow-inner flex flex-col items-center justify-center">
                        {pdfFile && (
                            <div className="relative p-3 w-40 h-56 border border-gray-300 rounded-lg shadow-md bg-white flex flex-col items-center transition hover:shadow-lg">
                                <div className="h-40 flex items-center justify-center text-6xl text-red-500">📄</div>
                                <p className="text-sm text-center truncate w-full text-gray-700 mt-2 font-medium">{pdfFile.name}</p>
                                <button onClick={removeFile} className="absolute top-0 right-0 m-1 p-1 rounded-full text-gray-400 hover:text-red-500 transition cursor-pointer" title="Remove file">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                                </button>
                                <div className="absolute bottom-0 mb-[-15px] bg-red-600 text-white text-xs px-2 py-1 rounded-full shadow-lg">
                                    Total Pages: {numOriginalPages}
                                </div>
                            </div>
                        )}
                        <p className="mt-8 text-center text-gray-500">
                            Configure your split settings in the sidebar on the right.
                        </p>
                    </div>
                </div>

                {/* 2. Right Sidebar Area (Split Options and Button) */}
                <div className="md:w-80 flex-shrink-0 p-6 bg-white border rounded-xl shadow-lg self-stretch flex flex-col relative">
                    <h3 className="text-xl font-semibold mb-4 text-gray-800 border-b pb-2">
                        Split Options
                    </h3>
                    
                    {/* Tab-like mode selection */}
                    <div className="flex space-x-2 mb-4">
                        <button
                            onClick={() => setSplitMode('custom-ranges')}
                            className={`px-4 py-2 rounded-md text-sm font-medium transition ${splitMode === 'custom-ranges' ? 'bg-red-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                        >
                            Custom ranges
                        </button>
                        <button
                            disabled
                            className={`px-4 py-2 rounded-md text-sm font-medium transition ${splitMode === 'fixed-ranges' ? 'bg-red-600 text-white' : 'bg-gray-200 text-gray-700 cursor-not-allowed'}`}
                        >
                            Fixed ranges (Coming Soon)
                        </button>
                    </div>

                    {/* Scrollable area for ranges */}
                    <div className="flex-grow overflow-y-auto pr-2 -mr-2 space-y-4">
                        {splitMode === 'custom-ranges' && pdfFile && (
                            <>
                                {pageRanges.map((range, index) => (
                                    <div key={index} className="space-y-2 bg-gray-50 p-3 border border-gray-300 rounded-md shadow-sm">
                                        <div className='flex justify-between items-center'>
                                            <span className="text-gray-700 font-semibold">Range {index + 1}</span>
                                            <button
                                                onClick={() => removeRange(index)}
                                                className="p-1 rounded-full text-gray-400 hover:text-red-500 transition"
                                                title="Remove range"
                                                disabled={pageRanges.length === 1}
                                            >
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                                            </button>
                                        </div>

                                        <div className="flex items-center space-x-2">
                                            <label className="text-gray-600 text-sm w-8">From:</label>
                                            <input
                                                type="number"
                                                min="1"
                                                max={numOriginalPages}
                                                value={range.from}
                                                onChange={(e) => updateRange(index, 'from', e.target.value)}
                                                className="w-16 p-2 border border-gray-300 rounded-md text-center text-sm focus:ring-red-500 focus:border-red-500"
                                            />
                                            <label className="text-gray-600 text-sm w-4">To:</label>
                                            <input
                                                type="number"
                                                min="1"
                                                max={numOriginalPages}
                                                value={range.to}
                                                onChange={(e) => updateRange(index, 'to', e.target.value)}
                                                className="w-16 p-2 border border-gray-300 rounded-md text-center text-sm focus:ring-red-500 focus:border-red-500"
                                            />
                                        </div>
                                    </div>
                                ))}

                                <button
                                    onClick={addRange}
                                    className="px-4 py-2 border border-dashed border-red-400 text-red-600 rounded-md hover:bg-red-50 transition flex items-center justify-center w-full text-sm font-medium"
                                >
                                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
                                    Add Range
                                </button>

                                <label className="flex items-center space-x-2 text-gray-700 mt-4 text-sm">
                                    <input
                                        type="checkbox"
                                        checked={mergeAllRanges}
                                        onChange={(e) => setMergeAllRanges(e.target.checked)}
                                        className="form-checkbox h-4 w-4 text-red-600 rounded"
                                    />
                                    <span>Merge all ranges in one PDF file.</span>
                                </label>
                            </>
                        )}
                        {splitMode === 'custom-ranges' && !pdfFile && (
                             <p className="text-center text-gray-500 italic mt-8">Upload a PDF to configure splitting ranges.</p>
                        )}
                    </div>
                    
                    {/* Split Button — fixed at bottom */}
                    <div className="mt-4 pt-4 border-t border-gray-200">
                        <button
                            onClick={handleSplit}
                            disabled={!pdfFile || isProcessing || pageRanges.some(r => r.from > r.to || r.from < 1 || r.to > numOriginalPages) || numOriginalPages === 0}
                            className={`w-full px-6 py-3 text-lg font-bold rounded-lg shadow-xl text-white transition transform ${pdfFile && !isProcessing && !pageRanges.some(r => r.from > r.to || r.from < 1 || r.to > numOriginalPages) && numOriginalPages > 0
                                ? 'bg-red-600 hover:bg-red-700'
                                : 'bg-gray-400 cursor-not-allowed'
                                }`}
                        >
                            {isProcessing ? (
                                <>
                                    <span className="animate-spin inline-block mr-2">🔄</span>Splitting...
                                </>
                            ) : (
                                `Split PDF`
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
                
                {/* Mobile Floating Button (Same logic as desktop button) */}
                <div className="md:hidden fixed bottom-0 left-0 right-0 flex justify-center z-50">
                    <button
                        onClick={handleSplit}
                        disabled={!pdfFile || isProcessing || pageRanges.some(r => r.from > r.to || r.from < 1 || r.to > numOriginalPages) || numOriginalPages === 0}
                        className={`w-[100%] max-w-sm px-6 py-3 text-lg font-bold shadow-2xl text-white transition ${pdfFile && !isProcessing && !pageRanges.some(r => r.from > r.to || r.from < 1 || r.to > numOriginalPages) && numOriginalPages > 0
                            ? 'bg-red-600 hover:bg-red-700'
                            : 'bg-gray-400 cursor-not-allowed'
                            }`}
                    >
                        {isProcessing ? (
                            <>
                                <span className="animate-spin inline-block mr-2">🔄</span>Splitting...
                            </>
                        ) : (
                            `Split PDF`
                        )}
                    </button>
                </div>

            </div>
        </div>
    );

    // --- Main Render Logic ---
    if (splitUrls.length > 0) {
        return <ResultScreen splitUrls={splitUrls} onBack={resetTool} />;
    }

    return (
        <div className="w-full min-h-[500px]">
            {pdfFile === null ? <InitialUploadScreen /> : <FileActionScreen />}
        </div>
    );
}