import React from "react";
import { useSelector } from "react-redux";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import LandingPage from "./Components/User/LandingPage/LandingPage";
import UserHome from "./Components/User/HomePage/UserHome";
import Login from "./Components/Admin/Login/Login";
import Dashboard from "./Components/Admin/Dashboard/Dashboard";
import ViewUser from "./Components/Admin/UserManipulations/ViewUser";
import AddTheater from "./Components/Admin/TheaterManipulations/AddTheater";
import ViewTheaters from "./Components/Admin/TheaterManipulations/ViewTheaters";
import AddTheaterManager from "./Components/Admin/TheaterManagerManipulations/AddTheaterManager";
import TMLogin from "./Components/TheaterManager/Login/TMLogin";
import TMDashbord from "./Components/TheaterManager/Home/TMDashbord";

function App() {
  const user = useSelector((state) => state.user);
  const admin = useSelector((state) => state.admin);
  const theaterAdmin = useSelector((state) => state.theaterAdmin)
  
  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            user && user.user !== null ? (
              <Navigate to="/home" />
            ) : (
              <LandingPage />
            )
          }
        />

        <Route
          path="/home"
          element={
            user && user.user !== null ? <UserHome /> : <Navigate to="/" />
          }
        />

        {/* Admin Routes */}
        <Route
          path="/admin"
          element={
            admin && admin.admin !== null ? (
              <Navigate to="/admin/home" />
            ) : (
              <Login />
            )
          }
        />
        <Route
          path="/admin/home"
          element={
            admin && admin.admin !== null ? (
              <Dashboard />
            ) : (
              <Navigate to="/admin" />
            )
          }
        />
        <Route
          path="/admin/viewUser"
          element={
            admin && admin.admin !== null ? (
              <ViewUser />
            ) : (
              <Navigate to="/admin" />
            )
          }
        />
        <Route
          path="/admin/addTheater"
          element={
            admin && admin.admin !== null ? (
              <AddTheater />
            ) : (
              <Navigate to="/admin" />
            )
          }
        />
        <Route
          path="/admin/viewTheaters"
          element={
            admin && admin.admin !== null ? (
              <ViewTheaters />
            ) : (
              <Navigate to="/admin" />
            )
          }
        />
        <Route
          path="/admin/addTheaterManager"
          element={
            admin && admin.admin !== null ? (
              <AddTheaterManager />
            ) : (
              <Navigate to="/admin" />
            )
          }
        />
        {/* Theater Admin routes*/}
        <Route
          path="/theaterAdmin"
          element={
            theaterAdmin && theaterAdmin.theaterAdmin !== null ? (
              <Navigate to="/theaterAdmin/home" />
            ) : (
              <TMLogin />
            )
          }
        />
        <Route
          path="/theaterAdmin/home"
          element={
            theaterAdmin && theaterAdmin.theaterAdmin !== null ? (
              <TMDashbord /> 
            ) : (
              <Navigate to="/theaterAdmin" />
            )
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
