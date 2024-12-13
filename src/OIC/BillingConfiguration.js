import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { addDoc, collection, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { FaUserCircle, FaBars, FaEdit, FaTrash  } from 'react-icons/fa';
import { rentmobileDb } from '../components/firebase.config';
import SideNav from './side_nav';
import Modal from 'react-modal';

const BillingConfigurationContainer = styled.div`
  display: flex;
  height: 100vh;
  background-color: #f4f5f7;
`;

const MainContent = styled.div`
  margin-left: ${({ isSidebarOpen }) => (isSidebarOpen ? '230px' : '70px')};
  padding: 2rem;
  background-color: #fff;
  width: 100%;
  transition: margin-left 0.3s ease;
  overflow-y: auto;
`;

const AppBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 30px;
  background-color: #188423;
  color: white;
  font-size: 24px;
  font-family: 'Inter', sans-serif;
  font-weight: bold;
  margin-bottom: 20px;
`;

const ToggleButton = styled.div`
  display: ${({ isSidebarOpen }) => (isSidebarOpen ? 'none' : 'block')};
  position: absolute;
  top: 15px;
  left: 15px;
  font-size: 1.8rem;
  color: #333;
  cursor: pointer;
  z-index: 200;
`;

const AddButton = styled.button`
  padding: 10px;
  background-color: #188423;
  color: white;
  font-size: 18px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #166a1a;
  }
`;

const TitleInput = styled.input`
  width: 96%;
  margin-bottom: 15px;
  padding: 10px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 4px;
  transition: border-color 0.3s;

  &:focus {
    border-color: #188423;
    outline: none;
  }
`;

const customModalStyles = {
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    position: 'relative',
    inset: 'auto',
    padding: 0,
    border: 'none',
    borderRadius: '10px',
    width: '50%',
    maxHeight: '80%',
    overflowY: 'auto',
  },
};

const ModalContent = styled.div`
  padding: 2rem;
  border-radius: 10px;
  box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1);
  background-color: white;
`;

const FormRow = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 15px;

  input, select {
    flex: 1;
    padding: 10px;
    font-size: 16px;
    border: 1px solid #ccc;
    border-radius: 4px;
    transition: border-color 0.3s;

    &:focus {
      border-color: #188423;
      outline: none;
    }
  }

  input[disabled] {
    background-color: #f0f0f0;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 20px;

  button {
    width: 48%;
    padding: 10px;
    font-size: 18px;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.3s;

    &:hover {
      opacity: 0.9;
    }
  }

  .add-btn {
    background-color: #007bff;
    color: white;
    border: none;

    &:hover {
      background-color: #0056b3;
    }
  }

  .undo-btn {
    background-color: #ff0000;
    color: white;
    border: none;

    &:hover {
      background-color: #c70000;
    }
  }
`;

const SaveButton = styled.button`
  padding: 10px 20px;
  background-color: #188423;
  color: white;
  font-size: 18px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  width: 100px;
  margin-top: 20px;
  transition: background-color 0.3s;

  &:hover {
    background-color: #166a1a;
  }
`;

const HorizontalLine = styled.hr`
  border: none;
  height: 1px;
  background-color: #ccc;
  margin: 5px 0; 
  margin-top: 20px;
`;

const CenteredContainer = styled.div`
  display: flex;
  background-color: #e9f7e3;
  justify-content: center;
  align-items: center;
  height: 20vh; /* Adjust the height to control vertical centering */
`;

const ConfigItem = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 10px;
  background-color: #f9f9f9;
  border: 1px solid #ccc;
  margin-bottom: 10px;
  border-radius: 4px;
`;

const EditButton = styled.button`
  padding: 5px 10px;
  background-color: #28a745;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #0056b3;
  }
`;

const AlertModalContent = styled.div`
  padding: 2rem;
  border-radius: 10px;
  box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1);
  background-color: white;
  text-align: center;

  button {
    background-color: red; /* Set the button color to red */
    color: white;
    border: none;
    border-radius: 4px;
    padding: 10px 20px;
    cursor: pointer;
    transition: background-color 0.3s;

    &:hover {
      background-color: darkred; /* Darker shade on hover */
    }
  }
