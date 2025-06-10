import React, { useState, useEffect } from 'react';
import { Eye, Search, Filter, Download, Trash2, CheckCircle, Clock, AlertCircle, XCircle } from 'lucide-react';

const AdminDashboard = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginData, setLoginData] = useState({ username: '', password: '' });
  const [loginError, setLoginError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  
  const [requests, setRequests] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const API_BASE = 'http://localhost:3000/api';

  // Get token from localStorage
  const getToken = () => localStorage.getItem('adminToken');

  // API call helper
  const apiCall = async (endpoint, options = {}) => {
    const token = getToken();
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      ...options,
    };

    const response = await fetch(`${API_BASE}${endpoint}`, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'API request failed');
    }

    return data;
  };

  // Login function
  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoggingIn(true);
    setLoginError('');

    try {
      const response = await apiCall('/admin/login', {
        method: 'POST',
        body: JSON.stringify(loginData),
      });

      localStorage.setItem('adminToken', response.token);
      localStorage.setItem('adminUser', JSON.stringify(response.admin));
      setIsLoggedIn(true);
      fetchDashboardData();
    } catch (error) {
      setLoginError(error.message);
    } finally {
      setIsLoggingIn(false);
    }
  };

  // Logout function
  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    setIsLoggedIn(false);
    setRequests([]);
    setStats({});
  };

  // Fetch dashboard data
  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [requestsData, statsData] = await Promise.all([
        apiCall(`/admin/requests?page=${currentPage}&limit=10&status=${statusFilter}&search=${searchTerm}`),
        apiCall('/admin/stats')
      ]);

      setRequests(requestsData.requests);
      setTotalPages(requestsData.pagination.totalPages);
      setStats(statsData);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Update request status
  const updateStatus = async (id, status) => {
    try {
      await apiCall(`/admin/requests/${id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status }),
      });
      fetchDashboardData();
    } catch (error) {
      console.error('Failed to update status:', error);
    }
  };

  // Delete request
  const deleteRequest = async (id) => {
    if (!window.confirm('Are you sure you want to delete this request?')) return;
    
    try {
      await apiCall(`/admin/requests/${id}`, { method: 'DELETE' });
      fetchDashboardData();
      setShowModal(false);
    } catch (error) {
      console.error('Failed to delete request:', error);
    }
  };

  // View request details
  const viewRequest = async (id) => {
    try {
      const request = await apiCall(`/admin/requests/${id}`);
      setSelectedRequest(request);
      setShowModal(true);
    } catch (error) {
      console.error('Failed to fetch request details:', error);
    }
  };

  // Check if user is logged in on mount
  useEffect(() => {
    const token = getToken();
    if (token) {
      setIsLoggedIn(true);
      fetchDashboardData();
    }
  }, []);

  // Refresh data when filters change
  useEffect(() => {
    if (isLoggedIn) {
      fetchDashboardData();
    }
  }, [currentPage, statusFilter, searchTerm]);

  // Status colors and icons
  const statusConfig = {
    new: { color: 'bg-blue-500', icon: <AlertCircle size={16} />, label: 'New' },
    in_progress: { color: 'bg-yellow-500', icon: <Clock size={16} />, label: 'In Progress' },
    contacted: { color: 'bg-purple-500', icon: <Eye size={16} />, label: 'Contacted' },
    completed: { color: 'bg-green-500', icon: <CheckCircle size={16} />, label: 'Completed' },
    cancelled: { color: 'bg-red-500', icon: <XCircle size={16} />, label: 'Cancelled' }
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Login Form
  if (!isLoggedIn) {
    return (
        <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
             <style jsx global>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        html, body {
          margin: 0;
          padding: 0;
          width: 100%;
          overflow-x: hidden;
        }
        #root {
          margin: 0;
          padding: 0;
          width: 100%;
        }
      `}</style>
        <div className="bg-gray-800 rounded-lg p-8 w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">
              <span className="text-white">FEET</span>
              <span className="text-orange-500"> INFRA</span>
            </h1>
            <p className="text-gray-400">Admin Dashboard</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Username
              </label>
              <input
                type="text"
                value={loginData.username}
                onChange={(e) => setLoginData({ ...loginData, username: e.target.value })}
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:border-orange-500 focus:outline-none text-white"
                placeholder="Enter username"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Password
              </label>
              <input
                type="password"
                value={loginData.password}
                onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:border-orange-500 focus:outline-none text-white"
                placeholder="Enter password"
                required
              />
            </div>

            {loginError && (
              <div className="bg-red-500 bg-opacity-20 border border-red-500 rounded-lg p-3 text-red-400 text-sm">
                {loginError}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoggingIn}
              className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-gray-600 text-white font-bold py-3 px-4 rounded-lg transition-colors duration-300"
            >
              {isLoggingIn ? 'Logging in...' : 'Login'}
            </button>
          </form>

          <div className="mt-6 p-4 bg-gray-700 rounded-lg">
            <p className="text-gray-300 text-sm mb-2">Default credentials:</p>
            <p className="text-gray-400 text-xs">Username: admin</p>
            <p className="text-gray-400 text-xs">Password: admin123</p>
          </div>
        </div>
      </div>
    );
  }

  // Main Dashboard
  return (
    <div className="min-h-full bg-gray-900 text-white">
         <style jsx global>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        html, body {
          margin: 0;
          padding: 0;
          width: 100%;
          overflow-x: hidden;
        }
        #root {
          margin: 0;
          padding: 0;
          width: 100%;
        }
      `}</style>
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700 p-4">
        <div className="flex justify-between items-center max-w-7xl mx-auto">
          <div>
            <h1 className="text-2xl font-bold">
              <span className="text-white">FEET</span>
              <span className="text-orange-500"> INFRA</span>
              <span className="text-gray-400 text-lg ml-2">Admin Dashboard</span>
            </h1>
          </div>
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg transition-colors duration-300"
          >
            Logout
          </button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-6">
        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gray-800 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Requests</p>
                <p className="text-3xl font-bold text-white">{stats.totalRequests || 0}</p>
              </div>
              <div className="bg-blue-500 p-3 rounded-full">
                <Eye className="text-white" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">New Requests</p>
                <p className="text-3xl font-bold text-blue-400">{stats.newRequests || 0}</p>
              </div>
              <div className="bg-yellow-500 p-3 rounded-full">
                <AlertCircle className="text-white" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">In Progress</p>
                <p className="text-3xl font-bold text-yellow-400">{stats.inProgressRequests || 0}</p>
              </div>
              <div className="bg-purple-500 p-3 rounded-full">
                <Clock className="text-white" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Completed</p>
                <p className="text-3xl font-bold text-green-400">{stats.completedRequests || 0}</p>
              </div>
              <div className="bg-green-500 p-3 rounded-full">
                <CheckCircle className="text-white" size={24} />
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-gray-800 rounded-lg p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search by name, email, or company..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:border-orange-500 focus:outline-none text-white"
                />
              </div>
            </div>
            <div className="flex gap-4">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:border-orange-500 focus:outline-none text-white"
              >
                <option value="all">All Status</option>
                <option value="new">New</option>
                <option value="in_progress">In Progress</option>
                <option value="contacted">Contacted</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>
        </div>

        {/* Requests Table */}
        <div className="bg-gray-800 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-700">
                <tr>
                  <th className="text-left p-4 text-gray-300">Name</th>
                  <th className="text-left p-4 text-gray-300">Contact</th>
                  <th className="text-left p-4 text-gray-300">Service</th>
                  <th className="text-left p-4 text-gray-300">Status</th>
                  <th className="text-left p-4 text-gray-300">Date</th>
                  <th className="text-left p-4 text-gray-300">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="6" className="text-center p-8 text-gray-400">
                      Loading requests...
                    </td>
                  </tr>
                ) : requests.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center p-8 text-gray-400">
                      No requests found
                    </td>
                  </tr>
                ) : (
                  requests.map((request) => (
                    <tr key={request.id} className="border-t border-gray-700 hover:bg-gray-750">
                      <td className="p-4">
                        <div>
                          <p className="font-medium text-white">{request.name}</p>
                          <p className="text-sm text-gray-400">{request.company || 'N/A'}</p>
                        </div>
                      </td>
                      <td className="p-4">
                        <div>
                          <p className="text-sm text-gray-300">{request.email}</p>
                          <p className="text-sm text-gray-400">{request.phone}</p>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="inline-block bg-gray-700 px-2 py-1 rounded text-sm text-gray-300">
                          {request.service}
                        </span>
                      </td>
                      <td className="p-4">
                        <select
                          value={request.status}
                          onChange={(e) => updateStatus(request.id, e.target.value)}
                          className={`px-2 py-1 rounded text-sm text-white border-none focus:outline-none ${statusConfig[request.status]?.color || 'bg-gray-500'}`}
                        >
                          <option value="new">New</option>
                          <option value="in_progress">In Progress</option>
                          <option value="contacted">Contacted</option>
                          <option value="completed">Completed</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </td>
                      <td className="p-4 text-sm text-gray-400">
                        {formatDate(request.created_at)}
                      </td>
                      <td className="p-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => viewRequest(request.id)}
                            className="bg-blue-500 hover:bg-blue-600 p-2 rounded transition-colors duration-300"
                            title="View Details"
                          >
                            <Eye size={16} />
                          </button>
                          <button
                            onClick={() => deleteRequest(request.id)}
                            className="bg-red-500 hover:bg-red-600 p-2 rounded transition-colors duration-300"
                            title="Delete Request"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-4 p-4 border-t border-gray-700">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed rounded transition-colors duration-300"
              >
                Previous
              </button>
              
              <div className="flex gap-2">
                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i + 1}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`px-3 py-1 rounded transition-colors duration-300 ${
                      currentPage === i + 1
                        ? 'bg-orange-500 text-white'
                        : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>

              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed rounded transition-colors duration-300"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Request Details Modal */}
      {showModal && selectedRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 rounded-lg max-w-2xl w-full max-h-90vh overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white">Request Details</h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-white transition-colors duration-300"
                >
                  <XCircle size={24} />
                </button>
              </div>

              <div className="space-y-6">
                {/* Basic Info */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Name</label>
                    <p className="text-white bg-gray-700 p-3 rounded-lg">{selectedRequest.name}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Email</label>
                    <p className="text-white bg-gray-700 p-3 rounded-lg">{selectedRequest.email}</p>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Phone</label>
                    <p className="text-white bg-gray-700 p-3 rounded-lg">{selectedRequest.phone}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Company</label>
                    <p className="text-white bg-gray-700 p-3 rounded-lg">{selectedRequest.company || 'N/A'}</p>
                  </div>
                </div>

                {/* Project Details */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Service</label>
                    <p className="text-white bg-gray-700 p-3 rounded-lg">{selectedRequest.service}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Budget</label>
                    <p className="text-white bg-gray-700 p-3 rounded-lg">{selectedRequest.budget || 'N/A'}</p>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Timeline</label>
                    <p className="text-white bg-gray-700 p-3 rounded-lg">{selectedRequest.timeline || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Status</label>
                    <div className="flex items-center gap-2">
                      <span className={`px-3 py-2 rounded-lg text-white ${statusConfig[selectedRequest.status]?.color || 'bg-gray-500'}`}>
                        {statusConfig[selectedRequest.status]?.icon}
                        <span className="ml-2">{statusConfig[selectedRequest.status]?.label || selectedRequest.status}</span>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Message */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Project Details</label>
                  <div className="text-white bg-gray-700 p-3 rounded-lg whitespace-pre-wrap">
                    {selectedRequest.message}
                  </div>
                </div>

                {/* Timestamps */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Submitted</label>
                    <p className="text-white bg-gray-700 p-3 rounded-lg">{formatDate(selectedRequest.created_at)}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Last Updated</label>
                    <p className="text-white bg-gray-700 p-3 rounded-lg">{formatDate(selectedRequest.updated_at)}</p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex justify-between items-center pt-4 border-t border-gray-700">
                  <div className="flex gap-2">
                    <select
                      value={selectedRequest.status}
                      onChange={(e) => {
                        updateStatus(selectedRequest.id, e.target.value);
                        setSelectedRequest({...selectedRequest, status: e.target.value});
                      }}
                      className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:border-orange-500 focus:outline-none text-white"
                    >
                      <option value="new">New</option>
                      <option value="in_progress">In Progress</option>
                      <option value="contacted">Contacted</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                  
                  <div className="flex gap-2">
                    <button
                      onClick={() => setShowModal(false)}
                      className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors duration-300"
                    >
                      Close
                    </button>
                    <button
                      onClick={() => deleteRequest(selectedRequest.id)}
                      className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors duration-300"
                    >
                      Delete Request
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;