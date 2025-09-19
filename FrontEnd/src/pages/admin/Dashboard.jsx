// pages/admin/Dashboard.jsx
import React, { useState, useEffect, useCallback } from "react";
import { 
  Search, 
  Bell, 
  User, 
  Settings, 
  LogOut, 
  ChevronDown,
  Users,
  UserPlus,
  Stethoscope,
  Shield,
  Plus,
  BarChart3,
  Calendar,
  Activity,
  Clock,
  CheckCircle,
  AlertTriangle
} from "lucide-react";

import InviteModal from "./InviteModal";
import Notification from "../../components/Notification";
import adminAPI from "../../services/AdminAPI";

const AdminDashboard = () => {
  // UI State
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [notification, setNotification] = useState(null);
  
  // Search State
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  
  // Data State
  const [stats, setStats] = useState({
    total_patients: 0,
    total_doctors: 0,
    total_staff: 0,
    total_appointments: 0,
    pending_approvals: 0,
    active_sessions: 0,
    pending_invites: 0,
  });
  const [activities, setActivities] = useState([]);
  const [isLoadingStats, setIsLoadingStats] = useState(true);
  const [isLoadingActivities, setIsLoadingActivities] = useState(true);

  // User data - you might want to get this from context or props
  const user = { name: "Admin", email: "admin@example.com" };

  // Load dashboard data on component mount
  useEffect(() => {
    loadDashboardData();
    // Close dropdown when clicking outside
    const handleClickOutside = () => setShowProfileDropdown(false);
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const loadDashboardData = async () => {
    await Promise.all([
      loadDashboardStats(),
      loadRecentActivities()
    ]);
  };

  const loadDashboardStats = async () => {
    try {
      setIsLoadingStats(true);
      const data = await adminAPI.getDashboardStats();
      setStats(data);
    } catch (error) {
      console.error('Failed to load dashboard stats:', error);
      showNotification('error', 'Failed to load dashboard statistics');
    } finally {
      setIsLoadingStats(false);
    }
  };

  const loadRecentActivities = async () => {
    try {
      setIsLoadingActivities(true);
      const data = await adminAPI.getRecentActivities();
      setActivities(data);
    } catch (error) {
      console.error('Failed to load recent activities:', error);
      showNotification('error', 'Failed to load recent activities');
    } finally {
      setIsLoadingActivities(false);
    }
  };

  // Debounced search function
  const handleSearch = useCallback(
    async (query) => {
      if (!query.trim()) {
        setSearchResults([]);
        return;
      }

      setIsSearching(true);
      try {
        const results = await adminAPI.searchUsers(query);
        setSearchResults(results);
      } catch (error) {
        console.error("Search failed:", error);
        showNotification('error', 'Search failed. Please try again.');
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    },
    []
  );

  // Search with debounce
  useEffect(() => {
    const timeoutId = setTimeout(() => handleSearch(searchQuery), 300);
    return () => clearTimeout(timeoutId);
  }, [searchQuery, handleSearch]);

  const handleInvitationSent = (result) => {
    setNotification(result);
    // Refresh stats to update pending invites count
    loadDashboardStats();
    // Refresh activities to show new invitation
    loadRecentActivities();
  };

  const showNotification = (type, message) => {
    setNotification({ type, message });
  };

  const closeNotification = () => {
    setNotification(null);
  };

  const logout = () => {
    console.log("Logout clicked");
    // Implement logout logic here
    // This would typically clear auth tokens and redirect to login
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case "doctor": return <Stethoscope className="w-4 h-4" />;
      case "staff": return <Shield className="w-4 h-4" />;
      case "patient": return <User className="w-4 h-4" />;
      default: return <User className="w-4 h-4" />;
    }
  };

  const getActivityIcon = (type) => {
    switch (type) {
      case "user_registered": return <UserPlus className="w-5 h-5 text-green-600" />;
      case "appointment_scheduled": return <Calendar className="w-5 h-5 text-blue-600" />;
      case "invitation_sent": return <UserPlus className="w-5 h-5 text-purple-600" />;
      case "user_approved": return <CheckCircle className="w-5 h-5 text-green-600" />;
      default: return <Activity className="w-5 h-5 text-gray-600" />;
    }
  };

  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInMinutes = Math.floor((now - time) / (1000 * 60));
    
    if (diffInMinutes < 1) return "Just now";
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  return (
    <div className="h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 overflow-hidden">
      {/* Notification */}
      {notification && (
        <Notification 
          type={notification.type}
          message={notification.message}
          onClose={closeNotification}
        />
      )}

      {/* Invite Modal */}
      <InviteModal 
        showInviteModal={showInviteModal}
        setShowInviteModal={setShowInviteModal}
        onInvitationSent={handleInvitationSent}
      />

      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-100 sticky top-0 z-50">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-semibold text-gray-800">BukCare Admin</span>
            </div>

            {/* Search Bar */}
            <div className="flex-1 max-w-2xl mx-4 lg:mx-8 relative">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search patients, doctors, staff..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                />
                {isSearching && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-600"></div>
                  </div>
                )}
              </div>
              
              {/* Search Results Dropdown */}
              {searchQuery && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-lg border border-gray-100 z-50 max-h-96 overflow-y-auto">
                  {searchResults.length === 0 && !isSearching ? (
                    <div className="p-4 text-center text-gray-500">
                      <Search className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                      <p className="text-sm">No results found for "{searchQuery}"</p>
                    </div>
                  ) : (
                    <div className="p-2">
                      {searchResults.map((result, index) => (
                        <div key={index} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer">
                          <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                            {getRoleIcon(result.role)}
                          </div>
                          <div className="flex-1">
                            <p className="font-medium text-gray-800">
                              {result.first_name} {result.last_name}
                            </p>
                            <p className="text-sm text-gray-600">{result.email}</p>
                          </div>
                          <span className="text-xs text-gray-500 capitalize">{result.role}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Right Side */}
            <div className="flex items-center space-x-4">
              {/* Notifications */}
              <div className="relative">
                <button className="relative p-2 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors duration-200">
                  <Bell className="w-6 h-6" />
                  {stats.pending_approvals > 0 && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                      {stats.pending_approvals}
                    </span>
                  )}
                </button>
              </div>

              {/* Profile Dropdown */}
              <div className="relative">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowProfileDropdown(!showProfileDropdown);
                  }}
                  className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                >
                  <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-white" />
                  </div>
                  <div className="hidden md:block text-left">
                    <p className="text-sm font-medium text-gray-800">{user.name}</p>
                    <p className="text-xs text-gray-600">Administrator</p>
                  </div>
                  <ChevronDown className="w-4 h-4 text-gray-600" />
                </button>

                {showProfileDropdown && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50">
                    <div className="px-4 py-3 border-b border-gray-100">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                          <User className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-800">{user.name}</p>
                          <p className="text-sm text-gray-600">{user.email}</p>
                        </div>
                      </div>
                    </div>

                    <div className="py-2">
                      <a href="#" className="flex items-center space-x-3 px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors">
                        <User className="w-4 h-4" />
                        <span className="text-sm">My Profile</span>
                      </a>
                      <a href="#" className="flex items-center space-x-3 px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors">
                        <Settings className="w-4 h-4" />
                        <span className="text-sm">Settings</span>
                      </a>
                    </div>

                    <div className="border-t border-gray-100 pt-2">
                      <button
                        onClick={logout}
                        className="w-full flex items-center space-x-3 px-4 py-2 text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        <span className="text-sm">Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="h-[calc(100vh-4rem)] overflow-y-auto">
        <div className="w-full px-4 sm:px-6 lg:px-8 py-6">
          {/* Welcome Section */}
          <div className="mb-6">
            <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl p-6 text-white">
              <h1 className="text-2xl font-bold mb-2">Welcome back, {user.name}!</h1>
              <p className="text-purple-100">
                Manage your healthcare platform. Monitor users and send invitations to new team members.
              </p>
            </div>
          </div>

          {/* Stats Overview */}
          <div className="mb-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-600">Total Patients</h3>
                  <p className="text-2xl font-bold text-gray-800">
                    {isLoadingStats ? '...' : stats.total_patients.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <Stethoscope className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-600">Total Doctors</h3>
                  <p className="text-2xl font-bold text-gray-800">
                    {isLoadingStats ? '...' : stats.total_doctors.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Shield className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-600">Total Staff</h3>
                  <p className="text-2xl font-bold text-gray-800">
                    {isLoadingStats ? '...' : stats.total_staff.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-orange-600" />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-600">Appointments</h3>
                  <p className="text-2xl font-bold text-gray-800">
                    {isLoadingStats ? '...' : stats.total_appointments.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions & Recent Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Quick Actions */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h2>
                <div className="space-y-3">
                  <button
                    onClick={() => setShowInviteModal(true)}
                    className="w-full flex items-center space-x-3 p-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-200 transform hover:scale-105"
                  >
                    <UserPlus className="w-5 h-5" />
                    <span className="font-medium">Invite New User</span>
                  </button>
                  
                  <button className="w-full flex items-center space-x-3 p-3 bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors">
                    <BarChart3 className="w-5 h-5" />
                    <span className="font-medium">View Analytics</span>
                  </button>
                  
                  <button className="w-full flex items-center space-x-3 p-3 bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors">
                    <Settings className="w-5 h-5" />
                    <span className="font-medium">System Settings</span>
                  </button>
                </div>

                {/* Quick Stats */}
                <div className="mt-6 pt-6 border-t border-gray-100">
                  <h3 className="text-sm font-medium text-gray-600 mb-3">System Status</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Active Sessions</span>
                      <span className="text-sm font-medium text-gray-800">
                        {isLoadingStats ? '...' : stats.active_sessions}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Pending Invites</span>
                      <span className="text-sm font-medium text-gray-800">
                        {isLoadingStats ? '...' : stats.pending_invites}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Pending Approvals</span>
                      <div className="flex items-center space-x-1">
                        {stats.pending_approvals > 0 && (
                          <AlertTriangle className="w-4 h-4 text-orange-500" />
                        )}
                        <span className="text-sm font-medium text-gray-800">
                          {isLoadingStats ? '...' : stats.pending_approvals}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Recent Activity</h2>
                
                {isLoadingActivities ? (
                  <div className="space-y-4">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className="flex items-center space-x-4 p-3">
                        <div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse"></div>
                        <div className="flex-1">
                          <div className="h-4 bg-gray-200 rounded animate-pulse mb-2"></div>
                          <div className="h-3 bg-gray-200 rounded animate-pulse w-2/3"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : activities.length === 0 ? (
                  <div className="text-center py-8">
                    <Activity className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500">No recent activity</p>
                  </div>
                ) : (
                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    {activities.map((activity, index) => (
                      <div key={index} className="flex items-start space-x-4 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                        <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                          {getActivityIcon(activity.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-gray-800 font-medium">
                            {activity.title}
                          </p>
                          <p className="text-sm text-gray-600 mt-1">
                            {activity.description}
                          </p>
                          <div className="flex items-center space-x-2 mt-2">
                            <Clock className="w-3 h-3 text-gray-400" />
                            <span className="text-xs text-gray-500">
                              {formatTimeAgo(activity.timestamp)}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                
                {activities.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <button className="text-sm text-purple-600 hover:text-purple-700 font-medium">
                      View All Activity →
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;