import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Plus, Users, Plane, Calendar, DollarSign } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

const ReservationSystem = () => {
  const { 
    flights, 
    aircraft, 
    sectors, 
    passengers, 
    reservations, 
    addPassenger, 
    addReservation 
  } = useAppContext();
  
  const [step, setStep] = useState(1);
  const [selectedFlight, setSelectedFlight] = useState<any>(null);
  const [passengerData, setPassengerData] = useState({
    name: '',
    age: '',
    gender: 'Male' as 'Male' | 'Female',
    phone: '',
    email: ''
  });
  const [bookingComplete, setBookingComplete] = useState(false);
  const [generatedPNR, setGeneratedPNR] = useState('');

  const getAircraftModel = (aircraftId: string) => {
    const aircraftItem = aircraft.find(a => a.id === aircraftId);
    return aircraftItem ? aircraftItem.model : 'Unknown';
  };

  const getSectorRoute = (sectorId: string) => {
    const sector = sectors.find(s => s.id === sectorId);
    return sector ? { from: sector.from, to: sector.to, duration: sector.duration } : null;
  };

  const handleFlightSelect = (flight: any) => {
    setSelectedFlight(flight);
    setStep(2);
  };

  const handlePassengerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Add passenger
    const passengerId = Math.random().toString(36).substr(2, 9);
    addPassenger({
      ...passengerData,
      age: parseInt(passengerData.age)
    });

    // Create reservation
    const seatNumber = `${Math.floor(Math.random() * 30) + 1}${String.fromCharCode(65 + Math.floor(Math.random() * 6))}`;
    const pnr = addReservation({
      flightId: selectedFlight.id,
      passengerId,
      seatNumber,
      bookingDate: new Date().toISOString().split('T')[0],
      status: 'Confirmed',
      amount: selectedFlight.price
    });

    setGeneratedPNR(pnr);
    setBookingComplete(true);
    setStep(3);
  };

  const resetBooking = () => {
    setStep(1);
    setSelectedFlight(null);
    setPassengerData({
      name: '',
      age: '',
      gender: 'Male',
      phone: '',
      email: ''
    });
    setBookingComplete(false);
    setGeneratedPNR('');
  };

  const availableFlights = flights.filter(f => f.availableSeats > 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <div className="bg-white shadow-lg border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Link to="/" className="flex items-center text-gray-600 hover:text-gray-900 transition-colors">
                <ArrowLeft className="h-5 w-5 mr-2" />
                Back to Menu
              </Link>
              <div className="h-6 w-px bg-gray-300" />
              <div className="flex items-center space-x-2">
                <Users className="h-6 w-6 text-blue-600" />
                <h1 className="text-2xl font-bold text-gray-900">Passenger Reservations</h1>
              </div>
            </div>
            {bookingComplete && (
              <button
                onClick={resetBooking}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
              >
                <Plus className="h-4 w-4" />
                <span>New Booking</span>
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-8">
            <div className={`flex items-center space-x-2 ${step >= 1 ? 'text-blue-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>
                1
              </div>
              <span className="font-medium">Select Flight</span>
            </div>
            <div className={`w-16 h-1 ${step >= 2 ? 'bg-blue-600' : 'bg-gray-200'} rounded`} />
            <div className={`flex items-center space-x-2 ${step >= 2 ? 'text-blue-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>
                2
              </div>
              <span className="font-medium">Passenger Details</span>
            </div>
            <div className={`w-16 h-1 ${step >= 3 ? 'bg-blue-600' : 'bg-gray-200'} rounded`} />
            <div className={`flex items-center space-x-2 ${step >= 3 ? 'text-blue-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 3 ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>
                3
              </div>
              <span className="font-medium">Confirmation</span>
            </div>
          </div>
        </div>

        {/* Step 1: Flight Selection */}
        {step === 1 && (
          <div className="bg-white rounded-xl shadow-lg border border-gray-100">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Available Flights</h2>
              <p className="text-gray-600">Select a flight for your journey</p>
            </div>
            <div className="p-6">
              <div className="grid gap-4">
                {availableFlights.map((flight) => {
                  const route = getSectorRoute(flight.sectorId);
                  return (
                    <div
                      key={flight.id}
                      className="border border-gray-200 rounded-lg p-6 hover:border-blue-300 hover:shadow-md transition-all cursor-pointer"
                      onClick={() => handleFlightSelect(flight)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="bg-blue-100 p-3 rounded-lg">
                            <Plane className="h-6 w-6 text-blue-600" />
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900">{flight.flightNumber}</h3>
                            <p className="text-gray-600">{getAircraftModel(flight.aircraftId)}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-blue-600">${flight.price}</div>
                          <div className="text-sm text-gray-500">per person</div>
                        </div>
                      </div>
                      
                      {route && (
                        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="flex items-center space-x-2">
                            <Calendar className="h-4 w-4 text-gray-400" />
                            <span className="text-gray-600">{flight.date}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="text-gray-900 font-medium">{route.from}</span>
                            <span className="text-gray-400">→</span>
                            <span className="text-gray-900 font-medium">{route.to}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="text-gray-600">{flight.departureTime} - {flight.arrivalTime}</span>
                            <span className="text-gray-400">({route.duration})</span>
                          </div>
                        </div>
                      )}
                      
                      <div className="mt-4 flex justify-between items-center">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          flight.availableSeats > 50 ? 'bg-green-100 text-green-800' :
                          flight.availableSeats > 20 ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {flight.availableSeats} seats available
                        </span>
                        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                          Select Flight
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Passenger Details */}
        {step === 2 && selectedFlight && (
          <div className="bg-white rounded-xl shadow-lg border border-gray-100">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Passenger Information</h2>
              <p className="text-gray-600">Enter passenger details for {selectedFlight.flightNumber}</p>
            </div>
            <form onSubmit={handlePassengerSubmit} className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={passengerData.name}
                    onChange={(e) => setPassengerData({ ...passengerData, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="John Doe"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Age
                  </label>
                  <input
                    type="number"
                    value={passengerData.age}
                    onChange={(e) => setPassengerData({ ...passengerData, age: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="25"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Gender
                  </label>
                  <select
                    value={passengerData.gender}
                    onChange={(e) => setPassengerData({ ...passengerData, gender: e.target.value as any })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={passengerData.phone}
                    onChange={(e) => setPassengerData({ ...passengerData, phone: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="+1 (555) 123-4567"
                    required
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={passengerData.email}
                    onChange={(e) => setPassengerData({ ...passengerData, email: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="john@example.com"
                    required
                  />
                </div>
              </div>
              
              {/* Flight Summary */}
              <div className="mt-8 bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-2">Flight Summary</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Flight:</span>
                    <span className="ml-2 font-medium">{selectedFlight.flightNumber}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Date:</span>
                    <span className="ml-2 font-medium">{selectedFlight.date}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Route:</span>
                    <span className="ml-2 font-medium">{getSectorRoute(selectedFlight.sectorId)?.from} → {getSectorRoute(selectedFlight.sectorId)?.to}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Price:</span>
                    <span className="ml-2 font-medium text-blue-600">${selectedFlight.price}</span>
                  </div>
                </div>
              </div>

              <div className="flex justify-between mt-6">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Back to Flights
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Confirm Booking
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Step 3: Confirmation */}
        {step === 3 && bookingComplete && (
          <div className="bg-white rounded-xl shadow-lg border border-gray-100">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-green-600">Booking Confirmed!</h2>
              <p className="text-gray-600">Your reservation has been successfully created</p>
            </div>
            <div className="p-6">
              <div className="text-center mb-6">
                <div className="bg-green-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <Users className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Reservation Successful</h3>
                <p className="text-gray-600">Please save your PNR for future reference</p>
              </div>

              <div className="bg-blue-50 rounded-lg p-6 mb-6">
                <div className="text-center">
                  <p className="text-sm text-gray-600 mb-1">Your PNR Number</p>
                  <p className="text-3xl font-bold text-blue-600">{generatedPNR}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Passenger Details</h4>
                  <div className="space-y-2 text-sm">
                    <div><span className="text-gray-600">Name:</span> <span className="ml-2">{passengerData.name}</span></div>
                    <div><span className="text-gray-600">Age:</span> <span className="ml-2">{passengerData.age}</span></div>
                    <div><span className="text-gray-600">Gender:</span> <span className="ml-2">{passengerData.gender}</span></div>
                    <div><span className="text-gray-600">Phone:</span> <span className="ml-2">{passengerData.phone}</span></div>
                    <div><span className="text-gray-600">Email:</span> <span className="ml-2">{passengerData.email}</span></div>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Flight Details</h4>
                  <div className="space-y-2 text-sm">
                    <div><span className="text-gray-600">Flight:</span> <span className="ml-2">{selectedFlight.flightNumber}</span></div>
                    <div><span className="text-gray-600">Date:</span> <span className="ml-2">{selectedFlight.date}</span></div>
                    <div><span className="text-gray-600">Time:</span> <span className="ml-2">{selectedFlight.departureTime} - {selectedFlight.arrivalTime}</span></div>
                    <div><span className="text-gray-600">Route:</span> <span className="ml-2">{getSectorRoute(selectedFlight.sectorId)?.from} → {getSectorRoute(selectedFlight.sectorId)?.to}</span></div>
                    <div><span className="text-gray-600">Amount Paid:</span> <span className="ml-2 font-semibold text-green-600">${selectedFlight.price}</span></div>
                  </div>
                </div>
              </div>

              <div className="flex justify-center space-x-4 mt-8">
                <Link
                  to="/tickets"
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Print Ticket
                </Link>
                <button
                  onClick={resetBooking}
                  className="bg-gray-100 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  New Booking
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReservationSystem;