import React from 'react';
import { motion } from 'framer-motion';

const InputOutputDisplay = () => {
  // Simulated data for input and output
  const [inputData, setInputData] = React.useState('Initializing...');
  const [outputData, setOutputData] = React.useState('Waiting for output...');

  React.useEffect(() => {
    const interval = setInterval(() => {
      // Simulate new input
      const newInput = `Input: ${Math.random().toFixed(4)} - ${['Image', 'Text', 'Sensor'].at(Math.floor(Math.random() * 3))}`;
      setInputData(newInput);

      // Simulate output after a short delay
      setTimeout(() => {
        const newOutput = `Output: ${Math.random() > 0.5 ? 'Positive' : 'Negative'} - Confidence: ${Math.random().toFixed(2)}`;
        setOutputData(newOutput);
      }, 500); // Simulate processing delay

    }, 2000); // Update every 2 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col flex-grow text-sm space-y-4">
      <motion.div 
        className="bg-gray-800 p-3 rounded-md border border-blue-600/30 font-code overflow-auto flex-grow"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="text-blue-300 mb-2">Current Input:</div>
        <p className="text-blue-200">{inputData}</p>
      </motion.div>

      <motion.div 
        className="bg-gray-800 p-3 rounded-md border border-blue-600/30 font-code overflow-auto flex-grow"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="text-blue-300 mb-2">Latest Output:</div>
        <p className="text-blue-200">{outputData}</p>
      </motion.div>
    </div>
  );
};

export default InputOutputDisplay;
