# No Scam Shaadi — Frontend

This is the premium React-based interface for the No Scam Shaadi matrimonial verification platform.

## Theme
**Indian Marriage Detective**: A high-fidelity, investigative aesthetic blending classic "Confidential Dossier" styles with modern Indian wedding color palettes (Royal Blue, Saffron, Aged Paper).

## Tech Stack
- **Framework**: Vite + React
- **Icons**: Lucide React
- **Animations**: Framer Motion
- **API Client**: Axios

## Local Development

1. **Install Dependencies**:
   ```bash
   cd frontend
   npm install
   ```

2. **Run Dev Server**:
   ```bash
   npm run dev
   ```

3. **Backend Connection**:
   The frontend expects the FastAPI backend to be running at `http://127.0.0.1:8000`. 
   Ensure CORS is enabled in the backend (already configured in `app/main.py`).

## Key Pages
- **Landing Page**: "The Investigator's Desk" hero section.
- **Login/Signup**: "Officer Checkpoints" for agent authentication.
- **Dashboard**: "Active Investigations" list with real-time status tracking.
- **Intake Form**: "Subject Investigation File" for gathering intake data.
- **Report View**: "Confidential Dossier" presenting structured pipeline results.
