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
  // State to hold user data
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Fetch user data from localStorage
    const userData = JSON.parse(localStorage.getItem("user"));
    setUser(userData);
  }, []);

  // Functions to check user roles
  const isExecutive = user?.position === "executive";
  const isAdmin = user?.flatnumber === "PCS";
  const isGuard = user?.flatnumber === "ABC";

  return (
    <div>
      <Router>
        <Routes>
          <Route path="/log" element={<Login />} />
          <Route path="/" element={<Home />} />
          <Route path="/paymentsuccess" element={<PaymentSucess />} />
          <Route
            path="/db"
            element={<Layout />}
          >
            <Route index element={<Dashboard />} />
            <Route path="reserve" element={<FacilityReservation />} />
            <Route path="payments" element={<Societypayments />} />
            <Route path="profile" element={<UserProfile />} />
            <Route path="trackpay" element={<Payementhistory />} />
            <Route path="visitor" element={<VisitorsLog />} />
            <Route path="maids" element={<MaidLog />} />
            <Route
              path="addincome"
              element={isAdmin ? <AddIncome /> : <Navigate to="/log" />}
            />
            <Route
              path="flat-details-change-perm"
              element={isAdmin ? <FlatDetails /> : <Navigate to="/log" />}
            />
            <Route
              path="facility-reservation-booking-account"
              element={(isAdmin || isExecutive) ? <></> : <Navigate to="/log" />}
            />
            <Route
              path="income-details-deptwise"
              element={<IncomeStatement/>}
            />
            <Route
              path="expenditure-details-deptwise"
              element={<ExpenditureStatements/>}
            />
            <Route
              path="income-expenditure-account"
              element={<IncomeExpAccount/>}
            />
            <Route
              path="cashbook"
              element={<CashBook/>}
            />
            <Route
              path="bankbook"
              element={<BankBook/>}
            />
            <Route
              path="maintenance-tracking"
              element={<MaintenanceRecord />}
            />
            <Route
              path="addpv"
              element={(isExecutive || isAdmin) ? <AddPaymentVoucher /> : <Navigate to="/log" />}
            />
            <Route
              path="visitor-manage"
              element={(isGuard) ? <AddVisitor /> : <></>}
            />
            <Route
              path="maidmanage"
              element={isGuard ? <MaidManagement/> : <Navigate to="/log" />}
            />
            <Route
              path="findvehicle"
              element={(isExecutive || isAdmin || isGuard) ? <FindVehicle /> : <Navigate to="/log" />}
            />
            <Route
              path="owner-details"
              element={(isExecutive || isAdmin) ? <></> : <Navigate to="/log" />}
            />
            <Route
              path="renter-details"
              element={(isExecutive || isAdmin) ? <></> : <Navigate to="/log" />}
            />
          </Route>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
