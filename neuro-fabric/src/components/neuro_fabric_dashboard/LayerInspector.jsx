import React from 'react';
import { motion } from 'framer-motion';

const LayerInspector = () => {
  const [selectedLayer, setSelectedLayer] = React.useState('Input Layer (L0)');
  const [layerDetails, setLayerDetails] = React.useState({
    neurons: 784,
    connections: 'N/A',
    activation: 'ReLU',
    activity: 'High',
  });

  const layers = ['Input Layer (L0)', 'Hidden Layer 1 (L1)', 'Hidden Layer 2 (L2)', 'Output Layer (L3)'];

  const handleLayerSelect = (layer) => {
    setSelectedLayer(layer);
    // Simulate fetching details for the selected layer
    switch (layer) {
      case 'Input Layer (L0)':
        setLayerDetails({ neurons: 784, connections: 'N/A', activation: 'None', activity: 'High' });
        break;
      case 'Hidden Layer 1 (L1)':
        setLayerDetails({ neurons: 128, connections: '100k', activation: 'ReLU', activity: 'Medium' });
        break;
      case 'Hidden Layer 2 (L2)':
        setLayerDetails({ neurons: 64, connections: '8k', activation: 'ReLU', activity: 'Medium' });
        break;
      case 'Output Layer (L3)':
        setLayerDetails({ neurons: 10, connections: '640', activation: 'Softmax', activity: 'Low' });
        break;
      default:
        setLayerDetails({});
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-shrink-0 mb-4 flex space-x-2 overflow-x-auto pb-2 hide-scrollbar">
        {layers.map((layer) => (
          <motion.button
            key={layer}
            onClick={() => handleLayerSelect(layer)}
            className={`px-4 py-2 rounded-md text-sm font-semibold transition-colors duration-200 whitespace-nowrap
                        ${selectedLayer === layer 
                            ? 'bg-pink-600 text-white' 
                            : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {layer}
          </motion.button>
        ))}
      </div>
      
      <motion.div 
        className="flex-grow bg-gray-800 p-4 rounded-md border border-pink-600/30 flex flex-col justify-between"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <h4 className="text-pink-400 text-lg font-bold mb-3">{selectedLayer} Details</h4>
        <div className="space-y-2 text-sm text-gray-300 flex-grow">
          <p><strong>Neurons:</strong> <span className="text-white">{layerDetails.neurons}</span></p>
          <p><strong>Connections:</strong> <span className="text-white">{layerDetails.connections}</span></p>
          <p><strong>Activation:</strong> <span className="text-white">{layerDetails.activation}</span></p>
          <p><strong>Activity:</strong> <span className="text-white">{layerDetails.activity}</span></p>
        </div>
        {/* Could add a small graph or visualization for the layer here */}
        <p className="text-xs text-gray-500 mt-4">Detailed layer statistics and visualization coming soon...</p>
      </motion.div>
    </div>
  );
};

export default LayerInspector;
