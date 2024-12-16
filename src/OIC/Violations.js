import React, { useState, useEffect } from 'react';
import { FaSearch, FaBars, FaEye, FaExclamationTriangle } from 'react-icons/fa';
import styled from 'styled-components';
import SideNav from './side_nav';
import { useNavigate } from 'react-router-dom';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { rentmobileDb } from '../components/firebase.config'; // Ensure you have this configuration

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

const TableContainer = styled.div`
  width: 100%;
  overflow-x: auto;
  margin-top: 20px;

  table {
    width: 100%;
    border-collapse: collapse;
    font-size: 14px;

    th, td {
      padding: 15px;
      text-align: left;
      border-bottom: 2px solid #dee2e6;
    }

    th {
      background-color: #e9ecef;
    }

    tr:nth-child(even) {
      background-color: #f2f2f2;
    }

    tr:nth-child(odd) {
      background-color: #ffffff;
    }

    .actions {
      display: flex;
      gap: 5px;
    }

    .action-button {
      display: flex;
      align-items: center;
      border: none;
      background: none;
      cursor: pointer;
      transition: color 0.2s ease;

      &:hover {
        color: #0056b3;
      }

      .icon {
        font-size: 24px;
        color: black;
      }
    }
  }
`;

const SummaryContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 30px;

  h3 {
    margin: 0;
    font-size: 22px;
    font-weight: bold;
    color: #188423;
  }

  p {
    margin: 0;
    color: #888;
    font-size: 18px;
    margin-right: 5px;
  }
`;

const ControlsContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-left: auto;
`;

const SearchBarContainer = styled.div`
  display: flex;
  align-items: center;
  padding: 10px;
  background-color: #e9ecef;
  border-radius: 20px;
  width: 250px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const SearchInput = styled.input`
  border: none;
  background: none;
  outline: none;
  margin-left: 10px;
  width: calc(100% - 30px);
  font-size: 16px;
  color: #333;
`;

const ReviewButton = styled.button`
  background-color: ${({ hasViolation }) => (hasViolation ? '#ff4d4d' : '#ddd')};
  color: white;
  border: none;
  padding: 6px 14px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: ${({ hasViolation }) => (hasViolation ? '#e63939' : '#ccc')}; /* Red color on hover */
  }
`;

const PendingButton = styled.button`
  background-color: ${({ hasPending }) => (hasPending ? '#ff4d4d' : '#ddd')};
  color: white;
  border: none;
  padding: 6px 14px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: ${({ hasPending }) => (hasPending ? '#e63939' : '#ccc')}; /* Red color on hover */
  }
`;

const SearchBar = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
    if (onSearch) {
      onSearch(event.target.value);
    }
  };

  return (
    <SearchBarContainer>
      <FaSearch color="#333" />
      <SearchInput
        type="text"
        placeholder="Search..."
        value={searchTerm}
        onChange={handleSearch}
      />
    </SearchBarContainer>
  );
};

const AddVendorButton = styled.button`
  background-color: blue;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 15px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #146c1f;
  }
`;

const FormContainer = styled.div`
  margin-top: 2rem;
  padding: 1rem;
  border-radius: 20px;
  background-color: #f8f9fa;
  border: 1px solid #ddd;
  box-shadow: 10px 10px 10px rgba(0, 0, 0, 0.1);

  h3 {
    margin-bottom: 1rem;
  }

  table {
    width: 100%;
    border-collapse: collapse;
    font-size: 12px;

    th, td {
      padding: 10px;
      text-align: left;
      border-bottom: 2px solid #dee2e6;
    }

    th {
      background-color: #e9ecef;
      color: #333;
      font-weight: bold;
    }

    tr:nth-child(even) {
      background-color: #f2f2f2;
    }

    tr:nth-child(odd) {
      background-color: #ffffff;
    }

    tr:hover {
      background-color: #f1f3f5;
    }

    .actions {
      display: flex;
      gap: 5px; /* Space between the buttons */
    }

    .action-button {
      display: flex;
      align-items: center;
      border: none;
      background: none;
      cursor: pointer;
      transition: color 0.2s ease;

      &:hover {
        color: #0056b3; /* Darken on hover */
      }

      .icon {
        font-size: 24px; /* Increase icon size */
        color: black;
      }
    }
  }
`;

const ViewButton = styled.button`
  background-color: #28a745;
  color: white;
  border: none;
  padding: 6px 14px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: #0056b3; /* Blue color on hover */
  }
`;

const PaidSettledButton = styled.button`
  background-color: green;
  color: white;
  border: none;
  padding: 6px 14px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: #0056b3; /* Dark blue color on hover */
  }
