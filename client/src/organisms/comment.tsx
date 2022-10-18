import { Card, Form, Stack } from 'react-bootstrap';
import React, { useState, useEffect } from 'react';
import Profile from '../atoms/profile.tsx';
import Title from '../atoms/title.tsx';
import Btn from '../atoms/button.tsx';
import HeartCount from '../atoms/heartCount.tsx';
import CommentWrite from './commentWrite.tsx'
import axios from 'axios';
import Warning from './warning.tsx'
import instance from '../utils/instance';
import { Comments, Hearts } from '../utils/axios.ts';
import { 
    CommentType, 
    CommentPropsType, 
    onChangeText, 
    InputEventType,
    Types
} from '../utils/types.ts';
import openSocket from "socket.io-client";

const socket = openSocket("http://localhost:5000", {
    transports: ['websocket']
});

const Comment = ({ 
    forumId, 
    nickname, 
    profileImagePath
}: CommentPropsType): React.ReactElement => {

    const [targetId, setTargetId] = useState('');
    const [commentText, setCommentText] = useState('')
    const [comments, setComments] = useState<CommentType[]>([]);

    const [alertShow, setAlertShow] = useState(false);
    const [alertShowMessage, setAlertShowMessage] = useState('');

    const alertClose = () => setAlertShow(false);

    const onChangeComment = (e: InputEventType) => onChangeText(e, setCommentText)

    const deleteComment = async (commentId: Types['commentId']) => {
        const params = {
            _forum: forumId
        }

        Comments.deleteComment(params, commentId)
        .then(() => {
            const newComments = comments.filter(comment => comment.commentId !== commentId);
            setComments(newComments)
        })
        .catch(err => {
            console.log(err);
        })
    }

    const updateHeart = async (commentId: Types['commentId']) => {
        const body = {
            _forum: forumId,
            _comment: commentId
        }

        Hearts.postHeart(body)
        .then((data) => {
            const newComents = [...comments];
            const findIndex = comments.findIndex(el => el.commentId == commentId);
            const newHeartCount = comments[findIndex].heartCount + data.fixHeartCount;
            const newHeartFill = data.heartFill;

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
        })
        .catch((err) => {
            console.log(err);
        })
    }

    const updateComment = async () => {
        const body = {
            commentText: commentText,
        }

        Comments.updateComment(body, targetId)
        .then(data => {
            const newComents = [...comments];
            const newCommentText = data.commentText;
            const findIndex = newComents.findIndex(el => el.commentId == targetId);

            if(findIndex !== -1) {
                newComents[findIndex] = {
                    ...newComents[findIndex], 
                    commentText: newCommentText, 
                };

                setComments(newComents)
                setTargetId('');
            }
        })
        .catch(err => {
            console.log(err);
            setAlertShowMessage(err.response.data);
            setAlertShow(true);
        })
    }

    const clickCancelBtn = async (commentText: Types['commentText']) => {
        setTargetId('')
        setCommentText(commentText)
    }

    const clickUpdateBtn = async (commentId: Types['commentId'], commentText: Types['commentText']) => {
        setTargetId(commentId)
        setCommentText(commentText)
    }

    const getComments = async () => {
        Comments.getComments(forumId)
        .then((data) => {
            setComments(data);
        })
        .catch((err) => {
            console.log(err)
        })
    }

    socket.on("comment", data => {
        console.log(data);
        
        if (data.action === "add") {
            setComments(prevComments => [data.comment, ...prevComments]);
        } else if (data.action === "delete") {
            /*
            setComments(prevComments =>
                prevComments.filter(comment => comment._id !== commentId)
            );
            */
        }
       
        socket.emit('reply', data)

    });

    useEffect(() => {
        getComments();
        //return () => socket.disconnect();
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
                    alertTitleText="Alert" 
                    mainText={ alertShowMessage }
                    btnText="Close"
                    alertVariant="danger"
                    btnVariant="outline-danger"
                />
                : null
            }

            { /* 댓글 view */
                comments.map((comment, i) => {
                    return (
                        <Card key={i} className="mb-3">
                            <Card.Header as="h5">
                                <Stack direction="horizontal" gap={3}>
                                    <div>
                                        <Profile 
                                            profileImagePath={ comment.profileImagePath } 
                                            nickname={ comment.nickname } 
                                            nicknameColor="#000" 
                                        />
                                    </div>
                                    <div className="ms-auto fs-5 text-secondary">
                                        <HeartCount 
                                            heartCount={ comment.heartCount } 
                                            heartFill={ comment.heartFill } 
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
                                            btnText={ targetId ? "Save" : "Update" } 
                                            btnVariant="outline-primary"
                                            margin='10px 10px 0 0'
                                            size="sm"
                                            onClick={ targetId ? updateComment : () => clickUpdateBtn(comment.commentId, comment.commentText) }
                                        />
                                        <Btn 
                                            btnText={ targetId ? "Cancel" : "Delete" }
                                            btnVariant="outline-danger"
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