import './App.css';

function NavBar() {
  return (
      <header>
            <a href="#" class="logo_img">
              <img src="public\img\new_home.png"/></a>

            <div class="bx_bx-menu" id="menu-icon"></div>
            <ul class="navbar">
                <li><a href="#home">Home</a></li>  
                <li><a href="#map">Map</a></li> 
                <li><a href="#rewards">Rewards</a></li>
                <li><a href="#about">About</a></li>
            </ul>

            <div class="header-btn">
                <a href="#" class="sign_up">Sign Up</a>
                <a href="#" class="sign_in">Sign In</a>
            </div>
        </header>
  );
}

export default NavBar;