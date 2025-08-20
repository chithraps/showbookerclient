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
import ViewTheaters from "./Components/Admin/TheaterManipulations/ViewTheaters";
import AddTheaterManager from "./Components/Admin/TheaterManagerManipulations/AddTheaterManager";
import TMLogin from "./Components/TheaterManager/Login/TMLogin";
import TMDashbord from "./Components/TheaterManager/Home/TMDashbord";
import ViewScreens from "./Components/TheaterManager/Screens/ViewScreens";
import StepperForm from "./Components/TheaterManager/Stepper/StepperForm";
import ViewGenre from "./Components/Admin/Genre/ViewGenre";
import ViewMovies from "./Components/Admin/Movies/ViewMovies";
import ViewShows from "./Components/TheaterManager/ShowTimings/ViewShows";
import MovieDetails from "./Components/User/MovieDetails/MovieDetails";
import TheatersListForMovies from "./Components/User/TheatersListForMovies/TheatersListForMovies";
import ScreenLayout from "./Components/User/ScreenLayout/ScreenLayout";
import EditProfile from "./Components/User/UserProfile/EditProfile";
import BookingHistory from "./Components/User/Bookings/BookingHistory";
import PrePayment from "./Components/User/Payment/PrePayment";
import Payment from "./Components/User/Payment/Payment";
import BookingConfirmation from "./Components/User/Payment/BookingConfirmation";
import ViewBookings from "./Components/TheaterManager/Bookings/ViewBookings";
import Bookings from "./Components/Admin/Bookings/Bookings";
import NotFound from "./Components/NotFound/NotFound";
import BannerImage from "./Components/Admin/BannerImage/BannerImage";
import SalesReport from "./Components/Admin/Dashboard/SalesReport";
import AboutUs from "./Components/User/Footer/AboutUs";
import Privacy from "./Components/User/Footer/Privacy";
import Services from "./Components/User/Footer/Services";
import Terms from "./Components/User/Footer/Terms";
import ViewProfile from "./Components/User/UserProfile/ViewProfile";
import PaymentFailure from "./Components/User/Payment/PaymentFailure";
function App() {
  const user = useSelector((state) => state.user);
  const admin = useSelector((state) => state.admin);
  const theaterAdmin = useSelector((state) => state.theaterAdmin);

  return (
    <Router>
      <Routes>
        {/* User Routes */}
        <Route
          path="/"
          element={
            user && user.user ? <Navigate to="/home" /> : <LandingPage />
          }
        />
        <Route path="/about" element = {<AboutUs />} />
        <Route path="/privacy" element = {<Privacy />} />
        <Route path="/services" element = {<Services />} />
        <Route path="/terms" element = {<Terms />} />
        <Route
          path="/home"
          element={user && user.user ? <LandingPage /> : <Navigate to="/" />}
        />
        {/* route for MovieDetail */}
        <Route path="/movies/:id" element={<MovieDetails />} />
 
        {/* route for TheatersList  */}
        <Route
          path="/theatersForMovie/:id"
          element={<TheatersListForMovies />}
        />

        {/* route for ScreenLayout */}
        <Route path="/screenLayout" element={<ScreenLayout />} />
        {/* route for user profile */}
        <Route path="/profile" element={ user && user.user ? <ViewProfile /> : <Navigate to="/" /> } />

        {/* route for EditLayout */}
        <Route path="/edit-profile" element={ user && user.user ? <EditProfile /> : <Navigate to="/" /> } />

        {/* route for bookingHistory */}
        <Route path="/booking-history" element={user && user.user ? <BookingHistory /> : <Navigate to="/" />} />
        
        {/* route for prePayment */}
        <Route path="/prepayment" element={<PrePayment />} />

        {/* route for payment*/}
        <Route path="/payment" element={<Payment />} />
        {/* bookingConfirmation */}
        <Route path="/bookingConfirmation" element={<BookingConfirmation />} />
        {/* Payment Failure */}
         <Route path="/paymentFailure" element={<PaymentFailure />} />
        {/* Admin Routes */}
        <Route
          path="/admin"
          element={
            admin && admin.admin ? <Navigate to="/admin/home" /> : <Login />
          }
        />
        <Route
          path="/admin/home"
          element={
            admin && admin.admin ? <Dashboard /> : <Navigate to="/admin" />
          }
        />
        <Route
          path="/admin/viewUser"
          element={
            admin && admin.admin ? <ViewUser /> : <Navigate to="/admin" />
          }
        />

        <Route
          path="/admin/viewTheaters"
          element={
            admin && admin.admin ? <ViewTheaters /> : <Navigate to="/admin" />
          }
        />
        <Route
          path="/admin/addTheaterManager"
          element={
            admin && admin.admin ? (
              <AddTheaterManager />
            ) : (
              <Navigate to="/admin" />
            )
          }
        />
        <Route
          path="/admin/viewGenres"
          element={
            admin && admin.admin ? <ViewGenre /> : <Navigate to="/admin" />
          }
        />
        <Route
          path="/admin/viewMovies"
          element={
            admin && admin.admin ? <ViewMovies /> : <Navigate to="/admin" />
          }
        />
        <Route
          path="/admin/salesReport"
          element={
            admin && admin.admin ? <SalesReport /> : <Navigate to="/admin" />
          }
        />
        <Route
          path="/admin/manageBannerImage"
          element={
            admin && admin.admin ? <BannerImage /> : <Navigate to="/admin" /> 
          }
        />
        <Route
          path="/admin/viewBookings"
          element={
            admin && admin.admin ? <Bookings /> : <Navigate to="/admin" />
          }
        />

        {/* Theater Admin Routes */}
        <Route
          path="/theaterAdmin"
          element={
            theaterAdmin && theaterAdmin.theaterAdmin ? (
              <Navigate to="/theaterAdmin/home" />
            ) : (
              <TMLogin />
            )
          }
        />
        <Route
          path="/theaterAdmin/home"
          element={
            theaterAdmin && theaterAdmin.theaterAdmin ? (
              <TMDashbord />
            ) : (
              <Navigate to="/theaterAdmin" />
            )
          }
        />
        <Route
          path="/theaterAdmin/viewScreens"
          element={
            theaterAdmin && theaterAdmin.theaterAdmin ? (
              <ViewScreens />
            ) : (
              <Navigate to="/theaterAdmin" />
            )
          }
        />
        <Route
          path="/theaterAdmin/screenManipulations"
          element={
            theaterAdmin && theaterAdmin.theaterAdmin ? (
              <StepperForm />
            ) : (
              <Navigate to="/theaterAdmin" />
            )
          }
        />
        <Route
          path="/theaterAdmin/showTimings"
          element={
            theaterAdmin && theaterAdmin.theaterAdmin ? (
              <ViewShows />
            ) : (
              <Navigate to="/theaterAdmin" />
            )
          }
        />
        <Route
          path="/theaterAdmin/viewBookings"
          element={
            theaterAdmin && theaterAdmin.theaterAdmin ? (
              <ViewBookings />
            ) : (
              <Navigate to="/theaterAdmin" />
            )
          }
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
