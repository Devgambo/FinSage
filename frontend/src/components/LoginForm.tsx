import { useAuthStore } from '../store/useAuthStore';
import { api, setBasicAuth } from '../api/api';
import { useState } from 'react';
import { Lock, User, X } from 'lucide-react';
import { useNavigate} from 'react-router-dom';


interface Props {
  setShowLoginModal:any
}

export default function LoginForm({setShowLoginModal}: Props) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { setUser , user} = useAuthStore();
  const navigate = useNavigate();
  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      setBasicAuth(username, password); 
      const res = await api.get('/login');
      const role = res.data.role;
      console.log("--------------------------------")
      console.log(res);
      console.log("--------------------------------")
      setUser({username, role});
      console.log(user);
      navigate('/chat');
    } catch (err) {
      alert("Login failed");
    }
  };

  const closeModal = () => {
    setShowLoginModal(false);
    setUsername('');
    setPassword('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={closeModal}
          />
          
          {/* Modal */}
          <div className="relative bg-gray-900/80 backdrop-blur-md rounded-2xl border border-gray-700/50 p-8 w-full max-w-md shadow-2xl">
            {/* Close button */}
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors duration-200"
            >
              <X className="w-6 h-6" />
            </button>
            
            {/* Modal Header */}
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-400 via-pink-500 to-purple-600 bg-clip-text text-transparent mb-2">
                Welcome Back
              </h2>
              <p className="text-gray-400">Sign in to access FinSage</p>
            </div>
            
            {/* Login Form */}
            <form   onSubmit={handleLogin} className="space-y-6">
              {/* Username Field */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-700/50 rounded-lg bg-gray-800/50 backdrop-blur-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                  placeholder="Username"
                  required
                />
              </div>
              
              {/* Password Field */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-700/50 rounded-lg bg-gray-800/50 backdrop-blur-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                  placeholder="Password"
                  required
                />
              </div>
              
              {/* Login Button */}
              <button
                type="submit"
                className="w-full py-3 px-4 bg-gradient-to-r from-purple-600 via-pink-600 to-purple-700 text-white font-semibold rounded-lg hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-purple-500/25 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-900"
              >
                Sign In
              </button>
            </form>
            
            {/* Registration Notice */}
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-400">
                Don't have an account?{' '}
                <span className="text-purple-400 font-medium">Contact HR to register</span>
              </p>
            </div>
          </div>
        </div>
  );
}
