import styled from 'styled-components';
import { ProfileType, Types } from '../utils/types';

const Box = styled.div`
    display:flex;
    align-items:center;
    gap:15px;
`

const Img = styled.img`
    width:45px;
    height:45px;
    border-radius:50%;
`

interface Nickname {
    nicknameColor?: Types['nicknameColor'];
}

const Nickname = styled.p<Nickname>`
    color:#fff;
    font-size:16px;
    margin:0;
    text-decoration:none;
    color: ${props => props.nicknameColor || "#fff"};
`

const Profile = ({ 
    profileImagePath, 
    nickname, 
    nicknameColor 
}: ProfileType): React.ReactElement => {
    return (
        <Box>
            <Img src={ profileImagePath } alt='프로필 이미지' />
            <Nickname nicknameColor={ nicknameColor }>{ nickname }</Nickname>
        </Box>
    )
}

export default Profile;
