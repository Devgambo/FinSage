import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit, Trash2, Users, Shield, X, Eye, EyeOff, Calendar, CheckCircle, AlertCircle } from 'lucide-react';
import { api } from '../api/api';

type User = {
    username: string;
    password: string;
    role: string;
    dateAdded?: string;
    status?: 'active' | 'inactive';
}

const departments = ['general', 'engineering', 'finance', 'hr', 'marketing'];

export default function HRAdminDashboard() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDepartment, setFilterDepartment] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    role: 'general'
  });

  // Form validation
  const [formErrors, setFormErrors] = useState({
    username: '',
    password: '',
    role: ''
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.get('/users/get-all');
      const users: User[] = res.data.users.map((user: User) => ({
        ...user,
        dateAdded: user.dateAdded || new Date().toISOString().split('T')[0],
        status: user.status || 'active'
      }));
      setUsers(users);
    } catch (err) {
      setError('Failed to fetch users. Please try again.');
      console.error('Error fetching users:', err);
    } finally {
      setLoading(false);
    }
  };

  // Filter users based on search and department
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.username.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment = filterDepartment === 'all' || user.role === filterDepartment;
    return matchesSearch && matchesDepartment;
  });

  // Statistics
  const stats = {
    total: users.length,
    active: users.filter(u => u.status === 'active').length,
    byDepartment: departments.reduce((acc, dept) => {
      acc[dept] = users.filter(u => u.role === dept).length;
      return acc;
    }, {} as Record<string, number>)
  };

  const validateForm = () => {
    const errors = { username: '', password: '', role: '' };
    let isValid = true;

    if (!formData.username.trim()) {
      errors.username = 'Username is required';
      isValid = false;
    } else if (formData.username.length < 3) {
      errors.username = 'Username must be at least 3 characters';
      isValid = false;
    }

    if (!showEditModal && !formData.password.trim()) {
      errors.password = 'Password is required';
      isValid = false;
    } else if (formData.password && formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
      isValid = false;
    }

    if (!formData.role) {
      errors.role = 'Role is required';
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  const resetForm = () => {
    setFormData({ username: '', password: '', role: 'general' });
    setFormErrors({ username: '', password: '', role: '' });
    setShowPassword(false);
  };

  const handleAddUser = async () => {
    if (!validateForm()) return;

    try {
      setIsSubmitting(true);
      const newUser: User = {
        username: formData.username,
        password: formData.password,
        role: formData.role,
      };

      await api.post('/users/add', newUser);
      await fetchUsers(); // Refresh the user list
      setShowAddModal(false);
      resetForm();
    } catch (err) {
      setError('Failed to add user. Please try again.');
      console.error('Error adding user:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditUser = async () => {
    if (!validateForm()) return;

    try {
      setIsSubmitting(true);
      await api.put('/users/update', formData);
      await fetchUsers(); // Refresh the user list
      setShowEditModal(false);
      setEditingUser(null);
      resetForm();
    } catch (err) {
      setError('Failed to update user. Please try again.');
      console.error('Error updating user:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteUser = async (username: string) => {
    if (window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      try {
        await api.delete('/users/delete', {
          data: { username }
        });
        await fetchUsers(); // Refresh the user list
      } catch (err) {
        setError('Failed to delete user. Please try again.');
        console.error('Error deleting user:', err);
      }
    }
  };

  const openEditModal = (user: User) => {
    setEditingUser(user);
    setFormData({
      username: user.username,
      password: '',
      role: user.role,
    });
    setShowEditModal(true);
  };

  const closeModals = () => {
    setShowAddModal(false);
    setShowEditModal(false);
    setEditingUser(null);
    resetForm();
  };

  const getDepartmentColor = (role: string) => {
    const colors = {
      engineering: 'from-blue-500 to-cyan-500',
      finance: 'from-green-500 to-emerald-500',
      hr: 'from-purple-500 to-pink-500',
      marketing: 'from-orange-500 to-red-500',
      general: 'from-gray-500 to-slate-500'
    };
    return colors[role as keyof typeof colors] || colors.general;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading users...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <div className="bg-gray-800/50 backdrop-blur-md border-b border-gray-700/50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 via-pink-500 to-purple-600 bg-clip-text text-transparent">
                HR Admin Dashboard
              </h1>
              <p className="text-gray-400 mt-1">Manage FinSage users and permissions</p>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-purple-600 via-pink-600 to-purple-700 text-white font-semibold rounded-xl hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-purple-500/25"
            >
              <Plus className="w-5 h-5" />
              <span>Add User</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Error Alert */}
        {error && (
          <div className="mb-6 bg-red-900/50 border border-red-500/50 rounded-xl p-4 flex items-center space-x-3">
            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
            <p className="text-red-200">{error}</p>
            <button
              onClick={() => setError(null)}
              className="ml-auto text-red-400 hover:text-red-300"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gray-800/50 backdrop-blur-md rounded-xl border border-gray-700/50 p-6">
            <div className="flex items-center">
              <Users className="w-10 h-10 text-blue-400" />
              <div className="ml-4">
                <p className="text-2xl font-bold text-white">{stats.total}</p>
                <p className="text-gray-400">Total Users</p>
              </div>
            </div>
          </div>
          <div className="bg-gray-800/50 backdrop-blur-md rounded-xl border border-gray-700/50 p-6">
            <div className="flex items-center">
              <CheckCircle className="w-10 h-10 text-green-400" />
              <div className="ml-4">
                <p className="text-2xl font-bold text-white">{stats.active}</p>
                <p className="text-gray-400">Active Users</p>
              </div>
            </div>
          </div>
          <div className="bg-gray-800/50 backdrop-blur-md rounded-xl border border-gray-700/50 p-6">
            <div className="flex items-center">
              <Shield className="w-10 h-10 text-purple-400" />
              <div className="ml-4">
                <p className="text-2xl font-bold text-white">{departments.length}</p>
                <p className="text-gray-400">Departments</p>
              </div>
            </div>
          </div>
          <div className="bg-gray-800/50 backdrop-blur-md rounded-xl border border-gray-700/50 p-6">
            <div className="flex items-center">
              <Calendar className="w-10 h-10 text-yellow-400" />
              <div className="ml-4">
                <p className="text-2xl font-bold text-white">{new Date().getDate()}</p>
                <p className="text-gray-400">Today</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-gray-800/50 backdrop-blur-md rounded-xl border border-gray-700/50 p-6 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-200"
              />
            </div>
            <select
              value={filterDepartment}
              onChange={(e) => setFilterDepartment(e.target.value)}
              className="px-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-200"
            >
              <option value="all">All Departments</option>
              {departments.map(dept => (
                <option key={dept} value={dept}>
                  {dept.charAt(0).toUpperCase() + dept.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-gray-800/50 backdrop-blur-md rounded-xl border border-gray-700/50 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-700/50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">User</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Department</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Date Added</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700/50">
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-gray-400">
                      {searchTerm || filterDepartment !== 'all' ? 'No users found matching your criteria' : 'No users available'}
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((user: User, index: number) => (
                    <tr key={index} className="hover:bg-gray-700/25 transition-colors duration-200">
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className={`w-10 h-10 rounded-full bg-gradient-to-r ${getDepartmentColor(user.role)} flex items-center justify-center text-white font-bold text-sm shadow-lg`}>
                            {user.username.charAt(0).toUpperCase()}
                          </div>
                          <div className="ml-4">
                            <p className="text-white font-medium">{user.username}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${getDepartmentColor(user.role)} text-white shadow-sm`}>
                          {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-gray-300">{user.dateAdded || 'N/A'}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          user.status === 'active' 
                            ? 'bg-green-900/50 text-green-300 border border-green-500/30' 
                            : 'bg-red-900/50 text-red-300 border border-red-500/30'
                        }`}>
                          {user.status === 'active' ? (
                            <CheckCircle className="w-3 h-3 mr-1" />
                          ) : (
                            <AlertCircle className="w-3 h-3 mr-1" />
                          )}
                          {user.status || 'Active'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => openEditModal(user)}
                            className="p-2 text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 rounded-lg transition-all duration-200 group"
                            title="Edit user"
                          >
                            <Edit className="w-4 h-4 group-hover:scale-110 transition-transform duration-200" />
                          </button>
                          <button
                            onClick={() => handleDeleteUser(user.username)}
                            className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-all duration-200 group"
                            title="Delete user"
                          >
                            <Trash2 className="w-4 h-4 group-hover:scale-110 transition-transform duration-200" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Add User Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={closeModals} />
          <div className="relative bg-gray-900/95 backdrop-blur-md rounded-2xl border border-gray-700/50 p-8 w-full max-w-md shadow-2xl">
            <button
              onClick={closeModals}
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors duration-200 hover:bg-gray-700/50 rounded-lg p-1"
            >
              <X className="w-6 h-6" />
            </button>
            
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-400 via-pink-500 to-purple-600 bg-clip-text text-transparent mb-2">
                Add New User
              </h2>
              <p className="text-gray-400">Create a new FinSage account</p>
            </div>
            
            <div className="space-y-4">
              <div>
                <input
                  type="text"
                  placeholder="Username"
                  value={formData.username}
                  onChange={(e) => setFormData({...formData, username: e.target.value})}
                  className={`w-full px-4 py-3 bg-gray-800/50 border ${formErrors.username ? 'border-red-500' : 'border-gray-700/50'} rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-200`}
                  required
                />
                {formErrors.username && (
                  <p className="text-red-400 text-sm mt-1">{formErrors.username}</p>
                )}
              </div>
              
              <div>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    className={`w-full px-4 py-3 pr-12 bg-gray-800/50 border ${formErrors.password ? 'border-red-500' : 'border-gray-700/50'} rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-200`}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors duration-200"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {formErrors.password && (
                  <p className="text-red-400 text-sm mt-1">{formErrors.password}</p>
                )}
              </div>
              
              <div>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({...formData, role: e.target.value})}
                  className={`w-full px-4 py-3 bg-gray-800/50 border ${formErrors.role ? 'border-red-500' : 'border-gray-700/50'} rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-200`}
                >
                  {departments.map(dept => (
                    <option key={dept} value={dept}>
                      {dept.charAt(0).toUpperCase() + dept.slice(1)}
                    </option>
                  ))}
                </select>
                {formErrors.role && (
                  <p className="text-red-400 text-sm mt-1">{formErrors.role}</p>
                )}
              </div>
              
              <button
                type="button"
                onClick={handleAddUser}
                disabled={isSubmitting}
                className="w-full py-3 bg-gradient-to-r from-purple-600 via-pink-600 to-purple-700 text-white font-semibold rounded-lg hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-purple-500/25 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {isSubmitting ? 'Adding User...' : 'Add User'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={closeModals} />
          <div className="relative bg-gray-900/95 backdrop-blur-md rounded-2xl border border-gray-700/50 p-8 w-full max-w-md shadow-2xl">
            <button
              onClick={closeModals}
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors duration-200 hover:bg-gray-700/50 rounded-lg p-1"
            >
              <X className="w-6 h-6" />
            </button>
            
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-400 via-pink-500 to-purple-600 bg-clip-text text-transparent mb-2">
                Edit User
              </h2>
              <p className="text-gray-400">Update user information</p>
            </div>
            
            <div className="space-y-4">
              <div>
                <input
                  type="text"
                  placeholder="Username"
                  value={formData.username}
                  onChange={(e) => setFormData({...formData, username: e.target.value})}
                  className={`w-full px-4 py-3 bg-gray-800/50 border ${formErrors.username ? 'border-red-500' : 'border-gray-700/50'} rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-200`}
                  required
                />
                {formErrors.username && (
                  <p className="text-red-400 text-sm mt-1">{formErrors.username}</p>
                )}
              </div>
              
              <div>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="New Password (optional)"
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    className={`w-full px-4 py-3 pr-12 bg-gray-800/50 border ${formErrors.password ? 'border-red-500' : 'border-gray-700/50'} rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-200`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors duration-200"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {formErrors.password && (
                  <p className="text-red-400 text-sm mt-1">{formErrors.password}</p>
                )}
              </div>
              
              <div>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({...formData, role: e.target.value})}
                  className={`w-full px-4 py-3 bg-gray-800/50 border ${formErrors.role ? 'border-red-500' : 'border-gray-700/50'} rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-200`}
                >
                  {departments.map(dept => (
                    <option key={dept} value={dept}>
                      {dept.charAt(0).toUpperCase() + dept.slice(1)}
                    </option>
                  ))}
                </select>
                {formErrors.role && (
                  <p className="text-red-400 text-sm mt-1">{formErrors.role}</p>
                )}
              </div>
              
              <button
                type="button"
                onClick={handleEditUser}
                disabled={isSubmitting}
                className="w-full py-3 bg-gradient-to-r from-purple-600 via-pink-600 to-purple-700 text-white font-semibold rounded-lg hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-purple-500/25 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {isSubmitting ? 'Updating User...' : 'Update User'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
