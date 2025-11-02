import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Clock, Calendar, Plane, MapPin, Filter } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

const ScheduledFlights = () => {
  const { flights, aircraft, sectors } = useAppContext();
  const [filterDate, setFilterDate] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const getAircraftModel = (aircraftId: string) => {
    const aircraftItem = aircraft.find(a => a.id === aircraftId);
    return aircraftItem ? aircraftItem.model : 'Unknown';
  };

  const getSectorRoute = (sectorId: string) => {
    const sector = sectors.find(s => s.id === sectorId);
    return sector ? { from: sector.from, to: sector.to, duration: sector.duration } : null;
  };

  const getFlightStatus = (flight: any) => {
    const flightDate = new Date(flight.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    flightDate.setHours(0, 0, 0, 0);

    if (flightDate < today) return 'Completed';
    if (flightDate.getTime() === today.getTime()) return 'Today';
    return 'Scheduled';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed':
        return 'bg-gray-100 text-gray-800';
      case 'Today':
        return 'bg-green-100 text-green-800';
      case 'Scheduled':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredFlights = flights.filter(flight => {
    const matchesDate = !filterDate || flight.date === filterDate;
    const status = getFlightStatus(flight);
    const matchesStatus = filterStatus === 'all' || status.toLowerCase() === filterStatus;
    return matchesDate && matchesStatus;
  });

  // Group flights by date
  const flightsByDate = filteredFlights.reduce((acc, flight) => {
    const date = flight.date;
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(flight);
    return acc;
  }, {} as Record<string, any[]>);

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
                <Clock className="h-6 w-6 text-blue-600" />
                <h1 className="text-2xl font-bold text-gray-900">Scheduled Flights</h1>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 mb-8">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900 flex items-center">
              <Filter className="h-5 w-5 mr-2" />
              Filter Flights
            </h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Filter by Date
                </label>
                <input
                  type="date"
                  value={filterDate}
                  onChange={(e) => setFilterDate(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Filter by Status
                </label>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Flights</option>
                  <option value="scheduled">Scheduled</option>
                  <option value="today">Today</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Flights</p>
                <p className="text-3xl font-bold text-gray-900">{flights.length}</p>
              </div>
              <Plane className="h-8 w-8 text-blue-600" />
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Today's Flights</p>
                <p className="text-3xl font-bold text-green-600">
                  {flights.filter(f => getFlightStatus(f) === 'Today').length}
                </p>
              </div>
              <Calendar className="h-8 w-8 text-green-600" />
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Scheduled</p>
                <p className="text-3xl font-bold text-blue-600">
                  {flights.filter(f => getFlightStatus(f) === 'Scheduled').length}
                </p>
              </div>
              <Clock className="h-8 w-8 text-blue-600" />
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <p className="text-3xl font-bold text-gray-600">
                  {flights.filter(f => getFlightStatus(f) === 'Completed').length}
                </p>
              </div>
              <MapPin className="h-8 w-8 text-gray-600" />
            </div>
          </div>
        </div>

        {/* Flights by Date */}
        <div className="space-y-6">
          {Object.entries(flightsByDate)
            .sort(([a], [b]) => new Date(a).getTime() - new Date(b).getTime())
            .map(([date, dateFlights]) => (
              <div key={date} className="bg-white rounded-xl shadow-lg border border-gray-100">
                <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 rounded-t-xl">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                      <Calendar className="h-5 w-5 mr-2 text-blue-600" />
                      {new Date(date).toLocaleDateString('en-US', { 
                        weekday: 'long', 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </h3>
                    <span className="text-sm text-gray-600">{dateFlights.length} flights</span>
                  </div>
                </div>
                <div className="divide-y divide-gray-200">
                  {dateFlights
                    .sort((a, b) => a.departureTime.localeCompare(b.departureTime))
                    .map((flight) => {
                      const route = getSectorRoute(flight.sectorId);
                      const status = getFlightStatus(flight);
                      return (
                        <div key={flight.id} className="p-6 hover:bg-gray-50 transition-colors">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-6">
                              <div className="bg-blue-100 p-3 rounded-lg">
                                <Plane className="h-6 w-6 text-blue-600" />
                              </div>
                              <div>
                                <h4 className="text-lg font-semibold text-gray-900">{flight.flightNumber}</h4>
                                <p className="text-gray-600">{getAircraftModel(flight.aircraftId)}</p>
                              </div>
                              {route && (
                                <div className="flex items-center space-x-4">
                                  <div className="text-center">
                                    <p className="text-lg font-semibold text-gray-900">{route.from}</p>
                                    <p className="text-sm text-gray-600">{flight.departureTime}</p>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <div className="w-8 h-px bg-gray-300"></div>
                                    <Plane className="h-4 w-4 text-gray-400" />
                                    <div className="w-8 h-px bg-gray-300"></div>
                                  </div>
                                  <div className="text-center">
                                    <p className="text-lg font-semibold text-gray-900">{route.to}</p>
                                    <p className="text-sm text-gray-600">{flight.arrivalTime}</p>
                                  </div>
                                </div>
                              )}
                            </div>
                            <div className="text-right">
                              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(status)}`}>
                                {status}
                              </span>
                              <div className="mt-2 space-y-1">
                                <p className="text-sm text-gray-600">
                                  Available: {flight.availableSeats} seats
                                </p>
                                <p className="text-sm font-medium text-blue-600">
                                  ${flight.price}
                                </p>
                              </div>
                            </div>
                          </div>
                          {route && (
                            <div className="mt-4 flex items-center justify-between text-sm text-gray-500">
                              <span>Duration: {route.duration}</span>
                              <span>Aircraft: {getAircraftModel(flight.aircraftId)}</span>
                            </div>
                          )}
                        </div>
                      );
                    })}
                </div>
              </div>
            ))}
        </div>

        {filteredFlights.length === 0 && (
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-12 text-center">
            <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Flights Found</h3>
            <p className="text-gray-600">
              {filterDate || filterStatus !== 'all' 
                ? 'No flights match your current filters. Try adjusting the date or status filter.'
                : 'No flights have been scheduled yet. Add some flights to see them here.'
              }
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ScheduledFlights;