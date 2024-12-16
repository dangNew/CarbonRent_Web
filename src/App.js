import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { AuthProvider } from './Interim/AuthContext';
import ProtectedRoute from './Interim/ProtectedRoute';

import ViewPayment from './Collector/ViewPayment';
import SignUp from './Interim/Signup';
import Login from './Interim/Login';
import ForgotPassword from './Interim/ForgotPassword';
import InterimDashboard from './Interim/Dashboard'; // Ensure this is the correct path
import ListOfVendors from './Interim/ListOfVendors';
import AddUnit from './Interim/AddUnit';
import UserManagement from './Interim/UserManagement';
import AddNewUser from './Interim/AddNewUser';
import Modal from './Interim/Modal';
import Profile from './Interim/Profile';
import UserEdit from './Interim/UserEdit';
import ContractManagement from './Interim/Contract';
import Ticket from './Interim/Ticket';
import TicketEdit from './Interim/TicketEdit';
import AddSpace from './Interim/AddSpace';
import AddCollector from './Interim/AddCollector';
import NewTicket from './Interim/NewTicket';
import Viewunit from './Interim/viewunit';
import ViewUser from './Interim/ViewUser';
import ViewStallholder from './Interim/ViewStallholder';
import EditUnit from './Interim/EditUnit';
import AddZone from './Interim/AddZone';
import InterimListstalls from './Interim/ListOfStalls';
import ViewSpace from './Interim/ViewSpace';
import EditSpace from './Interim/EditSpace';
import AssignCollector from './Interim/AssignCollector';
import ManageAppraise from './Interim/ManageAppraise';
import Stallholders from './Collector/Stallholders';
import CollectorDash from './Collector/CollectorDash';
import InterimAnnouncement from './Interim/InterimAnnouncement';
import Transaction from './Collector/Transaction';
import ViewTransaction from './Collector/ViewTransaction';
import NewStall from './Interim/NewStall';
import BillingConfig from './Interim/BillingConfig';
import DailyCollection from './Collector/DailyCollection';
import WeeklyCollection from './Collector/WeeklyCollection';
import Appraisers from './Interim/Appraisers';
import ViewAppraisers from './Interim/ViewAppraisers';
import AddAppraiser from './Interim/AddAppraiser';
import VendorTransaction from './Interim/VendorTransaction';
import ViewZone from './Interim/ViewZone';
import AppraisalProduct from './Interim/AppraisalProduct';
import Payment from './Collector/Payment';

import SideNav from './OIC/side_nav';
import OICDashboard from './OIC/oic_dashboard'; // Ensure this is the correct path
import OICListOfVendors from './OIC/OICListOfVendors';
import AddNewStall from './OIC/AddNewStall';
import VendorVerification from './OIC/VendorVerification';
import VendorReallocation from './OIC/VendorReallocation';
import DeclinedVendors from './OIC/DeclinedVendors';
import EditVendors from './OIC/EditVendors';
import EditVerification from './OIC/EditVerification';
import BillingConfiguration from './Interim/BillingConfig';
import OICListOfStalls from './OIC/ListOfStalls'; // Ensure this is the correct path
import ViolationPaidSettled from './OIC/ViolationsPaidSettled';


import SideHead from './CTO/Sidebar';
import CTODashboard from './CTO/dashboard';
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
import ViolationReports from './CTO/ViolationReports';
import MarketViolation from './CTO/MarketViolation';

