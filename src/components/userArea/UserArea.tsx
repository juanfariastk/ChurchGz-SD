import React, { useEffect, useState } from 'react';
import { Container, Nav, Navbar } from 'react-bootstrap';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import { Link, Route, Routes, useNavigate } from 'react-router-dom';
import EditData from '../EditData';
import Home from '../Home';
import './UserArea.css';

const UserArea: React.FC = () => {
  const [expanded, setExpanded] = useState(false);
  const [currentUser, setCurrentUser] = useState('');

  const navigate = useNavigate(); 


  const toggleNavbar = () => {
    setExpanded(!expanded);
  };

  useEffect(() => {
    const userFromLocalStorage = localStorage.getItem('currentUser');
    setCurrentUser(userFromLocalStorage ? JSON.parse(userFromLocalStorage) : '');
  }, []);
  
  const handleLogoff = () => {
    localStorage.removeItem('currentUser');
    navigate('/'); 
  };

  console.log(currentUser);
  return (
    <div className={`d-flex ${expanded ? 'expanded' : ''}`}>
      <Navbar
        expand="lg"
        variant="light"
        bg="light"
        className={`flex-column p-0 custom-sidebar ${expanded ? 'expanded' : ''}`}
      >
        <Navbar.Toggle onClick={toggleNavbar} aria-controls="sidebar" />
        <Navbar.Collapse id="sidebar" className="sidebar-content">
          <Nav className="flex-column">
            <Nav.Item>
              <Nav.Link as={Link} to="/userarea/home" onClick={toggleNavbar}>
                Home
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link as={Link} to="/userarea/edit-data" onClick={toggleNavbar}>
                Editar Dados
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link onClick={handleLogoff}>
                  Logoff
              </Nav.Link>
            </Nav.Item>
          </Nav>
        </Navbar.Collapse>

      </Navbar>
      <div className='button-alt'>
      <div className="sidebar-toggle-btn" onClick={toggleNavbar}>
          {expanded ? <FaArrowLeft /> : <FaArrowRight />}
        </div>
      </div>
      
      <Container fluid className="p-0">
        <Container className="mt-4">
          <Routes>
            <Route path="/home" element={<Home/>} />
            <Route path="/edit-data" element={<EditData />} />
          </Routes>
        </Container>
      </Container>
    </div>
  );
};

export default UserArea;