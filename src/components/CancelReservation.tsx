import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, XCircle, Search, AlertTriangle, DollarSign } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

const CancelReservation = () => {
  const { reservations, flights, passengers, cancelReservation } = useAppContext();
  const [searchPNR, setSearchPNR] = useState('');
  const [selectedReservation, setSelectedReservation] = useState<any>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleSearch = () => {
    const reservation = reservations.find(r => r.pnr === searchPNR && r.status === 'Confirmed');
    if (reservation) {
      const flight = flights.find(f => f.id === reservation.flightId);
      const passenger = passengers.find(p => p.id === reservation.passengerId);
      
      setSelectedReservation({
        ...reservation,
        flight,
        passenger
      });
    } else {
      alert('Active reservation not found with this PNR');
      setSelectedReservation(null);
    }
  };

  const handleCancelConfirm = () => {
    if (selectedReservation) {
      cancelReservation(selectedReservation.pnr);
      setShowConfirmation(false);
      setSelectedReservation(null);
      setSearchPNR('');
      alert('Reservation cancelled successfully. Refund will be processed within 5-7 business days.');
    }
  };

  const refundAmount = selectedReservation ? selectedReservation.amount * 0.8 : 0;

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
                <XCircle className="h-6 w-6 text-red-600" />
                <h1 className="text-2xl font-bold text-gray-900">Cancel Reservation</h1>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Section */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 mb-8">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Search Reservation</h2>
            <p className="text-gray-600">Enter PNR number to find and cancel reservation</p>
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

        {/* Reservation Details */}
        {selectedReservation && !showConfirmation && (
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 mb-8">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Reservation Details</h2>
              <p className="text-gray-600">Review the details before cancellation</p>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Passenger Information */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Passenger Information</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Name:</span>
                      <span className="font-medium">{selectedReservation.passenger?.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Age:</span>
                      <span className="font-medium">{selectedReservation.passenger?.age} years</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Gender:</span>
                      <span className="font-medium">{selectedReservation.passenger?.gender}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Phone:</span>
                      <span className="font-medium">{selectedReservation.passenger?.phone}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Email:</span>
                      <span className="font-medium">{selectedReservation.passenger?.email}</span>
                    </div>
                  </div>
                </div>

                {/* Flight Information */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Flight Information</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">PNR:</span>
                      <span className="font-medium text-blue-600">{selectedReservation.pnr}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Flight:</span>
                      <span className="font-medium">{selectedReservation.flight?.flightNumber}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Date:</span>
                      <span className="font-medium">{selectedReservation.flight?.date}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Time:</span>
                      <span className="font-medium">{selectedReservation.flight?.departureTime} - {selectedReservation.flight?.arrivalTime}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Seat:</span>
                      <span className="font-medium">{selectedReservation.seatNumber}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Booking Date:</span>
                      <span className="font-medium">{selectedReservation.bookingDate}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Cancellation Policy */}
              <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                <div className="flex items-start space-x-3">
                  <AlertTriangle className="h-6 w-6 text-yellow-600 mt-0.5" />
                  <div>
                    <h3 className="text-lg font-semibold text-yellow-800 mb-2">Cancellation Policy</h3>
                    <ul className="text-sm text-yellow-700 space-y-1">
                      <li>• Cancellation fee: 20% of ticket price</li>
                      <li>• Refund amount: 80% of original payment</li>
                      <li>• Processing time: 5-7 business days</li>
                      <li>• Refund will be credited to original payment method</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Payment Summary */}
              <div className="mt-6 bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <DollarSign className="h-5 w-5 mr-2 text-green-600" />
                  Refund Summary
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Original Amount:</span>
                    <span className="font-medium">${selectedReservation.amount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Cancellation Fee (20%):</span>
                    <span className="font-medium text-red-600">-${(selectedReservation.amount * 0.2).toFixed(2)}</span>
                  </div>
                  <div className="border-t border-gray-300 pt-2">
                    <div className="flex justify-between">
                      <span className="text-lg font-semibold text-gray-900">Refund Amount:</span>
                      <span className="text-lg font-semibold text-green-600">${refundAmount.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-4 mt-8">
                <button
                  onClick={() => setSelectedReservation(null)}
                  className="px-6 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Back to Search
                </button>
                <button
                  onClick={() => setShowConfirmation(true)}
                  className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Cancel Reservation
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Confirmation Modal */}
        {showConfirmation && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Confirm Cancellation</h3>
              </div>
              <div className="p-6">
                <div className="text-center mb-6">
                  <div className="bg-red-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                    <XCircle className="h-8 w-8 text-red-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Cancel Reservation?</h3>
                  <p className="text-gray-600">
                    Are you sure you want to cancel reservation {selectedReservation?.pnr}? 
                    This action cannot be undone.
                  </p>
                </div>

                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                  <div className="text-center">
                    <p className="text-sm text-gray-600 mb-1">Refund Amount</p>
                    <p className="text-2xl font-bold text-green-600">${refundAmount.toFixed(2)}</p>
                  </div>
                </div>

                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => setShowConfirmation(false)}
                    className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Keep Reservation
                  </button>
                  <button
                    onClick={handleCancelConfirm}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    Confirm Cancellation
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Recent Cancellations */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Recent Cancellations</h2>
            <p className="text-gray-600">Previously cancelled reservations</p>
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
                    Original Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Refund Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {reservations.filter(r => r.status === 'Cancelled').map((reservation) => {
                  const flight = flights.find(f => f.id === reservation.flightId);
                  const passenger = passengers.find(p => p.id === reservation.passengerId);
                  return (
                    <tr key={reservation.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{reservation.pnr}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{passenger?.name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{flight?.flightNumber}</div>
                        <div className="text-sm text-gray-500">{flight?.date}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">${reservation.amount}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-green-600">${(reservation.amount * 0.8).toFixed(2)}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                          Cancelled
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CancelReservation;