import { useEffect, useState } from 'react';
import { getClusterHealth } from '../services/elasticsearch';
import './earwig.css';

const EarWig = () => {
    return <div className="loader">
        <div data-glitch="Loading..." className="glitch">Loading...</div>
    </div>
}

export default EarWig;