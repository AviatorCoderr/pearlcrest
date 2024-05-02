import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Home from "./components/Home";
import Layout from "./components/Layout";
import Dashboard from "./components/Dashboard";
import AddComplaints from "./components/AddComplaints";
import FacilityReservation from "./components/FacilityReservation";
import Societypayments from "./components/Societypayments";
import UserProfile from "./components/UserProfile";
import Login from "./components/Login";
import IncomeExpAccount from "./components/IncomeExpAccount"
import Payementhistory from "./components/Payementhistory";
import VisitorsLog from "./components/VisitorsLog";
import AddIncome from "./components/AddIncome";
import FlatDetails from "./components/FlatDetails"
import FindVehicle from "./components/FindVehicle";
import IncomeStatement from "./components/IncomeStatement";
import AddTransaction from "./components/AddTransaction";
import AddPaymentVoucher from "./components/AddPaymentVoucher"
import ExpenditureStatements from "./components/ExpenditureStatements";
import CashBook from "./components/CashBook";
import BankBook from "./components/BankBook";
import MaintenanceRecord from "./components/MaintenanceRecord";
import PaymentSucess from "./components/PaymentSuccess"
import AddVisitor from "./components/AddVisitor"
import MaidManagement from "./components/MaidManagement";
function App() {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")));
  return (
    <div>
      <Router>
        <Routes>
          <Route path="/log" element={<Login />} />
          <Route path="/" element={<Home />} />
          <Route path="/paymentsuccess" element={<PaymentSucess />} />
          <Route path="/db" element={(user?.flatnumber !== null) ? <Layout/> : <Navigate to="/log" />}>
            <Route index element={<Dashboard />} />
            <Route path="addcomplain" element={<AddComplaints />} />
            <Route path="reserve" element={<FacilityReservation />} />
            <Route path="payments" element={<Societypayments />} />
            <Route path="profile" element={<UserProfile />} />
            <Route path="trackpay" element={<Payementhistory />} />
            <Route path="visitor" element={<VisitorsLog />} />
            <Route path="addincome" element={(user?.flatnumber === "PCS") ? <AddIncome/> : <Navigate to="/log" />} />
            <Route path="flat-details-change-perm" element={(user?.flatnumber === "PCS") ? <FlatDetails/> : <Navigate to="/log" />} />
            <Route path="add-transaction" element={(user?.flatnumber === "PCS") ? <AddTransaction/> : <Navigate to="/log" />} />
            {/* Admin Routes  */}
            <Route path="flat-details-change-perm" element />
            <Route path="facility-reservation-booking-account" element />
            <Route path="income-details-deptwise" element={(user?.flatnumber === "PCS") ? <IncomeStatement/> : <Navigate to="/log" />}/>
            <Route path="expenditure-details-deptwise" element={(user?.flatnumber === "PCS") ? <ExpenditureStatements/> : <Navigate to="/log" />} />
            <Route path="income-expenditure-account" element={(user?.flatnumber === "PCS") ? <IncomeExpAccount/> : <Navigate to="/log" />} />
            <Route path="cashbook" element={(user?.flatnumber === "PCS") ? <CashBook/> : <Navigate to="/log" />} />
            <Route path="bankbook"  element={(user?.flatnumber === "PCS") ? <BankBook/> : <Navigate to="/log" />} />
            <Route path="maintenance-tracking" element={(user?.flatnumber === "PCS") ? <MaintenanceRecord /> : <Navigate to="/log" />} />
            {/* Admin and Executive Routes  */}
            <Route path="complaint-redressal" element={user?.position === "executive" || user?.flatnumber === "PCS" ? <></> : <Navigate to="/log" />} />
            <Route path="addpv" element={user?.position === "executive" || user?.flatnumber === "PCS" ? <AddPaymentVoucher /> : <Navigate to="/log" />} />
            {/* Guard and Admin Routes  */}
            <Route path="visitor-manage" element={(user?.flatnumber === "PCS" || user?.flatnumber === "ABC") ? <AddVisitor /> : <></>} />
            {/* All Admin, Executive, and Guard Routes  */}
            <Route path="maidmanage" element={user?.flatnumber === "ABC" ? <MaidManagement/> : <Navigate to="/log" />} />
            <Route path="findvehicle" element={(user?.position === "executive" || user?.flatnumber === "PCS" || user?.flatnumber === "ABC") ? <FindVehicle /> : <Navigate to="/log" />} />
            <Route path="owner-details" element={user?.position === "executive" || user?.flatnumber === "PCS"? <></> : <Navigate to="/log" />} />
            <Route path="renter-details" element={user?.position === "executive" || user?.flatnumber === "PCS" ? <></> : <Navigate to="/log" />} />
          </Route>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
