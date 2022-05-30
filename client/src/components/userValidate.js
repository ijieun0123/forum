import { Row, Form, Col, Button, Modal } from 'react-bootstrap';
import { useState } from 'react';
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import Title from '../atoms/title'
import { useDispatch, useSelector } from 'react-redux'
import { signin, signout } from '../features/userSlice'
import Warning from '../organisms/warning'

const UserValidate = () => {

    const user = useSelector(state => state.user.user);

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const [validation, setValidation] = useState(false);
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

    const deleteUser = async () => {
        try{
            const res = await axios.post(`/api/user/delete/${user.userId}`);
            console.log(res.data);
            dispatch(signout({
                userId: '',
                profileImage: '',
                profileImageValue: '',
                userName: '',
                nickname: '',
                email: '',
                password: '',
                signin: false
            }));
            navigate('/');
        } catch(err){
            console.log(err);
        }
    }

    const getUser = async () => {
        const body = {
            email: email,
            password: password
        }
        try{
            const res = await axios.post('/api/user/get', body);
            const data = res.data[0];
            console.log(data)
            const { _id, profileImage, profileImageValue, userName, nickname, email, password } = data;
            if(!user.signin){
                dispatch(signin({
                    userId: _id,
                    profileImage: profileImage,
                    profileImageValue: profileImageValue,
                    userName: userName,
                    nickname: nickname,
                    email: email,
                    password: password,
                    signin: true
                }));
                navigate('/');
            } else{
                setValidation(true);
                setAlertMessage('탈퇴할 경우, 회원정보 복구가 어렵습니다. 정말 탈퇴하시겠습니까?');
                setAlertShow(true);
            }
        } catch(err){
            console.log(err);
            setAlertMessage('아이디와 비밀번호를 다시 확인해주세요!');
            setAlertShow(true);
        }
    }

    const onSubmit = e => {
        e.preventDefault();
        getUser();
    }

    return (
        <div>
            <Title 
                text={ user.signin ? 'Validation' : 'Sign in' } 
                deleteBtn={ user.signin ? true : false }
                updateBtn={ user.signin ? false : true }
                clickDeleteBtn={ getUser }
                clickUpdateBtn={ onSubmit }
                updateBtnText="로그인"
                deleteBtnText={ '탈퇴하기' }
            />

            {
                alertShow
                ? 
                <Warning 
                    onClickBtn={ validation ? deleteUser : alertClose } 
                    onClose={ () => { setAlertShow(false)} }
                    titleText="경고" 
                    mainText={ alertMessage }
                    btnText={ validation ? "탈퇴하기" : "닫기" }
                    variant={ "danger" }
                    btnVariant={ "outline-danger" }
                />
                : null
            }

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

                <Button type="submit" style={{display:'none'}}>로그인</Button>
            </Form>
        </div>
    )
}

export default UserValidate;
