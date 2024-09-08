import React, { useEffect, useState } from 'react';
import BookSearchModal from "./BookSearchModal";

const Test = () => {
    const [data, setData] = useState();
    const [result, setResult] = useState();

    const getData = BookSearchModal => {
        setData(BookSearchModal);
    };

    useEffect(() => {
        setResult(JSON.stringify(data));
    },[data]);

    return (
        <>
            <BookSearchModal getData={getData} />
            <p>{result}</p>
        </>
    );
};
export default Test;