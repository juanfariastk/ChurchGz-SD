import React, { useState } from 'react';
import { Button, Container, Form } from 'react-bootstrap';
import { hashData, validateUserCredentials } from '../services/hashService.service';


const religions = ['Mulçumano', 'Judeu', 'Católico'];
const politicalIdeologies = ['Esquerda', 'Direita', 'Centro'];

const EditData: React.FC = () => {
  const user = localStorage.getItem('currentUser') ? JSON.parse(localStorage.getItem('currentUser') || '{}') : {};

  const logAction = (action: string, data: any) => {
    const timestamp = new Date().toISOString();
    const systemChurchLog = localStorage.getItem('systemChurchLog');
    const systemLog = systemChurchLog ? JSON.parse(systemChurchLog) : [];

    const logEntry = { timestamp, action, data };
    systemLog.push(logEntry);
    localStorage.setItem('systemChurchLog', JSON.stringify(systemLog));
  };

  const [editedUser, setEditedUser] = useState({
    ...user,
    email: '',
    password: '',
    newEmail: '',
    newPassword: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditedUser({ ...editedUser, [name]: value });
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEditedUser({ ...editedUser, [name]: value });
  };

  
  const handleSubmit = async () => {
    const storedUsers = localStorage.getItem('users');
    let users = storedUsers ? JSON.parse(storedUsers) : [];
    const userAltValid = await validateUserCredentials(editedUser.email, editedUser.password, users);
  
    if (userAltValid) {
      const updatedUserData = {
        ...editedUser,
        email: await hashData(editedUser.newEmail) || editedUser.email,
        password: await hashData(editedUser.newPassword) || editedUser.password,
      };
  
      const userIndex = users.findIndex((storedUser: any) => storedUser.email === userAltValid.email);

      if (userIndex !== -1) {
        users[userIndex] = updatedUserData;

        localStorage.removeItem('users');
        localStorage.setItem('users', JSON.stringify(users));

        localStorage.setItem('currentUser', JSON.stringify(updatedUserData)); 

        const updatedStoredUsers = localStorage.getItem('users');
        const updatedUsers = updatedStoredUsers ? JSON.parse(updatedStoredUsers) : [];
        logAction('ChangesSaved', updatedUserData);
      }
    }
  };
  
  


  return (
    <Container className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
      <div className="w-50 mt-5">
        <h2 className="mb-4 text-center">Editar Dados</h2>
        <Form>
        <Form.Group controlId="formBasicEmail">
            <Form.Label>Previous Email:</Form.Label>
            <Form.Control
              type="email"
              name="email"
              value={editedUser.email}
              onChange={handleInputChange}
            />
          </Form.Group>

          <Form.Group controlId="formBasicPassword">
            <Form.Label>Previous Password:</Form.Label>
            <Form.Control
              type="password"
              name="password"
              value={editedUser.password}
              onChange={handleInputChange}
            />
          </Form.Group>

          <Form.Group controlId="formBasicNewEmail">
            <Form.Label>New Email:</Form.Label>
            <Form.Control
              type="email"
              name="newEmail"
              value={editedUser.newEmail}
              onChange={handleInputChange}
            />
          </Form.Group>

          <Form.Group controlId="formBasicNewPassword">
            <Form.Label>New Password:</Form.Label>
            <Form.Control
              type="password"
              name="newPassword"
              value={editedUser.newPassword}
              onChange={handleInputChange}
            />
          </Form.Group>

          <Form.Group controlId="formBasicName">
            <Form.Label>Name:</Form.Label>
            <Form.Control
              type="text"
              name="name"
              value={editedUser.name}
              onChange={handleInputChange}
            />
          </Form.Group>

          <Form.Group controlId="formBasicAddress">
            <Form.Label>Address:</Form.Label>
            <Form.Control
              type="text"
              name="address"
              value={editedUser.address}
              onChange={handleInputChange}
            />
          </Form.Group>

          <Form.Group controlId="formBasicAge">
            <Form.Label>Age:</Form.Label>
            <Form.Control
              type="number"
              name="age"
              value={editedUser.age}
              onChange={handleInputChange}
            />
          </Form.Group>

          <Form.Group controlId="formBasicReligion">
            <Form.Label>Religion:</Form.Label>
            <Form.Select
              name="religion"
              value={editedUser.religion}
              onChange={handleSelectChange}
            >
              <option value="">Select religion</option>
              {religions.map((religion, index) => (
                <option key={index} value={religion}>
                  {religion}
                </option>
              ))}
            </Form.Select>
          </Form.Group>

          <Form.Group controlId="formBasicPoliticalIdeology">
            <Form.Label>Political Ideology:</Form.Label>
            <Form.Select
              name="politicalIdeology"
              value={editedUser.politicalIdeology}
              onChange={handleSelectChange}
            >
              <option value="">Select political ideology</option>
              {politicalIdeologies.map((ideology, index) => (
                <option key={index} value={ideology}>
                  {ideology}
                </option>
              ))}
            </Form.Select>
          </Form.Group>

          <Form.Group controlId="formBasicProfession">
            <Form.Label>Profession:</Form.Label>
            <Form.Control
              type="text"
              name="profession"
              value={editedUser.profession}
              onChange={handleInputChange}
            />
          </Form.Group>

          <Form.Group controlId="formBasicNumberOfChildren">
            <Form.Label>Number of Children:</Form.Label>
            <Form.Control
              type="number"
              name="numberOfChildren"
              value={editedUser.numberOfChildren}
              onChange={handleInputChange}
            />
          </Form.Group>

          <Form.Group controlId="formBasicIncomeBeforeWar">
            <Form.Label>Income Before War:</Form.Label>
            <Form.Control
              type="text"
              name="incomeBeforeWar"
              value={editedUser.incomeBeforeWar}
              onChange={handleInputChange}
            />
          </Form.Group>

          <Form.Group controlId="formBasicEducationLevel">
            <Form.Label>Education Level:</Form.Label>
            <Form.Control
              type="text"
              name="educationLevel"
              value={editedUser.educationLevel}
              onChange={handleInputChange}
            />
          </Form.Group>

          <Button variant="primary" type="button" className="mt-3" onClick={handleSubmit}>
            Salvar Alterações
          </Button>

        </Form>
      </div>
    </Container>
  );
};

export default EditData;
