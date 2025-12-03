import React from 'react';
import { formatCurrency } from '../utils/formatters';

const RangeHighlight = ({ high, low }) => (
    <div className="p-4 rounded-md bg-cyan-500/10 mb-4">
        <p className="text-sm text-cyan-200">High (24h)</p>
        <p className="text-2xl font-bold text-cyan-400">{formatCurrency(high)}</p>
    </div>
);

const Lowlight = ({ low }) => (
    <div className="p-4 rounded-md bg-red-500/10">
        <p className="text-sm text-red-200">Low (24h)</p>
        <p className="text-2xl font-bold text-red-500">{formatCurrency(low)}</p>
    </div>
);

const HighlightBox = ({ data }) => (
    <div className="lg:col-span-1 bg-gray-800/50 p-6 rounded-lg flex flex-col justify-start">
        <h2 className="text-xl font-bold text-gray-200 mb-4">24-Hour Range</h2>
        <RangeHighlight high={data.high_24h} />
        <Lowlight low={data.low_24h} />
    </div>
);

export default HighlightBox;
