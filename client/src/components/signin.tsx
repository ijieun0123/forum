import { Row, Form, Col, Button, Modal } from 'react-bootstrap';
import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import Title from '../atoms/title.tsx'
import { useDispatch, useSelector } from 'react-redux'
import { SIGNIN, SIGNOUT } from '../features/userSlice.ts'
import Warning from '../organisms/warning.tsx'
import { onChangeText, InputEventType, FormEventType } from '../utils/types.ts'
import { Users } from '../utils/axios.ts'

const Signin = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const [alertMessage, setAlertMessage] = useState('');
    const [alertShow, setAlertShow] = useState(false);

    const alertClose = () => setAlertShow(false);

    const dispatch = useDispatch()
    const navigate = useNavigate();

    const onChangeEmail = (e: InputEventType) => onChangeText(e, setEmail);
    const onChangePassword = (e: InputEventType) => onChangeText(e, setPassword);

    const signin = async (e: FormEventType) => {
        e.preventDefault();
        const body = {
            email: email,
            password: password
        }

        Users.signin(body)
        .then((data) => {
            const { accessToken, refreshTokenId, user } = data;
            localStorage.setItem('accessToken', accessToken);
            localStorage.setItem('refreshTokenId', refreshTokenId);
            dispatch(SIGNIN({
                userName:user.userName,
                email:user.email,
                nickname:user.nickname,
                profileImageName:user.profileImageName,
                profileImagePath:user.profileImagePath
            }));
            navigate('/');
        })
        .catch((err: any)  => {
            console.log(err.response.data);
            setAlertMessage(err.response.data);
            setAlertShow(true);
        })
    }
    
    return (
        <div>
            {
                alertShow
                ? 
                <Warning 
                    onClickBtn={ alertClose } 
                    onClose={ alertClose }
                    alertTitleText="Alert" 
                    mainText={ alertMessage }
                    btnText='Close'
                    alertVariant={ "danger" }
                    btnVariant={ "outline-danger" }
                />
                : null
            }

            <Form onSubmit={ signin }>
                <Title 
                    titleText='Sign in'
                    primaryBtn={ true }
                    primaryBtnText="Sign in"
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

export default Signin;
