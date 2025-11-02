import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import MainMenu from './components/MainMenu';
import AircraftManagement from './components/AircraftManagement';
import FlightManagement from './components/FlightManagement';
import ReservationSystem from './components/ReservationSystem';
import TicketPrinting from './components/TicketPrinting';
import CancelReservation from './components/CancelReservation';
import DailyCollections from './components/DailyCollections';
import SectorManagement from './components/SectorManagement';
import ScheduledFlights from './components/ScheduledFlights';
import { AppProvider } from './context/AppContext';

function App() {
  return (
    <AppProvider>
      <Router>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
          <Routes>
            <Route path="/" element={<MainMenu />} />
            <Route path="/aircraft" element={<AircraftManagement />} />
            <Route path="/flights" element={<FlightManagement />} />
            <Route path="/reservations" element={<ReservationSystem />} />
            <Route path="/tickets" element={<TicketPrinting />} />
            <Route path="/cancel" element={<CancelReservation />} />
            <Route path="/collections" element={<DailyCollections />} />
            <Route path="/sectors" element={<SectorManagement />} />
            <Route path="/scheduled" element={<ScheduledFlights />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </Router>
    </AppProvider>
  );
}

export default App;