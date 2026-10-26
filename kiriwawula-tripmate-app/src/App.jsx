import { BrowserRouter as Router, Routes, Route } from "react-router-dom";


import Login from "./pages/Auth/Login";
import SignUp from "./pages/Auth/SignUp";
import Home from "./pages/Home/Home";
import Places from "./pages/Places/Places";
import Map from "./pages/Map/Map";
import PlaceDetails from "./pages/PlaceDetails/PlaceDetails";
import Dashboard from "./pages/Dashboard/Dashboard";

import MyItinerary from "./pages/Itinerary/MyItinerary";
import ItineraryDetails from "./pages/Itinerary/ItineraryDetails";
import ForgotPassword from "./pages/Password/ForgotPassword";
import ResetPassword from "./pages/Password/ResetPassword";
import AdminDashboard from "./pages/AdminDashboard/AdminDashboard";
import ManagePlaces from "./pages/AdminDashboard/ManagePlaces";
import ManageCategories from "./pages/AdminDashboard/ManageCategories";
import ManageFacilities from "./pages/AdminDashboard/ManageFacilities";
import ManageMedia from "./pages/AdminDashboard/ManageMedia";
import ManageUsers from "./pages/AdminDashboard/ManageUsers";

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/places" element={<Places />} />
                <Route path="/places/:placeId" element={<PlaceDetails />} />
                <Route path="/map" element={<Map />} />
                <Route path="/login" element={<Login />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password" element={<ResetPassword />} />
                <Route path="/signup" element={<SignUp />} />
                <Route path="/itinerary/:id" element={<ItineraryDetails />} />
                <Route path="/itinerary" element={<MyItinerary />} />
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/admin/places" element={<ManagePlaces />} />
                <Route path="/admin/categories" element={<ManageCategories />} />
                <Route path="/admin/facilities" element={<ManageFacilities />}/>
                <Route path="/admin/media" element={<ManageMedia />} />
                <Route path="/admin/users" element={<ManageUsers />} />
                <Route path="/admin/users" element={<ManageUsers />} />
                
            </Routes>
        </Router>
    );
};

export default App;