import Pagination from 'react-js-pagination';

type Paging = {
    activePage: number;
    itemsCountPerPage: number;
    totalItemsCount: number;
    onChangePage: (pageNumber: number) => void;
}

const Paging = ({ 
    activePage, 
    itemsCountPerPage,
    totalItemsCount,
    onChangePage
 }: Paging): React.ReactElement => {

    return(
        <Pagination
            activePage={activePage}
            itemsCountPerPage={itemsCountPerPage}
            totalItemsCount={totalItemsCount}
            pageRangeDisplayed={5}
            prevPageText={'‹'}
            nextPageText={'›'}
            onChange={onChangePage}
            linkClass="page-link"
            innerClass="pagination justify-content-center"
            itemClass="page-item"
        />
    )
}

export default Paging;