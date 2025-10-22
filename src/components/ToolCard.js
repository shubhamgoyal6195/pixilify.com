"use client";
import Link from 'next/link';

const ToolCard = ({ icon, title, description, href, status = 'Live' }) => {
  const isLive = status === 'Live';
  const linkClass = isLive
    ? 'bg-indigo-600 hover:bg-indigo-700'
    : 'bg-gray-400 cursor-not-allowed';

  return (
    <div className="flex flex-col p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100 dark:bg-zinc-900 dark:border-zinc-800">
      <div className="text-4xl mb-4">{icon}</div>
      <h2 className="text-2xl font-semibold text-gray-800 dark:text-zinc-50 mb-2">{title}</h2>
      <p className="text-gray-600 dark:text-zinc-400 mb-4 flex-grow">{description}</p>
      
      <Link 
        href={isLive ? href : '#'}
        className={`mt-4 px-4 py-2 text-center text-sm font-medium text-white rounded-lg transition-colors ${linkClass}`}
        aria-disabled={!isLive}
        onClick={(e) => { !isLive && e.preventDefault(); }}
      >
        {isLive ? 'Use Tool' : status}
      </Link>
    </div>
  );
};

export default ToolCard;