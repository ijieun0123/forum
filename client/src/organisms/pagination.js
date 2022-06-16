import JwPagination from 'jw-react-pagination'

const Pagination = ({ items, onChangePage }) => {
    const paginationLabels = {
        first: '<<',
        last: '>>',
        previous: '<',
        next: '>'
    };

    const paginationStyle = {
        ul: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin:'30px auto'
        },
    };

    return(
        <JwPagination 
            items={items} 
            onChangePage={onChangePage} 
            pageSize={5}
            maxPages={5}
            styles={paginationStyle}
            labels={paginationLabels}
        />
    )
}

export default Pagination;