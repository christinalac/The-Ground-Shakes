# The Ground Shakes — Code Notes

---

## How All the Files Connect (Big Picture)

```
Browser
  └── src/index.js             ← starts the React app
        └── src/App.jsx        ← sets up pages and navigation
              ├── Navbar.jsx   ← shows the nav links at the top
              ├── Home.jsx     ← fetches quake data, shows the map
              │     ├── MapComponent.jsx   ← draws the map and popups
              │     └── quakeUtils.js      ← cleans/normalizes quake data
              ├── Favorites.jsx            ← shows saved favorites
              │     └── useFavorites.js   ← reads/writes to localStorage
              └── About.jsx    ← static info page

Frontend talks to Backend:
  Home.jsx → fetch('/api/quakes') → setupProxy.js forwards to → server/index.js
  server/index.js → db.js (MongoDB) → Quake.js (schema/model)
  server/index.js uses → middleware/auth.js (checks for auth header)
```

---

## File-by-File Connection Map

| File | Gets data from | Sends data to |
|---|---|---|
| `index.js` (src) | nothing | renders `App.jsx` into the browser |
| `App.jsx` | imports page components | renders them based on the URL |
| `Navbar.jsx` | nothing | provides links to switch pages |
| `Home.jsx` | `/api/quakes` (backend) | passes quakes to `MapComponent` |
| `MapComponent.jsx` | quakes from `Home.jsx`, `quakeUtils.js`, `useFavorites.js` | shows map + popup |
| `Favorites.jsx` | `useFavorites.js` (localStorage) | displays saved quakes |
| `quakeUtils.js` | raw API data | cleaned quake array |
| `useFavorites.js` | localStorage | favorites array + toggle function |
| `setupProxy.js` | nothing | forwards `/api` calls to port 5000 |
| `server/index.js` | MongoDB via `Quake.js`, USGS API | JSON response to frontend |
| `server/db.js` | `.env` (MONGO_URI) | MongoDB connection |
| `server/models/Quake.js` | nothing | defines the shape of quake data in MongoDB |
| `server/middleware/auth.js` | request headers | allows or blocks the request |

---

## src/index.js — App Entry Point

```js
import React from 'react';
```
- Loads React so JSX works

```js
import ReactDOM from 'react-dom/client';
```
- Loads the tool that puts React components into the real browser DOM

```js
import './index.css';
```
- Loads global CSS (base font, margin reset) for the whole app

```js
import App from './App.jsx';
```
- Imports the root App component

```js
const root = ReactDOM.createRoot(document.getElementById('root'));
```
- Finds the `<div id="root">` in `public/index.html` — this is where the whole app mounts

```js
root.render(<React.StrictMode><App /></React.StrictMode>);
```
- Puts the App component into the browser
- `StrictMode` runs extra checks during development to catch bugs early

```js
reportWebVitals();
```
- Optional performance measuring tool — not doing anything meaningful right now

---

## src/App.jsx — Router and Page Layout

```js
import { BrowserRouter, Routes, Route } from "react-router-dom";
```
- `BrowserRouter` — wraps the whole app so React Router can track the URL
- `Routes` — container that holds all the route rules
- `Route` — maps a URL path to a component

```js
import Home from "./pages/Home";
import About from "./pages/About";
import Favorites from "./pages/Favorites";
import Navbar from "./components/Navbar";
```
- Imports every page and the Navbar so App can use them

```js
<BrowserRouter>
```
- Everything inside here can use React Router's navigation

