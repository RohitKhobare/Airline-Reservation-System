import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, DollarSign, TrendingUp, Calendar, Download, BarChart3 } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

const DailyCollections = () => {
  const { transactions, reservations } = useAppContext();
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  // Calculate statistics
  const totalRevenue = transactions
    .filter(t => t.type === 'Booking')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalRefunds = transactions
    .filter(t => t.type === 'Refund')
    .reduce((sum, t) => sum + t.amount, 0);

  const netRevenue = totalRevenue - totalRefunds;

  const todayTransactions = transactions.filter(t => t.date === selectedDate);
  const todayRevenue = todayTransactions
    .filter(t => t.type === 'Booking')
    .reduce((sum, t) => sum + t.amount, 0);

  const todayRefunds = todayTransactions
    .filter(t => t.type === 'Refund')
    .reduce((sum, t) => sum + t.amount, 0);

  const todayNet = todayRevenue - todayRefunds;

  // Group transactions by date for chart
  const transactionsByDate = transactions.reduce((acc, transaction) => {
    const date = transaction.date;
    if (!acc[date]) {
      acc[date] = { bookings: 0, refunds: 0, net: 0 };
    }
    if (transaction.type === 'Booking') {
      acc[date].bookings += transaction.amount;
    } else if (transaction.type === 'Refund') {
      acc[date].refunds += transaction.amount;
    }
    acc[date].net = acc[date].bookings - acc[date].refunds;
    return acc;
  }, {} as Record<string, { bookings: number; refunds: number; net: number }>);

  const handleExport = () => {
    // In a real application, this would generate a CSV or PDF report
    alert('Financial report exported successfully!');
  };

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
                <DollarSign className="h-6 w-6 text-green-600" />
                <h1 className="text-2xl font-bold text-gray-900">Daily Collections</h1>
              </div>
            </div>
            <button
              onClick={handleExport}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
            >
              <Download className="h-4 w-4" />
              <span>Export Report</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Date Selector */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 mb-8">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Select Date</h2>
          </div>
          <div className="p-6">
            <div className="flex items-center space-x-4">
              <Calendar className="h-5 w-5 text-gray-400" />
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <span className="text-gray-600">View transactions for selected date</span>
            </div>
          </div>
        </div>

        {/* Overall Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                <p className="text-3xl font-bold text-green-600">${totalRevenue.toFixed(2)}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-600" />
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Refunds</p>
                <p className="text-3xl font-bold text-red-600">${totalRefunds.toFixed(2)}</p>
              </div>
              <DollarSign className="h-8 w-8 text-red-600" />
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Net Revenue</p>
                <p className="text-3xl font-bold text-blue-600">${netRevenue.toFixed(2)}</p>
              </div>
              <BarChart3 className="h-8 w-8 text-blue-600" />
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Bookings</p>
                <p className="text-3xl font-bold text-purple-600">{reservations.length}</p>
              </div>
              <Calendar className="h-8 w-8 text-purple-600" />
            </div>
          </div>
        </div>

        {/* Daily Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Today's Revenue</p>
                <p className="text-2xl font-bold text-green-600">${todayRevenue.toFixed(2)}</p>
                <p className="text-sm text-gray-500">{selectedDate}</p>
              </div>
              <TrendingUp className="h-6 w-6 text-green-600" />
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Today's Refunds</p>
                <p className="text-2xl font-bold text-red-600">${todayRefunds.toFixed(2)}</p>
                <p className="text-sm text-gray-500">{selectedDate}</p>
              </div>
              <DollarSign className="h-6 w-6 text-red-600" />
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Today's Net</p>
                <p className="text-2xl font-bold text-blue-600">${todayNet.toFixed(2)}</p>
                <p className="text-sm text-gray-500">{selectedDate}</p>
              </div>
              <BarChart3 className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        {/* Revenue Chart */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 mb-8">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Revenue Trend</h2>
            <p className="text-gray-600">Daily revenue and refunds overview</p>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {Object.entries(transactionsByDate)
                .sort(([a], [b]) => new Date(b).getTime() - new Date(a).getTime())
                .slice(0, 7)
                .map(([date, data]) => (
                  <div key={date} className="flex items-center space-x-4">
                    <div className="w-24 text-sm text-gray-600">{date}</div>
                    <div className="flex-1 flex items-center space-x-2">
                      <div className="flex-1 bg-gray-200 rounded-full h-6 relative">
                        <div
                          className="bg-green-500 h-6 rounded-full flex items-center justify-end pr-2"
                          style={{ width: `${Math.max((data.bookings / Math.max(...Object.values(transactionsByDate).map(d => d.bookings))) * 100, 5)}%` }}
                        >
                          <span className="text-xs text-white font-medium">${data.bookings.toFixed(0)}</span>
                        </div>
                      </div>
                      <div className="w-16 text-xs text-gray-600">Revenue</div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>

        {/* Transactions Table */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Transaction Details</h2>
            <p className="text-gray-600">All transactions for {selectedDate}</p>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    PNR
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {todayTransactions.length > 0 ? (
                  todayTransactions.map((transaction) => (
                    <tr key={transaction.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-blue-600">{transaction.pnr}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{transaction.date}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          transaction.type === 'Booking' ? 'bg-green-100 text-green-800' :
                          transaction.type === 'Refund' ? 'bg-red-100 text-red-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {transaction.type}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className={`text-sm font-medium ${
                          transaction.type === 'Booking' ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {transaction.type === 'Booking' ? '+' : '-'}${transaction.amount.toFixed(2)}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                      No transactions found for {selectedDate}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Summary */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-4">Financial Summary</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <span className="text-blue-700">Total Transactions:</span>
              <span className="ml-2 font-medium">{transactions.length}</span>
            </div>
            <div>
              <span className="text-blue-700">Active Reservations:</span>
              <span className="ml-2 font-medium">{reservations.filter(r => r.status === 'Confirmed').length}</span>
            </div>
            <div>
              <span className="text-blue-700">Cancelled Reservations:</span>
              <span className="ml-2 font-medium">{reservations.filter(r => r.status === 'Cancelled').length}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DailyCollections;