import '../../../src/App.css';

function UploadListing() {
  return (
  <div>
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
    </div>
  );
}


export default UploadListing;