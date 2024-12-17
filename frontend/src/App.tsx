import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Components/Home/Home";
import Contact from "./Components/Contact/Contact";
import Navbar from "./Components/Navbar";
import Profile from "./Components/Profile/Profile";
import { Toaster } from "react-hot-toast";
import Mypets from "./Components/Mypets/Mypets";
import NewPet from "./Components/NewPet/NewPet";
import EditPet from "./Components/EditPet/EditPet";
import VetProfile from "./Components/VetProfile/VetProfile";
import Manage from "./Components/VetProfile/Manage/Manage";
import NewService from "./Components/VetProfile/Manage/NewService/NewService";
import EditService from "./Components/VetProfile/Manage/EditService/EditService";
import Login from "./Components/Login/Login";
import { AuthProvider } from "./Context/AuthContext";
import ForgotPassword from "./Components/Login/ForgotPassword";
import SearchPage from "./Components/Search/Search";
import ViewVetProfile from "./Components/VetProfile/ViewVetProfile/ViewVetProfile";
import VetService from "./Components/VetProfile/ViewVetProfile/VetService/VetService";

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Toaster />
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/mypets" element={<Mypets />} />
          <Route path="/newpet" element={<NewPet />} />
          <Route path="/editpet/:id" element={<EditPet />} />
          <Route path="/vet-profile" element={<VetProfile />} />
          <Route path="/vet-profile/:id" element={<ViewVetProfile />} />
          <Route path="/vet-profile/:id/service" element={<VetService />} />
          <Route path="/vet-profile/manage" element={<Manage />} />
          <Route
            path="/vet-profile/manage/new-service"
            element={<NewService />}
          />
          <Route path="/vet-profile/manage/:id" element={<EditService />} />
          <Route path="/search" element={<SearchPage />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
