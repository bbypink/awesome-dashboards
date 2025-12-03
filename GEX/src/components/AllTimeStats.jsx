import React from 'react';
import { formatCurrency } from '../utils/formatters';

const AllTimeStats = ({ data }) => {
    const athChangePositive = data.ath_change_percentage >= 0;

    return (
        <div className="lg:col-span-1 bg-gray-800/50 p-6 rounded-lg mt-6 lg:mt-0">
             <h3 className="text-xl font-bold text-gray-200 mb-4">All-Time Stats</h3>
             <div className="space-y-2 text-sm">
                <p><strong>All-Time High:</strong> {formatCurrency(data.ath)} <span className={`font-semibold ${athChangePositive ? 'text-cyan-400' : 'text-red-500'}`}>({data.ath_change_percentage.toFixed(2)}%)</span></p>
                <p className="text-gray-400">on {new Date(data.ath_date).toLocaleDateString()}</p>
                <hr className="border-gray-700 my-2" />
                <p><strong>All-Time Low:</strong> {formatCurrency(data.atl)}</p>
                <p className="text-gray-400">on {new Date(data.atl_date).toLocaleDateString()}</p>
             </div>
        </div>
    )
}

export default AllTimeStats;
