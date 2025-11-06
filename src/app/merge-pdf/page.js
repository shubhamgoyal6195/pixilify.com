'use client';

import { useState } from 'react';
import { PDFDocument } from 'pdf-lib';
import {secondaryTools} from '../../utils/master';

export default function MergePdfPage() {
    const [pdfFiles, setPdfFiles] = useState([]);
    const [isProcessing, setIsProcessing] = useState(false);
    const [mergedUrl, setMergedUrl] = useState(null);

    // --- Core Logic (Same as before) ---

    // Handle file selection
    const onFileChange = (e) => {
        if (e.target.files && e.target.files.length > 0) {
            const newFiles = Array.from(e.target.files)
                .filter((file) => file.type === 'application/pdf')
                .map((file) => ({
                    id: URL.createObjectURL(file),
                    file,
                    name: file.name,
                }));
            setPdfFiles((prev) => [...prev, ...newFiles]);
            e.target.value = null;
        }
    };

    // Function to remove a single file
    const removeFile = (fileId) => {
        const fileToRemove = pdfFiles.find(f => f.id === fileId);
        if (fileToRemove) {
            URL.revokeObjectURL(fileToRemove.id);
        }
        setPdfFiles(pdfFiles.filter((file) => file.id !== fileId));
    };

    // Merge PDFs
    const handleMerge = async () => {
        if (pdfFiles.length < 2) {
            alert('Please select at least 2 PDFs to merge.');
            return;
        }

        setIsProcessing(true);
        setMergedUrl(null);

        try {
            const mergedPdf = await PDFDocument.create();

            for (const fileObj of pdfFiles) {
                const fileBytes = await fileObj.file.arrayBuffer();
                const pdf = await PDFDocument.load(fileBytes);
                const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
                copiedPages.forEach((page) => mergedPdf.addPage(page));
            }

            const mergedBytes = await mergedPdf.save();
            const blob = new Blob([mergedBytes], { type: 'application/pdf' });
            const url = URL.createObjectURL(blob);
            setMergedUrl(url);
        } catch (error) {
            console.error('Error merging PDFs:', error);
            alert('Failed to merge PDFs. Check console for details.');
        } finally {
            setIsProcessing(false);
        }
    };

    // Reset function
    const resetTool = () => {
        pdfFiles.forEach((f) => URL.revokeObjectURL(f.id));
        setPdfFiles([]);
        setMergedUrl(null);
        setIsProcessing(false);
    };

    // --- New Result Component ---

    const ResultScreen = ({ downloadUrl, onBack }) => {
        // Placeholder links/actions (You'll need to define actual routes for these)
     

        return (
            <div className="flex flex-col items-center justify-center p-8 min-h-[500px] bg-gray-50">
                <div className="text-center mb-10">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800 mb-6">
                        PDFs have been merged!
                    </h1>

                    {/* Download Bar (Matching iLovePDF style) */}
                    <div className="flex items-center justify-center space-x-4">
                        <button
                            onClick={onBack}
                            className="w-12 h-12 bg-gray-300 text-gray-800 rounded-full flex items-center justify-center hover:bg-gray-400 transition"
                            title="Go back"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
                        </button>

                        <a
                            href={downloadUrl}
                            download="merged-pixilify.pdf"
                            className="flex items-center space-x-3 px-10 py-4 bg-red-600 text-white text-xl font-bold rounded-lg shadow-xl hover:bg-red-700 transition transform hover:scale-[1.02]"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                            <span>Download merged PDF</span>
                        </a>
                    </div>
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
        );
    };

    // --- Old UI Components (Minimized for brevity) ---
    // (InitialUploadScreen and FileActionScreen code remains the same as in your prompt)
    // ...

    const InitialUploadScreen = () => (
        <div>
            <section className="text-center px-4 py-12 bg-gradient-to-b from-yellow-100 to-yellow-50 border-b border-yellow-200">
                <h1 className="text-3xl md:text-5xl font-bold mb-2">Merge PDF Files Online</h1>
                <p className="text-gray-700 text-lg">Combine multiple PDFs securely and privately — right in your browser.</p>
            </section>
            <div className="max-w-6xl mx-auto p-8">
                <div className="flex justify-center py-12">
                    <label className="flex flex-col items-center justify-center w-full max-w-4xl h-48 border-4 border-dashed rounded-md cursor-pointer bg-yellow-100 transition duration-300 border-yellow-400 shadow-lg hover:bg-yellow-200">
                        <div className="flex flex-col items-center text-center justify-center pt-5 pb-6">
                            <svg className="w-10 h-10 mb-2 text-gray-800" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6zM6 20V4h7v5h5v11H6zM13 14H8v-2h5v2zm3-4H8V8h8v2z" />
                            </svg>
                            <p className="mb-1 text-lg text-gray-800 font-medium"><span className="font-bold">Click to upload</span><br/> <span className='text-sm'>or drag and drop PDFs</span></p>
                            <p className="text-sm text-gray-600">Select multiple PDF files</p>
                        </div>
                        <input id="dropzone-file" type="file" className="hidden" accept="application/pdf" multiple onChange={onFileChange} />
                    </label>
                </div>
            </div>
            <footer className="p-8 mt-12 bg-gray-50 rounded-lg shadow-inner">
                <h2 className="text-2xl font-semibold mb-4 text-gray-800">Why Choose Pixilify PDF Merger?</h2>
                <p className="text-gray-600 mb-3">Pixilify's <strong>PDF Merger Tool</strong> is designed with<strong> privacy</strong> in mind — all merging happens<strong> 100% locally</strong> in your browser. That means your files are <strong>never uploaded</strong> or stored anywhere.</p>
                <ul className="list-disc list-inside text-gray-600 space-y-1"><li>💻 Merge PDFs instantly in your browser.</li><li>🔒 No file uploads — everything stays on your device.</li><li>🪶 Lightweight, responsive, and mobile-friendly.</li><li>📁 Download your final merged PDF in one click.</li></ul>
                {/* <p className="text-gray-500 mt-4 text-sm">© {new Date().getFullYear()} Pixilify — Free Online PDF Tools</p> */}
            </footer>
        </div>
    );

    const FileActionScreen = () => (
        <div className="flex justify-center w-full mt-4">
            <div className="max-w-7xl w-full flex flex-col md:flex-row gap-6">
                <div className="flex-grow flex flex-col p-6">
                    <div className="flex justify-between w-full mb-4">
                        <div className="flex flex-col">
                            <h2 className="text-xl md:text-2xl font-bold text-gray-800">Selected PDFs ({pdfFiles.length})</h2>
                            <p className='text-xs md:text-sm text-gray-600'>Drag and drop files to change the merge order.</p>
                        </div>
                        <label className="flex items-center justify-center w-10 h-10 rounded-full bg-red-500 text-white shadow-md cursor-pointer hover:bg-red-600 transition">
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
                                multiple
                                onChange={onFileChange}
                            />
                        </label>

                    </div>
                    <div className="w-full min-h-[400px] p-8 bg-white border border-gray-200 rounded-lg shadow-inner flex flex-col items-center">
                        <div className="flex flex-wrap justify-center gap-4">
                            {pdfFiles.map((file, index) => (
                                <div key={file.id} className="relative p-3 w-40 h-56 border border-gray-300 rounded-lg shadow-md bg-white flex flex-col items-center transition hover:shadow-lg cursor-grab">
                                    <span className="absolute top-[-10px] left-[-10px] bg-red-600 text-white text-md font-extrabold w-6 h-6 flex items-center justify-center rounded-full border-2 border-white">{index + 1}</span>
                                    <div className="h-40 flex items-center justify-center text-6xl text-red-500">📄</div>
                                    <p className="text-sm text-center truncate w-full text-gray-700 mt-2 font-medium">{file.name}</p>
                                    <button onClick={() => removeFile(file.id)} className="absolute top-0 right-0 m-1 p-1 rounded-full text-gray-400 hover:text-red-500 transition cursor-pointer" title="Remove file">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                                    </button>
                                </div>
                            ))}
                        </div>
                        <div className="mt-8 text-center text-gray-500">To change the order of your PDFs, drag and drop the files as you want.</div>
                    </div>
                </div>
                <div className="md:w-72 flex-shrink-0 p-6 bg-white border rounded-xl shadow-lg self-stretch flex flex-col relative hidden md:block ">
                    <h3 className="text-xl font-semibold mb-4 text-gray-800 border-b pb-2">
                        Merge PDF
                    </h3>

                    {/* Merge Button — fixed at bottom for mobile */}
                    <div className="mt-auto">
                        <button
                            onClick={handleMerge}
                            disabled={pdfFiles.length < 2 || isProcessing}
                            className={`w-full px-6 py-3 text-lg font-bold rounded-lg shadow-xl text-white transition transform ${pdfFiles.length > 1 && !isProcessing
                                ? 'bg-red-600 hover:bg-red-700'
                                : 'bg-gray-400 cursor-not-allowed'
                                }`}
                        >
                            {isProcessing ? (
                                <>
                                    <span className="animate-spin inline-block mr-2">🔄</span>Merging...
                                </>
                            ) : (
                                `Merge ${pdfFiles.length} PDFs`
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
                {/* Mobile Floating Button */}
                <div className="md:hidden fixed bottom-0 left-0 right-0 flex justify-center z-50">
                    <button
                        onClick={handleMerge}
                        disabled={pdfFiles.length < 2 || isProcessing}
                        className={`w-[100%] max-w-sm px-6 py-3 text-lg font-bold shadow-2xl text-white transition ${pdfFiles.length > 1 && !isProcessing
                            ? 'bg-red-600 hover:bg-red-700'
                            : 'bg-gray-400 cursor-not-allowed'
                            }`}
                    >
                        {isProcessing ? (
                            <>
                                <span className="animate-spin inline-block mr-2">🔄</span>Merging...
                            </>
                        ) : (
                            `Merge PDFs`
                        )}
                    </button>
                </div>

            </div>
        </div>
    );
    // --- End Old UI Components ---

    // --- Main Render Logic ---

    if (mergedUrl) {
        return <ResultScreen downloadUrl={mergedUrl} onBack={resetTool} />;
    }

    return (
        <div className="w-full min-h-[500px]">
            {pdfFiles.length === 0 ? <InitialUploadScreen /> : <FileActionScreen />}
        </div>
    );
}