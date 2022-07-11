import styled from 'styled-components';
import { useSelector } from 'react-redux'
import React from 'react';
import { ReducerType } from '../app/store';
import { User } from '../features/userSlice'
import { HeartCountType } from '../utils/types';

const Button = styled.button`
    cursor:pointer;
    background: none;
    border: none;
`

const Icon = styled.img`
    width:22px;
    margin-right:10px;
`

const Count = styled.span`
    color:#888;
    font-size:15px;
`

const HeartCount = ({ 
    heartCount, 
    onClick, 
    heartFill 
}: HeartCountType): React.ReactElement => {
    const signin = useSelector<ReducerType, User['signin']>(state => state.user.signin);

    return (
        <Button onClick={ signin ? onClick : undefined }>
            <Icon src={ heartFill ? '../../img/heart_true.svg' : '../../img/heart_false.svg' } alt="좋아요" />
            <Count>{heartCount}</Count>
        </Button>
    )
}

export default HeartCount;