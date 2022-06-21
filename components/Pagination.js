import React from 'react';
import ReactPaginate from 'react-paginate';

export default function Pagination(props) {
  return (
    <div dir='ltr' className='paginationContainer'>
      <ReactPaginate
        className='pagination'
        breakClassName='treeDot'
        activeClassName='activePage'
        pageClassName='pageLi'
        pageLinkClassName='pageA'
        previousClassName= 'prevLi'
        nextClassName= 'nextLi'
        breakLabel='...'
        nextLabel='→'
        previousLabel='←'
        onPageChange={(e) => props.goToPage(e.selected + 1)}
        pageRangeDisplayed={3}
        marginPagesDisplayed={2}
        pageCount={props.totalPages}
        renderOnZeroPageCount={null}
        forcePage={props.forcePage}
      />
    </div>
  );
}
