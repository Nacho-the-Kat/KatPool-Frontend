import React from 'react';

interface DocCardProps {
  title: string;
  description: string;
  link: string;
  icon: React.ReactNode;
}

const DocCard: React.FC<DocCardProps> = ({ title, description, link, icon }) => (
  <a
    href={link}
    target="_blank"
    rel="noopener noreferrer"
    className="group flex flex-col p-7 bg-gradient-to-br from-gray-50/80 to-white dark:from-gray-800/80 dark:to-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-md hover:shadow-2xl hover:border-primary-400 dark:hover:border-primary-500/70 transition-all focus:outline-none focus:ring-2 focus:ring-primary-400"
  >
    <div className="flex items-center mb-4">
      {icon}
      <span className="ml-3 text-2xl font-semibold text-gray-800 dark:text-gray-100 group-hover:text-primary-500 transition-colors">{title}</span>
    </div>
    <p className="text-base text-gray-600 dark:text-gray-400 mb-4">{description}</p>
    <span className="mt-auto text-primary-500 font-medium flex items-center">
      Learn More
      <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
      </svg>
    </span>
  </a>
);

export default DocCard; 