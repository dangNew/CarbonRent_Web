import React, { useState, useEffect } from 'react';
import { collection, getDocs, updateDoc, doc } from 'firebase/firestore';
import { rentmobileDb } from '../components/firebase.config';
import styled from 'styled-components';
import { FaBars } from 'react-icons/fa';
import SideNav from './side_nav';

// Styled Components
const CompromiseRequestsContainer = styled.div`
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

const RequestList = styled.div`
  margin-top: 20px;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  background-color: #fff;
`;

const RequestItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  border-bottom: 1px solid #ccc;
`;

const RequestDetails = styled.div`
  flex: 1;
`;

const RequestActions = styled.div`
  display: flex;
  gap: 10px;
`;

const ActionButton = styled.button`
  padding: 10px 15px;
  background-color: ${({ type }) => (type === 'accept' ? '#188423' : '#ff0000')};
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  &:hover {
    background-color: ${({ type }) => (type === 'accept' ? '#0e5e14' : '#cc0000')};
  }
`;

const CompromiseRequests = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const requestsCollectionRef = collection(rentmobileDb, 'compromise_requests');
        const snapshot = await getDocs(requestsCollectionRef);
        const fetchedRequests = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setRequests(fetchedRequests);
      } catch (error) {
        console.error('Error fetching requests:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleAccept = async (requestId) => {
    try {
      const requestDocRef = doc(rentmobileDb, 'compromise_requests', requestId);
      await updateDoc(requestDocRef, {
        status: 'Accepted'
      });

      // Update the vendor's payment details in Firestore
      const vendorId = requests.find(request => request.id === requestId).vendorId;
      const vendorDocRef = doc(rentmobileDb, 'approvedVendors', vendorId);
      const vendorDoc = await getDocs(vendorDocRef);
      const vendorData = vendorDoc.data();

      const totalBalance = vendorData.totalBalance;
      const compromiseAmount = totalBalance * 0.25;

      await updateDoc(vendorDocRef, {
        totalBalance: compromiseAmount
      });

      setRequests(requests.map(request =>
        request.id === requestId ? { ...request, status: 'Accepted' } : request
      ));
    } catch (error) {
      console.error('Error accepting request:', error);
    }
  };

  const handleReject = async (requestId) => {
    try {
      const requestDocRef = doc(rentmobileDb, 'compromise_requests', requestId);
      await updateDoc(requestDocRef, {
        status: 'Rejected'
      });

      setRequests(requests.map(request =>
        request.id === requestId ? { ...request, status: 'Rejected' } : request
      ));
    } catch (error) {
      console.error('Error rejecting request:', error);
    }
  };

  return (
    <CompromiseRequestsContainer>
      <SideNav isSidebarOpen={isSidebarOpen} />
      <ToggleButton onClick={toggleSidebar}>
        <FaBars />
      </ToggleButton>
      <MainContent isSidebarOpen={isSidebarOpen}>
        <AppBar>
          <h1>Compromise Payment Requests</h1>
        </AppBar>
        <RequestList>
          {loading ? (
            <p>Loading requests...</p>
          ) : requests.length === 0 ? (
            <p>No requests found.</p>
          ) : (
            requests.map(request => (
              <RequestItem key={request.id}>
                <RequestDetails>
                  <p><strong>Vendor ID:</strong> {request.vendorId}</p>
                  <p><strong>Reason:</strong> {request.reason}</p>
                  <p><strong>Status:</strong> {request.status}</p>
                </RequestDetails>
                <RequestActions>
                  <ActionButton type="accept" onClick={() => handleAccept(request.id)}>
                    Accept
                  </ActionButton>
                  <ActionButton type="reject" onClick={() => handleReject(request.id)}>
                    Reject
                  </ActionButton>
                </RequestActions>
              </RequestItem>
            ))
          )}
        </RequestList>
      </MainContent>
    </CompromiseRequestsContainer>
  );
};

export default CompromiseRequests;

