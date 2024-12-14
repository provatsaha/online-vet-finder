import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Components/Home/Home";
import Navbar from "./Components/Navbar";
import Profile from "./Components/Profile/Profile";
import { Toaster } from "react-hot-toast";
import Mypets from "./Components/Mypets/Mypets";
import NewPet from "./Components/NewPet/NewPet";
import EditPet from "./Components/EditPet/EditPet";

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
			</Routes>
		</Router>
	);
};

export default App;
