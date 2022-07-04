import { Row, Form, Col, Button, Modal } from 'react-bootstrap';
import { useState } from 'react';
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import Title from '../atoms/title'
import { useDispatch, useSelector } from 'react-redux'
import { SIGNIN, SIGNOUT } from '../features/userSlice'
import Warning from '../organisms/warning'
import instance from '../utils/instance';

const Signin = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const [alertMessage, setAlertMessage] = useState('');
    const [alertShow, setAlertShow] = useState(false);

    const alertClose = () => setAlertShow(false);

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

    const signin = async (e) => {
        e.preventDefault();
        const body = {
            email: email,
            password: password
        }
        try{
            const res = await axios.post('/api/user/signin', body);
            const { accessToken, refreshTokenId, user } = res.data;
            console.log(accessToken)
            console.log(refreshTokenId)
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
        } catch(err){
            console.log(err.response.data);
            setAlertMessage(err.response.data);
            setAlertShow(true);
        }
    }
    
    return (
        <div>
            {
                alertShow
                ? 
                <Warning 
                    onClickBtn={ alertClose } 
                    onClose={ alertClose }
                    titleText="경고" 
                    mainText={ alertMessage }
                    btnText='닫기'
                    variant={ "danger" }
                    btnVariant={ "outline-danger" }
                />
                : null
            }

            <Form onSubmit={ signin }>
                <Title 
                    titleText='Sign in'
                    primaryBtn={ true }
                    primaryBtnText="로그인"
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
