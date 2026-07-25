import { useEffect, useState } from 'react';

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
                const items = Array.isArray(data?.quakes)
                    ? data.quakes
                    : Array.isArray(data?.features)
                        ? data.features
                        : [];
                setQuakes(items);
            })
            .catch((error) => console.error('Error fetching earthquake data:', error));
    }, []);

    return (
        <div>
            <h1>The Ground Shakes</h1>
            <p>Number of Earthquakes: {quakes.length}</p>
        </div>
    );
}

export default Home;