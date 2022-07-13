import Title from '../atoms/title';
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Warning from '../organisms/warning'
import Comment from '../organisms/comment'
import { Card, Stack } from 'react-bootstrap';
import Profile from '../atoms/profile';
import HeartCount from '../atoms/heartCount'
import { useSelector } from 'react-redux'
import EyeCount from '../atoms/eyeCount';
import instance from '../utils/instance';
import { ReducerType } from '../app/store';
import { User } from '../features/userSlice'
import { Forums, Hearts } from '../utils/axios';

const ForumView = () => {

    const [attachImagePath, setAttachImagePath] = useState('');
    const [attachImageName, setAttachImageName] = useState('')
    const [createdAt, setCreatedAt] = useState('');
    const [heartCount, setHeartCount] = useState(0);
    const [heartFill, setHeartFill] = useState(false);
    const [mainText, setMainText] = useState('');
    const [titleText, setTitleText] = useState('');
    const [viewCount, setViewCount] = useState(0);
    const [nickName, setNickName] = useState('');
    const [profileImagePath, setProfileImagePath] = useState('');

    const [alertShow, setAlertShow] = useState(false);
    
    const user = useSelector<ReducerType, User['user']>(state => state.user.user);

    const { id } = useParams();
    const navigate = useNavigate();
    
    const deleteForum = async () => {
        const params = {
            attachImageName: attachImageName
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
        if(id) 
        Forums.getForumGetViewCount(id)
        .then((data) => {
            setAttachImagePath(data.attachImagePath)
            setAttachImageName(data.attachImageName)
            setCreatedAt(data.createdAt)
            setHeartCount(data.heartCount)
            setHeartFill(data.heartFill)
            setMainText(data.mainText)
            setTitleText(data.titleText)
            setViewCount(data.viewCount)
            setNickName(data.nickname)
            setProfileImagePath(data.profileImagePath)
            console.log(data) 
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
                    {attachImagePath? <Card.Img variant="top" src={ attachImagePath } /> : null}
                    <Card.Text>{mainText}</Card.Text>
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