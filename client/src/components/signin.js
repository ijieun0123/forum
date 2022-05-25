import { Row, Form, Col, Button, Modal } from 'react-bootstrap';
import { useState } from 'react';
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import Title from '../atoms/title'

import { useDispatch } from 'react-redux'
import { signin } from '../features/userSlice'

const Signin = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const [modalMessage, setModalMessage] = useState('');
    const [modalOpen, setModalOpen] = useState(false); 
    const handleClose = () => setModalOpen(false);

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

    const getUser = async () => {
        const params = {
            email: email,
            password: password
        }
        try{
            const res = await axios.get('/api/user/get', {params: params});
            const data = res.data[0];
            console.log(data)
            const { _id, profileImage, userName, nickname, email, password } = data;
            if(data){
                dispatch(signin({
                    userId: _id,
                    profileImage: profileImage,
                    userName: userName,
                    nickname: nickname,
                    email: email,
                    password: password,
                    signin: true
                }));
                navigate('/');
            } else {
                setModalMessage('아이디와 비밀번호를 다시 확인해주세요!');
                setModalOpen(true);
            }
        } catch(err){
            console.log(err);
        }
    }

    const onSubmit = e => {
        e.preventDefault();
        getUser();
    }

    return (
        <div>
            <Title text='Sign in' />

            <Form onSubmit={ onSubmit }>
                <Form.Group as={Row} className="mb-3" controlId="formHorizontalEmail">
                    <Form.Label column sm={2}>
                        Email
                    </Form.Label>
                    <Col sm={10}>
                        <Form.Control type="email" placeholder="Email" value={email} onChange={ onChangeEmail }/>
                    </Col>
                </Form.Group>

                <Form.Group as={Row} className="mb-3" controlId="formHorizontalPassword">
                    <Form.Label column sm={2}>
                        Password
                    </Form.Label>
                    <Col sm={10}>
                        <Form.Control type="password" placeholder="Password" value={password} onChange={ onChangePassword }/>
                    </Col>
                </Form.Group>

                <Button type="submit" variant="primary">로그인</Button>
            </Form>

            <Modal show={modalOpen} onHide={ handleClose }>
                <Modal.Header closeButton>
                    <Modal.Title>Sign in guide</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <p>{modalMessage}</p>
                </Modal.Body>

                <Modal.Footer>
                    <Button variant="primary" onClick={ handleClose } >Close</Button>
                    <Button variant="primary" onClick={ () => navigate('/user/signup') } >Signup</Button>
                </Modal.Footer>
            </Modal>
        </div>
    )
}

export default Signin;
