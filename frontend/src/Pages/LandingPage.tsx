import { useState, useEffect } from 'react';
import { ArrowRight, MessageSquare, Shield, Zap, Users, ChevronDown, X, User, Lock, LucideSquareChevronRight, ArrowRightCircleIcon, LogOut } from 'lucide-react';
import LoginForm from '../components/LoginForm';
import { useAuthStore } from '../store/useAuthStore';
import { useNavigate } from 'react-router-dom';

export default function FinSageLanding() {
  const [isVisible, setIsVisible] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [showLoginModal, setShowLoginModal] = useState(false);
  const {user, logout}  = useAuthStore();
  const navigate = useNavigate();
  useEffect(() => {
    setIsVisible(true);
    
    const handleMouseMove = (e:any) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleGetStarted = () => {
    if(!user){
      setShowLoginModal(true);
    }else{
      navigate('/chat')
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white overflow-hidden relative">
      {/* Animated background gradient */}
      <div 
        className="absolute inset-0 opacity-30"
        style={{
          background: `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(168, 85, 247, 0.4) 0%, rgba(236, 72, 153, 0.3) 25%, rgba(0, 0, 0, 0.8) 50%)`
        }}
      />
      
      {/* Floating particles */}
      <div className="absolute inset-0">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-purple-400 rounded-full opacity-20 animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 2}s`
            }}
          />
        ))}
      </div>

      {/* Login Modal */}
      {showLoginModal && (
        <LoginForm setShowLoginModal={setShowLoginModal}/>
      )}

      {/* Main content */}
      <div className="relative z-10">
        {/* Header */}
        <header className="px-6 py-4">
          <nav className="max-w-7xl mx-auto flex justify-between items-center">
            <div className="text-3xl font-bold bg-gradient-to-r from-purple-400 via-pink-500 to-black bg-clip-text text-transparent">
              FinSage
            </div>
            {user && (
              <button className='cursor-pointer duration-150 hover:scale-150 text-purple-400' onClick={()=>{
                logout();
              }}>
                <LogOut/>
              </button>
            )}
          </nav>
        </header>

        {/* Hero Section */}
        <main className="px-6">
          <div className="max-w-7xl mx-auto">
            <div className={`text-center transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              
              {/* Main Title */}
              <h1 className="text-7xl md:text-8xl font-bold mb-8 leading-tight">
                <span className="bg-gradient-to-r from-purple-400 via-pink-500 to-purple-600 bg-clip-text text-transparent animate-pulse">
                  FinSage
                </span>
              </h1>
              
              {/* Subtitle */}
              <h2 className="text-2xl md:text-3xl font-light mb-6 text-gray-300">
                AI-Powered Financial Intelligence Platform
              </h2>
              
              {/* Description */}
              <p className="text-lg md:text-xl text-gray-400 max-w-3xl mx-auto mb-12 leading-relaxed">
                Transform your operations with our intelligent RAG chat application. 
                Break down data silos, accelerate decision-making, and empower your teams with 
                secure, role-based access to the documentation.
              </p>

              {/* Features Grid */}
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 max-w-5xl mx-auto">
                {[
                  { icon: Shield, title: "Role-Based Access", desc: "Secure department-specific data access" },
                  { icon: Zap, title: "Real-Time Insights", desc: "Instant access to financial intelligence" },
                  { icon: MessageSquare, title: "Smart Chat Interface", desc: "Natural language queries and responses" },
                  { icon: Users, title: "Hassle free", desc: "Know every detail about your role." }
                ].map((feature, i) => (
                  <div 
                    key={i}
                    className={`bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50 hover:border-purple-500/50 transition-all duration-300 hover:scale-105 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
                    style={{ transitionDelay: `${i * 100}ms` }}
                  >
                    <feature.icon className="w-8 h-8 text-purple-400 mb-4 mx-auto" />
                    <h3 className="text-lg font-semibold mb-2 text-white">{feature.title}</h3>
                    <p className="text-gray-400 text-sm">{feature.desc}</p>
                  </div>
                ))}
              </div>

              {/* CTA Button */}
              <div className={`transition-all flex gap-4 justify-center items-center  duration-1000 delay-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                <button
                  onClick={handleGetStarted}
                  className="group relative px-12 py-4 bg-gradient-to-r from-purple-600 via-pink-600 to-purple-700 rounded-full text-white font-semibold text-lg hover:scale-105 transition-all duration-300 shadow-2xl hover:shadow-purple-500/25"
                >
                  <span className="relative z-10 flex items-center">
                    Get Started
                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
                  </span>
                  <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-500 via-pink-500 to-purple-600 blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </button>
                {user && (
                  <button onClick={()=>{
                    navigate('/hr-dashboard')
                  }}>
                    <div className='flex hover:bg-purple-200 hover:text-purple-950 duration-400 gap-2 border-2 border-purple-950 px-4 py-2 m-2 rounded-4xl'>
                        Go to dashboard 
                          <span className='text-purple-600 font-2xl animate-ping translate-x-1/2'>
                          <ArrowRightCircleIcon/>
                          </span>
                    </div>
                  </button>
                )}
              </div>

              {/* Registration Notice */}
              {!user && (
                <div className={`mt-12 transition-all duration-1000 delay-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                <div className="inline-flex items-center px-6 py-3 bg-gray-800/60 backdrop-blur-sm rounded-full border border-gray-700/50">
                  <div className="w-2 h-2 bg-green-400 rounded-full mr-3 animate-pulse" />
                  <span className="text-gray-300">To register contact the HR</span>
                </div>
              </div>
              )}
            </div>
          </div>
        </main>

        {/* Bottom section with scroll indicator */}
        {!user && (
          <div className="absolute bottom-14 left-1/2 transform -translate-x-1/2">
          <ChevronDown className="w-6 h-6 text-gray-500 animate-bounce" />
          </div>
        )}
      </div>

      {/* Gradient overlays for depth */}
      <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-purple-900/20 to-transparent" />
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-purple-900/20 to-transparent" />
    </div>
  );
}