import './HomeAd.css';

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
                        <i className="bx bxs-map"/> {/* boxicons:map: font */}
                        <h2>List Spot Location</h2>
                        <p>SignIn to begin sharing your spot location(s)</p>
                    </div>

                    <div className="box">
                        <i className="bx bxs-calendar-check"/> {/* boxicons:calendar-checker: font */}
                        <h2> Availability <br/> Date &amp; Time</h2>
                        <p>Promote the (Date/Time) when spot is available.</p>
                    </div>

                    <div className="box">
                        <i className="bx bxs-calendar-star"/> {/* boxicons:calendar-star: font */}
                        <h2>Promote A Spot</h2>
                        <p>Showcase spot amenities and location convenience. </p>
                    </div>
                </div>
            </section>
        </div>
    );
}


export default UploadListing;