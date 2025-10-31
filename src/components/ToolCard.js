"use client";
import Link from 'next/link';

const ToolCard = ({ icon, title, description, href, status = 'Live' }) => {
  const isLive = status === 'Live';
  
  // The entire card becomes the clickable area.
  return (
    <Link 
      href={isLive ? href : '#'}
      className={`flex flex-col p-4 bg-white rounded-xl shadow-md transition-shadow duration-300 border border-gray-200 text-left cursor-pointer hover:border-2 hover:shadow-lg ${!isLive ? 'cursor-not-allowed opacity-75' : ''}`}
      aria-disabled={!isLive}
      onClick={(e) => { !isLive && e.preventDefault(); }}
    >
      
      {/* Icon Container: Square, smaller, and positioned at the top-left */}
      <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-transparent mb-2"> 
        <div className="text-4xl"> {/* Increased size for the icon itself to match the visual weight */}
          {icon}
        </div>
      </div>

      {/* Title (made into h3 for semantic hierarchy if this is part of a list) */}
      <h3 className="text-lg font-semibold text-gray-800 mb-1 leading-snug">
        {title}
        
        {/* Optional: Add a 'New!' tag if needed, similar to the image */}
        {status === 'New!' && (
            <span className="ml-2 px-2 py-0.5 text-xs font-medium text-white bg-green-500 rounded-full">
                New!
            </span>
        )}
      </h3>

      {/* Description: Slightly larger than before, better spacing for multiple lines */}
      <p className="text-sm text-gray-600 flex-grow leading-relaxed">
        {description}
      </p> 

    </Link>
  );
};

export default ToolCard;