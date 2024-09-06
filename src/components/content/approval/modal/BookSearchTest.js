import React, { useEffect, useState } from 'react';
import BookSearchModal from "./BookSearchModal";

const Test = () => {
    const [data, setData] = useState();
    const [result, setResult] = useState();

    const getData = BookSearchModal => {
        setData(BookSearchModal);
    };

    useEffect(() => {
        if(data !== undefined){
        const p = document.getElementById("testResult");
        p.innerText = data.title;
    }
    });

    return (
        <>
            <BookSearchModal getData={getData} />
            <p id="testResult">{result}</p>
        </>
    );
};
export default Test;