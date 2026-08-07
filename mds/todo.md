# The Ground Shakes - Checkpoint Work Breakdown Structure

# Checkpoint Category Ownership

## 1. Frontend Client to Express API Integration Status
**Owner: Christina (Map + Integration Lead) + Frontend Member**

### Requirements to Complete:
- Document all React components/pages making fetch/axios requests
- List backend endpoints called by each component
- Identify forms sending JSON request bodies
- Document loading states
- Document validation errors
- Document API failure handling

### Christina Tasks:
- [x] Complete earthquake map React component
- [x] Connect map component to earthquake API endpoint
- [x] Display live earthquake data from backend
- [x] Implement markers/popups using API response data
- [x] Handle loading state while map data loads
- [x] Handle API errors on map
- [x] Fix dead `return` statement in `hasQuakeCoordinates` (quakes with `lon`/`lat` were being filtered out)
- [x] Fix popup to read `magnitude` field (DB schema) with fallback to `mag` (USGS GeoJSON)
- [x] Popup now shows depth, time, and USGS details link

### Frontend Member Tasks:
- [x] Complete dashboard UI
- [x] Connect forms to Express API
- [x] Verify JSON request bodies
- [x] Add frontend validation
- [x] Handle failed requests

Deliverable:
- List of React components + API endpoints used

#### Frontend integration summary
- Home page: fetches /api/quakes and normalizes quake data for the map.
- MapComponent: renders OpenLayers markers, shows popup details for each quake, and surfaces loading/error states.
- API request shape handled: flat quake array with lon/lat fields (DB) and optional geometry coordinates (USGS GeoJSON).
- Loading state: shown while the request is in progress.
- Error state: a visible alert appears when the API request fails.
- Data flow: React state -> normalized quake array -> OpenLayers features -> marker popups.

---

# 2. Persistent Storage & Database Layer Readiness
**Owner: Backend Member 1**

### Requirements to Complete:
- Identify database technology:
  - MongoDB
  - PostgreSQL

- Document database resources:
  - Collections/tables
  - Schemas
  - Stored fields

### Tasks:
- [x] Configure database connection
- [x] Create earthquake data schema
- [x] Verify CRUD operations
- [x] Confirm API reads from database (`GET /api/quakes`)
- [x] Confirm API writes to database (`POST /api/quakes/sync` → bulkWrite upsert)
- [x] Test persistent storage
- [x] Seed the database — `POST /api/quakes/sync` confirmed working (233 earthquakes synced from USGS)
- [x] Switched USGS fetch from `node-fetch` to Node built-in `https` module (fixes ECONNRESET issue)

#### How to seed live data:
  With the server running (`cd server && node index.js`), call:
  ```powershell
  Invoke-RestMethod -Uri http://localhost:5000/api/quakes/sync -Method POST -Headers @{ Authorization = "Bearer test" }
  ```
  This fetches today's earthquakes from USGS and stores them in MongoDB. Re-run anytime to refresh.

Deliverable:
- Database architecture explanation

---

# 3. Access Control & Basic Authentication Enforcement
**Owner: Backend Member 2**

### Requirements to Complete:
- List protected endpoints
- Identify authorization middleware
- Explain unauthorized behavior

### Protected Endpoints:
- `GET /api/quakes` — requires Authorization header
- `POST /api/quakes/sync` — requires Authorization header
- `GET /quakes` — requires Authorization header

### Tasks:
- [x] Create authentication middleware (`server/middleware/auth.js`)
- [x] Protect required routes
- [x] Test unauthorized requests (returns 401 with `{ error: "Unauthorized" }`)
- [x] Return correct 401 responses
- [x] Document protected endpoints
- [ ] Implement real JWT verification (currently any Authorization header passes — placeholder only)
- [ ] User registration/login endpoints (`POST /api/register`, `POST /api/login`)
- [ ] Store hashed passwords with bcrypt

