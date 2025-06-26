import { useAuthStore } from './store/useAuthStore';
import FinSageLanding from './Pages/LandingPage';
import ChatBoxPage from './Pages/ChatBoxPage';
import { Navigate, Route, Routes } from 'react-router-dom';
import HRDashboardPage from './Pages/HRDashboardPage';
function App() {
  
  const { user } = useAuthStore();
  return (
    <Routes>
      <Route path='/' element={<FinSageLanding/>}/> 
      <Route path='/chat' element={user?<ChatBoxPage/>:<Navigate to={'/'}/>}/>
      <Route path='/hr-dashboard' element={<HRDashboardPage/>}/>
    </Routes>
  );
}

export default App;
