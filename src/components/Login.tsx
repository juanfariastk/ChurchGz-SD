import React, { useState } from 'react';
import { Button, Col, Container, Form, Row } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { validateUserCredentials } from '../services/hashService.service';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const navigate = useNavigate(); 

  const saveUserLocally = (userValidated:any) => {
    localStorage.setItem('currentUser', JSON.stringify(userValidated));
  };

  const logAction = (action: string, data: any) => {
    const timestamp = new Date().toISOString();
    const systemChurchLog = localStorage.getItem('systemChurchLog');
    const systemLog = systemChurchLog ? JSON.parse(systemChurchLog) : [];

    const logEntry = { timestamp, action, data };
    systemLog.push(logEntry);
    localStorage.setItem('systemChurchLog', JSON.stringify(systemLog));
  };

  const handleLogin = async () => {
    const storedUsers = localStorage.getItem('users');
    const users = storedUsers ? JSON.parse(storedUsers) : [];

    const validatedUser = await validateUserCredentials(email, password, users);

    if (validatedUser) {
      saveUserLocally(validatedUser);
      logAction('LoginSuccess', { userEmail: email });

      console.log(validatedUser.isAdmin)
      if (validatedUser.isAdmin) {
        navigate('/admin');
      } else {
        navigate('/userarea/home');
      }
      //navigate('/userarea/home');
    } else {
      window.alert('Credencial inválida');
      logAction('LoginFailure', { userEmail: email });
    }
  };

  return (
    <Container
      className="d-flex justify-content-center align-items-center"
      style={{ height: '100vh'}}
    >
       
      <Row style={{width:'400px'}}>
      <h2 className="mb-4" style={{textAlign:'center'}}>Gaza Igreja</h2>
        <Col xs={12} md={8} lg={12}>
          <div
            style={{
              boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)',
              borderRadius: '10px',
              padding: '20px',
              background: '#fff',
            }}
          >
            <h2 className="mb-4">Login</h2>
            <Form>
              <Form.Group className="mb-3" controlId="formBasicEmail">
                <Form.Label>Email:</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="Enter email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="formBasicPassword">
                <Form.Label>Password:</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </Form.Group>

              <Button variant="primary" onClick={handleLogin}>
                Login
              </Button>
              <div className="text-center mt-3">
                <Link to="/register">Register</Link>
              </div>
            </Form>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default Login;
