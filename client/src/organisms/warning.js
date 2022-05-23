import { Alert, Button  } from 'react-bootstrap'
import styled from 'styled-components';

const Body = styled.div`
    position:absolute;
    top:0;
    left:0;
    width:100%;
    height:100%;
    background:rgba(0,0,0,0.9);
    z-index:10;
`

const Waring = ({ alertShow, onClick, onClose, titleText, mainText, btnText }) => {
    const alertStyle={
        position:'absolute',
        top:'50%',
        left:'50%',
        transform:'translate(-50%, -50%)',
        width:'500px'
    }

    return(
        <Body>
            <Alert 
                show={alertShow} 
                onClose={onClose} 
                variant="danger" 
                dismissible 
                style={alertStyle}
            >
                <Alert.Heading>{titleText}</Alert.Heading>
                <p>{mainText}</p>
                <div className="d-flex justify-content-end">
                    <Button variant="outline-danger" onClick={onClick} >
                        {btnText}
                    </Button>
                </div>
            </Alert> 
        </Body>
    )
}

export default Waring;