import { Card, Form, Stack } from 'react-bootstrap';
import { useSelector } from 'react-redux'
import { useState, useEffect } from 'react';
import Profile from '../atoms/profile';
import Title from '../atoms/title';
import Btn from '../atoms/button';
import { useParams } from 'react-router-dom';
import CommentCard from '../molecules/card';
import HeartCount from '../atoms/heartCount';
import axios from 'axios';

const CommentView = ({ writerImg, writer, heartCount, cardText, createDate, heartClickUsers, heartFill, commentId, getComment }) => {
    const user = useSelector(state => state.user.user);
    const { nickname } = user
    const [commentText, setCommentText] = useState(cardText);
    const [targetId, setTargetId] = useState('');

    const onChangeComment = e => {
        const newCommentText = e.target.value;
        setCommentText(newCommentText);
    }

    const deleteComment = async () => {
        try{            
            const res = await axios.delete(`/api/comment/delete/${commentId}`);
            console.log(res.data);
            getComment();
        } catch(err){
            console.log(err);
        }
    }

    const updateCommentHeart = async () => {
        const body = {
            userId: user._id,
            heartClickUsers: heartClickUsers
        }
        try{            
            const res = await axios.patch(`/api/comment/heart/update/${commentId}`, body);
            const data = res.data;
            console.log(data);
            getComment();
        } catch(err){
            console.log(err);
        }
    }

    const updateComment = async () => {
        const body = {
            commentText: commentText,
        }
        try{
            const res = await axios.patch(`/api/comment/update/${targetId}`, body);
            console.log(res.data)
            getComment();
            setTargetId('');
        } catch(err){
            console.log(err);
        }
    }

    const clickCancelBtn = async () => {
        setTargetId('')
        setCommentText(cardText)
    }

    const clickUpdateBtn = async () => {
        setTargetId(commentId)
    }

    return (
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
                    <div className="ms-auto" style={{ color:'#888', fontSize:15 }}>
                        <HeartCount 
                            src={false} 
                            count={heartCount} 
                            fill={heartFill} 
                            onClick={ updateCommentHeart }
                        />
                    </div>
                </Stack>
            </Card.Header>
            <Card.Body>
                {
                    targetId === commentId?
                    <Form.Control
                        as="textarea"
                        placeholder="Leave a comment here"
                        style={{ height: '100px' }}
                        onChange={ onChangeComment }
                        value={commentText}
                    />
                    : <Card.Text>{cardText}</Card.Text>
                }
                {
                    nickname === writer?
                    <div>
                        <Btn 
                            value={ targetId ? "Save" : "Update" } 
                            variant="outline-primary"
                            margin='10px 10px 0 0'
                            onClick={ targetId ? updateComment : clickUpdateBtn }
                        />
                        <Btn 
                            value={ targetId ? "Cancel" : "Delete" }
                            variant="outline-danger"
                            margin='10px 0 0 0'
                            onClick={ targetId ? clickCancelBtn : deleteComment }
                        />
                    </div>
                    : null
                }
            </Card.Body>  
            <Card.Footer style={{ color:'#888', fontSize:15, textAlign:'center' }}>{createDate}</Card.Footer> 
        </Card>
    )
}

export default CommentView;