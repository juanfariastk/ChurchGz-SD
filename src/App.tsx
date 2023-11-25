import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import Login from './components/Login';
import Register from './components/Register';
import AdminArea from './components/adminArea/AdminArea';
import UserArea from './components/userArea/UserArea';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} /> 
        <Route path="/userarea/*" element={<UserArea />} />
        <Route path="/admin" element={<AdminArea />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
