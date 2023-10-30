import './App.css';
import SearchMenu from './Components/SearchMenu';
import NavBar from './Components/NavBar/NavBar';
import HomeBanner from './Components/HomeBanner';
import MapSelect from './Components/HomeAd/MapSelect';
import Reserve from './Components/HomeAd/Reserve';
import UploadListing from './Components/HomeAd/UploadListing';
import {Routes, Route} from 'react-router-dom'
import Home from './Pages/Home';
import Login from './Pages/Login';
import Register from './Pages/Register';

function App() {
    return (
        <div className="App">
            <NavBar/>
            <Routes>
                <Route path="/home" element={
                    <>
                        <Home />git
                        <HomeBanner/>
                        <SearchMenu/>
                        <Reserve/>
                        <UploadListing/>
                        <MapSelect/>
                    </>
                }/>
                <Route path="/register" element={<Register />}/>
                <Route path="/login" element={<Login />}/>
            </Routes>
            {/* Box Icons */}
            <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/boxicons@latest/css/boxicons.min.css" />
            {/* Link To JS */}
        </div>
    );
}


export default App;