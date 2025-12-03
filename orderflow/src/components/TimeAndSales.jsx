import React from 'react';

const TimeAndSales = ({ trades }) => (
    <div className="bg-gray-900/50 h-full p-2 rounded-lg border border-gray-700">
        <h3 className="text-sm text-gray-400 p-2">Time & Sales</h3>
        <div className="h-full overflow-y-hidden">
            <table className="w-full text-xs text-right">
                <thead>
                    <tr className="text-gray-500">
                        <th className="text-left">Time</th>
                        <th>Price</th>
                        <th>Quantity</th>
                    </tr>
                </thead>
                <tbody>
                    {trades.map((trade) => (
                        <tr
                            key={trade.id}
                            className={`trade-item ${trade.side === 'buy' ? 'text-green-400' : 'text-red-400'}`}
                        >
                            <td className="text-left">{trade.time}</td>
                            <td>{trade.price.toFixed(2)}</td>
                            <td>{trade.size.toFixed(4)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </div>
);

export default TimeAndSales;
