import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Home from "./components/Home";
import Layout from "./components/Layout";
import Dashboard from "./components/Dashboard";
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
import AddPaymentVoucher from "./components/AddPaymentVoucher"
import ExpenditureStatements from "./components/ExpenditureStatements";
import CashBook from "./components/CashBook";
import BankBook from "./components/BankBook";
import MaintenanceRecord from "./components/MaintenanceRecord";
import PaymentSucess from "./components/PaymentSuccess"
import AddVisitor from "./components/AddVisitor"
import MaidManagement from "./components/MaidManagement";
import MaidLog from "./components/MaidLogs";
function App() {
  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;

  // Function to check if user is authorized for a specific route
  const isAuthorized = (roles) => {
    if (!user || !user.position || !user.flatnumber) return false;
    if (!roles || roles.length === 0) return true;
    return roles.includes(user.position) || roles.includes(user.flatnumber);
  };

  // Function to render a route if user is authorized, otherwise redirect to login
  const renderAuthorizedRoute = (path, element, roles = []) => {
    return isAuthorized(roles) ? <Route path={path} element={element} /> : <Navigate to="/log" />;
  };

  return (
    <div>
      <Router>
        <Routes>
          <Route path="/log" element={<Login />} />
          <Route path="/" element={<Home />} />
          <Route path="/paymentsuccess" element={<PaymentSucess />} />
          <Route
            path="/db"
            element={user && user.flatnumber ? <Layout /> : <Navigate to="/log" />}
          >
            {renderAuthorizedRoute("/", <Dashboard />)}
            {renderAuthorizedRoute("reserve", <FacilityReservation />)}
            {renderAuthorizedRoute("payments", <Societypayments />)}
            {renderAuthorizedRoute("profile", <UserProfile />)}
            {renderAuthorizedRoute("trackpay", <Payementhistory />)}
            {renderAuthorizedRoute("visitor", <VisitorsLog />)}
            {renderAuthorizedRoute("maids", <MaidLog />)}
            {renderAuthorizedRoute("addincome", <AddIncome />, ["executive", "PCS"])}
            {renderAuthorizedRoute("flat-details-change-perm", <FlatDetails />, ["PCS"])}
            {renderAuthorizedRoute("facility-reservation-booking-account", null, ["executive", "PCS"])}
            {renderAuthorizedRoute("income-details-deptwise", <IncomeStatement />)}
            {renderAuthorizedRoute("expenditure-details-deptwise", <ExpenditureStatements />)}
            {renderAuthorizedRoute("income-expenditure-account", <IncomeExpAccount />)}
            {renderAuthorizedRoute("cashbook", <CashBook />)}
            {renderAuthorizedRoute("bankbook", <BankBook />)}
            {renderAuthorizedRoute("maintenance-tracking", <MaintenanceRecord />)}
            {renderAuthorizedRoute("addpv", <AddPaymentVoucher />, ["executive", "PCS"])}
            {renderAuthorizedRoute("visitor-manage", <AddVisitor />, ["ABC"])}
            {renderAuthorizedRoute("maidmanage", <MaidManagement />, ["ABC"])}
            {renderAuthorizedRoute("findvehicle", <FindVehicle />, ["executive", "PCS", "ABC"])}
            {renderAuthorizedRoute("owner-details", null, ["executive", "PCS"])}
            {renderAuthorizedRoute("renter-details", null, ["executive", "PCS"])}
          </Route>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
