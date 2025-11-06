"use client";
import Link from 'next/link';

const ToolCard = ({ icon, title, description, href, status = 'Live' }) => {
  const isLive = status === 'Live';

  return (
    <Link
      href={isLive ? href : '#'}
      className={`relative flex flex-col p-4 bg-white rounded-xl shadow-md transition-shadow duration-300 border border-gray-200 text-left cursor-pointer hover:border-2 hover:shadow-lg ${!isLive ? 'cursor-not-allowed opacity-75' : ''}`}
      aria-disabled={!isLive}
      onClick={(e) => { !isLive && e.preventDefault(); }}
    >
      {/* 🔖 Status Banner (absolute, does NOT affect height) */}
      {status !== 'Live' && (
        <div
          className={`absolute top-2 right-2 px-2 py-0.5 text-[10px] font-semibold uppercase rounded-md ${status === 'Coming Soon'
              ? 'bg-yellow-400 text-gray-900'
              : status === 'Beta'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-400 text-white'
            }`}
        >
          {status}
        </div>
      )}

      {/* Icon Container */}
      <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-transparent mb-2">
        <div className="text-4xl">
          {icon}
        </div>
      </div>

      {/* Title */}
      <h3 className="text-lg font-semibold text-gray-800 mb-1 leading-snug">
        {title}

        {/* New! Tag (unchanged) */}
        {status === 'New!' && (
          <span className="ml-2 px-2 py-0.5 text-xs font-medium text-white bg-green-500 rounded-full">
            New!
          </span>
        )}
      </h3>

      {/* Description */}
      <p className="text-sm text-gray-600 flex-grow leading-relaxed">
        {description}
      </p>
    </Link>
  );
};

export default ToolCard;
