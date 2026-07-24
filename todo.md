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
- [ ] Complete earthquake map React component
- [ ] Connect map component to earthquake API endpoint
- [ ] Display live earthquake data from backend
- [ ] Implement markers/popups using API response data
- [ ] Handle loading state while map data loads
- [ ] Handle API errors on map

### Frontend Member Tasks:
- [ ] Complete dashboard UI
- [ ] Connect forms to Express API
- [ ] Verify JSON request bodies
- [ ] Add frontend validation
- [ ] Handle failed requests

Deliverable:
- List of React components + API endpoints used

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
- [ ] Configure database connection
- [ ] Create earthquake data schema
- [ ] Verify CRUD operations
- [ ] Confirm API reads from database
- [ ] Confirm API writes to database
- [ ] Test persistent storage

Deliverable:
- Database architecture explanation

---

# 3. Access Control & Basic Authentication Enforcement
**Owner: Backend Member 2**

### Requirements to Complete:
- List protected endpoints
- Identify authorization middleware
- Explain unauthorized behavior

### Tasks:
- [ ] Create authentication middleware
- [ ] Protect required routes
- [ ] Test unauthorized requests
- [ ] Return correct 401 responses
- [ ] Document protected endpoints

Frontend Requirements:
- [ ] Detect 401 responses
- [ ] Redirect unauthenticated users
- [ ] Display login/error messages

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
- [ ] Review commit history
- [ ] Verify each member has contributions
- [ ] Update README
- [ ] Create final blocker list
- [ ] Document remaining features

Deliverable:
- Final checkpoint report

---

# Remaining Application TODO

## Map Feature
Owner: Christina

- [ ] Map library selected
- [ ] Map displays earthquake locations
- [ ] Markers display earthquake details
- [ ] Filtering implemented
- [ ] API integration completed

---

## Backend API
Owner: Backend Team

- [ ] All REST endpoints working
- [ ] Database connected
- [ ] CRUD operations tested
- [ ] Authentication middleware complete

---

## Frontend
Owner: Frontend Team

- [ ] Dashboard complete
- [ ] Forms connected
- [ ] Error states implemented
- [ ] Loading states implemented

---

## Final Integration
Owner: Everyone

- [ ] Frontend successfully communicates with backend
- [ ] Database persistence verified
- [ ] Authentication tested
- [ ] Presentation prepared
- [ ] Demo workflow tested
