import { useEffect, useState } from 'react';

function Home() {
    const [quakes, setQuakes] = useState([]);;

    useEffect(() => {
        fetch('https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson')
            .then(response => response.json())
            .then(data => setQuakes(data.features))
            .catch(error => console.error('Error fetching earthquake data:', error));
    }, []);

    return (
        <div>
            <h1>The Ground Shakes</h1>
            <p> Number of Earthquakes: {quakes.length}</p>
        </div>
    );
}

export default Home;