import './App.css';
import NavBar from './Components/NavBar';

function App() {
  return (
    <div className="App">
      <title>parkvue</title>
        {/* Box Icons */}
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/boxicons@latest/css/boxicons.min.css" />
        {/* NavBar */}
        <NavBar/>
        {/* Home Banner*/}
        <section className="home" id="home">
          <div className="text">
            {/* <span> Color text </span> */}
            <h1><span>Discover, <br />Earn, and Share. </span></h1>
            <p>Tell us your parking needs <br /> - where and when - <br /> and we'll locate the ideal spot for you.</p>
            return(
            <div className="app-stores">
              <img src="my-react-app/public/ios.png" alt="Download App for Android Phones" />
              <img src="my-react-app/public/play.png" alt="Download App for Apple phones" />
            </div>
            );
          </div>
          </section>
          {/* Search Menu */}
          <SearchMenu/>
        {/* Home Ad: Reserve a Spot Service*/}
        <section className="ride" id="ride">
          <div className="heading">
            <span>How It Works</span>
            <h1>Book With 3 Easy Steps</h1>
          </div>
          <div className="ride-container">
            <div className="box">
              <i className="bx bxs-map" /> {/* boxicons:map: font */}
              <h2>Choose a Location</h2>
              <p>Simplify your journeys with a personalized space, exclusively for you.</p>
            </div>
            <div className="box">
              <i className="bx bxs-calendar-check" /> {/* boxicons:calendar-checker: font */}
              <h2>Check-In <br /> Date &amp; Time</h2>
              <p>Save time, money &amp; hassle by booking your space before you set out.</p>
            </div>
            <div className="box">
              <i className="bx bxs-calendar-star" /> {/* boxicons:calendar-star: font */}
              <h2>Reserve A Spot</h2>
              <p>Find the best spot, see exactly what you're paying &amp; even extend your stay.</p>
            </div>
          </div>
        </section>
        {/* Home Ad: Upload Listing Service */}
        <section className="ride" id="ride">
          <div className="heading">
            <span>How It Works</span>
            <h1>Share With 3 Easy Steps</h1>
          </div>
          <div className="ride-container">
            <div className="box">
              <i className="bx bxs-map" /> {/* boxicons:map: font */}
              <h2>Location Address</h2>
              <p>....</p>
            </div>
            <div className="box">
              <i className="bx bxs-calendar-check" /> {/* boxicons:calendar-checker: font */}
              <h2>Avalibilty <br /> Date &amp; Time</h2>
              <p>....</p>
            </div>
            <div className="box">
              <i className="bx bxs-calendar-star" /> {/* boxicons:calendar-star: font */}
              <h2>Parking Space Type</h2>
              <p>....</p>
            </div>
          </div>
        </section>
        {/*Home Ad:  Map Selection Services */}
        <section className="services" id="services">
          <div className="heading">
            <span>Refine Your Parking Experience</span>
            <h1>Discover Available Parking Spots in Your City</h1>
          </div>
          <div className="services-container">
            <div className="box">
              <div className="box-img">
                <img src="my-react-app/public/Car-Park-gates-ave-brooklyn,-654444,-73024_1682971378.2875_648x400.jpg" alt="Car-Park-gates-ave-brooklyn" />
              </div>
              <h2>Secured, Indoor Covered emote Parking Space</h2>
              <p>Gates Ave Bedford</p>
              <h4><i className="bx bx-time-five" /> $1.62 <span>/hourly</span></h4>|<h4><i className="bx bx-calendar" /> $443.75 <span>/monthly</span></h4>
              <a href="#" className="btn">Book Now</a>
            </div>
            <div className="box">
              <div className="box-img">
                <img src="my-react-app/public/Car-Park-summerfield-street-ridgewood,-655745,-77781_1690979739.2012.jpeg" alt="Car-Park-summerfield-street-ridgewood" />
              </div>
              <h2>COVERED AND SECURE PARKING IN RIDGEWOOD/BUSHWICK</h2>
              <p>16-71 Summerfield St Ridgewood</p>
              <h4><i className="bx bx-time-five" /> $1.70 <span>/hourly</span></h4>|<h4><i className="bx bx-calendar" /> $500.00 <span>/monthly</span></h4>
              <a href="#" className="btn">Book Now</a>
            </div>
          </div>
        </section>
        {/* Link To JS */}
      </div>
    );
  }

export default App;