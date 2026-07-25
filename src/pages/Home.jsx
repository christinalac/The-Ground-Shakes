import { useEffect, useState } from 'react';
import MapComponent from '../MapComponent';
import { normalizeQuakes } from '../utils/quakeUtils';

function Home() {
    const [quakes, setQuakes] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState('');

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
                setErrorMessage('');
            })
            .catch((error) => {
                console.error('Error fetching earthquake data:', error);
                setQuakes([]);
                setErrorMessage('Unable to load earthquake data right now.');
            })
            .finally(() => {
                setIsLoading(false);
            });
    }, []);

    return (
        <div style={{ padding: '20px' }}>
            <h1>The Ground Shakes</h1>
            {isLoading ? (
                <p>Loading earthquakes...</p>
            ) : (
                <>
                    <p>Number of Earthquakes: {quakes.length}</p>
                    {errorMessage ? <p role="alert">{errorMessage}</p> : null}
                </>
            )}
            <MapComponent quakes={quakes} isLoading={isLoading} errorMessage={errorMessage} />
        </div>
    );
}

export default Home;