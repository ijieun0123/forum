import styled from 'styled-components';

const Box = styled.div`
    position:fixed;
    bottom:100px;
    right:100px;
    display:flex;
    align-items:center;
    justify-content:center;
    width:80px;
    height:80px;
    border-radius:50%;
    background:${props => props.bgColor || "#e5f7fb"};
    cursor:pointer;
`

const Img = styled.img`
    width:40px
`

const CircleBtn = ({ onClick, src, bgColor }) => {
    return (
        <Box onClick={ onClick } bgColor={ bgColor }>
            <Img src={ src ? "../../img/pencile.svg" : "../../img/heart.svg" } />
        </Box>
    )
}

export default CircleBtn;