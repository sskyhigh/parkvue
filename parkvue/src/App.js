import './App.css';
import SearchMenu from './Components/SearchMenu';
import NavBar from './Components/NavBar/NavBar';
import HomeBanner from './Components/HomeBanner';
import MapSelect from './Components/HomeAd/MapSelect';
import Reserve from './Components/HomeAd/Reserve';
import UploadListing from './Components/HomeAd/UploadListing';
import {Route, Routes} from 'react-router-dom'
import Home from './Pages/Home';
import Login from './Pages/Login';
import Register from './Pages/Register';
import {Toaster} from 'react-hot-toast';
import axios from "axios";
import {UserContextProvider} from "./context/userContext";
// connects frontend to backend
axios.defaults.baseURL = "http://localhost:8000";
axios.defaults.withCredentials = true;

function App() {
    return (
        <div className="App">
            <NavBar/>
            {/*defines the position and duration*/}
            <Toaster position='bottom-center' toastOptions={{duration: 2000}}/>
            <Routes>
                <Route path="/" element={
                    <UserContextProvider>
                        <HomeBanner/>
                        <SearchMenu/>
                        <Reserve/>
                        <UploadListing/>
                        <MapSelect/>
                    </UserContextProvider>
                }/>

                {/*
                Defining the routes
                website.com/register => registers accounts
                website.com/login => sends to login
                website.com/home => sends to homepage
                */}

                <Route path="/register" element={<Register/>}/>
                <Route path="/login" element={<Login/>}/>
                <Route path="/home" element={<Home/>}/>
            </Routes>
            {/* Box Icons */}
            <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/boxicons@latest/css/boxicons.min.css"/>
            {/* Link To JS */}
        </div>
    );
}


export default App;