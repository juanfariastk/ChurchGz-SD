import React, { useState } from 'react';
import { Button, Col, Container, Form, Row } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { countAdmins, hashData } from '../services/hashService.service';


const Register: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [age, setAge] = useState('');
  const [religion, setReligion] = useState('');
  const [politicalIdeology, setPoliticalIdeology] = useState('');
  const [profession, setProfession] = useState('');
  const [numberOfChildren, setNumberOfChildren] = useState('');
  const [incomeBeforeWar, setIncomeBeforeWar] = useState('');
  const [educationLevel, setEducationLevel] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminCode, setAdminCode] = useState('');
  const [isCodeValid, setIsCodeValid] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const navigate = useNavigate(); 

  const logAction = (action: string, data: any) => {
    const timestamp = new Date().toISOString();
    const systemChurchLog = localStorage.getItem('systemChurchLog');
    const systemLog = systemChurchLog ? JSON.parse(systemChurchLog) : [];

    const logEntry = { timestamp, action, data };
    systemLog.push(logEntry);
    localStorage.setItem('systemChurchLog', JSON.stringify(systemLog));
  };
  
  const handleRegister = async () => {

    if (
      !email ||
      !password ||
      !name ||
      !address ||
      !age ||
      !religion ||
      !politicalIdeology ||
      !profession ||
      !numberOfChildren ||
      !incomeBeforeWar ||
      !educationLevel
    ) {
      setErrorMessage('Todos os campos são obrigatórios.');
      return;
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{12,}$/;
    if (!password.match(passwordRegex)) {
      setErrorMessage('A senha deve conter pelo menos 12 caracteres com letras maiúsculas, minúsculas e algum símbolo.');
      return;
    }

    const hashedPassword = await hashData(password);
    const hashedEmail = await hashData(email);
  
    let isAdminUser = isAdmin; 

    if (isAdmin && adminCode.toString() === '4568') {
      setIsCodeValid(true);
      isAdminUser = true; 
    } else {
      setIsCodeValid(false);
      isAdminUser = false; 
    }
  
    const data = {
      email: hashedEmail,
      password: hashedPassword,
      name,
      address,
      age,
      religion,
      politicalIdeology,
      profession,
      numberOfChildren,
      incomeBeforeWar,
      educationLevel,
      isAdmin: isAdminUser,
    };
  
    const storedUsers = localStorage.getItem('users');
    const existingUsers = storedUsers ? JSON.parse(storedUsers) : [];
  
    if (isAdminUser && countAdmins(existingUsers) >= 2) {
      //console.log('Não é possível adicionar mais administradores. Limite alcançado.');
      setErrorMessage('Não é possível adicionar mais administradores. Limite alcançado.');
      return;
    }
  
    const updatedUsers = [...existingUsers, data];
    localStorage.setItem('users', JSON.stringify(updatedUsers));
    logAction('UserRegistration', { userEmail: email });
    navigate('/');
   
  };

  const religions = ['Mulçumano', 'Judeu', 'Católico'];
  const politicalIdeologies = ['Esquerda', 'Direita', 'Centro'];

  return (
    <Container
      className="d-flex justify-content-center align-items-center"
      style={{ height: '100vh'}}
    >
      <Row style={{width:'500px', height:'900px'}}>
        <Col xs={12} md={8} lg={12} style={{ marginBottom:'10px'}}>
          <div
            style={{
              boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)',
              borderRadius: '10px',
              padding: '20px',
              background: '#fff',
            }}
          >
            <h2 className="mb-4">Register</h2>

            <div style={{ marginBottom: '10px' }}>
                {errorMessage && (
                  <div className="alert alert-danger" role="alert">
                    {errorMessage}
                  </div>
                )}
              </div>
            
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
                  placeholder="Enter password"
                  value={password}
                  pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{12,}$"
                  onChange={(e) => setPassword(e.target.value)}
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="formBasicName">
                <Form.Label>Name:</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="formBasicAddress">
                <Form.Label>Address:</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="formBasicAge">
                <Form.Label>Age:</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="Enter age"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="formBasicReligion">
                <Form.Label>Religion:</Form.Label>
                <Form.Select
                  value={religion}
                  onChange={(e) => setReligion(e.target.value)}
                >
                  <option value="">Select religion</option>
                  {religions.map((rel, index) => (
                    <option key={index} value={rel}>
                      {rel}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
              <Form.Group className="mb-3" controlId="formBasicPoliticalIdeology">
                <Form.Label>Political Ideology:</Form.Label>
                <Form.Select
                  value={politicalIdeology}
                  onChange={(e) => setPoliticalIdeology(e.target.value)}
                >
                  <option value="">Select political ideology</option>
                  {politicalIdeologies.map((ideology, index) => (
                    <option key={index} value={ideology}>
                      {ideology}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>

              <Form.Group className="mb-3" controlId="formBasicProfession">
                <Form.Label>Profession:</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter profession"
                  value={profession}
                  onChange={(e) => setProfession(e.target.value)}
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="formBasicNumberOfChildren">
                <Form.Label>Number of Children:</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="Enter number of children"
                  value={numberOfChildren}
                  onChange={(e) => setNumberOfChildren(e.target.value)}
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="formBasicIncomeBeforeWar">
                <Form.Label>Income Before War:</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter income before war"
                  value={incomeBeforeWar}
                  onChange={(e) => setIncomeBeforeWar(e.target.value)}
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="formBasicEducationLevel">
                <Form.Label>Education Level:</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter education level"
                  value={educationLevel}
                  onChange={(e) => setEducationLevel(e.target.value)}
                />
              </Form.Group>
              <Form.Group controlId="formBasicAdmin">
                <Form.Check
                  type="checkbox"
                  label="Administrador"
                  checked={isAdmin}
                  onChange={(e) => setIsAdmin(e.target.checked)}
                />
              </Form.Group>

              {isAdmin && (
                <Form.Group controlId="formBasicAdminCode" className='mb-2'>
                  <Form.Label>Código de Administrador (4 dígitos):</Form.Label>
                  <Form.Control
                    type="password"
                    name="adminCode"
                    value={adminCode}
                    onChange={(e) => setAdminCode(e.target.value)}
                  />
                </Form.Group>
              )}

              <Button variant="primary" onClick={handleRegister}>
                  Register
              </Button>
            </Form>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default Register;
