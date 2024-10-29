import React from 'react';
import './SearchMenu.css';

function SearchMenu() {
    return (
        <div>
            {/* Search Menu */}
            <div className="form-container">
                <form action="">
                    {/* Input Boxes */}
                    {renderInputBox('Location', 'search', 'Search Places')}
                    {renderInputBox('Check-In', 'date')}
                    {renderInputBox('Check-Out', 'date')}

                    {/* Filter Add-on */}
                    {renderInputBox('Refine Your Search', 'dropdown', 'Select a Filter', [
                        'Parking Type',
                        'Handicap Access',
                        'Security Level',
                        'EV Charging',
                    ])}

                    {renderInputBox('Time-In', 'time')}
                    {renderInputBox('Time-Out', 'time')}

                    <button type="submit">Submit</button>
                </form>
            </div>
        </div>
    );
}

// Helper function to render input boxes
function renderInputBox(label, type, placeholder, options) {
    return (
        <div className="input-box" key={label}>
            <span>{label}</span>
            {type === 'dropdown' ? (
                <div className="search-container">
                    <div className="filter-dropdown">
                        <select id="filter">
                            <option value="" disabled hidden>
                                {placeholder}
                            </option>
                            {options.map((option) => (
                                <option key={option} value={option}>
                                    {option}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            ) : (
                <input
                    type={type}
                    placeholder={placeholder}
                    name=""
                    id=""
                    {...(type === 'date' || type === 'time' ? { required: true } : {})}
                />
            )}
        </div>
    );
}

export default SearchMenu;
