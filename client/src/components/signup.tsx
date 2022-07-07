import { Row, Form, Col, Stack, FloatingLabel } from 'react-bootstrap';
import { useState, useRef } from 'react';
import { useNavigate } from "react-router-dom";
import Warning from '../organisms/warning'
import Title from '../atoms/title'
import styled from 'styled-components';
import axios, { AxiosRequestConfig, AxiosResponse} from 'axios';

const Img = styled.img`
    display:block;
    margin:30px auto;
    width:250px;
    height:250px;
    border-radius:50%;
`

const Signup = () => {
    const [profileImageSrc, setProfileImageSrc] = useState('');
    const [profileImagePath, setProfileImagePath] = useState('');
    const [userName, setUserName] = useState('')
    const [nickname, setNickname] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [passwordConfirm, setPasswordConfirm] = useState('')

    const [validation, setValidation] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [alertShow, setAlertShow] = useState(false);

    const alertClose = () => {
        setAlertShow(false);
        setAlertMessage('');
        setValidation(false);
    }

    const navigate = useNavigate();

    const deleteProfileImage = () => {
        setProfileImagePath('');
    }

    const onChangeProfileImageSrc = (e: React.ChangeEvent<HTMLInputElement>) => {
        if(e.target.files){
            const fileBlob = e.target.files[0]
            const reader = new FileReader();
            reader.readAsDataURL(fileBlob);
            console.log(e.target.files)
            return new Promise<void>((resolve) => {
                reader.onload = () => {
                    setProfileImageSrc(reader.result as string);
                    resolve();
                };
            });
        }
    }

    const onChangeProfileImagePath = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newProfileImagePath = e.target.value;
        console.log(newProfileImagePath)
        setProfileImagePath(newProfileImagePath);
    }

    const onChangeUserName = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newUserName = e.target.value;
        setUserName(newUserName);
    }

    const onChangeNickName = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newNickName = e.target.value;
        setNickname(newNickName);
    }

    const onChangeEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newemail = e.target.value;
        setEmail(newemail);
    }

    const onChangePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newPassword = e.target.value;
        setPassword(newPassword);
    }

    const onChangePasswordConfirm = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newPasswordConfirm = e.target.value;
        setPasswordConfirm(newPasswordConfirm);
    }

    const formReset = () => {
        setProfileImagePath('');
        setUserName('');
        setNickname('');
        setEmail('');
        setPassword('');
        setPasswordConfirm('');
    }

    const signup = async (e: React.ChangeEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        formData.get('userName');
        formData.get('nickname');
        formData.get('email');
        formData.get('password');
        formData.get('passwordConfirm');
        formData.append('profileImagePath', profileImagePath)

        let config: AxiosRequestConfig = {
            method: "post",
            url: "/api/user/signup",
            headers: {
              "content-type": "multipart/form-data"
            },
            data: formData,
        };

        try{
            const res: AxiosResponse = await axios(config);
            console.log(res.data);
            setValidation(true);
            setAlertMessage('회원가입을 축하합니다!')
            setAlertShow(true)
            formReset();
        } catch(err: any){
            console.log(err);
            setAlertMessage(err.response.data)
            setAlertShow(true)
        }
    }

    return (
        <div>
            {
                alertShow
                ? 
                <Warning 
                    onClickBtn={ validation ? () => navigate('/') : alertClose } 
                    onClose={ alertClose }
                    titleText={ validation ? '안내' : '경고' }
                    mainText={ alertMessage }
                    btnText={ validation ? '홈으로' : '닫기' }
                    variant={ validation ? 'primary' : 'danger' }
                    btnVariant={ validation ? "outline-primary" : "outline-danger" }
                />
                : null
            }

            <Form noValidate onSubmit={ signup }>
                <Title 
                    titleText='Sign up'
                    primaryBtn={ true }
                    primaryBtnText='회원가입'
                />
                
                {
                    profileImagePath &&
                    <Img 
                        src={ profileImageSrc } 
                        alt="프로필"
                    />
                }       

                <Form.Group as={Row} className="mb-3">
                    <Form.Label column sm={2} style={{cursor:'pointer'}} htmlFor="profileImagePath"> 
                        프로필 이미지
                    </Form.Label>
                    <Col sm={8}>
                        <Form.Control 
                            name="profileImagePath"
                            type="file" 
                            onChange={ (e: React.ChangeEvent<HTMLInputElement>) => { onChangeProfileImagePath(e); onChangeProfileImageSrc(e); } }
                            accept="image/jpg,image/png,image/jpeg"
                            style={{display:'none'}}
                            id="profileImagePath"
                        />
                        <FloatingLabel controlId="floatingTextarea2" label="파일명">
                            <Form.Control
                                type="text" 
                                value={ profileImagePath }
                                readOnly
                            />
                        </FloatingLabel>
                    </Col>
                    <Col sm={1}>
                        <img 
                            src="../img/close.svg" 
                            alt="삭제" 
                            style={{ cursor:'pointer' }}
                            onClick={ deleteProfileImage }
                        />
                    </Col>
                </Form.Group>

                <Form.Group as={Row} className="mb-3">
                    <Form.Label column sm={2}>
                        이름
                    </Form.Label>
                    <Col sm={10}>
                        <Form.Control 
                            name="userName"
                            type="text" 
                            value={userName} 
                            placeholder="Username" 
                            required 
                            onChange={ onChangeUserName } 
                        />
                    </Col>
                </Form.Group>

                <Form.Group as={Row} className="mb-3">
                    <Form.Label column sm={2}>
                        닉네임
                    </Form.Label>
                    <Col sm={10}>
                        <Form.Control 
                            name="nickname"
                            type="text" 
                            value={nickname} 
                            placeholder="Nickname" 
                            required 
                            onChange={ onChangeNickName } 
                        />
                    </Col>
                </Form.Group>

                <Form.Group as={Row} className="mb-3">
                    <Form.Label column sm={2}>
                        아이디 
                    </Form.Label>
                    <Col sm={10}>
                        <Form.Control 
                            name="email"
                            type="email" 
                            value={email} 
                            placeholder="Email" 
                            required 
                            onChange={ onChangeEmail } 
                        />
                    </Col>
                </Form.Group>

                <Form.Group as={Row} className="mb-3">
                    <Form.Label column sm={2}>
                        비밀번호
                    </Form.Label>
                    <Col sm={10}>
                        <Form.Control 
                            name="password"
                            type="password" 
                            value={password} 
                            placeholder="Password" 
                            required onChange={ onChangePassword } 
                        />
                    </Col>
                </Form.Group>

                <Form.Group as={Row} className="mb-3">
                    <Form.Label column sm={2}>
                        비밀번호 확인
                    </Form.Label>
                    <Col sm={10}>
                        <Form.Control 
                            name="passwordConfirm"
                            type="password" 
                            value={passwordConfirm} 
                            placeholder="Confirm Password" 
                            required 
                            onChange={ onChangePasswordConfirm }
                        />
                    </Col>
                </Form.Group>
            </Form>
        </div>
    )
}

export default Signup;
