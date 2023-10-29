import './App.css';
import SearchMenu from './Components/SearchMenu/SearchMenu';
import NavBar from './Components/NavBar/NavBar';
import HomeBanner from './Components/HomeBanner/HomeBanner';
import MapSelect from './Components/HomeAd/MapSelect';
import Reserve from './Components/HomeAd/Reserve';
import UploadListing from './Components/HomeAd/UploadListing';

function App() {
  return (
    <div className="App">
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