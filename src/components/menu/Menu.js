import React from 'react';
import './Menu.css';

function Menu() {
    return (
    <div className="menu">
        <ul>
            <li><a href="/Home">도서 관리</a></li>
            <li><a href="/Home">도서 승인 관리</a></li>
            <li><a href="/Home">사용자 관리</a></li>
            
            {/* 다른 메뉴 항목 추가 */}
        </ul>
    </div>
    );
}

export default Menu;
