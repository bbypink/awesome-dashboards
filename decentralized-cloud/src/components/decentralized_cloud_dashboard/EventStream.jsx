import React, { useState, useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

const initialEventTemplates = [
  { message: 'Node_XYZ connected.', type: 'connect' },
  { message: 'Data upload: 1.2GB.', type: 'upload' },
  { message: 'Compute job finished: #456.', type: 'compute' },
  { message: 'Node_ABC disconnected.', type: 'disconnect' },
  { message: 'Data verification complete.', type: 'system' },
  { message: 'New node joining network.', type: 'connect' },
  { message: 'Security alert triggered.', type: 'alert' },
  { message: 'Data replication initiated.', type: 'system' },
];

const eventTypes = {
  connect: 'text-green-400',
  disconnect: 'text-red-400',
  upload: 'text-cyan-400',
  compute: 'text-purple-400',
  system: 'text-yellow-400',
  alert: 'text-red-500 font-bold',
};

const EventStream = () => {
  const [events, setEvents] = useState([]);
  const eventCounter = useRef(0);

  const getRandomEvent = () => {
    const template = initialEventTemplates[Math.floor(Math.random() * initialEventTemplates.length)];
    const now = new Date();
    const time = now.toLocaleTimeString('en-US', { hour12: false });
    eventCounter.current += 1;
    return { ...template, id: `event-${eventCounter.current}-${now.getTime()}`, time };
  };

  useEffect(() => {
    // Populate initial events
    const initial = [];
    for (let i = 0; i < 5; i++) {
      initial.unshift(getRandomEvent()); // Add to front to simulate latest events
    }
    setEvents(initial);

    const interval = setInterval(() => {
      setEvents(prevEvents => {
        const newEvent = getRandomEvent();
        return [newEvent, ...prevEvents].slice(0, 10); // Keep up to 10 events
      });
    }, 1000); // Add a new event every 1 second

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm p-4 rounded-2xl border border-gray-700/80 shadow-lg">
      <h2 className="text-lg font-semibold mb-4 text-gray-200 tracking-wider">Live Event Stream</h2>
      <div className="font-mono text-sm space-y-2 h-48 overflow-y-auto hide-scrollbar">
        <AnimatePresence initial={false}>
          {events.map((event) => (
            <motion.div
              key={event.id} // Unique key based on generated id
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -300 }}
              transition={{ duration: 0.5 }}
              className="flex items-center space-x-4"
            >
              <span className="text-gray-500">{event.time}</span>
              <span className={`${eventTypes[event.type] || 'text-gray-300'} flex-grow`}>
                {event.message}
              </span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default EventStream;
