import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { rentmobileDb } from '../components/firebase.config';
import { Button, Modal, Box, Menu, MenuItem } from '@mui/material';
import styled from 'styled-components';
import SideNav from './side_nav';
import { FaBars, FaSearch, FaFilter, FaEye } from 'react-icons/fa';

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

const FilterDropdown = ({ options, onFilterChange, label, iconColor }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleFilter = (filter) => {
    onFilterChange(filter);
    handleClose();
  };

  return (
    <div>
      <Button
        aria-controls="filter-menu"
        aria-haspopup="true"
        onClick={handleClick}
        sx={{ color: 'white', backgroundColor: iconColor, '&:hover': { backgroundColor: iconColor } }}
      >
        <FaFilter style={{ marginRight: '5px' }} /> {label}
      </Button>
      <Menu
        id="filter-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
      >
        {options.map((option, index) => (
          <MenuItem key={index} onClick={() => handleFilter(option.value)}>
            {option.label}
          </MenuItem>
        ))}
      </Menu>
    </div>
  );
};

const PaidSettledButton = styled.button`
  background-color: green;
  color: white;
  border: none;
  padding: 6px 14px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  transition: background-color 0.2s ease;
  display: flex;
  align-items: center;

  &:hover {
    background-color: #0056b3; /* Dark blue color on hover */
  }

  svg {
    margin-right: 8px;
  }
`;

const ViolationPaidSettled = () => {
  const { vendorId } = useParams();
  const [violations, setViolations] = useState([]);
  const [filteredViolations, setFilteredViolations] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [filterStatus, setFilterStatus] = useState('All');
  const [filterWarning, setFilterWarning] = useState('All');
  const [openModal, setOpenModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState('');
  const navigate = useNavigate();

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleSearch = (term) => {
    let filtered = violations.filter(violation =>
      (violation.warning?.toLowerCase().includes(term.toLowerCase()) ||
      violation.violationType?.toLowerCase().includes(term.toLowerCase()) ||
      violation.message?.toLowerCase().includes(term.toLowerCase()))
    );

    if (filterStatus !== 'All') {
      filtered = filtered.filter(violation => violation.status === filterStatus);
    }

    if (filterWarning !== 'All') {
      filtered = filtered.filter(violation => violation.warning === filterWarning);
    }

    setFilteredViolations(filtered);
  };

  const handleFilterStatus = (status) => {
    setFilterStatus(status);
  };

  const handleFilterWarning = (warning) => {
    setFilterWarning(warning);
  };

  const handleOpenModal = (imageUrl) => {
    setSelectedImage(imageUrl);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
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
    const fetchViolations = async () => {
      try {
        const violationCollection = collection(rentmobileDb, 'Market_violations');
        const q = query(violationCollection, where('vendorId', '==', vendorId));
        const querySnapshot = await getDocs(q);
        const violations = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        const filtered = violations.filter(v => v.status === 'paid' || v.status === 'Settled');
        setViolations(filtered);
        setFilteredViolations(filtered.filter(v => (v.status === filterStatus || filterStatus === 'All') && (v.warning === filterWarning || filterWarning === 'All')));
      } catch (error) {
        console.error('Error fetching violations:', error);
      }
    };

    fetchViolations();
  }, [vendorId, filterStatus, filterWarning]);

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
          <div>Paid & Settled Violations</div>
          <Button onClick={() => navigate(-1)} sx={{ color: 'white' }}>
            Back
          </Button>
        </AppBar>
        <SummaryContainer>
          <ControlsContainer>
            <p>{filteredViolations.length} Violations</p>
            <SearchBar onSearch={handleSearch} />
            <FilterDropdown
              options={[
                { label: 'All', value: 'All' },
                { label: 'Paid', value: 'paid' },
                { label: 'Settled', value: 'Settled' }
              ]}
              onFilterChange={handleFilterStatus}
              label="Status"
              iconColor="#f44336"
            />
            <FilterDropdown
              options={[
                { label: 'All', value: 'All' },
                { label: '1st Offense', value: '1st Offense' },
                { label: '2nd Offense', value: '2nd Offense' },
                { label: 'Final Offense', value: 'Final Offense' }
              ]}
              onFilterChange={handleFilterWarning}
              label="Warning"
              iconColor="#ff9800"
            />
          </ControlsContainer>
        </SummaryContainer>
        <TableContainer>
          <table>
            <thead>
              <tr>
                <th>Warning</th>
                <th>Violation Type</th>
                <th>Daily Payment</th>
                <th>Date</th>
                <th>Violation Payment</th>
                <th>Status</th>
                <th>Message</th>
                <th>Image</th>
              </tr>
            </thead>
            <tbody>
              {filteredViolations.map((violation) => (
                <tr key={violation.id}>
                  <td>{violation.warning}</td>
                  <td>{violation.violationType}</td>
                  <td>{violation.dailyPayment}</td>
                  <td>{new Date(violation.date?.seconds * 1000).toLocaleString()}</td>
                  <td>{violation.violationPayment}</td>
                  <td>{violation.status}</td>
                  <td>{violation.message}</td>
                  <td>
                    <PaidSettledButton onClick={() => handleOpenModal(violation.image_0)}>
                      <FaEye /> View Image
                    </PaidSettledButton>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </TableContainer>
        <Modal open={openModal} onClose={handleCloseModal}>
          <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', bgcolor: 'background.paper', boxShadow: 24, p: 4 }}>
            <img src={selectedImage} alt="Violation" style={{ width: '100%' }} />
          </Box>
        </Modal>
      </MainContent>
    </DashboardContainer>
  );
};

export default ViolationPaidSettled;
