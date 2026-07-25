import { useEffect, useState } from 'react';
import MapComponent from '../MapComponent';

function Home() {
    const [quakes, setQuakes] = useState([]);

    useEffect(() => {
        fetch('https://pocketworld.org/api/quakes')
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Failed to fetch quake data');
                }
                return response.json();
            })
            .then((data) => {
                const items = Array.isArray(data)
                    ? data
                    : Array.isArray(data?.quakes)
                        ? data.quakes
                        : Array.isArray(data?.features)
                            ? data.features
                            : Array.isArray(data?.earthquakes)
                                ? data.earthquakes
                                : [];
                setQuakes(items.filter((quake) => {
                    const coords = quake?.geometry?.coordinates || quake?.coordinates;
                    const hasCoordinateArray = Array.isArray(coords) && coords.length >= 2;
                    const hasDirectCoordinates = typeof quake?.lng === 'number' && typeof quake?.lat === 'number';
                    return hasCoordinateArray || hasDirectCoordinates;
                }));
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