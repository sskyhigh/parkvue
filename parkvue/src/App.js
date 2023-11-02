import './App.css';
import SearchMenu from './Components/SearchMenu';
import NavBar from './Components/NavBar';
import HomeBanner from './Components/HomeBanner';
import MapSelect from './Components/HomeAd/MapSelect';
import Reserve from './Components/HomeAd/Reserve';
import UploadListing from './Components/HomeAd/UploadListing';
import FAQ from './Components/FAQ';

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
       <FAQ /> 
      </div>
    );
  }

export default App;