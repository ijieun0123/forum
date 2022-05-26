import { Navbar, Container, Nav } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from "react-router-dom";
import { signout } from '../features/userSlice'

import Profile from '../atoms/profile';
import Btn from '../atoms/button';

const Header = () => {
    const user = useSelector(state => state.user.user);
    const { nickname, profileImage, signin } = user

    const navigate = useNavigate();
    const dispatch = useDispatch();
    
    const clickSignOutBtn = (e) => {
        e.preventDefault();
        dispatch(signout({
            userId:'',
            profileImage: '',
            profileImageValue: '',
            userName: '',
            nickname: '',
            email: '',
            password: '',
            signin: false
        }));
        navigate('/');
    }   
    
    return (
        <Navbar bg="primary" variant="dark">
            <Container>
                <Navbar.Brand>
                    <Link to="/">
                        <Btn 
                            value="Forum"
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
                                <Profile src={ profileImage } nickname={ nickname }/>
                            </Link>
                        </Navbar.Text>
                        <Navbar.Text>
                            <Btn 
                                onClick={ clickSignOutBtn } 
                                value="Sign out"
                                variant="outline-light"
                                margin='0 0 0 30px'
                            />
                        </Navbar.Text>
                    </Navbar.Collapse>
                    :
                    <Navbar.Collapse className="justify-content-end">
                        <Navbar.Text>
                            <Link to='/user/signin'>
                                <Btn 
                                    value="Sign in" 
                                    variant="outline-light" 
                                    margin='0 10px'
                                />
                            </Link>
                        </Navbar.Text>
                        <Navbar.Text>
                            <Link to='/user/signup'>
                                <Btn 
                                    value="Sign up" 
                                    variant="outline-light" 
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