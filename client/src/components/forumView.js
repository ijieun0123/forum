import axios from 'axios';
import Title from '../atoms/title';
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Warning from '../organisms/warning'
import CommentView from '../organisms/commentView'
import CommentWrite from '../organisms/commentWrite'
import { Card, Stack } from 'react-bootstrap';
import Profile from '../atoms/profile';
import HeartCount from '../atoms/heartCount'
import { useSelector } from 'react-redux'
import EyeCount from '../atoms/eyeCount';

const ForumView = () => {

    const [attachImage, setAttachImage] = useState('');
    const [createdAt, setCreatedAt] = useState('');
    const [heartCount, setHeartCount] = useState(0);
    const [heartClickUsers, setHeartClickUsers] = useState([]);
    const [mainText, setMainText] = useState('');
    const [titleText, setTitleText] = useState('');
    const [viewCount, setViewCount] = useState('');
    const [writer, setWriter] = useState('');
    const [writerImg, setWriterImg] = useState('');
    const [comments, setComments] = useState([]);

    const [alertShow, setAlertShow] = useState(false);
    const user = useSelector(state => state.user.user);
    const { nickname, signin, profileImage, _id } = user;

    const { id } = useParams();
    const navigate = useNavigate();
    
    const deleteForum = async () => {
        try{            
            const res = await axios.delete(`/forum/delete/${id}`);
            console.log(res.data);
            setAlertShow(false);
            navigate(`/forum/list/`);
        } catch(err){
            console.log(err);
        }
    }

    const updateForumHeart = async () => {
        const body = {
            userId: user._id,
            heartClickUsers: heartClickUsers
        }
        try{            
            const res = await axios.patch(`/forum/heart/update/${id}`, body);
            const data = res.data;
            setHeartCount(data.heart.count)
            setHeartClickUsers(data.heart.user)
            console.log(data);
        } catch(err){
            console.log(err);
        }
    }

    const getComment = async () => {
        try{
            const res = await axios.get(`/forum/get/${id}`)
            const data = res.data;
            setComments(data._comment)
            console.log(data._comment)
        } catch(err){
            console.log(err);
        }
    }

    const updateViewCount = async () => {
        try{
            const res = await axios.patch(`/forum/viewCount/update/${id}`);
            console.log(res.data)
        } catch(err){
            console.log(err);
        }
    }
  
    const getForum = async () => {
        try{
            const res = await axios.get(`/forum/get/${id}`)
            const data = res.data;
            setAttachImage(data.attachImage)
            setCreatedAt(data.createdAt)
            setHeartCount(data.heart.count)
            setHeartClickUsers(data.heart.user)
            setMainText(data.mainText)
            setTitleText(data.titleText)
            setViewCount(data.viewCount)
            setWriter(data._user.nickname)
            setWriterImg(data._user.profileImage)
            setComments(data._comment)
            console.log(data)
        } catch(err){
            console.log(err);
        }
    }

    useEffect(() => {
        getForum();
        updateViewCount();
    }, [])

    return (
        <div>
            <Title 
                text='Forum View' 
                deleteBtn={ nickname === writer ? true : false }
                updateBtn={ nickname === writer ? true : false }
                clickDeleteBtn={ () => {setAlertShow(true)}  }
                clickUpdateBtn={ () => navigate(`/forum/update/${id}`) }
            />
               
            {
                alertShow
                ? 
                <Warning 
                    onClick={ deleteForum } 
                    onClose={ () => {setAlertShow(false)} }
                    titleText="경고" 
                    mainText="게시물을 지우면 복구할 수 없습니다.&nbsp; 정말로 삭제하겠습니까?"
                    btnText="삭제하기"
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
                            {titleText}
                        </div>
                        <div className="ms-auto">
                            <EyeCount count={viewCount} />
                        </div>
                        <div>
                            <HeartCount 
                                src={false} 
                                count={heartCount} 
                                fill={heartClickUsers.includes(user._id) ? true : false} 
                                onClick={ updateForumHeart } 
                            />
                        </div>
                    </Stack>
                </Card.Header>
                <Card.Body>
                    {attachImage? <Card.Img variant="top" src={ attachImage } /> : null}
                    <Card.Text>{mainText}</Card.Text>
                </Card.Body>
                <Card.Footer className="text-muted text-center">
                    {createdAt? createdAt.slice(0, 10) : null}
                </Card.Footer>
            </Card>

            <Title text='Review' />

            {/* 댓글 반복문 */
                comments.map((comment, i) => {
                    return (
                        <CommentView
                            key={i}
                            writerImg={ comment._user.profileImage } 
                            writer={ comment._user.nickname } 
                            heartCount={ comment.heart.count }
                            heartFill={ comment.heart.user.includes(user._id) ? true : false }
                            heartClickUsers={ comment.heart.user }
                            cardText={ comment.commentText }
                            createDate={ comment.createdAt.slice(0, 10) }
                            commentId={ comment._id }
                            getComment={ getComment }
                        />
                    )
                })
            }

            {/* 댓글 쓰기 */
                signin ? 
                <CommentWrite 
                    nickname={ nickname }
                    profileImage={ profileImage }
                    _user={ _id }
                    _forum={ id }
                    getComment={ getComment }
                />
                : null
            }
        </div>
    )
}

export default ForumView;