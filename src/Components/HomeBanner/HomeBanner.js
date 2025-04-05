import "./HomeBanner.css";
import appstore from "../../img/ios.png";
import playstore from "../../img/play.png";
import { Typography } from "@mui/material";
import SearchMenu from "../SearchMenu/SearchMenu";

function HomeBanner() {
  return (
    <div>
      <section
        className="home"
        id="home"
        style={{ position: "relative", padding: "20px" }}
      >
        {/* Desktop version (hidden on small screens) */}
        <Typography
          variant="h6"
          component="h1"
          noWrap
          sx={{
            flexGrow: 1,
            display: { xs: "none", md: "flex" },
            flexDirection: "column", // Stack elements vertically on medium screens
            justifyContent: "center", // Vertically center content
            alignItems: "flex-start", // Align text to the left on medium screens
            textAlign: "left",
            height: "100vh", // Make sure content takes up full viewport height
          }}
        >
          <div className="text" style={{ padding: "20px" }}>
            <h1 style={{ fontSize: "2.5rem", marginBottom: "20px" }}>
              <span>
                Discover, <br />
                Earn, and Share.
              </span>
            </h1>
            <p style={{ fontSize: "1.2rem", marginBottom: "20px" }}>
              Tell us your parking needs <br /> - where and when - <br /> and
              we'll locate the ideal spot for you.
            </p>

            <div
              className="app-stores"
              style={{ display: "flex", gap: "20px" }}
            >
              <img
                src={appstore}
                alt="Download App for Android Phones"
                style={{ maxWidth: "150px", width: "100%" }}
              />
              <img
                src={playstore}
                alt="Download App for Apple phones"
                style={{ maxWidth: "150px", width: "100%" }}
              />
            </div>
          </div>
        </Typography>

        {/* Mobile version (hidden on large screens) */}
        <Typography
          variant="h6"
          component="h1"
          noWrap
          sx={{
            flexGrow: 1,
            display: { xs: "flex", md: "none" },
          }}
        >
          <SearchMenu />
        </Typography>
      </section>
    </div>
  );
}

export default HomeBanner;
