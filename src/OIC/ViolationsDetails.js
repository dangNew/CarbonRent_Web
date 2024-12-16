import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { Button } from '@mui/material';
import { FaEnvelope, FaBars, FaTimes, FaSearchPlus } from 'react-icons/fa';
import { collection, query, where, getDocs, doc, updateDoc } from 'firebase/firestore';
import { rentmobileDb } from '../components/firebase.config'; // Ensure you have this configuration
import SideNav from './side_nav'; // Import the SideNav component

const DashboardContainer = styled.div`
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
  padding: 40px 50px;
  background-color: #188423;
  color: white;
  font-size: 22px;
  font-family: 'Inter', sans-serif;
  font-weight: bold;
`;

const ToggleButton = styled.div`
  display: block;
  position: absolute;
  top: 5px;
  left: 15px;
  font-size: 1.8rem;
  color: #333;
  cursor: pointer;
  z-index: 200;
`;

const FormContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px; /* Space between the containers */
  margin-top: 1rem;
  padding: 0.5rem;
  border-radius: 10px;
  background-color: #f8f9fa;
  border: 1px solid #ddd;
  box-shadow: 5px 5px 5px rgba(0, 0, 0, 0.1);
`;

const DetailsContainer = styled.div`
  padding: 1rem;
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  margin: 1rem auto;
`;

const DetailsHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;

  h2 {
    margin: 0;
    font-size: 20px;
    color: #188423;
  }

  button {
    background-color: #188423;
    color: white;
    border: none;
    padding: 5px 10px;
    border-radius: 10px;
    cursor: pointer;
    font-size: 14px;
    transition: background-color 0.3s ease;

    &:hover {
      background-color: #146c1f;
    }
  }
`;

const DetailsContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  position: relative;

  p {
    margin: 0;
    font-size: 14px;
    color: #333;
  }

  img {
    max-width: 100%; /* Adjust the max-width */
    max-height: 200px; /* Adjust the max-height */
    border-radius: 10px;
    cursor: pointer;
  }

  .date-time {
    position: absolute;
    top: -55px;
    right: 0;
    font-size: 12px;
    color: #888;
  }
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 5px;
  margin-top: 1rem;

  button {
    background-color: #188423;
    color: white;
    border: none;
    padding: 5px 10px;
    border-radius: 10px;
    cursor: pointer;
    font-size: 14px;
    transition: background-color 0.3s ease;

    &:hover {
      background-color: #146c1f;
    }

    &:disabled {
      background-color: #ccc;
      cursor: not-allowed;
    }

    &.decline {
      background-color: red;

      &:hover {
        background-color: darkred;
      }

      &:disabled {
        background-color: #ffcccc;
        cursor: not-allowed;
      }
    }
  }
`;

const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;

  .modal-content {
    background-color: #fff;
    padding: 1rem;
    border-radius: 10px;
    text-align: center;

    h2 {
      margin: 0;
      font-size: 20px;
      color: #188423;
    }

    button {
      background-color: #188423;
      color: white;
      border: none;
      padding: 5px 10px;
      border-radius: 10px;
      cursor: pointer;
      font-size: 14px;
      transition: background-color 0.3s ease;

      &:hover {
        background-color: #146c1f;
      }
    }
  }
`;

const ImageModal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;

  .image-modal-content {
    max-width: 80%; /* Increase the max-width */
    max-height: 80%; /* Increase the max-height */
    border-radius: 10px;
    position: relative;

    img {
      width: 100%;
      height: 100%;
      border-radius: 10px;
      object-fit: contain; /* Ensure the image fits within the modal */
    }

    .close-button {
      position: absolute;
      top: 10px;
      right: 10px;
      background-color: rgba(0, 0, 0, 0.5);
      border: none;
      color: white;
      padding: 5px;
      border-radius: 50%;
      cursor: pointer;
      font-size: 20px;
      transition: background-color 0.3s ease;

      &:hover {
        background-color: rgba(0, 0, 0, 0.7);
      }
    }
  }
