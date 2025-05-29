import React from 'react';
import Pagination from 'react-bootstrap/Pagination';
import 'bootstrap/dist/css/bootstrap.min.css';

const PaginationComp = ({totalPosts, postsPerPage, setCurrentPage,currPage=1}) => {
    let pages = [];

    for (let i = 1; i<= Math.ceil(totalPosts/postsPerPage); i++){
        pages.push(i);
    }

    const togglePageNum = (pageNum) => {
        if (pageNum === pages.length + 1 || pageNum === 0 ) return;
        setCurrentPage(pageNum);
    }

    return (
        <nav aria-label="..." style={{display:"flex", justifyContent:"end", alignItems:"center"}}>
            <ul className="pagination">
                <li className="page-item"><a href="#" className="page-link" onClick={() => togglePageNum(currPage - 1)}>Previous</a></li>
                {pages.map((pageNum, idx) => {
                    if (pageNum === currPage) return <li className="page-item active" key={idx} onClick={() => togglePageNum(pageNum)}><a className="page-link" href="#" aria-current="page">{pageNum}</a></li>
                    else return <li className="page-item" key={idx} onClick={() => togglePageNum(pageNum)}><a className="page-link" href="#">{pageNum}</a></li>
                })}
                <li className="page-item"><a className="page-link" href="#" onClick={() => togglePageNum(currPage + 1)}>Next</a></li>
            </ul>
        </nav>
    )
}

export default PaginationComp;