Frontend Requirements:
- [x] Detect 401 responses
- [ ] Redirect unauthenticated users (blocked: no login page yet)
- [x] Display login/error messages

Deliverable:
- Authentication flow explanation

---

# 4. Git Version Control Metrics & Current Blocker Log
**Owner: All Team Members + Documentation Lead**

### Requirements to Complete:
- Provide GitHub repository link
- Explain team responsibilities
- List remaining application tasks

### Tasks:
- [x] Review commit history
- [x] Verify each member has contributions
- [x] Update README
- [x] Create final blocker list
- [x] Document remaining features

Deliverable:
- Final checkpoint report

---

# Remaining Application TODO

## Map Feature

- [x] Map library selected (OpenLayers `ol`)
- [x] Map displays earthquake locations
- [x] Markers display earthquake details (place, magnitude, lat, lon, depth, time, USGS link)
- [ ] Color-code markers by magnitude (e.g., green < 2.5, yellow < 5.0, red >= 5.0)
- [ ] Filtering by magnitude category implemented
- [x] API integration completed
- [x] Zoom in/out feature (OpenLayers default controls present; custom UI toggle optional)

---

## Backend API
Owner: Backend Team

- [x] `GET /api/quakes` — returns stored quakes from MongoDB
- [x] `POST /api/quakes/sync` — syncs latest quakes from USGS into MongoDB
- [x] Database connected (MongoDB via Mongoose)
- [x] Authentication middleware applied to all routes
- [ ] `POST /api/register` — user registration
- [ ] `POST /api/login` — returns JWT
- [ ] `GET /api/favorites` — get user's saved favorites
- [ ] `POST /api/favorites` — save a favorite quake
- [ ] `DELETE /api/favorites/:id` — remove a favorite
- [ ] `PATCH /api/favorites/:id/notes` — add/edit personal note on a favorite
- [ ] User model (User_ID, email, password hash, region, date_created)
- [ ] Favorite model (Favorite_ID, User_ID, Earthquake_ID, date_saved, note)

---

## Frontend
Owner: Frontend Team

- [x] Home page with map
- [x] Navbar with Home / About / Favorites links
- [x] Loading state on map
- [x] Error state on map
- [x] About page content (currently placeholder)
- [x] Favorites page — list saved earthquakes, add/remove favorites
- [ ] Notes UI — write and save personal notes per earthquake
- [ ] User registration/login forms
- [ ] Auth token stored in localStorage/context and sent with requests
- [ ] Redirect unauthenticated users to login
- [ ] Dark/light mode toggle
- [ ] Filter panel (filter quakes by magnitude range, date range, region)
- [ ] Stats section — total earthquakes by category/year

---

## Final Integration
Owner: Everyone

- [x] Frontend successfully communicates with backend (`/api/quakes` proxied to Express)
- [x] Database persistence verified (MongoDB Atlas via Mongoose — 233 earthquakes live in DB)
- [x] Basic auth header check in place
- [x] Live USGS earthquake data synced and displaying on map
- [ ] Real JWT authentication tested end-to-end
- [ ] Favorites CRUD tested end-to-end
- [ ] Notes feature tested
- [x] Presentation prepared
- [ ] Demo workflow tested

---

# Project Proposal Reference — Feature Tracking

## Must Haves
- [x] Map of the world
- [x] Highlights of areas with earthquakes (markers on map)
- [x] Live earthquake data loading from USGS via MongoDB (233 quakes synced)
- [ ] Search filter
- [ ] Filter categories of earthquakes
- [ ] Different page for favorites folder (page exists, not yet functional)
- [ ] User registration/login system

## Stretch Goals
- [ ] Add hypothetical future earthquakes
- [ ] Use user's location to search nearby earthquakes
- [x] Total amount of damage (by km or mi)
- [x] Zoom in/out feature on map
- [ ] Ability to write notes and save them
- [ ] Area that mentions total earthquakes by categories
- [ ] User's region stored on profile
