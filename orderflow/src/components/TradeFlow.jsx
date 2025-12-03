import React from 'react';

const TradeFlow = ({ latestTrade }) => {
    // We use the trade's unique ID as a key to force re-rendering and re-triggering the CSS animation
    if (!latestTrade) return null;

    return (
        <div 
            key={latestTrade.id} 
            className={`trade-bubble absolute top-1/2 -translate-y-1/2 ${latestTrade.side === 'buy' ? 'bg-green-500/80' : 'bg-red-500/80'}`}
            style={{
                width: `${Math.max(8, Math.sqrt(latestTrade.size) * 10)}px`,
                height: `${Math.max(8, Math.sqrt(latestTrade.size) * 10)}px`,
            }}
        />
    );
};

export default TradeFlow;
