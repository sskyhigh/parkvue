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
      <Routes>
        <Route path="/" element={<Home />}/>
        <Route path="/register" element={<Register />}/>
      </Routes>
      <title>parkvue</title>
        {/* Box Icons */}
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/boxicons@latest/css/boxicons.min.css" />
        {/* NavBar */}
        <NavBar/>
        {/* Home Banner*/}
       <HomeBanner/>
       {/* Search Menu */}
       <SearchMenu/>
        {/* Home Ad: Reserve a Spot Service*/}
        <Reserve/>
        {/* Home Ad: Upload Listing Service */}
        <UploadListing/>
        {/*Home Ad:  Map Selection Services */}
        <MapSelect/>
        {/* Link To JS */}
      </div>
    );
  }

export default App;