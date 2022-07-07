import styled from 'styled-components';
import { useSelector } from 'react-redux'
import React from 'react';
import { ReducerType } from '../app/store';
import { User } from '../features/userSlice'

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

type HeartCount = {
    count: number;
    onClick: (e: React.MouseEvent<HTMLDivElement>) => void;
    fill: boolean;
}

const HeartCount = ({ 
    count, 
    onClick, 
    fill 
}: HeartCount): React.ReactElement => {
    const signin = useSelector<ReducerType, User['signin']>(state => state.user.signin);

    return (
        <Box onClick={ signin ? onClick : undefined }>
            <Icon src={ fill ? '../../img/heart_true.svg' : '../../img/heart_false.svg' } alt="좋아요" />
            <Count>{count}</Count>
        </Box>
    )
}

export default HeartCount;