import { Button } from 'react-bootstrap'; 

const Btn = ({ value, onClick, margin, variant, size, type, disabled }) => {
    return (
        <Button 
            onClick={ onClick }
            variant={ variant } 
            style={{ margin: margin }}
            size={ size }
            type={ type }
            disabled = { disabled }
        >
            { value }
        </Button>
    )
}

export default Btn;
