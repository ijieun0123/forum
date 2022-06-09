import { Row, Form, Col, Stack, FloatingLabel } from 'react-bootstrap';
import { useState, useRef } from 'react';
import { useNavigate } from "react-router-dom";
import Warning from '../organisms/warning'
import axios from 'axios';
import Title from '../atoms/title'
import Button from '../atoms/button'
import { useSelector, useDispatch } from 'react-redux'
import { signin } from '../features/userSlice'
import { useEffect } from 'react';
import styled from 'styled-components';

const Img = styled.img`
    display:block;
    margin:30px auto;
    width:250px;
    height:250px;
    border-radius:50%;
`

const UserUpdate = () => {
    const user = useSelector(state => state.user.user);

    const [profileImageSrc, setProfileImageSrc] = useState('');
    const [profileImagePath, setProfileImagePath] = useState('');
    const [profileImageName, setProfileImageName] = useState('');
    const [userName, setUserName] = useState('')
    const [nickname, setNickname] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [passwordConfirm, setPasswordConfirm] = useState('')

    const [duplicateCheckEmail, setDuplicateCheckEmail] = useState(false)
    const [duplicateCheckNickname, setDuplicateCheckNickname] = useState(false)

    const [validation, setValidation] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [alertShow, setAlertShow] = useState(false);
    const [alertVariant, setAlertVariant] = useState('');
    const [alertBtnVariant, setAlertBtnVariant] = useState('');
    const [alertBtnText, setAlertBtnText] = useState('');

    const alertClose = () => setAlertShow(false);

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const deleteProfileImage = () => {
        setProfileImagePath('');
    }

    const onChangeAlert = () => {
        if(validation){
            setAlertVariant('primary')
            setAlertBtnVariant("outline-primary")
            setAlertBtnText('홈으로')
        } else{
            setAlertVariant('danger')
            setAlertBtnVariant("outline-danger")
            setAlertBtnText('닫기')
        }
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
        setDuplicateCheckNickname(false);
    }

    const onChangeEmail = e => {
        const newemail = e.target.value;
        setEmail(newemail);
        setDuplicateCheckEmail(false);
    }

    const onChangePassword = e => {
        const newPassword = e.target.value;
        setPassword(newPassword);
    }

    const onChangePasswordConfirm = e => {
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

    const postUser = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        formData.get('userName');
        formData.get('nickname');
        formData.get('email');
        formData.get('password');
        formData.append('profileImagePath', profileImagePath)

        let config = {
            method: "post",
            url: "/api/user/post",
            headers: {
              "content-type": "application/json",
              "content-type": "multipart/form-data"
            },
            data: formData,
        };

        try{
            setAlertMessage('잠시만 기다려주세요.')
            const res = await axios(config);
            console.log(res.data);
            setValidation(true);
            setAlertMessage('회원가입을 축하합니다!')
            formReset();
        } catch(err){
            console.log(err);
            if(err.response.status === 413){
                setAlertMessage('사진이 용량을 초과하였습니다.') 
            }
        }
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
            url: `/api/user/update/${user.userId}`,
            headers: {
              "content-type": "application/json",
              "content-type": "multipart/form-data"
            },
            data: formData,
        };

        try{
            setAlertMessage('잠시만 기다려주세요.')
            const res = await axios(config);;
            const data = res.data;
            console.log(data);
            const { 
                    _id, 
                    profileImagePath, 
                    profileImageName, 
                    userName, 
                    nickname, 
                    email, 
                    password 
                } = data;

            dispatch(signin({
                userId: _id,
                profileImagePath: profileImagePath,
                profileImageName: profileImageName,
                userName: userName,
                nickname: nickname,
                email: email,
                password: password,
                signin: true
            }));

            setValidation(true);
            setAlertMessage('프로필이 변경되었습니다!')
            formReset();
        } catch(err){
            console.log(err);
            if(err.response.status === 413){
                setAlertMessage('사진이 용량을 초과하였습니다.') 
            }
        }
    }

    const checkValidation = (e) => {
        const checkUserName = /^[가-힣a-zA-Z]{1,16}$/; 
        const checkPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^*()_+~`=\{\}\[\]|\:;"',.?/\-<>\&\\])(?!.*?[\sㄱ-ㅎㅏ-ㅣ가-힣]).{1,}$/; 
        
        if (!checkUserName.test(userName)){
            setAlertMessage('이름을 다시 확인해주세요. ( 한글 • 영어 • 최대 16자까지 입력가능 )');
        } else if (!duplicateCheckNickname) {
            setAlertMessage('닉네임 중복체크 해주세요.');
        } else if (!duplicateCheckEmail){
            setAlertMessage('아이디 중복체크 해주세요.');
        } else if (!checkPassword.test(password)){
            ( user.signin ? editUser(e) : setAlertMessage('비밀번호를 다시 확인해주세요. ( 최소 9자 이상 최대 16자까지 입력 • 특수문자 1개 이상 대문자 1개 이상 필수 입력 )') )
        } else if (password !== passwordConfirm){
            ( user.signin ? editUser(e) : setAlertMessage('비밀번호와 비밀번호 확인이 일치하지 않습니다.') )
        } else{
            ( user.signin ? editUser(e) : postUser(e) )
        }

        setAlertShow(true)
    }

    const onSubmit = e => {
        e.preventDefault();
        checkValidation(e);
        setAlertVariant('danger')
        setAlertBtnVariant("outline-danger")
    }

    const duplicateCheckFalse = () => {
        setAlertVariant('danger')
        setAlertBtnVariant("outline-danger")
    }

    const duplicateCheckTrue = () => {
        setAlertVariant('primary')
        setAlertBtnVariant("outline-primary")
    }
    
    const clickDuplicateCheckEmail = async (e) => {
        e.preventDefault();
        setAlertShow(true);
        setAlertBtnText('닫기');

        const checkEmail = /^(?=[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,3}$).{1,80}$/;

        if(!checkEmail.test(email)){
            setAlertMessage('아이디를 다시 확인해주세요. ( 이메일 형식 예시 user@email.com )');
        } else{
            const body = {
                email: email,
                signin: user.signin,
                _id: user.userId
            }
            try{
                const res = await axios.post('/api/user/duplicateCheck/email', body);
                const data = res.data;
                console.log(data)
    
                if(data){
                    duplicateCheckFalse();
                    setDuplicateCheckEmail(false) 
                    setAlertMessage('사용할 수 없는 아이디입니다.')
                } else{
                    duplicateCheckTrue();
                    setDuplicateCheckEmail(true) 
                    setAlertMessage('사용할 수 있는 아이디입니다.')
                }
            } catch(err){
                console.log(err);
            }
        }
    }

    const clickDuplicateCheckNickname = async (e) => {
        e.preventDefault();
        setAlertShow(true)
        setAlertBtnText('닫기')

        const checkNickname = /^[가-힣a-zA-Z]{1,16}$/; 

        if(!checkNickname.test(nickname)){
            setAlertMessage('닉네임을 다시 확인해주세요. ( 한글 • 영어 • 최대 16자까지 입력가능 )');
        } else{
            const body = {
                nickname: nickname,
                signin: user.signin,
                _id: user.userId
            }
            try{
                const res = await axios.post('/api/user/duplicateCheck/nickname', body);
                const data = res.data;
                console.log(data)
    
                if(data){
                    duplicateCheckFalse();
                    setDuplicateCheckNickname(false) 
                    setAlertMessage('사용할 수 없는 닉네임입니다.')
                } else{
                    duplicateCheckTrue();
                    setDuplicateCheckNickname(true)
                    setAlertMessage('사용할 수 있는 닉네임입니다.')
                }
            } catch(err){
                console.log(err);
            }
        }
    }
    
    useEffect(() => {
        onChangeAlert()
    }, [validation])

    useEffect(() => {
        if(user.signin){
            setProfileImageSrc(user.profileImagePath)
            setProfileImagePath(user.profileImagePath)
            setProfileImageName(user.profileImageName)
            setUserName(user.userName)
            setNickname(user.nickname)
            setEmail(user.email)
            setDuplicateCheckEmail(true)
            setDuplicateCheckNickname(true)
        } 
    }, [user])

    return (
        <div>
            {
                alertShow
                ? 
                <Warning 
                    onClickBtn={ validation ? () => navigate('/') : alertClose } 
                    onClose={ () => { setAlertShow(false)} }
                    titleText="안내" 
                    mainText={ alertMessage }
                    btnText={ alertBtnText }
                    variant={ alertVariant }
                    btnVariant={ alertBtnVariant }
                />
                : null
            }

            <Form noValidate onSubmit={ onSubmit }>
                <Title 
                    titleText={ user.signin ? 'Profile' : 'Sign up' } 
                    warnBtn={ user.signin ? true : false }
                    primaryBtn={ true }
                    clickWarnBtn={ () => navigate(`/user/validate`) }
                    primaryBtnText={ user.signin ? '수정하기' : '회원가입' }
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
                    <Col sm={8}>
                        <Form.Control 
                            name="nickname"
                            type="text" 
                            value={nickname} 
                            placeholder="Nickname" 
                            required 
                            onChange={ onChangeNickName } 
                        />
                    </Col>
                    <Col sm={2}>
                        <Button 
                            onClick={ clickDuplicateCheckNickname }
                            variant='primary'
                            size="md"
                            type="button"
                            value="중복체크"
                        />
                    </Col>
                </Form.Group>

                <Form.Group as={Row} className="mb-3">
                    <Form.Label column sm={2}>
                        아이디 
                    </Form.Label>
                    <Col sm={8}>
                        <Form.Control 
                            name="email"
                            type="email" 
                            value={email} 
                            placeholder="Email" 
                            required 
                            onChange={ onChangeEmail } 
                        />
                    </Col>
                    <Col sm={2}>
                        <Button 
                            onClick={ clickDuplicateCheckEmail }
                            variant='primary'
                            size="md"
                            type="button"
                            value="중복체크"
                        />
                    </Col>
                </Form.Group>

                {   user.signin 
                    ? null
                    :   <>
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
                                        type="password" 
                                        value={passwordConfirm} 
                                        placeholder="Confirm Password" 
                                        required 
                                        onChange={ onChangePasswordConfirm }
                                    />
                                </Col>
                            </Form.Group>
                        </>
                }
            </Form>
        </div>
    )
}

export default UserUpdate;
