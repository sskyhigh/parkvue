import './App.css';
import SearchMenu from './Components/SearchMenu/SearchMenu';
import NavBar from './Components/NavBar/NavBar';
import HomeBanner from './Components/HomeBanner/HomeBanner';
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
import FAQ from './Components/FAQ';
import AboutPage from "./Pages/AboutPage";

// connects frontend to backend
 axios.defaults.baseURL = process.env.REACT_APP_API_URL;
axios.defaults.withCredentials = true;

function App() {
    return (
        <div className="App">
            <UserContextProvider>
                <NavBar/>
                {/*defines the position and duration*/}
                <Toaster position='bottom-center' toastOptions={{duration: 2000}}/>
                <Routes>
                    <Route path="/" element={
                        <>
                            <HomeBanner/>
                            <SearchMenu/>
                            <Reserve/>
                            <UploadListing/>
                            <MapSelect/>
                            <FAQ/>
                        </>
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
                    <Route path="/about" element={<AboutPage/>} />
                </Routes>
            </UserContextProvider>
            {/* Box Icons */}
            <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/boxicons@latest/css/boxicons.min.css"/>
            {/* Link To JS */}
        </div>
    )
}

export default App;
