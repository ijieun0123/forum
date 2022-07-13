import styled from 'styled-components';
import { EyeCountType } from '../utils/types';

const Icon = styled.img`
    width:22px;
    margin-right:10px;
`

const Count = styled.span`
    color:#888;
    font-size:15px;
`

const EyeCount = ({ viewCount }: EyeCountType): React.ReactElement => {
    return (
        <div>
            <Icon src='../../img/eye.svg' alt="조회수" />
            <Count>{viewCount}</Count>
        </div>
    )
}

export default EyeCount;