`;


const BillingConfiguration = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [title, setTitle] = useState('');
  const [formRows, setFormRows] = useState([{ label: '', type: '%', value: '' }]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [configurations, setConfigurations] = useState([]);
  const [selectedConfig, setSelectedConfig] = useState(null); // For edit mode
  const [isEditModalOpen, setIsEditModalOpen] = useState(false); // Edit modal state
  const navigate = useNavigate();

  useEffect(() => {
    const loggedInUserData = JSON.parse(localStorage.getItem('userData'));
    if (loggedInUserData) {
      setLoggedInUser(loggedInUserData);
    }

    // Fetch configurations
    const fetchConfigurations = async () => {
      const billingConfigCollection = collection(rentmobileDb, 'billingconfig');
      const billingConfigSnapshot = await getDocs(billingConfigCollection);
      const fetchedConfigs = billingConfigSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setConfigurations(fetchedConfigs);
    };

    fetchConfigurations();
  }, []);

  const handleAddField = () => {
    setFormRows([...formRows, { label: '', type: '%', value: '' }]);
  };

  const handleUndo = () => {
    if (formRows.length > 1) {
      setFormRows(formRows.slice(0, -1));
    }
  };

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const openEditModal = (config) => {
    setSelectedConfig(config);
    setFormRows(Object.keys(config).filter(key => key.startsWith('label')).map((key, index) => ({
      label: config[`label${index + 1}`],
      type: config[`value${index + 1}`]?.endsWith('%') ? '%' : '₱',
      value: config[`value${index + 1}`]?.replace('%', '').replace('₱', ''),
    })));
    setTitle(config.title);
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedConfig(null);
  };

  const handleInputChange = (index, field, value) => {
    const updatedRows = [...formRows];
    
    if (field === 'value') {
      updatedRows[index][field] = parseFloat(value) || 0; // Ensure the value is stored as a number
    } else {
      updatedRows[index][field] = value;
    }
  
    if (field === 'type' && value === 'None') {
      updatedRows[index].value = ''; // Clear the value when 'None' is selected
    }
  
    setFormRows(updatedRows);
  };

  const openAlertModal = (message) => {
    setAlertMessage(message);
    setIsAlertModalOpen(true);
  };

  const closeAlertModal = () => {
    setIsAlertModalOpen(false);
    // Reset title and formRows when closing the alert modal
    setTitle('');
    setFormRows([{ label: '', type: '%', value: '' }]); // Reset to the initial state
  };
  
  
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const isDuplicateTitle = configurations.some(
      (config) => config.title.toLowerCase() === title.toLowerCase()
    );
  
    if (isDuplicateTitle) {
      openAlertModal('A billing configuration with this title already exists.');
      return;
    }
  
    try {
      const billingConfigCollection = collection(rentmobileDb, 'billingconfig');
  
      const formattedData = { title };
      formRows.forEach((row, index) => {
        formattedData[`label${index + 1}`] = row.label;
        if (row.type !== 'None') {
          formattedData[`value${index + 1}`] = parseFloat(row.value) || 0; // Store as number
          formattedData[`type${index + 1}`] = row.type;
        }
      });
  
      await addDoc(billingConfigCollection, formattedData);
      setConfigurations([...configurations, formattedData]);
      openAlertModal('Billing configuration saved successfully!');
      closeModal();
    } catch (error) {
      console.error('Error saving billing configuration: ', error);
      openAlertModal('Failed to save billing configuration.');
    }
  };

  const handleUpdate = async () => {
    const isDuplicateTitle = configurations.some(
      (config) =>
        config.title.toLowerCase() === title.toLowerCase() &&
        config.id !== selectedConfig.id
    );
  
    if (isDuplicateTitle) {
      openAlertModal('A billing configuration with this title already exists.');
      return;
    }
  
    try {
      const configRef = doc(rentmobileDb, 'billingconfig', selectedConfig.id);
  
      const updatedData = { title };
      formRows.forEach((row, index) => {
        updatedData[`label${index + 1}`] = row.label;
        if (row.type !== 'None') {
          updatedData[`value${index + 1}`] = parseFloat(row.value) || 0; // Store as number
          updatedData[`type${index + 1}`] = row.type;
        } else {
          updatedData[`value${index + 1}`] = ''; // Clear value if 'None'
          updatedData[`type${index + 1}`] = '';
        }
      });
  
      await updateDoc(configRef, updatedData);
      setConfigurations(
        configurations.map((config) =>
          config.id === selectedConfig.id ? updatedData : config
        )
      );
      closeEditModal();
      openAlertModal('Billing configuration updated successfully!');
    } catch (error) {
      console.error('Error updating billing configuration: ', error);
      openAlertModal('Failed to update billing configuration.');
    }
  };


  const handleDelete = async (id) => {
    try {
      const configRef = doc(rentmobileDb, 'billingconfig', id);
      await deleteDoc(configRef);
      setConfigurations(configurations.filter(config => config.id !== id));
      openAlertModal('Billing configuration deleted successfully!');
    } catch (error) {
      console.error('Error deleting billing configuration: ', error);
      openAlertModal('Failed to delete billing configuration.');
    }
  };
  

  return (
    <BillingConfigurationContainer>
      <SideNav isSidebarOpen={isSidebarOpen} loggedInUser={loggedInUser} />
      <ToggleButton onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
        <FaBars />
      </ToggleButton>
      <MainContent isSidebarOpen={isSidebarOpen}>
        <AppBar>
          <h1>Billing Configuration</h1>
          <FaUserCircle size={30} />
        </AppBar>

        <CenteredContainer>
        <AddButton onClick={openModal}>+ Add Billing Configuration</AddButton>
        </CenteredContainer>

        <HorizontalLine />

        {configurations.map((config) => (
          <ConfigItem key={config.id}>
            <span>{config.title}</span>
            <div>
              <EditButton onClick={() => openEditModal(config)}>
                <FaEdit /> Edit
              </EditButton>
              <button onClick={() => handleDelete(config.id)} style={{ marginLeft: '10px', background: 'none', border: 'none', color: 'red', cursor: 'pointer' }}>
                <FaTrash /> Delete
              </button>
            </div>
          </ConfigItem>
        ))}

<Modal
      isOpen={isModalOpen}
      onRequestClose={closeModal}
      contentLabel="Add Billing Configuration"
      style={customModalStyles}
    >
      <ModalContent>
        <h2>Add Billing Configuration</h2>
        <TitleInput
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        {formRows.map((row, index) => (
          <FormRow key={index}>
            <input
              type="text"
              placeholder={`Label ${index + 1}`}
              value={row.label}
              onChange={(e) => handleInputChange(index, 'label', e.target.value)}
            />
            <input
              type="number"
              placeholder="Value"
              value={row.value}
              onChange={(e) => handleInputChange(index, 'value', e.target.value)}
            />
            <select
              value={row.type}
              onChange={(e) => handleInputChange(index, 'type', e.target.value)}
            >
              <option value="%">%</option>
              <option value="₱">₱</option>
              <option value="None">None</option>
            </select>
          </FormRow>
        ))}

        <ButtonGroup>
          <button className="add-btn" onClick={handleAddField}>Add Field</button>
          <button className="undo-btn" onClick={handleUndo}>Undo</button>
        </ButtonGroup>

        <SaveButton onClick={handleSubmit}>Save</SaveButton>
      </ModalContent>
    </Modal>


    <Modal
      isOpen={isEditModalOpen}
      onRequestClose={closeEditModal}
      contentLabel="Edit Billing Configuration"
      style={customModalStyles}
    >
      <ModalContent>
        <h2>Edit Billing Configuration</h2>
        <TitleInput
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        {formRows.map((row, index) => (
          <FormRow key={index}>
            <input
              type="text"
              placeholder={`Label ${index + 1}`}
              value={row.label}
              onChange={(e) => handleInputChange(index, 'label', e.target.value)}
            />
            <input
              type="number"
              placeholder="Value"
              value={row.value}
              onChange={(e) => handleInputChange(index, 'value', e.target.value)}
              disabled={row.type === 'None'} // Disable input if type is 'None'
            />
            <select
              value={row.type}
              onChange={(e) => handleInputChange(index, 'type', e.target.value)}
            >
              <option value="%">%</option>
              <option value="₱">₱</option>
              <option value="None">None</option>
            </select>
          </FormRow>
        ))}
        <SaveButton onClick={handleUpdate}>Update</SaveButton>
      </ModalContent>
    </Modal>

        <Modal isOpen={isAlertModalOpen} onRequestClose={closeAlertModal} style={customModalStyles}>
      <AlertModalContent>
        <h2>{alertMessage}</h2>
        <button onClick={closeAlertModal}>Close</button>
      </AlertModalContent>
    </Modal>


      </MainContent>
    </BillingConfigurationContainer>
  );
};

export default BillingConfiguration;