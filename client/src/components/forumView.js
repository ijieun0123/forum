import axios from 'axios';
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

const ForumView = () => {

    const [attachImagePath, setAttachImagePath] = useState('');
    const [attachImageName, setAttachImageName] = useState('')
    const [createdAt, setCreatedAt] = useState('');
    const [heartCount, setHeartCount] = useState(0);
    const [heartClickUsers, setHeartClickUsers] = useState([]);
    const [mainText, setMainText] = useState('');
    const [titleText, setTitleText] = useState('');
    const [viewCount, setViewCount] = useState('');
    const [writer, setWriter] = useState('');
    const [writerImg, setWriterImg] = useState('');

    const [alertShow, setAlertShow] = useState(false);
    const user = useSelector(state => state.user.user);
    const { nickname, profileImage ,userId } = user;

    const { id } = useParams();
    const navigate = useNavigate();
    
    const deleteForum = async () => {
        const params = {
            attachImagePath: attachImagePath,
            attachImageName: attachImageName
        }

        try{            
            const res = await axios.delete(`/api/forum/delete/${id}`, { params: params });
            console.log(res.data);
            setAlertShow(false);
            navigate(`/`);
        } catch(err){
            console.log(err);
        }
    }

    const updateForumHeart = async () => {
        const body = {
            userId: userId,
            heartClickUsers: heartClickUsers
        }
        try{            
            const res = await axios.patch(`/api/forum/heart/update/${id}`, body);
            const data = res.data;
            setHeartCount(data.heart.count)
            setHeartClickUsers(data.heart.user)
            console.log(data);
        } catch(err){
            console.log(err);
        }
    }
  
    const getForum = async () => {
        try{
            const res = await axios.get(`/api/forum/get/${id}`)
            const data = res.data;
            setAttachImagePath(data.attachImagePath)
            setAttachImageName(data.attachImageName)
            setCreatedAt(data.createdAt)
            setHeartCount(data.heart.count)
            setHeartClickUsers(data.heart.user)
            setMainText(data.mainText)
            setTitleText(data.titleText)
            setViewCount(data.viewCount)
            setWriter(data._user.nickname)
            setWriterImg(data._user.profileImage)
            console.log(data)
        } catch(err){
            console.log(err);
        }
    }

    useEffect(() => {
        getForum();
    }, [])

    return (
        <div>
            <Title 
                text='Forum View' 
                deleteBtn={ nickname === writer ? true : false }
                updateBtn={ nickname === writer ? true : false }
                clickDeleteBtn={ () => {setAlertShow(true)}  }
                clickUpdateBtn={ () => navigate(`/forum/update/${id}`) }
                updateBtnText="수정하기"
                deleteBtnText="삭제하기"
            />
               
            {
                alertShow
                ? 
                <Warning 
                    onClickBtn={ deleteForum } 
                    onClose={ () => {setAlertShow(false)} }
                    titleText="경고" 
                    mainText="게시물을 지우면 복구할 수 없습니다.&nbsp; 정말로 삭제하겠습니까?"
                    btnText="삭제하기"
                    variant="danger"
                    btnVariant="outline-danger"
                />
                : null
            }

            <Card>
                <Card.Header as="h5">
                    <Stack direction="horizontal" gap={3}>
                        <div>
                            <Profile 
                                src={ writerImg }  
                                nickname={ writer } 
                                nicknameColor="#000" 
                            />
                        </div>
                        <div className="ms-auto">
                            {titleText.slice(0, 40)}
                        </div>
                        <div className="ms-auto">
                            <EyeCount count={viewCount} />
                        </div>
                        <div>
                            <HeartCount 
                                src={false} 
                                count={heartCount} 
                                fill={heartClickUsers.includes(userId) ? true : false} 
                                onClick={ updateForumHeart } 
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
                forumId={ id } 
                nickname={ nickname }
                profileImage={ profileImage }
                userId={ userId }
            />  
        </div>
    )
}

export default ForumView;