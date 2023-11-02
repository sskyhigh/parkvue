import '../../../src/App.css';
import BookNow from '../BookNow';

function MapSelect() {
    return (
        <div>
            <section className="services" id="services">
                <div className="heading">
                    <span>Refine Your Parking Experience</span>
                    <h1>Discover Available Parking Spots in Your City</h1>
                </div>
                <div className="services-container">
                    <div className="box">
                        <div className="box-img">
                            <img src="public\img\Car-Park-gates-ave-brooklyn,-654444,-73024_1682971378.2875_648x400.jpg"
                                 alt="Car-Park-gates-ave-brooklyn"/>
                        </div>
                        <h2>Secured, Indoor Covered Remote Parking Space</h2>
                        <p>Gates Ave Bedford</p>
                        <h4><i className="bx bx-time-five"/> $1.62 <span>/hourly</span></h4>|<h4><i
                        className="bx bx-calendar"/> $443.75 <span>/monthly</span></h4>
                        <BookNow/>
                    </div>
                    <div className="box">
                        <div className="box-img">
                            <img
                                src="public\img\Car-Park-summerfield-street-ridgewood,-655745,-77781_1690979739.2012.jpeg"
                                alt="Car-Park-summerfield-street-ridgewood"/>
                        </div>
                        <h2>COVERAGE AND SECURE PARKING IN RIDGEWOOD/BUSHWICK</h2>
                        <p>16-71 Summerfield St Ridgewood</p>
                        <h4><i className="bx bx-time-five"/> $1.70 <span>/hourly</span></h4>|<h4><i
                        className="bx bx-calendar"/> $500.00 <span>/monthly</span></h4>
                        <BookNow/>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default MapSelect;