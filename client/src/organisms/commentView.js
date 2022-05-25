import { Card, Form, Stack } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import Profile from '../atoms/profile';
import Title from '../atoms/title';
import Btn from '../atoms/button';
import CommentCard from '../molecules/card';
import HeartCount from '../atoms/heartCount';
import CommentWrite from '../organisms/commentWrite'
import axios from 'axios';

const Comment = ({ forumId, nickname, profileImage, userId }) => {

    const [targetId, setTargetId] = useState('');
    const [commentText, setCommentText] = useState('')
    const [heartClickUsers, setHeartClickUsers] = useState([]);
    const [comments, setComments] = useState([]);

    const onChangeComment = e => {
        const newCommentText = e.target.value;
        setCommentText(newCommentText);
    }

    const deleteComment = async (targetId) => {
        const body = {
            _forum: forumId
        }
        try{            
            const res = await axios.delete(`/api/comment/delete/${targetId}`, {params: body});
            const data = res.data;
            console.log(data);
            setComments(data);
        } catch(err){
            console.log(err);
        }
    }

    const updateCommentHeart = async () => {
        const body = {
            userId: userId,
            heartClickUsers: heartClickUsers
        }
        try{            
            const res = await axios.patch(`/api/comment/heart/update/${targetId}`, body);
            const data = res.data;
            console.log(data);
            //getComment();
        } catch(err){
            console.log(err);
        }
    }

    const updateComment = async () => {
        const body = {
            commentText: commentText,
            _forum: forumId
        }
        try{
            const res = await axios.patch(`/api/comment/update/${targetId}`, body);
            const data = res.data;
            console.log(data)
            setComments(data);
            setTargetId('');
        } catch(err){
            console.log(err);
        }
    }

    const clickCancelBtn = async (commentText) => {
        setTargetId('')
        setCommentText(commentText)
    }

    const clickUpdateBtn = async (commentId, commentText) => {
        setTargetId(commentId)
        setCommentText(commentText)
    }

    const getComments = async () => {
        try{
            const res = await axios.get(`/api/comment/get/${forumId}`)
            const data = res.data;
            setComments(data);
            console.log(data)
        } catch(err){
            console.log(err);
        }
    }

    useEffect(() => {
        getComments();
    }, [])

    return (
        <>
            <Title text='Comment' />

            { /* 댓글 view */
                comments.map((comment, i) => {
                    return (
                        <Card key={i} style={{ 'margin-bottom':20 }}>
                            <Card.Header as="h5">
                                <Stack direction="horizontal" gap={3}>
                                    <div>
                                        <Profile 
                                            src={ comment._user.profileImage } 
                                            nickname={ comment._user.nickname } 
                                            nicknameColor="#000" 
                                        />
                                    </div>
                                    <div className="ms-auto" style={{ color:'#888', fontSize:15 }}>
                                        <HeartCount 
                                            src={false} 
                                            count={ comment.heart.count } 
                                            fill={ comment.heart.user.includes(userId) ? true : false } 
                                            onClick={ updateCommentHeart }
                                        />
                                    </div>
                                </Stack>
                            </Card.Header>
                            <Card.Body>
                                {
                                    targetId === comment._id?
                                    <Form.Control
                                        as="textarea"
                                        placeholder="Leave a comment here"
                                        style={{ height: '100px' }}
                                        onChange={ onChangeComment }
                                        value={ commentText }
                                    />
                                    : <Card.Text>{ comment.commentText }</Card.Text>
                                }
                                {
                                    nickname === comment._user.nickname?
                                    <div>
                                        <Btn 
                                            value={ targetId ? "Save" : "Update" } 
                                            variant="outline-primary"
                                            margin='10px 10px 0 0'
                                            onClick={ targetId ? updateComment : () => clickUpdateBtn(comment._id, comment.commentText) }
                                        />
                                        <Btn 
                                            value={ targetId ? "Cancel" : "Delete" }
                                            variant="outline-danger"
                                            margin='10px 0 0 0'
                                            onClick={ targetId ? () => clickCancelBtn(comment.commentText) : () => deleteComment(comment._id) }
                                        />
                                    </div>
                                    : null
                                }
                            </Card.Body>  
                            <Card.Footer style={{ color:'#888', fontSize:15, textAlign:'center' }}>
                                { comment.createdAt.slice(0, 10) }    
                            </Card.Footer> 
                        </Card>
                    )
                })
            }

            {/* 댓글 write */}
            <CommentWrite 
                nickname={ nickname }
                profileImage={ profileImage }
                userId={ userId }
                forumId={ forumId }
                getComments={ getComments }
            />
        </>
    )
}

export default Comment;