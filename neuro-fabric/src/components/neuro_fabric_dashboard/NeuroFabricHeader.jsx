import React from 'react';
import { motion } from 'framer-motion';

const NeuroFabricHeader = () => {
  return (
    <motion.header 
      initial={{ y: -100, opacity: 0 }} 
      animate={{ y: 0, opacity: 1 }} 
      transition={{ type: "spring", stiffness: 100, duration: 0.5 }}
      className="p-4 bg-gradient-to-r from-gray-900 to-gray-800 border-b border-purple-600/50 flex items-center justify-between"
    >
      <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-red-600 drop-shadow-lg">
        <span className="text-purple-300">Neuro</span>-<span className="text-red-400">Fabric</span>
      </h1>
      <nav>
        <ul className="flex space-x-6">
          <li><a href="#" className="text-gray-300 hover:text-purple-400 transition-colors duration-200">Overview</a></li>
          <li><a href="#" className="text-gray-300 hover:text-blue-400 transition-colors duration-200">Performance</a></li>
          <li><a href="#" className="text-gray-300 hover:text-green-400 transition-colors duration-200">Topology</a></li>
          <li><a href="#" className="text-gray-300 hover:text-pink-400 transition-colors duration-200">Settings</a></li>
        </ul>
      </nav>
    </motion.header>
  );
};

export default NeuroFabricHeader;