`;

const ViolationDetails = () => {
  const { vendorId } = useParams();
  const [violations, setViolations] = useState([]);
  const [messages, setMessages] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [showImageModal, setShowImageModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchViolationDetails = async () => {
      const violationCollection = collection(rentmobileDb, 'Market_violations');
      const q = query(violationCollection, where('vendorId', '==', vendorId));
      const querySnapshot = await getDocs(q);

      const data = querySnapshot.docs.map((doc) => {
        const date = doc.data().date ? doc.data().date.toDate().toLocaleString() : '';
        let penaltyDays = 0;
        let penaltyMonths = '';
        if (doc.data().warning === '1st Offense') {
          penaltyDays = 3 * 30; // 3 months
          penaltyMonths = '3 months';
        } else if (doc.data().warning === '2nd Offense') {
          penaltyDays = 5 * 30; // 5 months
          penaltyMonths = '5 months';
        }
        const violationPayment = doc.data().dailyPayment * penaltyDays;

        return {
          id: doc.id,
          vendorId: doc.data().vendorId,
          vendorName: doc.data().vendorName,
          stallNumber: doc.data().stallNo,
          violationType: doc.data().violationType,
          dateTime: date,
          imageUrls: [doc.data().image_0, doc.data().image_1, doc.data().image_2].filter(url => url),
          warning: doc.data().warning,
          stallLocation: doc.data().stallLocation,
          dailyPayment: doc.data().dailyPayment,
          status: doc.data().status,
          penaltyMonths: penaltyMonths,
          violationPayment: violationPayment,
        };
      });

      // Sort violations by warning level
      data.sort((a, b) => {
        const order = { '1st Offense': 1, '2nd Offense': 2, 'Final Offense': 3 };
        return order[a.warning] - order[b.warning];
      });

      setViolations(data);
    };

    fetchViolationDetails();
  }, [vendorId]);

  useEffect(() => {
    const fetchLoggedInUser = async () => {
      const userData = JSON.parse(localStorage.getItem('userData'));
      if (userData) {
        setLoggedInUser(userData);
      }
    };

    fetchLoggedInUser();
  }, []);

  const handleSendNotice = async (violationId) => {
    const docRef = doc(rentmobileDb, 'Market_violations', violationId);
    const updateData = {
      status: 'Pending', // Update status to Pending
      penaltyMonths: violations.find(v => v.id === violationId)?.penaltyMonths, // Store penaltyMonths
    };

    if (violations.find(v => v.id === violationId)?.warning === 'Final Offense') {
      updateData.message = messages[violationId];
    } else {
      updateData.violationPayment = violations.find(v => v.id === violationId)?.violationPayment;
    }

    await updateDoc(docRef, updateData);
    setShowModal(true); // Show the modal
    fetchViolationDetails(); // Re-fetch the violation details to reflect the changes
  };

  const handleDecline = async (violationId) => {
    const docRef = doc(rentmobileDb, 'Market_violations', violationId);
    await updateDoc(docRef, {
      status: 'Declined', // Update status to Declined
    });
    setShowModal(true); // Show the modal
    fetchViolationDetails(); // Re-fetch the violation details to reflect the changes
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleImageClick = (imageUrl) => {
    setShowImageModal(true);
    setSelectedImage(imageUrl);
  };

  const handleCloseImageModal = () => {
    setShowImageModal(false);
  };

  const fetchViolationDetails = async () => {
    const violationCollection = collection(rentmobileDb, 'Market_violations');
    const q = query(violationCollection, where('vendorId', '==', vendorId));
    const querySnapshot = await getDocs(q);

    const data = querySnapshot.docs.map((doc) => {
      const date = doc.data().date ? doc.data().date.toDate().toLocaleString() : '';
      let penaltyDays = 0;
      let penaltyMonths = '';
      if (doc.data().warning === '1st Offense') {
        penaltyDays = 3 * 30; // 3 months
        penaltyMonths = '3 months';
      } else if (doc.data().warning === '2nd Offense') {
        penaltyDays = 5 * 30; // 5 months
        penaltyMonths = '5 months';
      }
      const violationPayment = doc.data().dailyPayment * penaltyDays;

      return {
        id: doc.id,
        vendorId: doc.data().vendorId,
        vendorName: doc.data().vendorName,
        stallNumber: doc.data().stallNo,
        violationType: doc.data().violationType,
        dateTime: date,
        imageUrls: [doc.data().image_0, doc.data().image_1, doc.data().image_2].filter(url => url),
        warning: doc.data().warning,
        stallLocation: doc.data().stallLocation,
        dailyPayment: doc.data().dailyPayment,
        status: doc.data().status,
        penaltyMonths: penaltyMonths,
        violationPayment: violationPayment,
      };
    });

    // Sort violations by warning level
    data.sort((a, b) => {
      const order = { '1st Offense': 1, '2nd Offense': 2, 'Final Offense': 3 };
      return order[a.warning] - order[b.warning];
    });

    setViolations(data);
  };

  if (violations.length === 0) {
    return <div>Loading...</div>;
  }

  const filteredViolations = violations.filter(violation => violation.status === 'To be Reviewed');

  return (
    <DashboardContainer>
      <SideNav isSidebarOpen={isSidebarOpen} loggedInUser={loggedInUser} />
      <ToggleButton onClick={toggleSidebar}>
        <FaBars />
      </ToggleButton>
      <MainContent isSidebarOpen={isSidebarOpen}>
        <AppBar>
          <ToggleButton onClick={toggleSidebar}>
            <FaBars />
          </ToggleButton>
          <div>{loggedInUser?.name || 'Violation Details'}</div>
          <Button onClick={() => navigate(-1)} sx={{ color: 'white' }}>
            Back
          </Button>
        </AppBar>

        <FormContainer>
          {filteredViolations.map((violation) => (
            <DetailsContainer key={violation.id}>
              <DetailsHeader>
                <h2>{violation.warning}</h2>
              </DetailsHeader>
              <DetailsContent>
                <div className="date-time">{violation.dateTime}</div>
                <p><strong>Vendor Name:</strong> {violation.vendorName}</p>
                <p><strong>Stall Number:</strong> {violation.stallNumber}</p>
                <p><strong>Violation Type:</strong> {violation.violationType}</p>
                <p><strong>Stall Location:</strong> {violation.stallLocation}</p>
                <p><strong>Daily Payment:</strong> {violation.dailyPayment}</p>
                {violation.warning !== 'Final Offense' && (
                  <>
                    <p><strong>Violation Payment:</strong> {violation.violationPayment}</p>
                    <p><strong>Penalty Months:</strong> {violation.penaltyMonths}</p>
                  </>
                )}
                {violation.status === 'Declined' && <p style={{ color: 'red' }}><strong>Status:</strong> Declined</p>}
                {violation.status === 'Settled' && <p style={{ color: 'green' }}><strong>Status:</strong> Settled</p>}
                {violation.imageUrls.map((imageUrl, index) => (
                  imageUrl && (
                    <div key={index} style={{ position: 'relative' }}>
                      <img src={imageUrl} alt={`Violation ${index}`} onClick={() => handleImageClick(imageUrl)} />
                      <button style={{ position: 'absolute', top: '10px', right: '10px', background: 'rgba(0, 0, 0, 0.5)', border: 'none', color: 'white', padding: '5px', borderRadius: '50%', cursor: 'pointer' }} onClick={() => handleImageClick(imageUrl)}>
                        <FaSearchPlus />
                      </button>
                    </div>
                  )
                ))}
                {violation.warning === 'Final Offense' && (
                  <textarea
                    placeholder="Enter your message"
                    value={messages[violation.id] || ''}
                    onChange={(e) => setMessages({ ...messages, [violation.id]: e.target.value })}
                  />
                )}
              </DetailsContent>
              <ActionButtons>
                <button onClick={() => handleSendNotice(violation.id)} disabled={violation.status === 'Declined' || violation.status === 'Settled'}>
                  <FaEnvelope style={{ marginRight: '5px' }} /> Send Notice
                </button>
                <button className="decline" onClick={() => handleDecline(violation.id)} disabled={violation.status === 'Declined' || violation.status === 'Settled'}>
                  <FaTimes style={{ marginRight: '5px' }} /> Decline
                </button>
              </ActionButtons>
            </DetailsContainer>
          ))}
          {showModal && (
            <Modal>
              <div className="modal-content">
                <h2>Violation successfully sent</h2>
                <button onClick={handleCloseModal}>OK</button>
              </div>
            </Modal>
          )}
          {showImageModal && (
            <ImageModal>
              <div className="image-modal-content">
                <img src={selectedImage} alt="Violation" />
                <button className="close-button" onClick={handleCloseImageModal}>
                  <FaTimes />
                </button>
              </div>
            </ImageModal>
          )}
        </FormContainer>
      </MainContent>
    </DashboardContainer>
  );
};

export default ViolationDetails;
