import { useEffect, useState } from 'react';
import MapComponent from '../MapComponent';
import { normalizeQuakes } from '../utils/quakeUtils';

function Home() {
    const [quakes, setQuakes] = useState([]);

    useEffect(() => {
        fetch('/api/quakes')
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Failed to fetch quake data');
                }
                return response.json();
            })
            .then((data) => {
                setQuakes(normalizeQuakes(data));
            })
            .catch((error) => {
                console.error('Error fetching earthquake data:', error);
                setQuakes([]);
            });
    }, []);

    return (
        <div style={{ padding: '20px' }}>
            <h1>The Ground Shakes</h1>
            <p>Number of Earthquakes: {quakes.length}</p>
            <MapComponent quakes={quakes} />
        </div>
    );
}

export default Home;