import AvailableStalls from './OIC/AvailableStalls';
import ProfileOIC from './OIC/Profile_OIC';
import Violations from './OIC/Violations';
import ViolationDetails from './OIC/ViolationsDetails';
import ViolationPending from './OIC/ViolationPending';
import ViewVendor from './OIC/ViewVendor';
import ViolationReportsPage from './OIC/ViolationReportsPage';
import CompromiseRequests from './OIC/CompromiseRequests';
import Announcement from './OIC/Announcement';
import EditStall from './OIC/EditStall';
import OccupiedStalls from './OIC/OccupiedStalls';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/signup" element={<SignUp />} />

          {/* Protected Routes */}
          <Route path="/view-payment/:id" element={<ProtectedRoute element={<ViewPayment />} />} />
          <Route path="/dashboard" element={<ProtectedRoute element={<InterimDashboard />} />} />
          <Route path="/list" element={<ProtectedRoute element={<ListOfVendors />} />} />
          <Route path="/addunit" element={<ProtectedRoute element={<AddUnit />} />} />
          <Route path="/userManagement" element={<ProtectedRoute element={<UserManagement />} />} />
          <Route path="/newuser" element={<ProtectedRoute element={<AddNewUser />} />} />
          <Route path="/modal" element={<ProtectedRoute element={<Modal />} />} />
          <Route path="/profile" element={<ProtectedRoute element={<Profile />} />} />
          <Route path="/edit/:id" element={<ProtectedRoute element={<UserEdit />} />} />
          <Route path="/contract" element={<ProtectedRoute element={<ContractManagement />} />} />
          <Route path="/ticket" element={<ProtectedRoute element={<Ticket />} />} />
          <Route path="/ticketEdit/:id" element={<ProtectedRoute element={<TicketEdit />} />} />
          <Route path="/addspace" element={<ProtectedRoute element={<AddSpace />} />} />
          <Route path="/addcollector" element={<ProtectedRoute element={<AddCollector />} />} />
          <Route path="/newticket" element={<ProtectedRoute element={<NewTicket />} />} />
          <Route path="/viewunit" element={<ProtectedRoute element={<Viewunit />} />} />
          <Route path="/viewuser/:userId" element={<ProtectedRoute element={<ViewUser />} />} />
          <Route path="/view-stallholder/:id" element={<ProtectedRoute element={<ViewStallholder />} />} />
          <Route path="/edit-unit/:id" element={<ProtectedRoute element={<EditUnit />} />} />
          <Route path="/addzone" element={<ProtectedRoute element={<AddZone />} />} />
          <Route path="/interim-listofstalls" element={<ProtectedRoute element={<InterimListstalls />} />} />
          <Route path="/viewspace" element={<ProtectedRoute element={<ViewSpace />} />} />
          <Route path="/editspace/:id" element={<ProtectedRoute element={<EditSpace />} />} />
          <Route path="/assigncollector" element={<ProtectedRoute element={<AssignCollector />} />} />
          <Route path="/appraise" element={<ProtectedRoute element={<ManageAppraise />} />} />
          <Route path="/stallholders" element={<ProtectedRoute element={<Stallholders />} />} />
          <Route path="/collectdash" element={<ProtectedRoute element={<CollectorDash />} />} />
          <Route path="/announce" element={<ProtectedRoute element={<InterimAnnouncement />} />} />
          <Route path="/transaction" element={<ProtectedRoute element={<Transaction />} />} />
          <Route path="/view-transaction/:vendorId" element={<ViewTransaction />} />
          <Route path="/newstall" element={<ProtectedRoute element={<NewStall />} />} />
          <Route path="/billingconfig" element={<ProtectedRoute element={<BillingConfig />} />} />
          <Route path="/daily" element={<ProtectedRoute element={<DailyCollection />} />} />
          <Route path="/weekly" element={<ProtectedRoute element={<WeeklyCollection />} />} />
          <Route path="/appraisers" element={<ProtectedRoute element={<Appraisers />} />} />
          <Route path="/view-appraisers/:vendorId" element={<ViewAppraisers />} />
          <Route path="/addappraisers" element={<ProtectedRoute element={<AddAppraiser />} />} />
          <Route path="/vendor-transaction/:vendorId" element={<VendorTransaction />} />
          <Route path="/viewzone" element={<ProtectedRoute element={<ViewZone />} />} />
          <Route path="/appraiseproduct" element={<ProtectedRoute element={<AppraisalProduct />} />} />
          <Route path="/payment" element={<ProtectedRoute element={<Payment />} />} />

          {/* OIC Routes */}
          <Route path="/oic_dashboard" element={<ProtectedRoute element={<OICDashboard />} />} />
          <Route path="/vendors" element={<ProtectedRoute element={<OICListOfVendors />} />} />
          <Route path="/vendor-verification" element={<ProtectedRoute element={<VendorVerification />} />} />
          <Route path="/vendor-reallocation" element={<ProtectedRoute element={<VendorReallocation />} />} />
          <Route path="/declined-vendors" element={<ProtectedRoute element={<DeclinedVendors />} />} />
          <Route path="/oic-listofstalls" element={<ProtectedRoute element={<OICListOfStalls />} />} />
          <Route path="/addnew_stall" element={<ProtectedRoute element={<AddNewStall />} />} />
          <Route path="/edit-vendors/:Id" element={<ProtectedRoute element={<EditVendors />} />} />
          <Route path="/edit-verification/:vendorId" element={<ProtectedRoute element={<EditVerification />} />} />
          <Route path="/billing-config" element={<ProtectedRoute element={<BillingConfiguration />} />} />
          <Route path="/editstall/:id" element={<ProtectedRoute element={<EditStall />} />} />
          <Route path="/occupied/:id" element={<ProtectedRoute element={<OccupiedStalls />} />} />
          <Route path="/announcement" element={<ProtectedRoute element={<Announcement />} />} />
          <Route path="/compromise" element={<ProtectedRoute element={<CompromiseRequests />} />} />
          <Route path="/available" element={<ProtectedRoute element={<AvailableStalls />} />} />
          <Route path="/profileoic" element={<ProtectedRoute element={<ProfileOIC />} />} />
          <Route path="/violations" element={<ProtectedRoute element={<Violations />} />} />
          <Route path="/violation-reports" element={<ProtectedRoute element={<ViolationReportsPage />} />} />
          <Route path="/violation-pending/:vendorId" element={<ProtectedRoute element={<ViolationPending />} />} />
          <Route path="/view-vendor/:id" element={<ProtectedRoute element={<ViewVendor />} />} />
          <Route path="/violation-details/:vendorId" element={<ProtectedRoute element={<ViolationDetails />} />} />
          <Route path="/violation-paid-settled/:vendorId" element={<ViolationPaidSettled />} />


          {/* CTO Routes */}
          <Route path="/listViolators" element={<ProtectedRoute element={<SideHead><Violators /></SideHead>} />} />
          <Route path="/stallHistory" element={<ProtectedRoute element={<SideHead><Transactions /></SideHead>} />} />
          <Route path="/stallholder-payment" element={<ProtectedRoute element={<SideHead><StallHolderPayment /></SideHead>} />} />
          <Route path="/collector" element={<ProtectedRoute element={<SideHead><CollectorList /></SideHead>} />} />
          <Route path="/ambulantHistory" element={<ProtectedRoute element={<SideHead><AmbulantHistory /></SideHead>} />} />
          <Route path="/historyAppraisal" element={<ProtectedRoute element={<SideHead><HistoryApprais /></SideHead>} />} />
          <Route path="/collector/:collectorName" element={<ProtectedRoute element={<SideHead><Appraisals /></SideHead>} />} />
          <Route path="/ambulant-collector/:collector/:location/:zone" element={<ProtectedRoute element={<SideHead><ListsOfAmbulant /></SideHead>} />} />
          <Route path="/ctoprofile" element={<ProtectedRoute element={<SideHead><CTOProfile /></SideHead>} />} />
          <Route path="/transaction-details/:date" element={<ProtectedRoute element={<SideHead><TransactionDetails /></SideHead>} />} />
          <Route path="/appraisalCollects" element={<ProtectedRoute element={<SideHead><AppraisalCollects /></SideHead>} />} />
          <Route path="/market-violation" element={<ProtectedRoute element={<SideHead><MarketViolation /></SideHead>} />} />
          <Route path="/cto_dashboard" element={<ProtectedRoute element={<SideHead><CTODashboard /></SideHead>} />} />

          {/* Other Routes */}
          <Route path="/side_nav" element={<SideNav />} />

          {/* Default Route */}
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
