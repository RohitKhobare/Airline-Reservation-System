import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Plane, 
  Calendar, 
  Users, 
  Ticket, 
  XCircle, 
  DollarSign, 
  MapPin, 
  Clock,
  Building2
} from 'lucide-react';

const MainMenu = () => {
  const menuItems = [
    {
      title: 'Aircraft Management',
      description: 'Manage aircraft fleet, capacity, and status',
      icon: Plane,
      path: '/aircraft',
      color: 'bg-blue-500 hover:bg-blue-600'
    },
    {
      title: 'Flight Management',
      description: 'Create and manage flight schedules',
      icon: Calendar,
      path: '/flights',
      color: 'bg-green-500 hover:bg-green-600'
    },
    {
      title: 'Passenger Reservations',
      description: 'Book tickets and manage passenger details',
      icon: Users,
      path: '/reservations',
      color: 'bg-purple-500 hover:bg-purple-600'
    },
    {
      title: 'Print Tickets',
      description: 'Generate and print passenger tickets',
      icon: Ticket,
      path: '/tickets',
      color: 'bg-orange-500 hover:bg-orange-600'
    },
    {
      title: 'Cancel Reservations',
      description: 'Cancel bookings and process refunds',
      icon: XCircle,
      path: '/cancel',
      color: 'bg-red-500 hover:bg-red-600'
    },
    {
      title: 'Daily Collections',
      description: 'View financial reports and transactions',
      icon: DollarSign,
      path: '/collections',
      color: 'bg-emerald-500 hover:bg-emerald-600'
    },
    {
      title: 'Sector Management',
      description: 'Manage routes and destinations',
      icon: MapPin,
      path: '/sectors',
      color: 'bg-indigo-500 hover:bg-indigo-600'
    },
    {
      title: 'Scheduled Flights',
      description: 'View all scheduled flight operations',
      icon: Clock,
      path: '/scheduled',
      color: 'bg-teal-500 hover:bg-teal-600'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <div className="bg-white shadow-lg border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-600 p-3 rounded-xl">
                <Building2 className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Horizon Airlines</h1>
                <p className="text-sm text-gray-600">Reservation Management System</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Welcome to</p>
              <p className="text-lg font-semibold text-gray-900">Admin Dashboard</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Airline Management System
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Complete solution for managing aircraft, flights, reservations, and passenger services. 
            Select a module below to get started.
          </p>
        </div>

        {/* Menu Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {menuItems.map((item, index) => {
            const IconComponent = item.icon;
            return (
              <Link
                key={index}
                to={item.path}
                className="group relative bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100"
              >
                <div className="p-8">
                  <div className={`inline-flex p-4 rounded-xl ${item.color} transition-colors duration-300 mb-6`}>
                    <IconComponent className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {item.description}
                  </p>
                </div>
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </Link>
            );
          })}
        </div>

        {/* System Features */}
        <div className="mt-16 bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">System Features</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Plane className="h-8 w-8 text-blue-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Fleet Management</h4>
              <p className="text-gray-600 text-sm">Complete aircraft fleet management with maintenance tracking</p>
            </div>
            <div className="text-center">
              <div className="bg-green-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Users className="h-8 w-8 text-green-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Passenger Services</h4>
              <p className="text-gray-600 text-sm">Comprehensive booking and passenger management system</p>
            </div>
            <div className="text-center">
              <div className="bg-purple-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <DollarSign className="h-8 w-8 text-purple-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Financial Tracking</h4>
              <p className="text-gray-600 text-sm">Real-time revenue tracking and financial reporting</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainMenu;