import React from 'react';
import './Menu.css';

function Menu() {
    return (
    <div className="menu">
        <ul>
            <li><a href="/Home">Home</a></li>
            {/* 다른 메뉴 항목 추가 */}
        </ul>
    </div>
    );
}

export default Menu;
