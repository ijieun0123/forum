import { Row, Form, Col, Button, Modal } from 'react-bootstrap';
import { useState, useRef } from 'react';
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import Title from '../atoms/title'
import { useSelector, useDispatch } from 'react-redux'
import { signin } from '../features/userSlice'
import { useEffect } from 'react';

const UserUpdate = () => {
    const user = useSelector(state => state.user.user);

    const defaultProfileImage = "/img/profile_default.png";
    const [profileImage, setProfileImage] = useState(defaultProfileImage);
    const fileInput = useRef(null);

    const [userName, setUserName] = useState('')
    const [nickname, setNickname] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [passwordConfirm, setPasswordConfirm] = useState('')

    const [modalMessage, setModalMessage] = useState('');
    const [modalOpen, setModalOpen] = useState(false); 
    const handleClose = () => setModalOpen(false);

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const onChangeProfileImage = e => {
        let reader = new FileReader();
        const file = e.target.files[0]

        reader.onload = function(){
           setProfileImage(reader.result)
        }
        if(file){
            reader.readAsDataURL(file);
        } 
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

    const onChangePassword = e => {
        const newPassword = e.target.value;
        setPassword(newPassword);
    }

    const onChangePasswordConfirm = e => {
        const newPasswordConfirm = e.target.value;
        setPasswordConfirm(newPasswordConfirm);
    }

    const formReset = () => {
        fileInput.current.value="";
        setProfileImage(defaultProfileImage);
        setUserName('');
        setNickname('');
        setEmail('');
        setPassword('');
        setPasswordConfirm('');
    }

    const postUser = async () => {
        const body = {
            profileImage: profileImage,
            userName: userName,
            nickname: nickname,
            email: email,
            password: password,
        }
        try{
            const res = await axios.post('/api/user/post', body);
            console.log(res.data);
            setModalMessage('회원가입을 축하합니다!')
            formReset();
            navigate('/');
        } catch(err){
            console.log(err);
            ( err.response.status === 413
            ? setModalMessage('사진이 용량을 초과하였습니다.') 
            : setModalMessage('이미 다른 사용자가 사용 중입니다.'))
        }
    }

    const updateUser = async () => {
        const body = {
            profileImage: profileImage,
            userName: userName,
            nickname: nickname,
            email: email,
        }
        try{
            const res = await axios.patch(`/api/user/update/${user._id}`, body);
            const data = res.data;
            const { _id, profileImage, userName, nickname, email, password } = data;
            console.log(data);
            dispatch(signin({
                userId: _id,
                profileImage: profileImage,
                userName: userName,
                nickname: nickname,
                email: email,
                password: password,
                signin: true
            }));
            formReset();
            navigate('/');
        } catch(err){
            console.log(err);
            ( err.response.status === 413
            ? setModalMessage('사진이 용량을 초과하였습니다.') 
            : setModalMessage('이미 다른 사용자가 사용 중입니다.'))
        }
    }

    const checkValidation = () => {
        const checkUserName = /^[가-힣a-zA-Z]{1,16}$/; 
        const checkNickname = /^[가-힣a-zA-Z]{1,16}$/; 
        const checkEmail = /^(?=[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,3}$).{1,80}$/; 
        const checkPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^*()_+~`=\{\}\[\]|\:;"',.?/\-<>\&\\])(?!.*?[\sㄱ-ㅎㅏ-ㅣ가-힣]).{1,}$/; 
        
        if (!checkUserName.test(userName)){
            setModalMessage('이름을 다시 확인해주세요. ( 한글 • 영어 • 최대 16자까지 입력가능 )');
        } else if (!checkNickname.test(nickname)){
            setModalMessage('닉네임을 다시 확인해주세요. ( 한글 • 영어 • 최대 16자까지 입력가능 )');
        } else if (!checkEmail.test(email)){
            setModalMessage('이메일 형식을 정확히 입력하세요.( user@email.com )');
        } else if (!checkPassword.test(password)){
            ( user.signin ? updateUser() : setModalMessage('비밀번호를 다시 확인해주세요. ( 최소 9자 이상 최대 16자까지 입력 • 특수문자 1개 이상 대문자 1개 이상 필수 입력 )') )
        } else if (password !== passwordConfirm){
            ( user.signin ? updateUser() : setModalMessage('비밀번호와 비밀번호 확인이 일치하지 않습니다.') )
        } else{
            ( user.signin ? updateUser() : postUser() )
        }

        setModalOpen(true)
    }

    const onSubmit = e => {
        e.preventDefault();
        checkValidation();
    }

    useEffect(() => {
        if(user.signin){
            setProfileImage(user.profileImage)
            setUserName(user.userName)
            setNickname(user.nickname)
            setEmail(user.email)
        } else{
            setProfileImage(defaultProfileImage)
            setUserName('')
            setNickname('')
            setEmail('')
        }
    }, [user])

    return (
        <div>
            <Title text={ user.signin ? 'Profile' : 'Sign up' } />

            <img 
                src={ 
                    profileImage 
                    ? profileImage
                    : defaultProfileImage
                } 
                onClick={ () => fileInput.current.click() }
                alt="프로필"
                className="profileImage"
            />

            <Form noValidate onSubmit={ onSubmit }>
                <Form.Group as={Row} className="mb-3">
                    <Form.Label column sm={2}>
                        프로필 이미지
                    </Form.Label>
                    <Col sm={10}>
                        <Form.Control 
                            type="file" 
                            onChange={ onChangeProfileImage }
                            accept="image/jpg,image/png,image/jpeg"
                            ref={ fileInput }
                        />
                    </Col>
                </Form.Group>

                <Form.Group as={Row} className="mb-3">
                    <Form.Label column sm={2}>
                        이름
                    </Form.Label>
                    <Col sm={10}>
                        <Form.Control 
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
                            type="email" 
                            value={email} 
                            placeholder="Email" 
                            required 
                            onChange={ onChangeEmail } 
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

                <Button type="submit" variant="primary">
                    { user.signin ? '저장하기' : '회원가입' }
                </Button>
            </Form>

            <Modal show={modalOpen} onHide={ handleClose }>
                <Modal.Header closeButton>
                    <Modal.Title>
                        { user.signin ? 'Profile guide' : 'Sign up guide' }
                    </Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <p>{modalMessage}</p>
                </Modal.Body>

                <Modal.Footer>
                    <Button variant="primary" onClick={ handleClose } >Close</Button>
                    <Button variant="primary" onClick={ () => navigate('/user/signin') } >Signin</Button>
                </Modal.Footer>
            </Modal>
        </div>
    )
}

export default UserUpdate;
