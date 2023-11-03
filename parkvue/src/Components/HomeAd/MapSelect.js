import '../HomeAd/HomeAd.css';
import BookNow from './BookNow';
import Park_Gates from '../../img/car_park_gates.jpg'
import Park_SummerField from '../../img/car_park_summerfield_street_ridgewood.jpeg'

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
                            <img src={Park_Gates}
                                 alt="Car Park gates ave brooklyn"/>
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
                                src={Park_SummerField}
                                alt="Car Park summerfield street ridgewood"/>
                        </div>
                        <h2>COVERED AND SECURE PARKING IN RIDGEWOOD/BUSHWICK</h2>
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