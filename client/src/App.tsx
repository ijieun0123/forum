import './App.css';
import { Route, Routes } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import Header from './organisms/header.tsx';
import Signin from './components/signin.tsx';
import Signup from './components/signup.tsx';
import Profile from './components/profile.tsx';
import Withdrawal from './components/withdrawal.tsx';
import ForumList from './components/forumList.tsx';
import ForumWrite from './components/forumWrite.tsx';
import ForumView from './components/forumView.tsx';
import { useSelector, useDispatch } from 'react-redux'
import { useState, useEffect } from 'react';
import Warning from './organisms/warning.tsx';
import { useNavigate } from 'react-router-dom';
import { ReducerType } from './app/store.ts';
import { User } from './features/userSlice.ts'

const App: React.FC = (): JSX.Element => {

  const signin = useSelector<ReducerType, User['signin']>(state => state.user.signin);

  const [alertShow, setAlertShow] = useState(false);

  const navigate = useNavigate();

  return (
    <div className="App">  
        <Header />

        <Container>
            <Routes>
                <Route path="/user/signin" element={ <Signin /> } />
                <Route path="/user/withdrawal" element={ <Withdrawal /> } />
                <Route path="/user/signup" element={ <Signup /> } />
                <Route path="/user/profile" element={ <Profile /> } />
                <Route path="/" element={ <ForumList /> } />
                <Route 
                  path='/forum/write'
                  element={ 
                    signin
                    ? <ForumWrite /> 
                    : <Warning 
                        onClickBtn={() => {navigate('/user/signin'); setAlertShow(false);}}
                        onClose={() => {navigate('/'); setAlertShow(false);}}
                        alertTitleText={'Alert'}
                        mainText={'로그인이 필요합니다.'}
                        btnText="Sign in"
                        alertVariant="danger"
                        btnVariant="outline-danger"
                      /> 
                  }
                />
                <Route path="/forum/update/:id" element={ <ForumWrite /> } />
                <Route 
                  path="/forum/view/:id" 
                  element={ 
                    signin
                    ? <ForumView />
                    : <Warning 
                        onClickBtn={() => {navigate('/user/signin'); setAlertShow(false);}}
                        onClose={() => {navigate('/'); setAlertShow(false);}}
                        alertTitleText={'Alert'}
                        mainText={'로그인이 필요합니다.'}
                        btnText="Sign in"
                        alertVariant="danger"
                        btnVariant="outline-danger"
                      /> 
                  }
                />
            </Routes>
        </Container>
    </div>
  );
}

export default App;
