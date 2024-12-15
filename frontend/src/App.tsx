import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Components/Home/Home";
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

const App = () => {
	return (
		<Router>
			<Toaster />
			<Navbar />
			<Routes>
				<Route path="/" element={<Home />} />
				<Route path="/profile" element={<Profile />} />
				<Route path="/mypets" element={<Mypets />} />
				<Route path="/newpet" element={<NewPet />} />
				<Route path="/editpet/:id" element={<EditPet />} />
				<Route path="/vet-profile" element={<VetProfile />} />
				<Route path="/vet-profile/manage" element={<Manage />} />
				<Route
					path="/vet-profile/manage/new-service"
					element={<NewService />}
				/>
				<Route
					path="/vet-profile/manage/:id"
					element={<EditService />}
				/>
			</Routes>
		</Router>
	);
};

export default App;
