import { Row, Form, Col, Button, Modal } from 'react-bootstrap';
import { useState } from 'react';
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import Title from '../atoms/title'
import { useDispatch, useSelector } from 'react-redux'
import { SIGNIN, SIGNOUT } from '../features/userSlice'
import Warning from '../organisms/warning'
import instance from '../utils/instance';
import { 
    onChangeText, 
    InputEventType, 
    BtnMouseEventType, 
    FormEventType 
} from '../utils/types';
import { Users } from '../utils/axios';

const Withdrawal = () => {

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [ensureDelete, setEnsureDelete] = useState(false)

    const [alertMessage, setAlertMessage] = useState('');
    const [alertShow, setAlertShow] = useState(false);

    const alertClose = () => { 
        setAlertShow(false); 
        setEnsureDelete(false); 
    }

    const dispatch = useDispatch()
    const navigate = useNavigate();

    const onChangeEmail = (e: InputEventType) => onChangeText(e, setEmail)
    const onChangePassword = (e: InputEventType) => onChangeText(e, setPassword)

    const withdrawal = async (e: BtnMouseEventType) => {
        setEnsureDelete(true)

        const body = {
            email: email,
            password: password
        }

        Users.withdrawal(body)
        .then(() => {
            setAlertMessage('탈퇴되었습니다.');
            dispatch(SIGNOUT({}));
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshTokenId');
            navigate('/');
        })
        .catch((err: any) => {
            console.log(err);
            setAlertMessage(err.response.data);
        })
        /*
        try{
            const res = await instance.post(`/api/user/withdrawal`, body);
            console.log(res.data);
            setAlertMessage('탈퇴되었습니다.');
            dispatch(SIGNOUT({}));
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshTokenId');
            navigate('/');
        } catch(err: any){
            console.log(err);
            setAlertMessage(err.response.data);
        }
        */
    }

    const onSubmit = (e: FormEventType) => {
        e.preventDefault();
        setAlertShow(true); 
        setAlertMessage('정말 탈퇴하시겠습니까?');
    }

    return (
        <div>
            {
                alertShow
                ? 
                <Warning 
                    onClickBtn={ ensureDelete ? alertClose : withdrawal } 
                    onClose={ alertClose }
                    alertTitleText="Alert" 
                    mainText={ alertMessage }
                    btnText={ ensureDelete ? 'Close' : 'Withdrawal' } 
                    alertVariant={ "danger" }
                    btnVariant={ "outline-danger" }
                />
                : null
            }

            <Form onSubmit={ onSubmit }>
                <Title 
                    titleText='Withdrawal'
                    warnBtn={ true }
                    primaryBtn={ false }
                    warnBtnText={ 'Withdrawal' }
                />

                <Form.Group as={Row} className="mb-3" controlId="formHorizontalEmail">
                    <Form.Label column sm={2}>
                        Email
                    </Form.Label>
                    <Col sm={10}>
                        <Form.Control 
                            type="email" 
                            placeholder="Email" 
                            value={email} 
                            onChange={ onChangeEmail }
                        />
                    </Col>
                </Form.Group>

                <Form.Group as={Row} className="mb-3" controlId="formHorizontalPassword">
                    <Form.Label column sm={2}>
                        Password
                    </Form.Label>
                    <Col sm={10}>
                        <Form.Control 
                            type="password" 
                            placeholder="Password" 
                            value={password} 
                            onChange={ onChangePassword }
                        />
                    </Col>
                </Form.Group>
            </Form>
        </div>
    )
}

export default Withdrawal;
