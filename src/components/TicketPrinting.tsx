import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Ticket, Search, Printer, Download, Plane, Calendar, Clock, MapPin } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

const TicketPrinting = () => {
  const { reservations, flights, passengers, aircraft, sectors } = useAppContext();
  const [searchPNR, setSearchPNR] = useState('');
  const [selectedReservation, setSelectedReservation] = useState<any>(null);

  const handleSearch = () => {
    const reservation = reservations.find(r => r.pnr === searchPNR && r.status === 'Confirmed');
    if (reservation) {
      const flight = flights.find(f => f.id === reservation.flightId);
      const passenger = passengers.find(p => p.id === reservation.passengerId);
      const aircraftItem = aircraft.find(a => a.id === flight?.aircraftId);
      const sector = sectors.find(s => s.id === flight?.sectorId);
      
      setSelectedReservation({
        ...reservation,
        flight,
        passenger,
        aircraft: aircraftItem,
        sector
      });
    } else {
      alert('Reservation not found or cancelled');
      setSelectedReservation(null);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    // In a real application, this would generate a PDF
    alert('Ticket downloaded successfully!');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <div className="bg-white shadow-lg border-b border-gray-200 print:hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Link to="/" className="flex items-center text-gray-600 hover:text-gray-900 transition-colors">
                <ArrowLeft className="h-5 w-5 mr-2" />
                Back to Menu
              </Link>
              <div className="h-6 w-px bg-gray-300" />
              <div className="flex items-center space-x-2">
                <Ticket className="h-6 w-6 text-blue-600" />
                <h1 className="text-2xl font-bold text-gray-900">Print Tickets</h1>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Section */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 mb-8 print:hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Search Reservation</h2>
            <p className="text-gray-600">Enter PNR number to retrieve and print ticket</p>
          </div>
          <div className="p-6">
            <div className="flex space-x-4">
              <div className="flex-1">
                <input
                  type="text"
                  value={searchPNR}
                  onChange={(e) => setSearchPNR(e.target.value.toUpperCase())}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                  placeholder="Enter PNR Number (e.g., PNR12345)"
                />
              </div>
              <button
                onClick={handleSearch}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
              >
                <Search className="h-5 w-5" />
                <span>Search</span>
              </button>
            </div>
          </div>
        </div>

        {/* Ticket Display */}
        {selectedReservation && (
          <div className="bg-white rounded-xl shadow-lg border border-gray-100">
            {/* Print Actions */}
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center print:hidden">
              <h2 className="text-xl font-semibold text-gray-900">Boarding Pass</h2>
              <div className="flex space-x-3">
                <button
                  onClick={handleDownload}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
                >
                  <Download className="h-4 w-4" />
                  <span>Download</span>
                </button>
                <button
                  onClick={handlePrint}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                >
                  <Printer className="h-4 w-4" />
                  <span>Print</span>
                </button>
              </div>
            </div>

            {/* Ticket Content */}
            <div className="p-8">
              {/* Airline Header */}
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-blue-600 mb-2">Horizon Airlines</h1>
                <p className="text-gray-600">Electronic Boarding Pass</p>
              </div>

              {/* Main Ticket */}
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 mb-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Passenger Info */}
                  <div className="lg:col-span-2">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-2">Passenger</h3>
                        <p className="text-xl font-bold text-gray-900">{selectedReservation.passenger?.name}</p>
                        <p className="text-gray-600">{selectedReservation.passenger?.age} years, {selectedReservation.passenger?.gender}</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-2">PNR</h3>
                        <p className="text-xl font-bold text-blue-600">{selectedReservation.pnr}</p>
                        <p className="text-gray-600">Booking Date: {selectedReservation.bookingDate}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                      <div>
                        <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-2">From</h3>
                        <p className="text-lg font-bold text-gray-900">{selectedReservation.sector?.from}</p>
                        <div className="flex items-center text-gray-600 mt-1">
                          <Clock className="h-4 w-4 mr-1" />
                          <span>{selectedReservation.flight?.departureTime}</span>
                        </div>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-2">To</h3>
                        <p className="text-lg font-bold text-gray-900">{selectedReservation.sector?.to}</p>
                        <div className="flex items-center text-gray-600 mt-1">
                          <Clock className="h-4 w-4 mr-1" />
                          <span>{selectedReservation.flight?.arrivalTime}</span>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                      <div>
                        <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-2">Flight</h3>
                        <p className="text-lg font-bold text-gray-900">{selectedReservation.flight?.flightNumber}</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-2">Date</h3>
                        <p className="text-lg font-bold text-gray-900">{selectedReservation.flight?.date}</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-2">Seat</h3>
                        <p className="text-lg font-bold text-gray-900">{selectedReservation.seatNumber}</p>
                      </div>
                    </div>
                  </div>

                  {/* QR Code Section */}
                  <div className="flex flex-col items-center justify-center border-l-2 border-dashed border-gray-300 pl-6">
                    <div className="bg-gray-100 w-32 h-32 rounded-lg flex items-center justify-center mb-4">
                      <div className="text-center">
                        <div className="w-24 h-24 bg-black rounded grid grid-cols-8 gap-px p-1">
                          {Array.from({ length: 64 }).map((_, i) => (
                            <div
                              key={i}
                              className={`${Math.random() > 0.5 ? 'bg-white' : 'bg-black'} rounded-sm`}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 text-center">Scan for mobile boarding</p>
                  </div>
                </div>
              </div>

              {/* Flight Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                    <Plane className="h-5 w-5 mr-2 text-blue-600" />
                    Aircraft Details
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div><span className="text-gray-600">Model:</span> <span className="ml-2">{selectedReservation.aircraft?.model}</span></div>
                    <div><span className="text-gray-600">Capacity:</span> <span className="ml-2">{selectedReservation.aircraft?.capacity} passengers</span></div>
                  </div>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                    <MapPin className="h-5 w-5 mr-2 text-blue-600" />
                    Route Information
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div><span className="text-gray-600">Distance:</span> <span className="ml-2">{selectedReservation.sector?.distance} miles</span></div>
                    <div><span className="text-gray-600">Duration:</span> <span className="ml-2">{selectedReservation.sector?.duration}</span></div>
                  </div>
                </div>
              </div>

              {/* Important Information */}
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h3 className="font-semibold text-yellow-800 mb-2">Important Information</h3>
                <ul className="text-sm text-yellow-700 space-y-1">
                  <li>• Please arrive at the airport at least 2 hours before domestic flights</li>
                  <li>• Carry a valid government-issued photo ID</li>
                  <li>• Check-in closes 45 minutes before departure</li>
                  <li>• Baggage allowance: 23kg checked, 7kg carry-on</li>
                </ul>
              </div>

              {/* Footer */}
              <div className="text-center mt-8 pt-6 border-t border-gray-200">
                <p className="text-gray-600">Thank you for choosing Horizon Airlines</p>
                <p className="text-sm text-gray-500 mt-1">Have a pleasant journey!</p>
              </div>
            </div>
          </div>
        )}

        {/* Recent Reservations */}
        {!selectedReservation && (
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 print:hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Recent Reservations</h2>
              <p className="text-gray-600">Click on any reservation to print ticket</p>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      PNR
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Passenger
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Flight
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {reservations.filter(r => r.status === 'Confirmed').slice(0, 10).map((reservation) => {
                    const flight = flights.find(f => f.id === reservation.flightId);
                    const passenger = passengers.find(p => p.id === reservation.passengerId);
                    return (
                      <tr key={reservation.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-blue-600">{reservation.pnr}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{passenger?.name}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{flight?.flightNumber}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{flight?.date}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            {reservation.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            onClick={() => {
                              setSearchPNR(reservation.pnr);
                              handleSearch();
                            }}
                            className="text-blue-600 hover:text-blue-900 transition-colors"
                          >
                            Print Ticket
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TicketPrinting;