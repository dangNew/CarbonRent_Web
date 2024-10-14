import React, { useState, useEffect, useRef } from 'react';
import { Link,  useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { FaBars, FaSearch, FaUserCircle, FaSignOutAlt,} from 'react-icons/fa';
import { faHome, faShoppingCart, faUser, faSearch, faPlus, faUsers, faFileContract, faCog, faTicketAlt, faCheck} from '@fortawesome/free-solid-svg-icons';


const DashboardContainer = styled.div`
  display: flex;
  height: 100vh;
  background-color: #f4f5f7;
`;

const Sidebar = styled.div`
  width: ${({ isSidebarOpen }) => (isSidebarOpen ? '230px' : '60px')};
  background-color: #f8f9fa;
  padding: 10px;
  display: flex;
  border: 1px solid #ddd;  /* ADD THIS */
  flex-direction: column;
  justify-content: space-between;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  transition: width 0.3s ease;
  position: fixed;
  height: 100vh;
  z-index: 100;
   overflow-y: auto;
`;

const SidebarMenu = styled.ul`
  list-style-type: none;
  padding: 0;
  margin: 0;
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const SidebarItem = styled.li`
  display: flex;
  align-items: center;
  justify-content: ${({ isSidebarOpen }) => (isSidebarOpen ? 'flex-start' : 'center')};
  padding: 10px;
  margin-bottom: 10px;
  margin-top: -10px;
  border-radius: 8px;
  font-size: 14px;
  color: ${({ active }) => (active ? 'white' : '#333')};
  background-color: ${({ active }) => (active ? '#007bff' : 'transparent')};
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: ${({ active }) => (active ? '#007bff' : '#f1f3f5')};
  }

  .icon {
    font-size: 1rem;  /* Increase the icon size */
    color: #000;
    transition: margin-left 0.2s ease;
  }

  span:last-child {
    margin-left: 10px;
    display: ${({ isSidebarOpen }) => (isSidebarOpen ? 'inline' : 'none')};
  }
`;


const SidebarFooter = styled.div`
  padding: 10px;
  margin-top: auto; /* Pushes the footer to the bottom */
  display: flex;
  align-items: center;
  justify-content: ${({ isSidebarOpen }) => (isSidebarOpen ? 'flex-start' : 'center')};
`;

const LogoutButton = styled(SidebarItem)`
  margin-top: 5px; /* Add some margin */
  background-color: #dc3545; /* Bootstrap danger color */
  color: white;
  align-items: center;
  margin-left: 20px;
  padding: 5px 15px; /* Add padding for a better button size */
  border-radius: 5px; /* Rounded corners */
  font-weight: bold; /* Make text bold */
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2); /* Subtle shadow for depth */
  transition: background-color 0.3s ease, transform 0.2s ease; /* Smooth transitions */

  &:hover {
    background-color: #c82333; /* Darker red on hover */
    transform: scale(1.05); /* Slightly scale up on hover */
  }
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

const MainContent = styled.div`
  margin-left: ${({ isSidebarOpen }) => (isSidebarOpen ? '230px' : '70px')};
  padding-left: 40px;
  background-color: #fff;
  padding: 2rem;
  width: 100%;
  transition: margin-left 0.3s ease;
  overflow-y: auto;
`;

const ProfileHeader = styled.div`
  display: flex;
  align-items: center;
  padding: 40px 10px;
  position: relative;
  flex-direction: column;

  .profile-icon {
    font-size: 3rem;
    margin-bottom: 15px;
    color: #6c757d; // Subtle color for icon
  }

  .profile-name {
    font-size: 1.2rem;
    font-weight: 700; // Bolder text
    color: black; // Darker gray for a professional look
    display: ${({ isSidebarOpen }) => (isSidebarOpen ? 'block' : 'none')};
  }

  hr {
    width: 100%;
    border: 0.5px solid #ccc;
    margin-top: 15px;
  }

  .profile-position {
    font-size: 1rem; /* Increase the font size */
    font-weight: 600; /* Make it bold */
    color: #007bff; /* Change color to blue for better visibility */
    display: ${({ isSidebarOpen }) => (isSidebarOpen ? 'block' : 'none')};
    margin-top: 5px; /* Add some margin for spacing */
  }
`;


const ProfileImage = styled.img`
  border-radius: 50%;
  width: 60px; /* Adjusted for better visibility */
  height: 60px;
  margin-bottom: 15px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); // Subtle shadow for a polished look
`;

const AppBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 40px 50px;
  background-color: #188423; /* Updated color */
  color: white;
  box-shadow: 0 10px 10px rgba(0, 0, 0, 0.1);
  font-size: 22px;
  font-family: 'Inter', sans-serif; /* Use a professional font */
  font-weight: bold; /* Apply bold weight */
`;

const SearchBarContainer = styled.div`
  display: flex;
  align-items: center;
  padding: 10px;
  background-color: #e9ecef;
  border-radius: 20px;
  margin-bottom: 20px;
  margin-top: -25px;
  display: ${({ isSidebarOpen }) => (isSidebarOpen ? 'flex' : 'none')};
`;

const SearchInput = styled.input`
  border: none;
  background: none;
  outline: none;
  margin-left: 10px;
  width: 100%;
