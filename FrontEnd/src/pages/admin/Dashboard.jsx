import React, { useState } from "react";
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
  Eye,
  Edit3,
  Trash2,
  Plus,
  Mail,
  CheckCircle,
  XCircle,
  AlertTriangle,
  BarChart3,
  Calendar,
  Activity
} from "lucide-react";

const AdminDashboard = () => {
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [inviteForm, setInviteForm] = useState({ email: '', role: 'doctor' });
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  // Mock stats - these would come from your API
  const stats = {
    totalPatients: 125,
    totalDoctors: 18,
    totalStaff: 34,
    totalAppointments: 89,
    pendingApprovals: 3
  };

  const user = { name: "Admin", email: "admin@bukcare.com" };

  const logout = () => console.log("Logout clicked");

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-100';
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'inactive': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case 'doctor': return <Stethoscope className="w-4 h-4" />;
      case 'staff': return <Shield className="w-4 h-4" />;
      case 'patient': return <User className="w-4 h-4" />;
      default: return <User className="w-4 h-4" />;
    }
  };

  const handleSearch = async (query) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    try {
      // Mock search results for demonstration
      await new Promise(resolve => setTimeout(resolve, 800));
      const mockResults = [
        { name: 'Dr. John Smith', email: 'john@example.com', role: 'doctor' },
        { name: 'Jane Nurse', email: 'jane@example.com', role: 'staff' },
        { name: 'Alice Patient', email: 'alice@example.com', role: 'patient' }
      ].filter(result => 
        result.name.toLowerCase().includes(query.toLowerCase()) ||
        result.email.toLowerCase().includes(query.toLowerCase())
      );
      setSearchResults(mockResults);
      console.log('Searching for:', query);
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleInviteUser = async () => {
    if (!inviteForm.email.trim()) {
      alert('Please enter an email address');
      return;
    }

    setIsLoading(true);
    try {
      // API call will be implemented here
      // await inviteUser(inviteForm.email, inviteForm.role);
      alert(`Invitation sent to ${inviteForm.email}!`);
      setInviteForm({ email: '', role: 'doctor' });
      setShowInviteModal(false);
    } catch (error) {
      alert('Failed to send invitation. Please try again.');
      console.error('Invite error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Invite User Modal
  const InviteModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-800">Invite New User</h2>
          <button 
            onClick={() => setShowInviteModal(false)} 
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <XCircle className="w-6 h-6" />
          </button>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
            <input
              type="email"
              value={inviteForm.email}
              onChange={(e) => setInviteForm({...inviteForm, email: e.target.value})}
              placeholder="Enter email address"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
            <select
              value={inviteForm.role}
              onChange={(e) => setInviteForm({...inviteForm, role: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="doctor">Doctor</option>
              <option value="staff">Staff</option>
            </select>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-start space-x-2">
              <Mail className="w-5 h-5 text-blue-600 mt-0.5" />
              <div>
                <h4 className="text-sm font-medium text-blue-800">How it works</h4>
                <p className="text-sm text-blue-600 mt-1">
                  An invitation link will be sent to the email address. The recipient can click the link to complete their account setup.
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="p-6 border-t border-gray-100 flex space-x-3">
          <button 
            onClick={() => setShowInviteModal(false)} 
            className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            disabled={isLoading}
          >
            Cancel
          </button>
          <button 
            onClick={handleInviteUser} 
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            disabled={isLoading}
          >
            {isLoading ? 'Sending...' : 'Send Invitation'}
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 overflow-hidden">
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
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    handleSearch(e.target.value);
                  }}
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
                            <p className="font-medium text-gray-800">{result.name}</p>
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
                  {stats.pendingApprovals > 0 && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                      {stats.pendingApprovals}
                    </span>
                  )}
                </button>
              </div>

              {/* Profile Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setShowProfileDropdown(!showProfileDropdown)}
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
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-600">Total Patients</h3>
                  <p className="text-2xl font-bold text-gray-800">{stats.totalPatients}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <Stethoscope className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-600">Total Doctors</h3>
                  <p className="text-2xl font-bold text-gray-800">{stats.totalDoctors}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Shield className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-600">Total Staff</h3>
                  <p className="text-2xl font-bold text-gray-800">{stats.totalStaff}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-orange-600" />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-600">Appointments</h3>
                  <p className="text-2xl font-bold text-gray-800">{stats.totalAppointments}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div 
              onClick={() => setShowInviteModal(true)}
              className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow cursor-pointer group"
            >
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-green-100 group-hover:bg-green-200 rounded-lg flex items-center justify-center transition-colors">
                  <UserPlus className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">Invite User</h3>
                  <p className="text-sm text-gray-600">Send invitation to doctor or staff</p>
                </div>
                <Plus className="w-5 h-5 text-gray-400 group-hover:text-green-600 transition-colors ml-auto" />
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <BarChart3 className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">View Reports</h3>
                  <p className="text-sm text-gray-600">Analytics and insights</p>
                </div>
              </div>
            </div>
          </div>

          {/* Main Dashboard Content */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            <div className="xl:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100">
              <div className="p-4 lg:p-6 border-b border-gray-100">
                <h2 className="text-lg lg:text-xl font-semibold text-gray-800">Recent Activity</h2>
              </div>
              <div className="p-4 lg:p-6">
                <div className="text-center py-12 text-gray-500">
                  <Activity className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p className="text-lg font-medium mb-2">No Recent Activity</p>
                  <p className="text-sm">User activities and system updates will appear here.</p>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h3 className="font-semibold text-gray-800 mb-4">System Status</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Database</span>
                    <div className="flex items-center space-x-1">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm text-green-600">Online</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Email Service</span>
                    <div className="flex items-center space-x-1">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm text-green-600">Online</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">API Status</span>
                    <div className="flex items-center space-x-1">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm text-green-600">Running</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h3 className="font-semibold text-gray-800 mb-4">Quick Stats</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Active Sessions</span>
                    <span className="font-semibold text-gray-800">23</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Pending Invites</span>
                    <span className="font-semibold text-yellow-600">2</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">System Load</span>
                    <span className="font-semibold text-green-600">Low</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Modals */}
      {showInviteModal && <InviteModal />}
    </div>
  );
};

export default AdminDashboard;