```js
<Navbar />
```
- Renders the nav bar on every page (it's outside `<Routes>` so it always shows)

```js
<Route path="/" element={<Home />} />
```
- When the URL is `/`, show the Home page

```js
<Route path="/About" element={<About />} />
```
- When the URL is `/About`, show the About page

```js
<Route path="/Favorites" element={<Favorites />} />
```
- When the URL is `/Favorites`, show the Favorites page

---

## src/components/Navbar.jsx — Navigation Bar

```js
import { Link } from 'react-router-dom';
```
- `Link` works like an `<a>` tag but doesn't reload the page — it just swaps the component

```js
<Link to="/">Home</Link>
<Link to="/About">About</Link>
<Link to="/Favorites">Favorites</Link>
```
- Each one changes the URL and shows the matching page without a full page reload

---

## src/pages/Home.jsx — Homepage with Map

```js
import { useEffect, useState } from 'react';
```
- `useState` — stores data that can change (quakes list, loading state, errors)
- `useEffect` — runs code after the component loads (used here to fetch data)

```js
import MapComponent from '../MapComponent';
```
- Brings in the map so Home can render it

```js
import { normalizeQuakes } from '../utils/quakeUtils';
```
- Brings in the function that cleans raw API data into a usable format

```js
const [quakes, setQuakes] = useState([]);
```
- `quakes` starts as an empty array — will be filled with earthquake data
- `setQuakes` is the function used to update it

```js
const [isLoading, setIsLoading] = useState(true);
```
- Starts as `true` — shows "Loading..." until data arrives

```js
const [errorMessage, setErrorMessage] = useState('');
```
- Starts empty — gets filled if the API call fails

```js
useEffect(() => { ... }, []);
```
- The `[]` at the end means this runs once when the page loads
- Fetches earthquake data from the backend

```js
fetch('/api/quakes', { headers: { Authorization: "Bearer test" } })
```
- Calls the backend API
- The `Authorization` header is required — the server rejects requests without it
- `/api/quakes` gets forwarded to `http://localhost:5000/api/quakes` by `setupProxy.js`

```js
if (response.status === 401) { throw new Error('You are not authorized'); }
```
- If the server returns 401 (unauthorized), throws an error with a clear message

```js
if (!response.ok) { throw new Error('Failed to fetch quake data'); }
```
- If any other non-success status comes back, throws a generic error

```js
setQuakes(normalizeQuakes(data));
```
- Passes the raw API data through `normalizeQuakes` to clean it, then saves it

```js
setErrorMessage(error.message);
```
- If anything fails, saves the error message so it can be shown on screen

```js
.finally(() => { setIsLoading(false); })
```
- Always runs at the end (success or failure) — turns off the loading state

```js
<MapComponent quakes={quakes} isLoading={isLoading} errorMessage={errorMessage} />
```
- Passes the quake data, loading state, and any error down to MapComponent as props

---

## src/MapComponent.jsx — Interactive Map

```js
import { useEffect, useRef, useState } from "react";
```
- `useRef` — holds a reference to a real DOM element (the map div and popup div)
- `useState` — tracks which quake is selected and the status message
- `useEffect` — runs the map setup code after the component renders

```js
import "ol/ol.css";
```
- Required CSS for OpenLayers — without this the map looks broken

```js
import Map from "ol/Map";
```
- The main OpenLayers map object

```js
import Overlay from "ol/Overlay";
```
- Used to anchor the popup box to a coordinate on the map

```js
import View from "ol/View";
```
- Controls the map's center point and zoom level

```js
import TileLayer from "ol/layer/Tile";
import OSM from "ol/source/OSM";
```
- `TileLayer` + `OSM` together load the OpenStreetMap background tiles

```js
import Feature from "ol/Feature";
import Point from "ol/geom/Point";
```
- `Feature` = one item on the map (one earthquake dot)
- `Point` = the geometry type — a single lat/lon location

```js
import VectorSource from "ol/source/Vector";
import VectorLayer from "ol/layer/Vector";
```
- `VectorSource` — holds all the earthquake features (dots)
- `VectorLayer` — the layer that draws those dots on top of the map tiles

```js
import { fromLonLat } from "ol/proj";
```
- Converts standard longitude/latitude coordinates into the map's internal coordinate system

```js
import { Circle as CircleStyle, Fill, Stroke, Style } from "ol/style";
```
- Used to style the earthquake dots (red circle with white border)

```js
import { getQuakeCoordinates } from "./utils/quakeUtils";
```
- Gets the lon/lat from a quake object, regardless of what format it came in

```js
import { useFavorites } from "./hooks/useFavorites";
```
- Pulls in the favorites hook so the popup checkbox can save/unsave quakes

```js
const mapRef = useRef(null);
```
- Points to the `<div>` where the map will be drawn

```js
const popupRef = useRef(null);
```
- Points to the `<div>` that holds the popup content

```js
const { isFavorite, toggleFavorite } = useFavorites();
```
- `isFavorite(id)` — checks if a quake is saved
- `toggleFavorite(quake)` — saves or removes a quake from favorites

```js
if (!mapRef.current) return;
```
- Safety check — if the map div doesn't exist yet, stop and do nothing

```js
const vectorSource = new VectorSource();
const vectorLayer = new VectorLayer({ source: vectorSource });
```
- Creates an empty layer — earthquake dots will be added to it

```js
const map = new Map({ target: mapRef.current, layers: [...], view: ... })
```
- Creates the actual map
- `target` — tells OpenLayers which div to draw into
- `layers` — the tile background + the earthquake dot layer
- `view` — sets the starting position (center of world, zoom 2)

```js
const popupOverlay = new Overlay({ element: popupRef.current, ... })
```
- Creates an overlay that attaches the popup div to a map coordinate
- `positioning: "bottom-left"` — popup appears to the right and above the click point
- `autoPan: true` — map slides to keep the popup visible if it would go off screen

```js
map.addOverlay(popupOverlay);
```
- Registers the overlay with the map so it moves with the map when panning

```js
const feature = map.forEachFeatureAtPixel(event.pixel, (f) => f);
```
- Checks if any dot was at the pixel the user clicked
- Returns the first matching feature, or undefined if nothing was clicked

```js
popupOverlay.setPosition(event.coordinate);
```
- Moves the popup to the exact map coordinate that was clicked

```js
popupOverlay.setPosition(undefined);
```
- Hides the popup by removing its position

```js
map.hasFeatureAtPixel(event.pixel)
```
- Returns true if the cursor is over any dot — used to change the cursor to a pointer

```js
const feature = new Feature({ geometry: new Point(fromLonLat([lon, lat])) });
```
- Creates one dot on the map at the earthquake's coordinates

```js
feature.set("quake", quake);
```
- Stores the full quake data object inside the feature so it can be retrieved on click

```js
feature.setStyle(new Style({ image: new CircleStyle({ radius: 7, fill: ..., stroke: ... }) }))
```
- Makes the dot red with a white outline, 7px radius

```js
vectorSource.addFeatures(features);
```
- Adds all the dots to the map at once

```js
return () => { map.setTarget(null); }
```
- Cleanup function — destroys the map when the component unmounts to prevent memory leaks

```js
const quakeId = selectedQuake?._id || selectedQuake?.usgsId;
const favorited = quakeId ? isFavorite(quakeId) : false;
```
- Gets the quake's ID (tries `_id` first for MongoDB, falls back to `usgsId`)
- Checks if that ID is in favorites — controls whether the checkbox is checked

```js
display: selectedQuake ? "block" : "none"
```
- Shows the popup div only when a quake is selected, hides it otherwise

```js
<input type="checkbox" checked={favorited} onChange={() => toggleFavorite(selectedQuake)} />
```
- The Favorite checkbox
- `checked` is controlled by whether the quake is in localStorage
- `onChange` calls `toggleFavorite` which adds or removes from favorites

---

## src/utils/quakeUtils.js — Data Cleaning Utilities

```js
export function normalizeQuakes(data) {
```
- Called in `Home.jsx` after the API responds
- Handles 4 different possible response shapes from the API

```js
const items = Array.isArray(data) ? data
  : Array.isArray(data?.quakes) ? data.quakes
  : Array.isArray(data?.features) ? data.features
  : Array.isArray(data?.earthquakes) ? data.earthquakes
  : [];
```
- Checks multiple possible shapes the data could arrive in
- Returns the array wherever it's found, or empty array if nothing matches

```js
return items.filter(hasQuakeCoordinates);
```
- Removes any quakes that don't have valid coordinates (can't be plotted)

