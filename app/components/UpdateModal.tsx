import React, { useState, useEffect } from 'react';
import { useMobileDetection } from '../hooks/useMobileDetection';

interface UpdateModalProps {
  isOpen: boolean;
  onClose: () => void;
  version: string;
  releaseNotes: string;
  htmlUrl: string;
}

const UpdateModal: React.FC<UpdateModalProps> = ({ isOpen, onClose, version, releaseNotes, htmlUrl }) => {
  const isMobile = useMobileDetection();
  const [closeButtonText, setCloseButtonText] = useState('Close');

  useEffect(() => {
    // Set random fun close button text
    const funWords = [
      'Cool!',
      'Sweet!',
      'Awesome!',
      'Great!',
      'Fantastic!',
      'Excellent!',
      'Amazing!',
      'Wonderful!',
      'Rad!',
      'Tubular!',
    ];
    const randomWord = funWords[Math.floor(Math.random() * funWords.length)];
    setCloseButtonText(randomWord);
  }, [isOpen]);

  if (!isOpen) return null;

  // Process release notes to handle line breaks
  const processedNotes = releaseNotes.split('\n').map((line, index) => (
    <React.Fragment key={index}>
      {line}
      {index < releaseNotes.split('\n').length - 1 && <br />}
    </React.Fragment>
  ));

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50">
      <div className={`bg-white ${isMobile ? 'p-4 mx-4 max-w-sm' : 'p-6 max-w-2xl'} w-full rounded-lg shadow-xl max-h-[80vh] overflow-y-auto`}>
        <h2 className={`${isMobile ? 'text-lg mb-3' : 'text-2xl mb-4'} font-bold text-gray-900`}>
          🎉 New Update Available: {version}
        </h2>
        <div className={`text-gray-700 ${isMobile ? 'mb-4 text-sm' : 'mb-6'} whitespace-pre-wrap`}>
          {processedNotes}
        </div>
        <div className={`flex ${isMobile ? 'flex-col space-y-2' : 'justify-between space-x-4'}`}>
          <button
            onClick={() => window.open(htmlUrl, '_blank')}
            className={`${isMobile ? 'w-full px-3 py-2 text-sm' : 'px-4 py-2'} bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors`}
          >
            View Full Release Notes
          </button>
          <button
            onClick={onClose}
            className={`${isMobile ? 'w-full px-3 py-2 text-sm' : 'px-4 py-2'} bg-gray-300 text-gray-800 rounded hover:bg-gray-400 transition-colors`}
          >
            {closeButtonText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UpdateModal;
