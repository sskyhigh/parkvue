import '../../src/App.css';
// import logo from '../img/new_parkvue_logo.png';
import SignUp from '../Components/SignUp'
import SignIn from '../Components/SignIn'

function NavBar() {
    return (
        <header>
            <a href="#" class="logo_img">
                {/* <img src={logo} alt={'test'}/> */}
            </a>

            <div class="bx_bx-menu" id="menu-icon"></div>
            <ul class="navbar">
                <li><a href="#home">Home</a></li>
                <li><a href="#map">Map</a></li>
                <li><a href="#rewards">Rewards</a></li>
                <li><a href="#about">About</a></li>
            </ul>

            <div class="header-btn">
                <SignUp/>
                <SignIn/>
            </div>
        </header>
    );
}

export default NavBar;