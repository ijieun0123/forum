import { Row, Form, Col, Button, Modal } from 'react-bootstrap';
import { useState } from 'react';
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import Title from '../atoms/title'
import { useDispatch, useSelector } from 'react-redux'
import { SIGNIN, SIGNOUT } from '../features/userSlice'
import Warning from '../organisms/warning'
import instance from '../utils/instance';

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

    const onChangeEmail = e => {
        let newEmail = e.target.value;
        setEmail(newEmail);
    }

    const onChangePassword = e => {
        let newPassword = e.target.value;
        setPassword(newPassword);
    }

    const deleteToken = async () => {
        try{
            const res = await instance.delete(`/api/user/delete/refreshToken`);
            console.log(res.data);
            setAlertMessage('탈퇴되었습니다.');
            dispatch(SIGNOUT({}));
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshTokenId');
            navigate('/');
            deleteToken();
        } catch(err){
            console.log(err);
            setAlertMessage(err.response.data);
        }
    }

    const deleteUser = async () => {
        setEnsureDelete(true)
        
        const body = {
            email: email,
            password: password
        }
        try{
            const res = await instance.post(`/api/user/delete`, body);
            console.log(res.data);
            deleteToken();
        } catch(err){
            console.log(err);
            setAlertMessage(err.response.data);
        }
    }

    const onSubmit = (e) => {
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
                    onClickBtn={ ensureDelete ? alertClose : deleteUser } 
                    onClose={ alertClose }
                    titleText="경고" 
                    mainText={ alertMessage }
                    btnText={ ensureDelete ? '닫기' : '탈퇴하기' } 
                    variant={ "danger" }
                    btnVariant={ "outline-danger" }
                />
                : null
            }

            <Form onSubmit={ onSubmit }>
                <Title 
                    titleText='Withdrawal'
                    warnBtn={ true }
                    primaryBtn={ false }
                    warnBtnText={ '탈퇴하기' }
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