`;

const ViolationReports = () => {
  const [violations, setViolations] = useState([]);
  const [filteredViolations, setFilteredViolations] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [loggedInUser, setLoggedInUser] = useState(null);
  const navigate = useNavigate();

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
    const filtered = violations.filter(violation =>
      (violation.vendorName.toLowerCase().includes(term.toLowerCase()) ||
      violation.stallNumber.includes(term) ||
      violation.violationType.toLowerCase().includes(term.toLowerCase()))
    );
    setFilteredViolations(filtered);
  };

  const handleViewDetails = (vendorId) => {
    navigate(`/violation-details/${vendorId}`);
  };

  const handleViewReports = () => {
    navigate('/violation-reports');
  };

  const handleViewPending = (vendorId) => {
    navigate(`/violation-pending/${vendorId}`);
  };

  const handleViewPaidSettled = (vendorId) => {
    navigate(`/violation-paid-settled/${vendorId}`);
  };

  useEffect(() => {
    const fetchLoggedInUser = async () => {
      const userData = JSON.parse(localStorage.getItem('userData'));
      if (userData) {
        setLoggedInUser(userData);
      }
    };

    fetchLoggedInUser();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const querySnapshot = await getDocs(collection(rentmobileDb, 'approvedVendors'));
      const data = querySnapshot.docs.map((doc) => {
        const stallInfo = doc.data().stallInfo || {};
        const dateOfRegistration = doc.data().dateOfRegistration
          ? doc.data().dateOfRegistration.toDate().toLocaleDateString()
          : '';

        return {
          id: doc.id,
          stallNumber: stallInfo.stallNumber || '',
          firstName: doc.data().firstName || '',
          lastName: doc.data().lastName || '',
          location: stallInfo.location || '',
          areaMeters: stallInfo.stallSize || '',
          billing: stallInfo.ratePerMeter || '',
          date: dateOfRegistration,
          approvedBy: doc.data().approvedBy || '',
          contactNumber: doc.data().contactNumber || '',
          email: doc.data().email || '',
        };
      });

      const checkViolation = async (vendorId) => {
        try {
          const violationCollection = collection(rentmobileDb, 'Market_violations');
          const q = query(violationCollection, where('vendorId', '==', vendorId), where('stallLocation', '==', loggedInUser.location));
          const querySnapshot = await getDocs(q);
          const violations = querySnapshot.docs.map(doc => ({
            id: doc.id,
            status: doc.data().status,
          }));
          return violations;
        } catch (error) {
          console.error('Error checking violation:', error);
          return [];
        }
      };

      const dataWithChecks = await Promise.all(
        data.map(async (stall) => {
          const violations = await checkViolation(stall.id);
          const hasPending = violations.some(violation => violation.status === 'Pending');
          const hasToBeReviewed = violations.some(violation => violation.status === 'To be Reviewed');
          return { ...stall, violations, hasPending, hasToBeReviewed };
        })
      );

      // Filter out vendors without violations
      const vendorsWithViolations = dataWithChecks.filter(stall => stall.violations.length > 0);

      setViolations(vendorsWithViolations);
      setFilteredViolations(vendorsWithViolations);
    };

    if (loggedInUser) {
      fetchData();
    }
  }, [loggedInUser]);

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
          <div>Manage Violations</div>
        </AppBar>
        <SummaryContainer>
          <ControlsContainer>
            <p>{filteredViolations.length} Violations</p>
            <SearchBar onSearch={handleSearch} />
          </ControlsContainer>
        </SummaryContainer>

        <FormContainer>
          <table>
            <thead>
              <tr>
                <th>Stall No.</th>
                <th>Stall Holder</th>
                <th>Email</th>
                <th>To be Reviewed</th>
                <th>Pending</th>
                <th className="actions">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredViolations.map((stall, index) => (
                <tr key={index}>
                  <td>{stall.stallNumber}</td>
                  <td>{stall.firstName} {stall.lastName}</td>
                  <td>{stall.email}</td>
                  <td>
                    {stall.hasToBeReviewed ? (
                      <ReviewButton hasViolation={true} onClick={() => handleViewDetails(stall.id)}>
                        <FaExclamationTriangle style={{ marginRight: '6px' }} /> {/* Add the icon */}
                        To be Reviewed ({stall.violations.filter(v => v.status === 'To be Reviewed').length})
                      </ReviewButton>
                    ) : (
                      'No Violation'
                    )}
                  </td>
                  <td>
                    {stall.hasPending ? (
                      <PendingButton hasPending={true} onClick={() => handleViewPending(stall.id)}>
                        <FaExclamationTriangle style={{ marginRight: '6px' }} /> {/* Add the icon */}
                        Pending ({stall.violations.filter(v => v.status === 'Pending').length})
                      </PendingButton>
                    ) : (
                      'No Pending'
                    )}
                  </td>
                  <td className="actions">

                    <PaidSettledButton onClick={() => handleViewPaidSettled(stall.id)}>
                      <FaEye /> View Paid & Settled
                    </PaidSettledButton>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </FormContainer>
      </MainContent>
    </DashboardContainer>
  );
};

export default ViolationReports;