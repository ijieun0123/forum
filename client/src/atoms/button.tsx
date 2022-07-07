import { Button } from 'react-bootstrap'; 

type Btn = {
    value: string;
    onClick?: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void; 
    margin: string | number;
    variant: string;
    size?: "sm" | "lg";
    type?: "submit";
    disabled?: boolean;
};

const Btn = ({ 
    value, 
    onClick, 
    margin, 
    variant, 
    size, 
    type, 
    disabled 
}: Btn): React.ReactElement => {
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
