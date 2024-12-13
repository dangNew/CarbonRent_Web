import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider } from './Interim/AuthContext'; // Ensure the path is correct
import ProtectedRoute from './Interim/ProtectedRoute'; // Ensure the path is correct

import ListOfStallholders from './Collector/ListOfStallholders';
import ViewPayment from './Collector/ViewPayment';
import SignUp from './Interim/Signup';
import Login from './Interim/Login';
import Dashboard from './Interim/Dashboard';
import ListOfVendors from './Interim/ListOfVendors';
import AddUnit from './Interim/AddUnit';
import UserManagement from './Interim/UserManagement';
import AddNewUser from './Interim/AddNewUser';
import LoginCTO from './CTO/LoginCTO';
import Modal from './Interim/Modal';
import Profile from './Interim/Profile';
import UserEdit from './Interim/UserEdit';
import ContractManagement from './Interim/Contract';
import Ticket from './Interim/Ticket';
import TicketEdit from './Interim/TicketEdit';
import AssignCollector from './Interim/AssignCollector';
import AddCollector from './Interim/AddCollector';
import NewTicket from './Interim/NewTicket';

import SideNav from './OIC/side_nav';
import OICDashboard from './OIC/oic_dashboard';
import ListOfStalls from './OIC/ListOfStalls';
import OICListOfVendors from './OIC/OICListOfVendors';
import AddNewStall from './OIC/AddNewStall'; // New import
import VendorVerification from './OIC/VendorVerification'; // New import
import VendorReallocation from './OIC/VendorReallocation'; // New import
import DeclinedVendors from './OIC/DeclinedVendors'; // New import
import EditVendors from './OIC/EditVendors';
import EditVerification from './OIC/EditVerification';
import BillingConfiguration from './OIC/BillingConfiguration';
import EditStall from './OIC/EditStall';
import Occupied from './OIC/OccupiedStalls';
import Announcement from './OIC/Announcement';
import CompromiseRequests from './OIC/CompromiseRequests';
import AvailableStalls from './OIC/AvailableStalls';
import ProfileOIC from './OIC/Profile_OIC';
import Violations from './OIC/Violations';
import ViolationDetails from './OIC/ViolationsDetails';
import ViewVendor from './OIC/ViewVendor';
import ViolationReports from './OIC/ViolationReportsPage';



