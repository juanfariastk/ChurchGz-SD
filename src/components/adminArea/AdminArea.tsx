import React, { useState } from 'react';
import { Button, Form, Modal, Table } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';


const AdminArea: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  const [showSendEmailModal, setShowSendEmailModal] = useState(false);
  const [showSystemLogModal, setShowSystemLogModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [systemLogs, setSystemLogs] = useState([]);
  const [emailData, setEmailData] = useState({
    recipient: '',
    subject: '',
    body: ''
  });
  const [attachUserList, setAttachUserList] = useState(false); 

  const adminUser = localStorage.getItem('currentUser');
  const adminUserJson = adminUser ? JSON.parse(adminUser) : '';

  const usersFromLocalStorage = localStorage.getItem('users');
  const users = usersFromLocalStorage ? JSON.parse(usersFromLocalStorage) : [];

  const systemChurchLog = localStorage.getItem('systemChurchLog');
  const systemLog = systemChurchLog ? JSON.parse(systemChurchLog) : [];

  const logAction = (action: string, data: any) => {
    const timestamp = new Date().toISOString();
    const logEntry = { timestamp, action, data };
    systemLog.push(logEntry);
    localStorage.setItem('systemChurchLog', JSON.stringify(systemLog));
  };

  const navigate = useNavigate();

  const handleUserClick = (user: any) => {
    setSelectedUser(user);
    setShowModal(true);
    logAction(`UserClicked Admin Access ${adminUserJson.name}`, user);
  };

  const generateCSV = () => {
    const nonAdminUsers = users.filter((user: { isAdmin: any; }) => !user.isAdmin);
  
    const csvHeader = "Email,Name,Address,Age,Religion,Political Ideology,Profession,Number of Children,Income Before War,Education Level\n";
  
    const csvData = nonAdminUsers.map((user: { email: any; name: any; address: any; age: any; religion: any; politicalIdeology: any; profession: any; numberOfChildren: any; incomeBeforeWar: any; educationLevel: any; }) => {
      const {
        email,
        name,
        address,
        age,
        religion,
        politicalIdeology,
        profession,
        numberOfChildren,
        incomeBeforeWar,
        educationLevel
      } = user;
      
      return [email, name, address, age, religion, politicalIdeology, profession, numberOfChildren, incomeBeforeWar, educationLevel].join(',');
    }).join("\n");
  
    const csvContent = `${csvHeader}${csvData}`;
  
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
  
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "nonAdminUsers.csv");
    link.click();
    logAction('CSVGenerated', nonAdminUsers);
  };  

  const handleDownloadLog = () => {
    const jsonContent = JSON.stringify(systemLog, null, 2);
    const jsonBlob = new Blob([jsonContent], { type: 'application/json' });
    const jsonUrl = URL.createObjectURL(jsonBlob);
  
    const jsonLink = document.createElement("a");
    jsonLink.setAttribute("href", jsonUrl);
    jsonLink.setAttribute("download", "systemLog.json");
    jsonLink.click();

    const csvHeader = "Timestamp,Action,Data\n";
    const csvData = systemLog.map((logEntry: { timestamp: any; action: any; data: any; }) => {
      const { timestamp, action, data } = logEntry;
      return `${timestamp},${action},${JSON.stringify(data)}\n`;
    }).join("");
    const csvContent = `${csvHeader}${csvData}`;
    const csvBlob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const csvUrl = URL.createObjectURL(csvBlob);

    const csvLink = document.createElement("a");
    csvLink.setAttribute("href", csvUrl);
    csvLink.setAttribute("download", "systemLog.csv");
    csvLink.click();
    logAction('SystemLogDownloaded', {});
  };
  
  const handleGenerateCsv = ():any =>{
    generateCSV();
  }

  const handleLogoff = () => {
    localStorage.removeItem('currentUser');
    logAction('LoggedOff', adminUserJson.name);
    navigate('/');
  };

  const handleSendEmail = () => {
    logAction('EmailModalOpened', {});
    setShowSendEmailModal(true);
  };

  const handleEmailSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    /*console.log('Enviando e-mail para:', emailData.recipient);
    console.log('Assunto:', emailData.subject);
    console.log('Corpo:', emailData.body);
    console.log('Anexar lista de usuários:', attachUserList);*/
    window.alert('Email Sent!') 
    //sendEmail(emailData.subject, emailData.body, emailData.recipient, 'src/app/nonAdminUsers.csv')
    handleCloseModal();
    logAction('ModalClosed', adminUserJson.name);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEmailData({ recipient: '', subject: '', body: '' }); 
    logAction('EmailSent', emailData);
  };
  const handleAccessSystemLog = () => {
    setSystemLogs(systemLog);
    setShowSystemLogModal(true);
    logAction(`AccessedSystemLog Admin Access ${adminUserJson.name}`, {});
  };

  return (
    <div style={{ textAlign: 'center', padding: '20px' }}>
      <h1>Admin Area</h1>
      <p>Welcome to the Admin Dashboard!</p>
      <div style={{ margin: '20px' }}>
        <h2>User List</h2>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user: any, index: number) => (
              <tr key={index} onClick={() => handleUserClick(user)}>
                <td>{user.name}</td>
                <td>{user.email}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
      <Button variant="danger" onClick={handleLogoff}>
        Logoff
      </Button>{' '}
      <Button variant="primary" onClick={handleSendEmail}>
        Send Email
      </Button>{' '}
      <Button variant="primary" onClick={handleGenerateCsv}>
        Generate CSV
      </Button>{' '}
      <Button variant="primary" onClick={handleAccessSystemLog}>
        Access System Log
      </Button>

      <Modal show={showSystemLogModal} onHide={() => setShowSystemLogModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>System Log</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <div style={{ overflowX: 'auto' }}>
          <Table striped bordered hover style={{ minWidth: '800px' }}>
            <thead>
              <tr>
                <th>Timestamp</th>
                <th>Action</th>
                <th>Data</th>
              </tr>
            </thead>
            <tbody>
              {systemLogs.map((logEntry: any, index: number) => (
                <tr key={index}>
                  <td>{logEntry.timestamp}</td>
                  <td>{logEntry.action}</td>
                  <td>{JSON.stringify(logEntry.data)}</td>
                </tr>
              ))}
            </tbody>
          </Table>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowSystemLogModal(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={handleDownloadLog}>
            Download Log
          </Button>
        </Modal.Footer>
      </Modal>


      <Modal show={showSendEmailModal} onHide={() => setShowSendEmailModal(false)} size="lg" >
        <Modal.Header closeButton>
          <Modal.Title>Send Email</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleEmailSubmit}>
            <Form.Group controlId="formRecipient">
              <Form.Label>Recipient:</Form.Label>
              <Form.Control
                type="email"
                value={emailData.recipient}
                onChange={(e) => setEmailData({ ...emailData, recipient: e.target.value })}
                required
              />
            </Form.Group>
            <Form.Group controlId="formSubject">
              <Form.Label>Subject:</Form.Label>
              <Form.Control
                type="text"
                value={emailData.subject}
                onChange={(e) => setEmailData({ ...emailData, subject: e.target.value })}
                required
              />
            </Form.Group>
            <Form.Group controlId="formBody">
              <Form.Label>Body:</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={emailData.body}
                onChange={(e) => setEmailData({ ...emailData, body: e.target.value })}
                required
              />
            </Form.Group>
            <Form.Group controlId="formAttachUserList" className='m-2'>
              <Form.Check
                type="checkbox"
                label="Attach current user list"
                checked={attachUserList}
                onChange={(e) => setAttachUserList(e.target.checked)}
              />
            </Form.Group>
            <Button variant="primary" type="submit">
              Send
            </Button>
          </Form>
        </Modal.Body>

      </Modal>

      <Modal show={showModal} onHide={handleCloseModal} size="lg">
            <Modal.Header closeButton>
                <Modal.Title>User Details</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {selectedUser && (
                <Form>
                    <Form.Group controlId="formUserName">
                    <Form.Label>Name:</Form.Label>
                    <Form.Control type="text" value={selectedUser.name} readOnly />
                    </Form.Group>
                    <Form.Group controlId="formUserEmail">
                    <Form.Label>Email:</Form.Label>
                    <Form.Control type="email" value={selectedUser.email} readOnly />
                    </Form.Group>
                    <Form.Group controlId="formUserAddress">
                    <Form.Label>Address:</Form.Label>
                    <Form.Control type="text" value={selectedUser.address} readOnly />
                    </Form.Group>
                    <Form.Group controlId="formUserAge">
                    <Form.Label>Age:</Form.Label>
                    <Form.Control type="text" value={selectedUser.age} readOnly />
                    </Form.Group>
                    <Form.Group controlId="formUserReligion">
                    <Form.Label>Religion:</Form.Label>
                    <Form.Control type="text" value={selectedUser.religion} readOnly />
                    </Form.Group>
                    <Form.Group controlId="formUserPoliticalIdeology">
                    <Form.Label>Political Ideology:</Form.Label>
                    <Form.Control type="text" value={selectedUser.politicalIdeology} readOnly />
                    </Form.Group>
                    <Form.Group controlId="formUserProfession">
                    <Form.Label>Profession:</Form.Label>
                    <Form.Control type="text" value={selectedUser.profession} readOnly />
                    </Form.Group>
                    <Form.Group controlId="formUserNumberOfChildren">
                    <Form.Label>Number of Children:</Form.Label>
                    <Form.Control type="text" value={selectedUser.numberOfChildren} readOnly />
                    </Form.Group>
                    <Form.Group controlId="formUserIncomeBeforeWar">
                    <Form.Label>Income Before War:</Form.Label>
                    <Form.Control type="text" value={selectedUser.incomeBeforeWar} readOnly />
                    </Form.Group>
                    <Form.Group controlId="formUserEducationLevel">
                    <Form.Label>Education Level:</Form.Label>
                    <Form.Control type="text" value={selectedUser.educationLevel} readOnly />
                    </Form.Group>
                    <Form.Group controlId="formUserIsAdmin">
                    <Form.Label>Is Admin:</Form.Label>
                    <Form.Control type="text" value={selectedUser.isAdmin ? 'Yes' : 'No'} readOnly />
                    </Form.Group>
                </Form>
                )}
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleCloseModal}>
                Close
                </Button>
            </Modal.Footer>
            </Modal>


    </div>
  );
};

export default AdminArea;
