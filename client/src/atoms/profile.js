import styled from 'styled-components';

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

const Nickname = styled.p`
    color:#fff;
    font-size:16px;
    margin:0;
    text-decoration:none;
    color: ${props => props.nicknameColor || "#fff"};
`

const Profile = ({ src, nickname, nicknameColor }) => {
    return (
        <Box>
            <Img src={ src } alt='프로필 이미지' />
            <Nickname nicknameColor={ nicknameColor }>{ nickname }</Nickname>
        </Box>
    )
}

export default Profile;
