import React from 'react';
import { COLORS } from '../constants';

const Loader: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center bg-white bg-opacity-80 rounded-3xl shadow-neumorphic-light">
      <div
        className={`w-24 h-24 rounded-full border-8 border-t-8 animate-spin`}
        style={{ borderColor: COLORS.BLUE, borderTopColor: COLORS.YELLOW }}
      ></div>
      <p className="mt-6 text-3xl sm:text-4xl font-bold text-gray-700">Generating magic...</p>
      <p className="mt-2 text-xl sm:text-2xl text-gray-500">This might take a moment.</p>
    </div>
  );
};

export default Loader;