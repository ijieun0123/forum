import { Row, Form, Col, Stack, FloatingLabel } from 'react-bootstrap';
import { useState, useRef } from 'react';
import { useNavigate } from "react-router-dom";
import Warning from '../organisms/warning'
import axios from 'axios';
import Title from '../atoms/title'
import Button from '../atoms/button'
import { useSelector, useDispatch } from 'react-redux'
import { SIGNIN, SIGNOUT } from '../features/userSlice'
import { useEffect } from 'react';
import styled from 'styled-components';
import instance from '../utils/instance';

const Img = styled.img`
    display:block;
    margin:30px auto;
    width:250px;
    height:250px;
    border-radius:50%;
`

const Profile = () => {
    const user = useSelector(state => state.user.user);

    const [profileImageSrc, setProfileImageSrc] = useState('');
    const [profileImagePath, setProfileImagePath] = useState('');
    const [profileImageName, setProfileImageName] = useState('');
    const [userName, setUserName] = useState('')
    const [nickname, setNickname] = useState('')
    const [email, setEmail] = useState('')

    const [validation, setValidation] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [alertShow, setAlertShow] = useState(false);

    const alertClose = () => {
        setAlertShow(false);
        setAlertMessage('');
        setValidation(false);
    }

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const deleteProfileImage = () => {
        setProfileImagePath('');
    }

    const onChangeProfileImageSrc = (e) => {
        const fileBlob = e.target.files[0];
        const reader = new FileReader();
        reader.readAsDataURL(fileBlob);
        console.log(e.target.files)
        return new Promise((resolve) => {
            reader.onload = () => {
                setProfileImageSrc(reader.result);
                resolve();
            };
        });
    }

    const onChangeProfileImagePath = (e) => {
        const newProfileImagePath = e.target.value;
        console.log(newProfileImagePath)
        setProfileImagePath(newProfileImagePath);
    }

    const onChangeUserName = e => {
        const newUserName = e.target.value;
        setUserName(newUserName);
    }

    const onChangeNickName = e => {
        const newNickName = e.target.value;
        setNickname(newNickName);
    }

    const onChangeEmail = e => {
        const newemail = e.target.value;
        setEmail(newemail);
    }

    const formReset = () => {
        setProfileImagePath('');
        setUserName('');
        setNickname('');
        setEmail('');
    }

    const editUser = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        formData.get('userName');
        formData.get('nickname');
        formData.get('email');
        formData.append('profileImagePath', profileImagePath)
        formData.append('profileImageName', profileImageName);

        let config = {
            method: "patch",
            url: `/api/user/update/${user._id}`,
            headers: {
              "content-type": "application/json",
              "content-type": "multipart/form-data"
            },
            data: formData,
        };

        try{
            const res = await instance(config);;
            const data = res.data;
            console.log(data);
            dispatch(SIGNIN({
                userName:data.userName,
                email:data.email,
                nickname:data.nickname,
                profileImageName:data.profileImageName,
                profileImagePath:data.profileImagePath
            }));
            setValidation(true);
            setAlertMessage('프로필이 변경되었습니다!')
            setAlertShow(true)
            formReset();
        } catch(err){
            console.log(err);
            setAlertMessage(err.response.data)
            setAlertShow(true)
        }
    }

    useEffect(() => {
        setProfileImageSrc(user.profileImagePath)
        setProfileImagePath(user.profileImagePath)
        setProfileImageName(user.profileImageName)
        setUserName(user.userName)
        setNickname(user.nickname)
        setEmail(user.email)
    }, [])

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

            <Form noValidate onSubmit={ editUser }>
                <Title 
                    titleText='Profile'
                    warnBtn={ true }
                    primaryBtn={ true }
                    clickWarnBtn={ () => navigate(`/user/withdrawal`) }
                    primaryBtnText='수정하기'
                    warnBtnText="탈퇴하기"
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
                            onChange={ e => { onChangeProfileImagePath(e); onChangeProfileImageSrc(e); } }
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
                    <Col sm={8}>
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
            </Form>
        </div>
    )
}

export default Profile;
