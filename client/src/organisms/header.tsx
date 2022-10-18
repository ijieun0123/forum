import { Navbar, Container, Nav } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from "react-router-dom";
import { SIGNOUT } from '../features/userSlice.ts'
import Profile from '../atoms/profile.tsx';
import Btn from '../atoms/button.tsx';
import axios from 'axios';
import instance from '../utils/instance'
import { ReducerType } from '../app/store.ts';
import { User } from '../features/userSlice.ts'
import React from 'react';
import { BtnMouseEventType } from '../utils/types';
import { Users } from '../utils/axios.ts';
 
const Header = () => {
    const signin = useSelector<ReducerType, User['signin']>(state => state.user.signin);
    const user = useSelector<ReducerType, User['user']>(state => state.user.user);

    const navigate = useNavigate();
    const dispatch = useDispatch();
    
    const signout = async () => {
        Users.signout()
        .then(() => {
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshTokenId');
            dispatch(SIGNOUT({}));
            navigate('/');
        })
        .catch(err => {
            console.log(err)
        })
    }   
    
    return (
        <Navbar bg="primary" variant="dark">
            <Container>
                <Navbar.Brand>
                    <Link to="/">
                        <Btn 
                            btnVariant="primary"
                            btnText="Forum"
                            margin='0 5px'
                            size="lg"
                        /> 
                    </Link>
                </Navbar.Brand>

                {
                    signin
                    ?
                    <Navbar.Collapse className="justify-content-end">
                        <Navbar.Text>
                            <Link to='/user/profile'>
                                <Profile 
                                    profileImagePath={ user.profileImagePath! } 
                                    nickname={ user.nickname! }
                                />
                            </Link>
                        </Navbar.Text>
                        <Navbar.Text>
                            <Btn 
                                onClick={ signout } 
                                btnText="Sign out"
                                btnVariant="outline-light"
                                margin='0 0 0 30px'
                            />
                        </Navbar.Text>
                    </Navbar.Collapse>
                    :
                    <Navbar.Collapse className="justify-content-end">
                        <Navbar.Text>
                            <Link to='/user/signin'>
                                <Btn 
                                    btnText="Sign in" 
                                    btnVariant="outline-light" 
                                    margin='0 10px'
                                />
                            </Link>
                        </Navbar.Text>
                        <Navbar.Text>
                            <Link to='/user/signup'>
                                <Btn 
                                    btnText="Sign up" 
                                    btnVariant="outline-light" 
                                    margin='0'
                                />
                            </Link>
                        </Navbar.Text>
                    </Navbar.Collapse>
                }
            </Container>
        </Navbar> 
    )
}

export default Header;