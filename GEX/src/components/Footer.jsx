import React from 'react';
import RadialMetric from './RadialMetric';

const Footer = ({ data }) => {
    // Note: Some of these are now illustrative, using live data for animation effect
    const is7dChangePositive = data.ivChange >= 0;

    return (
        <footer className="mt-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <RadialMetric 
                    label="Put/Call Ratio"
                    value={data.putCallRatio}
                    total={2} // A typical range for PCR might be 0-2
                    color={data.putCallRatio > 1 ? '#f43f5e' : '#22d3ee'}
                    formatter={(val) => val.toFixed(2)}
                />
                 <RadialMetric 
                    label="IV Change"
                    value={data.ivChange * 100}
                    total={100}
                    color={is7dChangePositive ? '#d946ef' : '#3b82f6'}
                    formatter={() => `${data.ivChange.toFixed(2)}%`}
                />
                 <RadialMetric 
                    label="Volume Spike"
                    value={Math.random() * 100} // Purely decorative animation
                    color={'#facc15'}
                />
                <RadialMetric 
                    label="Circulating Supply"
                    value={data.circulating_supply}
                    total={21000000} // Keep this one based on bitcoin max for familiarity
                    color={'#22d3ee'}
                />
            </div>
             <div className="text-right text-xs text-gray-500 mt-4">
                Last Updated: {new Date().toLocaleString()}
            </div>
        </footer>
    );
};

export default Footer;