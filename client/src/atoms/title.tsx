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

type Title = {
    titleText: string;
    warnBtn?: boolean | undefined;
    primaryBtn?: boolean | undefined;
    clickWarnBtn?: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
    clickPrimaryBtn?: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
    primaryBtnText?: string;
    warnBtnText?: string;
}

const Title = ({ 
    titleText, 
    warnBtn, 
    primaryBtn, 
    clickWarnBtn, 
    clickPrimaryBtn, 
    primaryBtnText, 
    warnBtnText 
}: Title): React.ReactElement => {
    return (
        <TitleBox>
            <H3>{ titleText }</H3>

            <div>
                {
                    primaryBtn
                    ? 
                    <Button 
                        variant="outline-primary" 
                        style={{marginRight:10}} 
                        onClick={ clickPrimaryBtn }
                        type="submit"
                    >
                        { primaryBtnText }
                    </Button>
                    : null
                }
                {
                    warnBtn
                    ? 
                    <Button 
                        variant="outline-danger" 
                        onClick={ clickWarnBtn }
                        type="submit"
                    >
                        { warnBtnText }
                    </Button>
                    : null
                }
            </div>
        </TitleBox>
    )
}

export default Title;