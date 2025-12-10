import React from 'react';
import { FaCloudsmith } from 'react-icons/fa';

const Header = () => {
  return (
    <header className="bg-gray-900/50 backdrop-blur-sm border-b border-gray-700/80 p-4">
      <div className="flex items-center space-x-3">
        <FaCloudsmith className="text-3xl text-cyan-400" />
        <h1 className="text-2xl font-bold text-gray-100 tracking-wider">
          Decentralized Cloud
        </h1>
      </div>
    </header>
  );
};

export default Header;
