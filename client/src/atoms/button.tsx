import { Button } from 'react-bootstrap'; 
import { BtnType } from '../utils/types';

const Btn = ({ 
    btnText, 
    onClick, 
    margin, 
    btnVariant, 
    size, 
    type, 
    disabled 
}: BtnType): React.ReactElement => {
    return (
        <Button 
            onClick={ onClick }
            variant={ btnVariant } 
            style={{ margin: margin }}
            size={ size }
            type={ type }
            disabled = { disabled }
        >
            { btnText }
        </Button>
    )
}

export default Btn;
