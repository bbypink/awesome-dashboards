import React from 'react';

const Header = () => (
    <header className="flex items-center space-x-3 mb-6">
        <img 
            src="https://coin-images.coingecko.com/coins/images/1/large/bitcoin.png?1696501400" 
            alt="Bitcoin Logo" 
            className="w-8 h-8"
        />
        <h1 className="text-2xl font-bold tracking-wider text-gray-200">BITCOIN PERFORMANCE OVERVIEW</h1>
    </header>
);

export default Header;
