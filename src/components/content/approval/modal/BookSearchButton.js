import React, { useEffect, useState } from 'react';
import { Button } from 'antd';
import BookSearchModal from "./BookSearchModal";

const BookSearchButton = () => {
    const [isModalOpen, setIsModalOpen] = useState({open:'', type:''});
    const [data, setData] = useState();
    const [result, setResult] = useState();

    /** 모달 열기1 */
    const showModal1 = () => setIsModalOpen({open:true, type:'1'});
    /** 모달 닫기 */
    const hideModal = () => setIsModalOpen({...isModalOpen, open:false});
    
    /** 결과값 */
    const getData = (getData) => {
        setData(getData);
    };

    useEffect(() => {
        setResult(JSON.stringify(data));
    },[data]);

    return (
        <>
            <BookSearchModal isModalOpen={isModalOpen} handleCancel={hideModal} getData={getData}/>
            <Button type="primary" onClick={showModal1}>도서검색</Button>
            <p>{result}</p>
        </>
    );
};
export default BookSearchButton;