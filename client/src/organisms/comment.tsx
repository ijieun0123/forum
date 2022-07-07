import { Card, Form, Stack } from 'react-bootstrap';
import React, { useState, useEffect } from 'react';
import Profile from '../atoms/profile';
import Title from '../atoms/title';
import Btn from '../atoms/button';
import HeartCount from '../atoms/heartCount';
import CommentWrite from './commentWrite'
import axios from 'axios';
import Warning from './warning'
import instance from '../utils/instance';

interface Comment {
	forumId: string;
    nickname: string;
    profileImagePath: string;
}

const Comment = ({ 
    forumId, 
    nickname, 
    profileImagePath
}: Comment): React.ReactElement => {
    
    interface Comment {
        commentId: string;
        commentText: string;
        createdAt: string;
        heartCount: number;
        heartFill: boolean;
        nickname: string;
        profileImagePath: string;
    }

    const [targetId, setTargetId] = useState('');
    const [commentText, setCommentText] = useState('')
    const [comments, setComments] = useState<Comment[]>([]);

    const [alertShow, setAlertShow] = useState(false);
    const [alertShowMessage, setAlertShowMessage] = useState('');

    const alertClose = () => setAlertShow(false);

    const onChangeComment = (e: React.ChangeEvent<HTMLInputElement>): void => {
        const newCommentText = e.target.value;
        setCommentText(newCommentText);
    }

    const deleteComment = async (targetId: string) => {
        const body = {
            _forum: forumId
        }
        try{            
            const res = await instance.delete(`/api/comment/delete/${targetId}`, {params: body});
            const data = res.data;
            console.log(data);
            const newComments = comments.filter(comment => comment.commentId !== targetId);
            setComments(newComments)
        } catch(err){
            console.log(err);
        }
    }

    const updateHeart = async (commentId: string) => {
        const body = {
            _forum: forumId,
            _comment: commentId
        }

        try{            
            const res = await instance.post(`/api/heart/update`, body);
            const data = res.data;

            const newComents = [...comments];
            const findIndex = comments.findIndex(el => el.commentId == commentId);
            const newHeartCount = comments[findIndex].heartCount + res.data.fixHeartCount;
            const newHeartFill = res.data.heartFill;

            if(findIndex !== -1) {
                newComents[findIndex] = {
                    ...newComents[findIndex], 
                    heartCount: newHeartCount, 
                    heartFill: newHeartFill
                };

                setComments(newComents)
                setTargetId('');
                console.log(data.msg)
            }
        } catch(err){
            console.log(err);
        }
    }

    const updateComment = async () => {
        const body = {
            commentText: commentText,
        }
        try{
            const res = await instance.patch(`/api/comment/update/${targetId}`, body);
            const newComents = [...comments];
            const newCommentText = res.data.commentText;
            const findIndex = newComents.findIndex(el => el.commentId == targetId);
            console.log(newCommentText)

            if(findIndex !== -1) {
                newComents[findIndex] = {
                    ...newComents[findIndex], 
                    commentText: newCommentText, 
                };

                setComments(newComents)
                setTargetId('');
            }

        } catch(err: any){
            console.log(err);
            setAlertShowMessage(err.response.data);
            setAlertShow(true);
        }
    }

    const clickCancelBtn = async (commentText: string) => {
        setTargetId('')
        setCommentText(commentText)
    }

    const clickUpdateBtn = async (commentId: string, commentText: string) => {
        setTargetId(commentId)
        setCommentText(commentText)
    }

    const getComments = async () => {
        try{
            const res = await instance.get(`/api/comment/get/${forumId}`)
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
            <Title titleText='Comment' />

            {
                alertShow
                ? 
                <Warning 
                    onClickBtn={ alertClose } 
                    onClose={ alertClose }
                    titleText="안내" 
                    mainText={ alertShowMessage }
                    btnText="닫기"
                    variant="danger"
                    btnVariant="outline-danger"
                />
                : null
            }

            { /* 댓글 view */
                comments.map((comment, i) => {
                    return (
                        <Card key={i} style={{ 'margin-bottom':20 } as React.CSSProperties }>
                            <Card.Header as="h5">
                                <Stack direction="horizontal" gap={3}>
                                    <div>
                                        <Profile 
                                            src={ comment.profileImagePath } 
                                            nickname={ comment.nickname } 
                                            nicknameColor="#000" 
                                        />
                                    </div>
                                    <div className="ms-auto" style={{ color:'#888', fontSize:15 }}>
                                        <HeartCount 
                                            count={ comment.heartCount } 
                                            fill={ comment.heartFill } 
                                            onClick={ () => updateHeart(comment.commentId) }
                                        />
                                    </div>
                                </Stack>
                            </Card.Header>
                            <Card.Body>
                                {
                                    targetId === comment.commentId?
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
                                    nickname === comment.nickname?
                                    <div>
                                        <Btn 
                                            value={ targetId ? "Save" : "Update" } 
                                            variant="outline-primary"
                                            margin='10px 10px 0 0'
                                            size="sm"
                                            onClick={ targetId ? updateComment : () => clickUpdateBtn(comment.commentId, comment.commentText) }
                                        />
                                        <Btn 
                                            value={ targetId ? "Cancel" : "Delete" }
                                            variant="outline-danger"
                                            margin='10px 0 0 0'
                                            size="sm"
                                            onClick={ targetId ? () => clickCancelBtn(comment.commentText) : () => deleteComment(comment.commentId) }
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
                profileImagePath={ profileImagePath }
                forumId={ forumId }
                comments={ comments }
                setComments={ setComments }
            />
        </>
    )
}

export default Comment;