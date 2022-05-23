import styled from 'styled-components';

const Icon = styled.img`
    width:22px;
    margin-right:10px;
`

const Count = styled.span`
    color:#888;
    font-size:15px;
`

const EyeCount = ({ count }) => {
    return (
        <div>
            <Icon src='../../img/eye.svg' alt="조회수" />
            <Count>{count}</Count>
        </div>
    )
}

export default EyeCount;
