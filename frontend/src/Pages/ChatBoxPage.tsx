import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, MessageSquare, AlertCircle } from 'lucide-react';
import { api } from '../api/api';
import Markdown from 'react-markdown';

export default function ChatBox() {
  const [input, setInput] = useState('');
  const [chatLog, setChatLog] = useState([
    {
      from: 'bot',
      text: 'Hello! I\'m FinSage AI, your intelligent financial assistant. How can I help you today?',
      timestamp: new Date()
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatLog]);

  const sendMessage = async () => {
    if (!input.trim()) return;
    
    const userMessage = { from: 'user', text: input, timestamp: new Date() };
    setChatLog(prev => [...prev, userMessage]);
    setIsLoading(true);
    
    try {
      const res = await api.post('/chat', { message: input });

      const response = res.data.message.response;

      const botMessage = { from: 'bot', text: response, timestamp: new Date() };
      setChatLog(prev => [...prev, botMessage]);

    } catch (err) {
      const errorMessage = { 
        from: 'bot', 
        text: 'Sorry, I encountered an error. Please try again.', 
        timestamp: new Date() 
      };
      setChatLog(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      setInput('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4">
      <div className="max-w-[80%] mx-auto">
        {/* Header */}
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 via-pink-500 to-purple-600 bg-clip-text text-transparent mb-2">
            FinSage AI Chat
          </h1>
          <p className="text-gray-400">Your intelligent financial assistant</p>
        </div>

        {/* Chat Container */}
        <div className="bg-gray-800/50 backdrop-blur-md rounded-2xl border border-gray-700/50 shadow-2xl overflow-hidden">
          {/* Chat Messages */}
          <div className="h-[60vh] overflow-y-auto p-2 space-y-4 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent">
            {chatLog.map((msg, i) => (
              <div key={i} className={`flex ${msg.from === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`flex items-start space-x-3 max-w-xs lg:max-w-md ${msg.from === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                  {/* Avatar */}
                  <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                    msg.from === 'user' 
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500' 
                      : 'bg-gradient-to-r from-blue-500 to-cyan-500'
                  }`}>
                    {msg.from === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                  </div>
                  
                  {/* Message Bubble */}
                  <div className={`px-4 py-3 rounded-2xl ${
                    msg.from === 'user'
                      ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                      : 'bg-gray-700/50 backdrop-blur-sm border border-gray-600/50 text-gray-100'
                  } shadow-lg`}>
                    <div className="text-sm leading-relaxed">
                        <div className='className="prose max-w-none"'>
                            <Markdown children={msg.text}/>
                        </div>
                    </div>
                    <span className="text-xs opacity-70 mt-1 block">
                      {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              </div>
            ))}
            
            {/* Loading indicator */}
            {isLoading && (
              <div className="flex justify-start">
                <div className="flex items-start space-x-3 max-w-xs lg:max-w-md">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center">
                    <Bot className="w-4 h-4" />
                  </div>
                  <div className="px-4 py-3 rounded-2xl bg-gray-700/50 backdrop-blur-sm border border-gray-600/50">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-6 border-t border-gray-700/50 bg-gray-800/30 backdrop-blur-sm">
            <div className="flex items-center space-x-4">
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask me anything about finance, data, or your department..."
                  className="w-full px-4 py-3 pr-12 bg-gray-700/50 backdrop-blur-sm border border-gray-600/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                  disabled={isLoading}
                />
                <MessageSquare className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              </div>
              
              <button
                onClick={sendMessage}
                disabled={!input.trim() || isLoading}
                className="px-6 py-3 bg-gradient-to-r from-purple-600 via-pink-600 to-purple-700 text-white font-semibold rounded-xl hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-purple-500/25 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center space-x-2"
              >
                <Send className="w-4 h-4" />
                <span>Send</span>
              </button>
            </div>
          </div>
        </div>
        <div className='flex justify-center align-middle items-center gap-2 my-2'>
                  <span><AlertCircle className='text-red-400 w-4'/></span>
                  <p className='text-xs font-mono font-bold'>I don't have the permission tell you anything other than your department (unless yr're a c-level)</p>
        </div>

        {/* Status Bar */}
        <div className="mt-4 text-center text-sm text-gray-500">
          <div className="flex items-center justify-center space-x-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span>FinSage AI is online and ready to help</span>
          </div>
        </div>
      </div>
    </div>
  );
}