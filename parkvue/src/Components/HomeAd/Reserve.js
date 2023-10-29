import '../HomeAd/HomeAd.css';

function Reserve() {
  return (
  <div>
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
                </div>
                );
                }
                export default Reserve;