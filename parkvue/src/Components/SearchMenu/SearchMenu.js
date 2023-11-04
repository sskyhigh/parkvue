import '../SearchMenu/SearchMenu.css';

function SearchMenu() {
<<<<<<< HEAD:parkvue/src/Components/SearchMenu.js
    return (
        <div>
            {/* <!-- Search Menu --> */}
            <div className="form-container">
                <div className="input-box">
                    <span>Location</span>
                    <input type="search" name="" id="" placeholder="Search Places"/>

                </div>
                <div className="input-box">
                    <span>Check-In</span>
                    <input type="date" name="" id=""/>
                </div>
                <div className="input-box">
                    <span>Check-Out</span>
                    <input type="date" name="" id=""/>
                </div>
                {/* <!-- Filter Add on --> */}
                <form action="">
                    <div className="input-box">
=======
  return (
  <div>
    {/* <!-- Search Menu --> */}
    <div class="form-container">
    <form action="">
        
      <div class="input-box">
        <span>Location</span>
        <input type="search" name="" id="" placeholder="Search Places"/>
        </div>

        <div class="input-box">
          <span>Check-In</span>
          <input type="date" name="" id=""/>
          </div>

                <div class="input-box">
                    <span>Check-Out</span>
                    <input type="date" name="" id=""/>
                </div>
                 {/* <!-- Filter Add on --> */}

                        <div class="input-box">
>>>>>>> e1fc9d1d657c15933dc8d7f4278cdd47cd419ea1:parkvue/src/Components/SearchMenu/SearchMenu.js
                        <span>Refine Your Search</span>
                        {/* <!--  <input type="" name="" id="" placeholder="Search Places"> --> */}
                        <div className="search-container">
                            <div className="filter-dropdown">
                                <select id="filter">
                                    <option value="parking type">Parking Type</option>
                                    <option value="handicap">Handicap Access</option>
                                    <option value="security">Security Level</option>
                                    <option value="ev">EV Charging</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="input-box">
                        <span>Time-In</span>
                        <input type="time" name="" id=""/>
                    </div>
                    <div className ="input-box">
                        <span>Time-Out</span>
                        <input type="time" name="" id=""/>
                    </div>
<<<<<<< HEAD:parkvue/src/Components/SearchMenu.js
                    <div className="form-container">
                    </div>
                    <button> Submit</button>
=======
                    
                <button> Submit </button>
>>>>>>> e1fc9d1d657c15933dc8d7f4278cdd47cd419ea1:parkvue/src/Components/SearchMenu/SearchMenu.js
                </form>
            </div>
        </div>
    );
}

export default SearchMenu;