```js
export function hasQuakeCoordinates(quake) {
```
- Returns `true` if the quake has usable coordinates in any format

```js
const coords = quake?.geometry?.coordinates || quake?.coordinates;
const hasCoordinateArray = Array.isArray(coords) && coords.length >= 2;
```
- Checks for USGS GeoJSON format: `geometry.coordinates: [lon, lat, depth]`

```js
const hasDirectCoordinates = typeof quake?.lng === 'number' && typeof quake?.lat === 'number';
```
- Checks for `lng`/`lat` format (some older API shapes)

```js
const hasLonCoordinates = typeof quake?.lon === 'number' && typeof quake?.lat === 'number';
```
- Checks for `lon`/`lat` format — this is what MongoDB returns

```js
export function getQuakeCoordinates(quake) {
```
- Called in `MapComponent` for each quake to get `{ lon, lat }` for plotting

```js
return { lon: coords[0], lat: coords[1] };
```
- GeoJSON arrays are `[longitude, latitude, depth]` — index 0 is lon, 1 is lat

---

## src/hooks/useFavorites.js — Favorites Storage

```js
const STORAGE_KEY = "quake_favorites";
```
- The key name used to store favorites in the browser's localStorage
- Using a constant avoids typos if you reference it in multiple places

```js
function loadFavorites() {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : [];
}
```
- Reads the saved favorites from localStorage when the app loads
- `JSON.parse` converts the stored string back into a JavaScript array
- Returns empty array if nothing is saved yet

```js
function saveFavorites(favorites) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
}
```
- Saves the favorites array to localStorage
- `JSON.stringify` converts the array to a string (localStorage only stores strings)

