import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { addDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { rentmobileDb } from '../components/firebase.config';
import styled from 'styled-components';
import { FaBars } from 'react-icons/fa';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserCircle } from '@fortawesome/free-solid-svg-icons';
import SideNav from './side_nav';

// Styled Components
const AddNewStallContainer = styled.div`
  display: flex;
  height: 100vh;
  background-color: #f4f5f7;
`;

const MainContent = styled.div`
  margin-left: ${({ isSidebarOpen }) => (isSidebarOpen ? '230px' : '70px')};
  padding-left: 40px;
  background-color: #fff;
  padding: 2rem;
  width: 100%;
  transition: margin-left 0.3s ease;
  overflow-y: auto;

  & > *:not(:first-child) {
    margin-top: 20px;
  }
`;

const AppBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 5px 10px;
  background-color: #188423;
  color: white;
  font-size: 22px;
  font-family: 'Inter', sans-serif;
  font-weight: bold;
`;

const ToggleButton = styled.div`
  display: ${({ isSidebarOpen }) => (isSidebarOpen ? 'none' : 'block')};
  position: absolute;
  top: 5px;
  left: 15px;
  font-size: 1.8rem;
  color: #333;
  cursor: pointer;
  z-index: 200;
`;

const FormContainer = styled.div`
  margin-top: 20px;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  background-color: #fff;
`;

const ErrorText = styled.p`
  color: red;
  margin: 10px 0;
`;

const StyledInput = styled.input`
  padding: 12px 15px;
  margin: 10px 0;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 16px;
  width: 100%;
  &:focus {
    border-color: #188423;
    outline: none;
  }
`;

const StyledSelect = styled.select`
  padding: 12px 15px;
  margin: 10px 0;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 16px;
  width: 100%;
  &:focus {
    border-color: #188423;
    outline: none;
  }
`;

const StyledButton = styled.button`
  padding: 12px 15px;
  background-color: #188423;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  &:hover {
    background-color: #0e5e14;
  }
`;

// Modal Component
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background-color: #fff;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
  width: 400px;
  text-align: center;
`;

const ModalButton = styled.button`
  margin-top: 1rem;
  padding: 10px 20px;
  background-color: #188423;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
  &:hover {
    background-color: #0e5e14;
  }
`;

// Main Component
const AddNewStall = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [locations, setLocations] = useState([]);
  const [location, setLocation] = useState('');
  const [stallNumber, setStallNumber] = useState('');
  const [stallSize, setStallSize] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal state
  const navigate = useNavigate();

  useEffect(() => {
    const loggedInUserData = JSON.parse(localStorage.getItem('userData'));
    if (loggedInUserData) {
      setLoggedInUser(loggedInUserData);
    }

    const fetchLocations = async () => {
      try {
        const locationsCollectionRef = collection(rentmobileDb, 'unit');
        const snapshot = await getDocs(locationsCollectionRef);
        const fetchedLocations = snapshot.docs.map(doc => doc.data().name);
        setLocations(fetchedLocations);
      } catch (error) {
        console.error('Error fetching locations:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLocations();
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleStallSizeChange = (e) => {
    const value = e.target.value;
    if (/^\d*\.?\d*$/.test(value)) {
      setStallSize(value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const numericStallSize = parseFloat(stallSize.trim());

    try {
      const stallsCollectionRef = collection(rentmobileDb, 'Stall');
      const q = query(
        stallsCollectionRef,
        where('stallNumber', '==', stallNumber),
        where('location', '==', location)
      );
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        setError('Stall number already exists in this location.');
        return;
      }

      await addDoc(stallsCollectionRef, {
        location,
        stallNumber,
        stallSize: numericStallSize,
        status: 'Available'
      });

      setLocation('');
      setStallNumber('');
      setStallSize('');
      setError('');
      setIsModalOpen(true); // Show modal on success
    } catch (error) {
      console.error('Error adding document: ', error);
      setError('Error submitting form: ' + error.message);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    navigate(0); // Refresh the current page
  };

  return (
    <AddNewStallContainer>
      <SideNav isSidebarOpen={isSidebarOpen} loggedInUser={loggedInUser} />
      <ToggleButton onClick={toggleSidebar}>
        <FaBars />
      </ToggleButton>
      <MainContent isSidebarOpen={isSidebarOpen}>
        <AppBar>
          <h1>Add New Stall</h1>
          <div>
            <FontAwesomeIcon icon={faUserCircle} />
          </div>
        </AppBar>
        <FormContainer>
          <form onSubmit={handleSubmit}>
            <StyledInput
              type="text"
              placeholder="Stall Number"
              value={stallNumber}
              onChange={(e) => setStallNumber(e.target.value)}
              required
            />
            <StyledInput
              type="text"
              placeholder="Stall Size (Meter)"
              value={stallSize}
              onChange={handleStallSizeChange}
              required
            />
            <StyledSelect
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              required
            >
              <option value="" disabled>Select Location</option>
              {loading ? (
                <option disabled>Loading locations...</option>
              ) : (
                locations.map((loc, index) => (
                  <option key={index} value={loc}>{loc}</option>
                ))
              )}
            </StyledSelect>
            {error && <ErrorText>{error}</ErrorText>}
            <StyledButton type="submit">Add Stall</StyledButton>
          </form>
        </FormContainer>

        {isModalOpen && (
          <ModalOverlay>
            <ModalContent>
              <h2>Stall added successfully!</h2>
              <ModalButton onClick={closeModal}>OK</ModalButton>
            </ModalContent>
          </ModalOverlay>
        )}
      </MainContent>
    </AddNewStallContainer>
  );
};

export default AddNewStall;
