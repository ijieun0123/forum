import Pagination from 'react-js-pagination';
import { PagingType } from '../utils/types'

const Paging = ({ 
    activePage, 
    itemsCountPerPage,
    totalItemsCount,
    onChangePage
 }: PagingType): React.ReactElement => {

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