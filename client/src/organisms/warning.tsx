import { Alert, Button  } from 'react-bootstrap'
import styled from 'styled-components';
import { WarningType } from '../utils/types'

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
    alertTitleText, 
    mainText, 
    btnText, 
    alertVariant, 
    btnVariant 
}: WarningType): React.ReactElement => {
    
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
                variant={alertVariant}
                dismissible 
                style={alertStyle}
            >
                <Alert.Heading>{alertTitleText}</Alert.Heading>
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