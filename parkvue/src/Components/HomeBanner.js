import '../../src/App.css';

function HomeBanner() {
  return (
    <div>
 <section className="home" id="home">
          <div className="text">
            {/* <span> Color text </span> */}
            <h1><span>Discover, <br />Earn, and Share. </span></h1>
            <p>Tell us your parking needs <br /> - where and when - <br /> and we'll locate the ideal spot for you.</p>
            return(
            <div className="app-stores">
              <img src="public\img\ios.png" alt="Download App for Android Phones" />
              <img src="public\img\play.png" alt="Download App for Apple phones" />
            </div>
            );
          </div>
          </section>
    </div>
  );
}


export default HomeBanner;