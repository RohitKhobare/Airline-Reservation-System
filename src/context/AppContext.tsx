import React, { createContext, useContext, useState, ReactNode } from 'react';

interface Aircraft {
  id: string;
  model: string;
  capacity: number;
  status: 'Active' | 'Maintenance' | 'Retired';
}

interface Sector {
  id: string;
  from: string;
  to: string;
  distance: number;
  duration: string;
}

interface Flight {
  id: string;
  flightNumber: string;
  aircraftId: string;
  sectorId: string;
  departureTime: string;
  arrivalTime: string;
  date: string;
  price: number;
  availableSeats: number;
}

interface Passenger {
  id: string;
  name: string;
  age: number;
  gender: 'Male' | 'Female';
  phone: string;
  email: string;
}

interface Reservation {
  id: string;
  pnr: string;
  flightId: string;
  passengerId: string;
  seatNumber: string;
  bookingDate: string;
  status: 'Confirmed' | 'Cancelled';
  amount: number;
}

interface Transaction {
  id: string;
  pnr: string;
  date: string;
  type: 'Booking' | 'Cancellation' | 'Refund';
  amount: number;
}

interface AppContextType {
  aircraft: Aircraft[];
  sectors: Sector[];
  flights: Flight[];
  passengers: Passenger[];
  reservations: Reservation[];
  transactions: Transaction[];
  addAircraft: (aircraft: Omit<Aircraft, 'id'>) => void;
  updateAircraft: (id: string, aircraft: Partial<Aircraft>) => void;
  deleteAircraft: (id: string) => void;
  addSector: (sector: Omit<Sector, 'id'>) => void;
  updateSector: (id: string, sector: Partial<Sector>) => void;
  deleteSector: (id: string) => void;
  addFlight: (flight: Omit<Flight, 'id'>) => void;
  updateFlight: (id: string, flight: Partial<Flight>) => void;
  deleteFlight: (id: string) => void;
  addPassenger: (passenger: Omit<Passenger, 'id'>) => void;
  addReservation: (reservation: Omit<Reservation, 'id' | 'pnr'>) => void;
  cancelReservation: (pnr: string) => void;
  addTransaction: (transaction: Omit<Transaction, 'id'>) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [aircraft, setAircraft] = useState<Aircraft[]>([
    { id: '1', model: 'Boeing 737-800', capacity: 189, status: 'Active' },
    { id: '2', model: 'Airbus A320', capacity: 180, status: 'Active' },
    { id: '3', model: 'Boeing 777-300ER', capacity: 396, status: 'Maintenance' },
  ]);

  const [sectors, setSectors] = useState<Sector[]>([
    { id: '1', from: 'New York', to: 'Los Angeles', distance: 2445, duration: '5h 30m' },
    { id: '2', from: 'Chicago', to: 'Miami', distance: 1197, duration: '3h 15m' },
    { id: '3', from: 'San Francisco', to: 'Seattle', distance: 679, duration: '2h 10m' },
  ]);

  const [flights, setFlights] = useState<Flight[]>([
    {
      id: '1',
      flightNumber: 'HA101',
      aircraftId: '1',
      sectorId: '1',
      departureTime: '08:00',
      arrivalTime: '11:30',
      date: '2024-01-15',
      price: 299,
      availableSeats: 150
    },
    {
      id: '2',
      flightNumber: 'HA202',
      aircraftId: '2',
      sectorId: '2',
      departureTime: '14:30',
      arrivalTime: '17:45',
      date: '2024-01-15',
      price: 189,
      availableSeats: 120
    }
  ]);

  const [passengers, setPassengers] = useState<Passenger[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  const generateId = () => Math.random().toString(36).substr(2, 9);
  const generatePNR = () => 'PNR' + Math.random().toString(36).substr(2, 5).toUpperCase();

  const addAircraft = (newAircraft: Omit<Aircraft, 'id'>) => {
    setAircraft(prev => [...prev, { ...newAircraft, id: generateId() }]);
  };

  const updateAircraft = (id: string, updatedAircraft: Partial<Aircraft>) => {
    setAircraft(prev => prev.map(a => a.id === id ? { ...a, ...updatedAircraft } : a));
  };

  const deleteAircraft = (id: string) => {
    setAircraft(prev => prev.filter(a => a.id !== id));
  };

  const addSector = (newSector: Omit<Sector, 'id'>) => {
    setSectors(prev => [...prev, { ...newSector, id: generateId() }]);
  };

  const updateSector = (id: string, updatedSector: Partial<Sector>) => {
    setSectors(prev => prev.map(s => s.id === id ? { ...s, ...updatedSector } : s));
  };

  const deleteSector = (id: string) => {
    setSectors(prev => prev.filter(s => s.id !== id));
  };

  const addFlight = (newFlight: Omit<Flight, 'id'>) => {
    setFlights(prev => [...prev, { ...newFlight, id: generateId() }]);
  };

  const updateFlight = (id: string, updatedFlight: Partial<Flight>) => {
    setFlights(prev => prev.map(f => f.id === id ? { ...f, ...updatedFlight } : f));
  };

  const deleteFlight = (id: string) => {
    setFlights(prev => prev.filter(f => f.id !== id));
  };

  const addPassenger = (newPassenger: Omit<Passenger, 'id'>) => {
    setPassengers(prev => [...prev, { ...newPassenger, id: generateId() }]);
  };

  const addReservation = (newReservation: Omit<Reservation, 'id' | 'pnr'>) => {
    const pnr = generatePNR();
    const reservation = { ...newReservation, id: generateId(), pnr };
    setReservations(prev => [...prev, reservation]);
    
    // Update available seats
    setFlights(prev => prev.map(f => 
      f.id === newReservation.flightId 
        ? { ...f, availableSeats: f.availableSeats - 1 }
        : f
    ));

    // Add transaction
    addTransaction({
      pnr,
      date: new Date().toISOString().split('T')[0],
      type: 'Booking',
      amount: newReservation.amount
    });

    return pnr;
  };

  const cancelReservation = (pnr: string) => {
    const reservation = reservations.find(r => r.pnr === pnr);
    if (reservation) {
      setReservations(prev => prev.map(r => 
        r.pnr === pnr ? { ...r, status: 'Cancelled' as const } : r
      ));

      // Update available seats
      setFlights(prev => prev.map(f => 
        f.id === reservation.flightId 
          ? { ...f, availableSeats: f.availableSeats + 1 }
          : f
      ));

      // Add refund transaction
      addTransaction({
        pnr,
        date: new Date().toISOString().split('T')[0],
        type: 'Refund',
        amount: reservation.amount * 0.8 // 80% refund
      });
    }
  };

  const addTransaction = (newTransaction: Omit<Transaction, 'id'>) => {
    setTransactions(prev => [...prev, { ...newTransaction, id: generateId() }]);
  };

  return (
    <AppContext.Provider value={{
      aircraft,
      sectors,
      flights,
      passengers,
      reservations,
      transactions,
      addAircraft,
      updateAircraft,
      deleteAircraft,
      addSector,
      updateSector,
      deleteSector,
      addFlight,
      updateFlight,
      deleteFlight,
      addPassenger,
      addReservation,
      cancelReservation,
      addTransaction
    }}>
      {children}
    </AppContext.Provider>
  );
};