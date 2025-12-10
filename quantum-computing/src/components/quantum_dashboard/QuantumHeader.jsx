import React from 'react';
import { FaAtom } from 'react-icons/fa';

const QuantumHeader = () => {
  return (
    <header className="bg-gray-900/50 backdrop-blur-sm border-b border-gray-700/80 p-4">
      <div className="flex items-center space-x-3">
        <FaAtom className="text-3xl text-purple-400" />
        <h1 className="text-2xl font-bold text-gray-100 tracking-wider">
          Quantum Computing
        </h1>
      </div>
    </header>
  );
};

export default QuantumHeader;
