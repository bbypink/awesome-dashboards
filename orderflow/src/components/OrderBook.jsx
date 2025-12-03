import React from 'react';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell } from 'recharts';

const OrderBook = ({ data }) => {
    const { bids, asks } = data;

    // Add a cumulative total to each level for the bar chart
    const processData = (levels, reverse = false) => {
        let cumulative = 0;
        const processed = levels.map(level => {
            cumulative += level.size;
            return { ...level, cumulative };
        });
        return reverse ? processed.reverse() : processed;
    };
    
    const bidData = processData(bids, true);
    const askData = processData(asks);

    const maxCumulative = Math.max(bidData[bidData.length - 1]?.cumulative || 0, askData[askData.length-1]?.cumulative || 0);

    return (
        <div className="bg-gray-900/50 h-full p-2 rounded-lg border border-gray-700 flex flex-col">
            <h3 className="text-sm text-gray-400 p-2 text-center">Live Order Book</h3>
            <div className="flex-grow flex items-center">
                {/* Bids Chart (Green) */}
                <ResponsiveContainer width="50%" height="100%">
                    <BarChart data={bidData} layout="vertical" margin={{ top: 20, right: 0, left: 0, bottom: 20 }}>
                        <XAxis type="number" hide={true} domain={[0, maxCumulative]} />
                        <YAxis type="category" dataKey="price" axisLine={false} tickLine={false} tick={{fill: '#10b981', fontSize: 12}} />
                        <Bar dataKey="cumulative" isAnimationActive={false} barSize={20}>
                            {bidData.map((entry, index) => <Cell key={index} fill="#10b981" fillOpacity={0.3 + (index / bidData.length) * 0.5} />)}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>

                {/* Asks Chart (Red) */}
                <ResponsiveContainer width="50%" height="100%">
                     <BarChart data={askData} layout="vertical" margin={{ top: 20, right: 0, left: 0, bottom: 20 }}>
                        <XAxis type="number" hide={true} domain={[0, maxCumulative]} reversed={true} />
                        <YAxis type="category" dataKey="price" orientation="right" axisLine={false} tickLine={false} tick={{fill: '#f87171', fontSize: 12}} />
                         <Bar dataKey="cumulative" isAnimationActive={false} barSize={20}>
                            {askData.map((entry, index) => <Cell key={index} fill="#f87171" fillOpacity={0.3 + (index / askData.length) * 0.5} />)}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default OrderBook;
