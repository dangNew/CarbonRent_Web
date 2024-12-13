import React, { useState, useEffect } from 'react';
import { FaBars, FaSearch, FaFilter } from 'react-icons/fa';
import styled from 'styled-components';
import SideNav from './side_nav';
import { useNavigate } from 'react-router-dom';
import { Button, Menu, MenuItem } from '@mui/material';
import { collection, getDocs } from 'firebase/firestore';
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

const ViolationReportsPage = () => {
  const [violations, setViolations] = useState([]);
  const [filteredViolations, setFilteredViolations] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [filterStatus, setFilterStatus] = useState('All');
  const [filterWarning, setFilterWarning] = useState('All');
  const navigate = useNavigate();

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleSearch = (term) => {
    const filtered = violations.filter(violation =>
      (violation.vendorName.toLowerCase().includes(term.toLowerCase()) ||
      violation.violationType.toLowerCase().includes(term.toLowerCase()) ||
      violation.warning.toLowerCase().includes(term.toLowerCase()))
    );
    setFilteredViolations(filtered);
  };

  const handleFilterStatus = (status) => {
    setFilterStatus(status);
  };

  const handleFilterWarning = (warning) => {
    setFilterWarning(warning);
  };

  useEffect(() => {
    applyFilters();
  }, [filterStatus, filterWarning]);

  const applyFilters = () => {
    let filtered = violations;
    if (filterStatus !== 'All') {
      filtered = filtered.filter(violation => violation.status === filterStatus);
    }
    if (filterWarning !== 'All') {
      filtered = filtered.filter(violation => violation.warning === filterWarning);
    }
    setFilteredViolations(filtered);
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
      const querySnapshot = await getDocs(collection(rentmobileDb, 'Market_violations'));
      const data = querySnapshot.docs.map((doc) => {
        return {
          id: doc.id,
          vendorName: doc.data().vendorName,
          dailyPayment: doc.data().dailyPayment,
          violationType: doc.data().violationType,
          warning: doc.data().warning,
          status: doc.data().status,
          violationPayment: doc.data().violationPayment, // Add violationPayment field
          message: doc.data().message, // Add message field
        };
      });
      const filteredData = data.filter(violation => violation.message || violation.violationPayment);
      setViolations(filteredData);
      setFilteredViolations(filteredData);
    };

    fetchData();
  }, []);

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
          <div>Violation Reports</div>
          <Button onClick={() => navigate(-1)} sx={{ color: 'white' }}>
            Back
          </Button>
        </AppBar>
        <SummaryContainer>
          <ControlsContainer>
            <p>{filteredViolations.length} Violators</p>
            <SearchBar onSearch={handleSearch} />
            <FilterDropdown
              options={[
                { label: 'All', value: 'All' },
                { label: 'Paid', value: 'Paid' },
                { label: 'Pending', value: 'Pending' }
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
                <th>Vendor Name</th>
                <th>Daily Payment</th>
                <th>Violation Type</th>
                <th>Warning</th>
                <th>Violation Payment</th>
                <th>Status</th>
                <th>Message</th>
              </tr>
            </thead>
            <tbody>
              {filteredViolations.map((violation) => (
                <tr key={violation.id}>
                  <td>{violation.vendorName}</td>
                  <td>{violation.dailyPayment}</td>
                  <td>{violation.violationType}</td>
                  <td>{violation.warning}</td>
                  <td>{violation.violationPayment}</td>
                  <td>{violation.status}</td>
                  <td>{violation.message}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </TableContainer>
      </MainContent>
    </DashboardContainer>
  );
};

export default ViolationReportsPage;