`;
const Dashboard = () => {
 
    
  return (

    <DashboardContainer>
     <Sidebar ref={sidebarRef} isSidebarOpen={isSidebarOpen}>
  <Link to="/profile" style={{ textDecoration: 'none' }}>
    <ProfileHeader isSidebarOpen={isSidebarOpen}>
      {loggedInUser && loggedInUser.Image ? (
        <ProfileImage
          src={loggedInUser.Image}
          alt={`${loggedInUser.firstName} ${loggedInUser.lastName}`}
        />
      ) : (
        <FaUserCircle className="profile-icon" />
      )}
      <span className="profile-name">
        {loggedInUser ? `${loggedInUser.firstName} ${loggedInUser.lastName}` : 'Guest'}
      </span>

      <span
        className="profile-email"
        style={{ fontSize: '0.9rem', color: '#6c757d', display: isSidebarOpen ? 'block' : 'none' }}
      >
        {loggedInUser ? loggedInUser.email : ''}
      </span>

      {/* Add position below the email */}
      <span
        className="profile-position"
        style={{ fontSize: '0.9rem', color: '#6c757d', display: isSidebarOpen ? 'block' : 'none' }}
      >
        {loggedInUser ? loggedInUser.position : ''}
      </span>
    </ProfileHeader>
  </Link>

  <SearchBarContainer isSidebarOpen={isSidebarOpen}>
    <FaSearch />
    <SearchInput type="text" placeholder="Search..." />
  </SearchBarContainer>

  <SidebarMenu>
    <Link to="/dashboard" style={{ textDecoration: 'none' }}>
      <SidebarItem isSidebarOpen={isSidebarOpen}>
        <FontAwesomeIcon icon={faHome} className="icon" />
        <span>Dashboard</span>
      </SidebarItem>
    </Link>

    <Link to="/list" style={{ textDecoration: 'none' }}>
      <SidebarItem isSidebarOpen={isSidebarOpen}>
        <FontAwesomeIcon icon={faShoppingCart} className="icon" />
        <span>List of Vendors</span>
      </SidebarItem>
    </Link>

    <SidebarItem isSidebarOpen={isSidebarOpen} onClick={handleDropdownToggle}>
      <FontAwesomeIcon icon={faUser} className="icon" />
      <span>User Management</span>
    </SidebarItem>

    {isDropdownOpen && (
      <ul style={{ paddingLeft: '20px', listStyleType: 'none' }}>
        <Link to="/usermanagement" style={{ textDecoration: 'none' }}>
          <li>
            <SidebarItem isSidebarOpen={isSidebarOpen}>
              <FontAwesomeIcon icon={faSearch} className="icon" />
              <span>View Users</span>
            </SidebarItem>
          </li>
        </Link>
        <Link to="/newuser" style={{ textDecoration: 'none' }}>
          <li>
            <SidebarItem isSidebarOpen={isSidebarOpen}>
              <FontAwesomeIcon icon={faPlus} className="icon" />
              <span>Add User</span>
            </SidebarItem>
          </li>
        </Link>
      </ul>
    )}

    <Link to="/viewunit" style={{ textDecoration: 'none' }}>
      <SidebarItem isSidebarOpen={isSidebarOpen}>
        <FontAwesomeIcon icon={faPlus} className="icon" />
        <span>Add New Unit</span>
      </SidebarItem>
    </Link>

    <Link to="/manage-roles" style={{ textDecoration: 'none' }}>
      <SidebarItem isSidebarOpen={isSidebarOpen}>
        <FontAwesomeIcon icon={faUsers} className="icon" />
        <span>Manage Roles</span>
      </SidebarItem>
    </Link>

    <Link to="/contract" style={{ textDecoration: 'none' }}>
      <SidebarItem isSidebarOpen={isSidebarOpen}>
        <FontAwesomeIcon icon={faFileContract} className="icon" />
        <span>Contract</span>
      </SidebarItem>
    </Link>

    <Link to="/ticket" style={{ textDecoration: 'none' }}>
      <SidebarItem isSidebarOpen={isSidebarOpen}>
        <FontAwesomeIcon icon={faTicketAlt} className="icon" />
        <span>Manage Ticket</span>
      </SidebarItem>
    </Link>

    {/* Manage Ambulant Section */}
    <SidebarItem isSidebarOpen={isSidebarOpen} onClick={handleDropdownToggle}>
      <FontAwesomeIcon icon={faUser} className="icon" />
      <span>Manage Ambulant</span>
    </SidebarItem>

    {isDropdownOpen && (
      <ul style={{ paddingLeft: '20px', listStyleType: 'none' }}>
        <Link to="/assign" style={{ textDecoration: 'none' }}>
          <li>
            <SidebarItem isSidebarOpen={isSidebarOpen}>
              <FontAwesomeIcon icon={faCheck} className="icon" />
              <span>Assign Collector</span>
            </SidebarItem>
          </li>
        </Link>
        <Link to="/viewcollector" style={{ textDecoration: 'none' }}>
          <li>
            <SidebarItem isSidebarOpen={isSidebarOpen}>
              <FontAwesomeIcon icon={faCheck} className="icon" />
              <span>View Collector</span>
            </SidebarItem>
          </li>
        </Link>

        <Link to="/addcollector" style={{ textDecoration: 'none' }}>
          <li>
            <SidebarItem isSidebarOpen={isSidebarOpen}>
              <FontAwesomeIcon icon={faPlus} className="icon" />
              <span>Add Ambulant Collector</span>
            </SidebarItem>
          </li>
        </Link>
      </ul>
    )}
  </SidebarMenu>

      <SidebarFooter isSidebarOpen={isSidebarOpen}>
          <LogoutButton isSidebarOpen={isSidebarOpen} onClick={handleLogout}>
            <span><FaSignOutAlt /></span>
            <span>Logout</span>
          </LogoutButton>
        </SidebarFooter>
      </Sidebar>

        <MainContent isSidebarOpen={isSidebarOpen}>
        
          <ToggleButton onClick={toggleSidebar}>
            <FaBars />
          </ToggleButton>
          
        
          <AppBar>
        <div className="title">INTERIM</div>
      </AppBar>

<FormContainer>
 
</FormContainer>

      </MainContent>
      </DashboardContainer>
  );
};
export default Dashboard;