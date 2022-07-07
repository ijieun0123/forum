import { Alert, Button  } from 'react-bootstrap'
import styled from 'styled-components';

type Warning = {
    alertShow?: boolean;
    onClickBtn: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
    onClose: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
    titleText: string;
    mainText: string;
    btnText: string;
    variant: string;
    btnVariant: string;
}

const Body = styled.div`
    position:fixed;
    top:0;
    left:0;
    width:100%;
    height:100%;
    background:rgba(0,0,0,0.9);
    z-index:10;
`

const Warning = ({ 
    alertShow, 
    onClickBtn, 
    onClose, 
    titleText, 
    mainText, 
    btnText, 
    variant, 
    btnVariant 
}: Warning): React.ReactElement => {
    
    const alertStyle = {
        position:'absolute',
        top:'50%',
        left:'50%',
        transform:'translate(-50%, -50%)',
        width:'500px'
    } as React.CSSProperties

    return(
        <Body>
            <Alert 
                show={alertShow} 
                onClose={onClose} 
                variant={variant}
                dismissible 
                style={alertStyle}
            >
                <Alert.Heading>{titleText}</Alert.Heading>
                <p>{mainText}</p>
                <div className="d-flex justify-content-end">
                    <Button variant={btnVariant} onClick={onClickBtn} >
                        {btnText}
                    </Button>
                </div>
            </Alert> 
        </Body>
    )
}

export default Warning;