import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import SideHead from './CTO/Sidebar';
import './App.css';
import CTODashboard from './CTO/Dashboard';
import Violators from './CTO/Violators';
import Transactions from './CTO/Transactions';
import CollectorList from './CTO/CollectorList';
import Appraisals from './CTO/Appraisal';
import AmbulantHistory from './CTO/AmbulantHistory';
import HistoryApprais from './CTO/HistoryApprais';
import ListsOfAmbulant from './CTO/ListOfAmbulant';
import StallHolderPayment from './CTO/StallHolderPayment';
import CTOProfile from './CTO/Profile_';
import TransactionDetails from './CTO/Transactions';
import AppraisalCollects from './CTO/AppraisalCollect';
import ViolationReportss from './CTO/ViolationReports';
import MarketViolation from './CTO/MarketViolation';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/stallholders" element={<ListOfStallholders />} />
        <Route path="/view-payment/:id" element={<ViewPayment />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/list" element={<ListOfVendors />} />
        <Route path="/Addunit" element={<AddUnit />} />
        <Route path="/userManagement" element={<UserManagement />} />
        <Route path="/newuser" element={<AddNewUser />} />
        <Route path="/Login" element={<LoginCTO />} />
        <Route path="/modal" element={<Modal />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/ctoprofile" element={<Profile />} />
        <Route path="/edit/:id" element={<UserEdit />} />
        <Route path="/contract" element={<ContractManagement />} />
        <Route path="/ticket" element={<Ticket />} />
        <Route path="/ticketEdit/:id" element={<TicketEdit />} />
        <Route path="/assign" element={<AssignCollector />} />
        <Route path="/addcollector" element={<AddCollector />} />
        <Route path="/newticket" element={<NewTicket />} />
      

        {/* OIC Routes */}
        <Route
          path="/oic_dashboard"
          element={<ProtectedRoute element={<OICDashboard />} />}
        />
        <Route
          path="/vendors"
          element={<ProtectedRoute element={<OICListOfVendors />} />}
        />
        <Route
          path="/vendor-verification"
          element={<ProtectedRoute element={<VendorVerification />} />}
        />
        <Route
          path="/vendor-reallocation"
          element={<ProtectedRoute element={<VendorReallocation />} />}
        />
        <Route
          path="/declined-vendors"
          element={<ProtectedRoute element={<DeclinedVendors />} />}
        />
        <Route
          path="/stalls"
          element={<ProtectedRoute element={<ListOfStalls />} />}
        />
        <Route
          path="/addnew_stall"
          element={<ProtectedRoute element={<AddNewStall />} />}
        />
        <Route
          path="/edit-vendors/:Id"
          element={<ProtectedRoute element={<EditVendors />} />}
        />
        <Route
          path="/edit-verification/:vendorId"
          element={<ProtectedRoute element={<EditVerification />} />}
        />
        <Route
          path="/billing-config"
          element={<ProtectedRoute element={<BillingConfiguration />} />}
        />
        <Route
          path="/editstall/:id"
          element={<ProtectedRoute element={<EditStall />} />}
        />
        <Route
          path="/occupied/:id"
          element={<ProtectedRoute element={<Occupied />} />}
        />
        <Route
          path="/announcement"
          element={<ProtectedRoute element={<Announcement />} />}
        />
        <Route
          path="/compromise"
          element={<ProtectedRoute element={<CompromiseRequests />} />}
        />

        <Route
          path="/available"
          element={<ProtectedRoute element={<AvailableStalls />} />}
        />

        <Route
          path="/profileoic"
          element={<ProtectedRoute element={<ProfileOIC />} />}
        />

        <Route
          path="/violations"
          element={<ProtectedRoute element={<Violations />} />}
        />

        <Route
          path="/violation-reports"
          element={<ProtectedRoute element={<ViolationReports />} />}
        />

        <Route
          path="/view-vendor/:id"
          element={<ProtectedRoute element={<ViewVendor />} />}
        />

        <Route
          path="/violation-details/:vendorId"
          element={<ProtectedRoute element={<ViolationDetails />} />}
        />

        <Route path="/side_nav" element={<SideNav />} />



        <Route path="/listViolators" element={<ProtectedRoute><SideHead><Violators /></SideHead></ProtectedRoute>} />
          <Route path="/stallHistory" element={<ProtectedRoute><SideHead><Transactions /></SideHead></ProtectedRoute>} />
          <Route path="/stallholder-payment" element={<ProtectedRoute><SideHead><StallHolderPayment /></SideHead></ProtectedRoute>} />
          <Route path="/collector" element={<ProtectedRoute><SideHead><CollectorList /></SideHead></ProtectedRoute>} />
          <Route path="/ambulantHistory" element={<ProtectedRoute><SideHead><AmbulantHistory /></SideHead></ProtectedRoute>} />
          <Route path="/ambulantHistory" element={<ProtectedRoute><SideHead><ViolationReportss /></SideHead></ProtectedRoute>} />
          <Route path="/historyAppraisal" element={<ProtectedRoute><SideHead><HistoryApprais /></SideHead></ProtectedRoute>} />
          <Route path="/collector/:collectorName" element={<ProtectedRoute><SideHead><Appraisals /></SideHead></ProtectedRoute>} />
          <Route path="/ambulant-collector/:collector/:location/:zone" element={<ProtectedRoute><SideHead><ListsOfAmbulant /></SideHead></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><SideHead><CTOProfile /></SideHead></ProtectedRoute>} />
          <Route path="/transaction-details/:date" element={<ProtectedRoute><SideHead><TransactionDetails /></SideHead></ProtectedRoute>} />
          <Route path="/appraisalCollects" element={<ProtectedRoute><SideHead><AppraisalCollects /></SideHead></ProtectedRoute>} /> {/* New route for AmbuCollects */}
          <Route path="/market-violation" element={<ProtectedRoute><SideHead><MarketViolation /></SideHead></ProtectedRoute>} /> {/* New route for AmbuCollects */}
          <Route path="/dashboard" element={<ProtectedRoute><SideHead><CTODashboard /></SideHead></ProtectedRoute>} /> {/* New route for AmbuCollects */}


        <Route path="*" element={<Navigate to="/login" />} />
        
      </Routes>
    </Router>
  );
}

export default App;
