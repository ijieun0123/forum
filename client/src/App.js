import './App.css';
import { Route, Routes } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import Header from './components/header';
import Signin from './components/signin';
import UserUpdate from './components/userUpdate';
import ForumList from './components/forumList';
import ForumWrite from './components/forumWrite';
import ForumView from './components/forumView';
import { useSelector } from 'react-redux'
import { useState } from 'react';
import Warning from './organisms/warning';
import { useNavigate } from 'react-router-dom';

function App() {
  const user = useSelector(state => state.user.user);
  const { signin } = user;

  const [alertShow, setAlertShow] = useState(true);
  const navigate = useNavigate();

  return (
    <div className="App">
        <Header />

        <Container>
            <Routes>
                <Route path="/user/signin" element={ <Signin /> } />
                <Route path="/user/signup" element={ <UserUpdate /> } />
                <Route path="/user/profile" element={ <UserUpdate /> } />
                <Route path="/" element={ <ForumList /> } />
                <Route 
                  path="/forum/write" 
                  element={ 
                    signin 
                    ? <ForumWrite /> 
                    : <Warning 
                        alertShow={alertShow}
                        onClick={() => {navigate('/user/signin'); setAlertShow(true);}}
                        onClose={() => {navigate('/')}}
                        titleText={'경고창'}
                        mainText={'로그인 후 글쓰기 작성이 가능합니다.'}
                        btnText={'sign in'}
                      /> 
                  }
                />
                <Route path="/forum/update/:id" element={ signin ? <ForumWrite /> : <Warning /> } />
                <Route 
                  path="/forum/view/:id" 
                  element={ 
                    signin 
                    ? <ForumView /> 
                    : <Warning 
                        alertShow={alertShow}
                        onClick={() => {navigate('/user/signin'); setAlertShow(true);}}
                        onClose={() => {navigate('/')}}
                        titleText={'경고창'}
                        mainText={'회원만 접근가능 합니다.'}
                        btnText={'sign in'}
                      /> 
                  } 
                />
            </Routes>
        </Container>
    </div>
  );
}

export default App;
