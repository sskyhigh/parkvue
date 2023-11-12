import '../HomeBanner/HomeBanner.css';
import appstore from '../../img/ios.png';
import playstore from '../../img/play.png';

function HomeBanner() {
    return (
        <div>
            <section className="home" id="home">
                <div className="text">
                    {/* <span> Color text </span> */}
                    <h1><span>Discover, <br/>Earn, and Share. </span></h1>
                    <p>Tell us your parking needs <br/> - where and when - <br/> and we'll locate the ideal spot for
                        you.</p>
                    <div className="app-stores">
                        <img src={appstore} alt="Download App for Android Phones"/>
                        <img src={playstore} alt="Download App for Apple phones"/>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default HomeBanner;