import styled from 'styled-components';
import { useSelector } from 'react-redux'

const Box = styled.div`
    cursor:pointer;
`

const Icon = styled.img`
    width:22px;
    margin-right:10px;
`

const Count = styled.span`
    color:#888;
    font-size:15px;
`

const HeartCount = ({ count, onClick, fill }) => {
    const signin = useSelector(state => state.user.signin);

    return (
        <Box onClick={ signin ? onClick : null }>
            <Icon src={ fill ? '../../img/heart_true.svg' : '../../img/heart_false.svg' } alt="좋아요" />
            <Count>{count}</Count>
        </Box>
    )
}

export default HeartCount;