```js
const [favorites, setFavorites] = useState(loadFavorites);
```
- Initializes the favorites state by calling `loadFavorites` once on startup
- `loadFavorites` (no parentheses) means React calls it lazily — only once, not every render

```js
useEffect(() => { saveFavorites(favorites); }, [favorites]);
```
- Every time `favorites` changes, automatically saves to localStorage
- This keeps the browser storage always in sync with the React state

```js
function isFavorite(quakeId) {
  return favorites.some((q) => q._id === quakeId || q.usgsId === quakeId);
}
```
- Loops through saved favorites and returns `true` if any match the given ID
- Checks both `_id` (MongoDB) and `usgsId` to handle both data formats

```js
function toggleFavorite(quake) {
  const id = quake._id || quake.usgsId;
  if (isFavorite(id)) { removeFavorite(id); } else { addFavorite(quake); }
}
```
- If already favorited → removes it
- If not favorited → adds it
- This is what the checkbox's `onChange` calls

```js
return { favorites, isFavorite, toggleFavorite };
```
- Exposes only what other components need
- `MapComponent` uses `isFavorite` + `toggleFavorite`
- `Favorites.jsx` uses `favorites` + `toggleFavorite`

---

## src/pages/Favorites.jsx — Favorites Page

```js
const { favorites, toggleFavorite } = useFavorites();
```
- Gets the saved favorites array and the toggle function from localStorage

```js
{favorites.length === 0 ? <p>No favorites...</p> : ...}
```
- Shows a message if nothing is saved yet, otherwise shows the list

```js
{favorites.map((quake) => { ... })}
```
- Loops through every saved quake and renders a card for each one

```js
const id = quake._id || quake.usgsId;
```
- Gets the unique ID — used as the React `key` prop to identify each card

```js
onClick={() => toggleFavorite(quake)}
```
- The Remove button calls `toggleFavorite` which removes the quake from localStorage
- The card disappears immediately because React re-renders when state changes

---

## server/index.js — Express Backend Server

```js
require('dotenv').config();
```
- Loads the `.env` file so `process.env.MONGO_URI` and `process.env.PORT` are available

```js
const express = require('express');
const app = express();
```
- Creates the Express web server

```js
app.use(cors());
```
- Allows the React frontend (on port 3000) to make requests to this server (port 5000)
- Without this, the browser would block cross-origin requests

```js
app.use(express.json());
```
- Tells Express to automatically parse JSON request bodies

```js
connectDB();
```
- Calls `db.js` to connect to MongoDB using the URI from `.env`

```js
app.get('/api/quakes', authMiddleware, async (req, res) => {
```
- A GET route — responds when the frontend calls `fetch('/api/quakes')`
- `authMiddleware` runs first and blocks the request if no Authorization header

```js
const quakes = await Quake.find().sort({ time: -1 }).limit(500);
```
- Queries MongoDB for up to 500 quakes, newest first

```js
res.json(quakes);
```
- Sends the quake array back to the frontend as JSON

```js
app.post('/api/quakes/sync', authMiddleware, async (req, res) => {
```
- A POST route for manually syncing fresh data from USGS into MongoDB
- Run this once to seed the database, re-run anytime to refresh

```js
https.get('https://earthquake.usgs.gov/...', (response) => { ... })
```
- Uses Node's built-in `https` module to fetch today's earthquake data from USGS

```js
response.on('data', (chunk) => { raw += chunk; });
response.on('end', () => { resolve(JSON.parse(raw)); });
```
- Collects the response in chunks (streaming), then parses the full JSON at the end

```js
const ops = data.features.map((f) => ({ updateOne: { filter: ..., upsert: true } }))
```
- Builds a list of "upsert" operations — update if exists, insert if new
- Uses `usgsId` as the unique key to avoid duplicates

```js
await Quake.bulkWrite(ops);
```
- Sends all the upsert operations to MongoDB in one efficient batch

```js
app.listen(process.env.PORT || 5000, ...)
```
- Starts the server on port 5000 (or whatever PORT is set to in `.env`)

---

## server/db.js — Database Connection

```js
const mongoose = require('mongoose');
```
- Mongoose is the library that connects Node to MongoDB and provides the model system

```js
await mongoose.connect(process.env.MONGO_URI);
```
- Connects to MongoDB using the URI from the `.env` file
- The URI contains the username, password, and database name

```js
process.exit(1);
```
- If the connection fails, shuts down the server — no point running without a database

```js
module.exports = connectDB;
```
- Exports the function so `server/index.js` can call it

---

## server/models/Quake.js — Earthquake Data Schema

