import React, { useState } from 'react';
import BookSearchModal from "./BookSearchModal";

const Test = () => {
    
    const [data, setData] = useState();
    const getData = BookSearchModal => {
        setData(BookSearchModal);
    };

    return (
        <>
            <BookSearchModal getData={getData} />
            <p>{data}</p>
        </>
    );
};
export default Test;