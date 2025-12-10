import React, { useState, useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { FaPlayCircle, FaPauseCircle, FaCheckCircle, FaHourglassHalf } from 'react-icons/fa';

const JobItem = ({ job }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'running': return 'text-green-400';
      case 'pending': return 'text-yellow-400';
      case 'completed': return 'text-purple-400';
      default: return 'text-gray-400';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'running': return <FaPlayCircle className="text-green-400" />;
      case 'pending': return <FaHourglassHalf className="text-yellow-400" />;
      case 'completed': return <FaCheckCircle className="text-purple-400" />;
      default: return null;
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -100 }}
      transition={{ type: "spring", stiffness: 500, damping: 30 }}
      className="flex items-center justify-between bg-gray-700/30 p-3 rounded-lg border border-gray-600/50"
    >
      <div className="flex items-center space-x-3">
        {getStatusIcon(job.status)}
        <span className="font-mono text-gray-200">{job.name}</span>
      </div>
      <div className="flex items-center space-x-2">
        <span className={`text-sm ${getStatusColor(job.status)}`}>{job.status.toUpperCase()}</span>
        {job.status === 'running' && (
          <div className="w-24 bg-gray-600 rounded-full h-2 relative overflow-hidden"> {/* Increased width */}
            <div
              className="bg-green-400 h-2 rounded-full absolute inset-y-0 left-0"
              style={{ width: `${job.progress}%` }}
            ></div>
            {/* Marching ants effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-[progress-scan_2s_linear_infinite]"
                 style={{ width: '100%' }}></div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

const JobQueue = () => {
  const [jobs, setJobs] = useState([
    { id: 'job-1', name: 'Q-Factorization', status: 'running', progress: 30 },
    { id: 'job-2', name: 'Quantum Search', status: 'pending', progress: 0 },
    { id: 'job-3', name: 'Q-Simulation', status: 'completed', progress: 100 },
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setJobs(prevJobs => {
        return prevJobs.map(job => {
          if (job.status === 'running') {
            const newProgress = Math.min(job.progress + Math.floor(Math.random() * 10) + 1, 100);
            return {
              ...job,
              progress: newProgress,
              status: newProgress === 100 ? 'completed' : 'running',
            };
          }
          return job;
        });
      });
    }, 1000); // Update progress every second

    // Add new job periodically
    const addJobInterval = setInterval(() => {
      setJobs(prevJobs => {
        const newJobName = `Q-Task-${Math.floor(Math.random() * 1000)}`;
        const newJob = {
          id: `job-${Date.now()}-${Math.random()}`,
          name: newJobName,
          status: 'pending',
          progress: 0,
        };
        // Add new job to a random position or at the start/end
        const insertIndex = Math.floor(Math.random() * (prevJobs.length + 1));
        const updatedJobs = [...prevJobs.slice(0, insertIndex), newJob, ...prevJobs.slice(insertIndex)];
        return updatedJobs.slice(0, 5); // Keep max 5 jobs
      });
    }, 5000); // Add new job every 5 seconds

    return () => {
      clearInterval(interval);
      clearInterval(addJobInterval);
    };
  }, []);

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm p-4 rounded-2xl border border-gray-700/80 shadow-lg h-full">
      <h2 className="text-lg font-semibold mb-4 text-gray-200 tracking-wider">Quantum Job Queue</h2>
      <div className="space-y-3 h-full overflow-y-auto hide-scrollbar">
        <AnimatePresence>
          {jobs.map(job => (
            <JobItem key={job.id} job={job} />
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default JobQueue;
