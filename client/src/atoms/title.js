import styled from 'styled-components';
import { Button } from 'react-bootstrap'; 

const TitleBox = styled.div`
    display:flex;
    align-items:center;
    justify-content:space-between;
    margin:40px 0;
    padding-bottom:20px;
    border-bottom:1px solid #dbdbdb;
`

const H3 = styled.h3`
    margin:0;
    color:#2a2a2a;
`

const Title = ({ text, deleteBtn, updateBtn, clickDeleteBtn, clickUpdateBtn }) => {
    return (
        <TitleBox>
            <H3>{ text }</H3>

            <div>
                {
                    updateBtn
                    ? 
                    <Button 
                        variant="outline-primary" 
                        style={{marginRight:10}} 
                        onClick={ clickUpdateBtn }
                    >
                        수정하기
                    </Button>
                    : null
                }
                {
                    deleteBtn
                    ? 
                    <Button 
                        variant="outline-danger" 
                        onClick={ clickDeleteBtn }
                    >
                        삭제하기
                    </Button>
                    : null
                }
            </div>
        </TitleBox>
    )
}

export default Title;