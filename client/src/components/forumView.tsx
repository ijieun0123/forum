import Title from '../atoms/title.tsx';
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Warning from '../organisms/warning.tsx'
import Comment from '../organisms/comment.tsx'
import { Card, Stack } from 'react-bootstrap';
import Profile from '../atoms/profile.tsx';
import HeartCount from '../atoms/heartCount.tsx'
import EyeCount from '../atoms/eyeCount.tsx';
import instance from '../utils/instance';
import { ReducerType } from '../app/store.ts';
import { User } from '../features/userSlice.ts'
import { Forums, Hearts } from '../utils/axios.ts';

import { Viewer } from '@toast-ui/react-editor'
import '@toast-ui/editor/dist/toastui-editor.css';
import { useBeforeunload } from 'react-beforeunload';
import { Forum } from '../features/forumSlice'
import { useDispatch, useSelector } from 'react-redux'

const ForumView = () => {

    const [attachImagePath, setAttachImagePath] = useState('');
    const [attachImageNames, setAttachImageNames] = useState<string[]>([])
    const [createdAt, setCreatedAt] = useState('');
    const [heartCount, setHeartCount] = useState(0);
    const [heartFill, setHeartFill] = useState(false);
    const [mainText, setMainText] = useState('');
    const [titleText, setTitleText] = useState('');
    const [viewCount, setViewCount] = useState(0);
    const [nickName, setNickName] = useState('');
    const [profileImagePath, setProfileImagePath] = useState('');

    const [alertShow, setAlertShow] = useState(false);

    const { id } = useParams();
    const navigate = useNavigate();
    
    const user = useSelector<ReducerType, User['user']>(state => state.user.user);
    const forum = useSelector<ReducerType, Forum['forum']>(state => state.forum.forum);
    const forumData = forum.find(el => el.forumId === id);
    
    const deleteForum = async () => {
        const params = {
            attachImageNames: attachImageNames
        }

        if(id) Forums.deleteForum(params, id)
        .then(data => {
            console.log(data);
            setAlertShow(false);
            navigate(`/`);
        })
        .catch(err => {
            console.log(err);
        })
    }
    
    const updateHeart = async () => {
        if(id){
            const body = {
                _forum: id
            }
    
            Hearts.postHeart(body)
            .then(data => {
                const newHeartCount = heartCount + data.fixHeartCount;
                const newHeartFill =  data.heartFill
                setHeartCount(newHeartCount)
                setHeartFill(newHeartFill)
            })
            .catch(err => {
                console.log(err);
            })
        }
    }

    const getForum = async () => {
        Forums.getForumView(id)
        .then((data) => {
            console.log(data)
            setAttachImageNames(data.attachImageNames)
            setCreatedAt(data.createdAt)
            setHeartCount(data.heartCount)
            setHeartFill(data.heartFill)
            setMainText(data.mainText)
            setTitleText(data.titleText)
            setViewCount(data.viewCount)
            setNickName(data.nickname)
            setProfileImagePath(data.profileImagePath)
        })
        .catch((err) => {
            console.log(err);
        })
    }
    
    useEffect(() => {
        getForum();
    }, [])

    return (
        <div>
            <Title 
                titleText='Forum View' 
                warnBtn={ user.nickname === nickName ? true : false }
                primaryBtn={ user.nickname === nickName ? true : false }
                clickWarnBtn={ () => {setAlertShow(true)}  }
                clickPrimaryBtn={ () => navigate(`/forum/update/${id}`) }
                primaryBtnText="Update"
                warnBtnText="Delete"
            />
               
            {
                alertShow
                ? 
                <Warning 
                    onClickBtn={ deleteForum } 
                    onClose={ () => {setAlertShow(false)} }
                    alertTitleText="Alert" 
                    mainText="게시물을 지우면 복구할 수 없습니다.&nbsp; 정말로 삭제하겠습니까?"
                    btnText="Delete"
                    alertVariant="danger"
                    btnVariant="outline-danger"
                />
                : null
            }

            <Card>
                <Card.Header as="h5">
                    <Stack direction="horizontal" gap={3}>
                        <div>
                            <Profile 
                                profileImagePath={ profileImagePath }  
                                nickname={ nickName } 
                                nicknameColor="#000" 
                            />
                        </div>
                        <div className="ms-auto">
                            {titleText.slice(0, 40)}
                        </div>
                        <div className="ms-auto">
                            <EyeCount viewCount={viewCount} />
                        </div>
                        <div>
                            <HeartCount 
                                heartCount={heartCount} 
                                heartFill={heartFill} 
                                onClick={ updateHeart } 
                            />
                        </div>
                    </Stack>
                </Card.Header>

                <Card.Body>
                <Viewer 
                    initialValue={ forumData.mainText }
                />
                </Card.Body>
                
                <Card.Footer className="text-muted text-center">
                    {createdAt? createdAt.slice(0, 10) : null}
                </Card.Footer>
            </Card>

            <Comment 
                forumId={ id! } 
                nickname={ user.nickname! }
                profileImagePath={ user.profileImagePath! }
            />  
        </div>
    )
}

export default ForumView;