```js
const quakeSchema = new mongoose.Schema({ ... });
```
- Defines the shape of every earthquake document stored in MongoDB

```js
usgsId: { type: String, required: true, unique: true }
```
- The USGS earthquake ID (e.g. `"us7000abc1"`)
- `unique: true` prevents duplicate earthquakes from being inserted

```js
magnitude: { type: Number }
place: { type: String }
time: { type: Date }
lon: { type: Number, required: true }
lat: { type: Number, required: true }
depth: { type: Number }
url: { type: String }
```
- The fields stored for each earthquake
- `lon` and `lat` are required — a quake without coordinates can't be plotted

```js
{ timestamps: true }
```
- Automatically adds `createdAt` and `updatedAt` fields to every document

```js
module.exports = mongoose.model('Quake', quakeSchema);
```
- Creates the `Quake` model — this is what `server/index.js` imports and queries

---

## server/middleware/auth.js — Auth Check

```js
function authMiddleware(req, res, next) {
```
- Middleware runs between receiving a request and sending a response
- `next()` means "go ahead and run the route handler"

```js
const authHeader = req.headers.authorization;
if (!authHeader) { return res.status(401).json({ error: "Unauthorized" }); }
```
- Checks if the `Authorization` header exists
- If missing, returns 401 and stops — the route handler never runs
- Currently accepts any value (placeholder) — real JWT verification is a future task

```js
next();
```
- Header exists → allow the request through to the actual route

```js
module.exports = authMiddleware;
```
- Exports so `server/index.js` can attach it to any route

---

## src/setupProxy.js — API Proxy

```js
const { createProxyMiddleware } = require('http-proxy-middleware');
```
- A tool that forwards certain requests to a different server

```js
app.use('/api', createProxyMiddleware({ target: 'http://localhost:5000', changeOrigin: true }))
```
- Any request starting with `/api` gets forwarded to `http://localhost:5000`
- So `fetch('/api/quakes')` in React actually hits `http://localhost:5000/api/quakes`
- This only runs during development — in production you'd configure this on your host

---

## Part 1 — Frontend Client to Express API Integration (Code Evidence)

### React Components Making API Requests

**`src/pages/Home.jsx`**

```js
fetch('/api/quakes', { headers: { Authorization: "Bearer test" } })
```
- The only component making a fetch call
- Calls the Express backend endpoint `GET /api/quakes`
- Sends an Authorization header — required by the auth middleware

```js
.then((response) => {
  if (response.status === 401) { throw new Error('You are not authorized'); }
  if (!response.ok) { throw new Error('Failed to fetch quake data'); }
  return response.json();
})
```
- Checks for 401 (unauthorized) specifically — shows a clear message
- Checks for any other failure with `!response.ok`
- Converts the response to JSON if successful

```js
.then((data) => { setQuakes(normalizeQuakes(data)); })
```
- Passes the raw JSON through `normalizeQuakes` before storing
- `normalizeQuakes` handles different possible response shapes

```js
.catch((error) => { setErrorMessage(error.message); })
```
- Any failure (network error, 401, 500) sets the error message
- Error is displayed in the UI via `<p role="alert">{errorMessage}</p>`

```js
.finally(() => { setIsLoading(false); })
```
- Always runs — turns off the loading spinner whether the request succeeded or failed

### Loading State

```js
const [isLoading, setIsLoading] = useState(true);
```
- Starts as `true` so "Loading earthquakes..." shows immediately

```js
{isLoading ? <p>Loading earthquakes...</p> : <p>Number of Earthquakes: {quakes.length}</p>}
```
- Swaps the loading message for the count once data arrives

### Error State

```js
{errorMessage ? <p role="alert">{errorMessage}</p> : null}
```
- `role="alert"` makes this accessible to screen readers
- Only shows when there's actually an error

### Passing Data to MapComponent

```js
<MapComponent quakes={quakes} isLoading={isLoading} errorMessage={errorMessage} />
```
- All three pieces of state are passed down as props
- MapComponent uses them to show markers, loading text, or error text

### Backend Endpoint Called

| Component | Method | Endpoint | Purpose |
|---|---|---|---|
| `Home.jsx` | GET | `/api/quakes` | Fetch all stored earthquakes |

### Request Body
- `GET /api/quakes` has no request body — data comes back in the response
- The only request data sent is the `Authorization` header

### API Failure Handling Summary
- **401** → "You are not authorized"
- **Any other non-ok status** → "Failed to fetch quake data"
- **Network error** → error message from the thrown Error object
- All errors → stored in `errorMessage` state → displayed in the UI
- Map still renders (empty) so the page doesn't break
