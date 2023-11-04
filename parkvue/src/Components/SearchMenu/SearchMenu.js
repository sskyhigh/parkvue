import '../SearchMenu/SearchMenu.css';

function SearchMenu() {
    return (
        <div>
            {/* <!-- Search Menu --> */}
            <div class="form-container">
                <form action="">
                    <div class="input-box">
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

                    <div className="input-box">
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
                    <div className="input-box">
                        <span>Time-Out</span>
                        <input type="time" name="" id=""/>
                    </div>
                    <div className="form-container">
                    </div>
                    <button> Submit</button>
                    <button> Submit</button>
                </form>
            </div>
        </div>
    );
}

export default SearchMenu;

