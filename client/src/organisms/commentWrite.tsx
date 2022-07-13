import { Card, Form } from 'react-bootstrap';
import Profile from '../atoms/profile';
import Btn from '../atoms/button';
import React, { useState } from 'react';
import Warning from './warning'
import instance from '../utils/instance';
import axios, {AxiosError} from 'axios';
import { Comments } from '../utils/axios';
import { 
    CommentWritePropsType, 
    onChangeText, 
    InputEventType, 
    FormEventType 
} from '../utils/types';

const CommentWrite = ({ 
    profileImagePath, 
    nickname, 
    forumId, 
    comments, 
    setComments 
}: CommentWritePropsType): React.ReactElement => {

    const [commentText, setCommentText] = useState('');

    const [alertShow, setAlertShow] = useState(false);
    const [alertShowMessage, setAlertShowMessage] = useState('');

    const alertClose = () => setAlertShow(false);
    
    const onChangeComment = (e: InputEventType) => onChangeText(e, setCommentText)

    const createComment = async () => {        
        const body = {
            _forum: forumId,
            commentText: commentText
        }

        Comments.postComment(body)
        .then(data => {
            const newComment = data
            const newComments = [...comments, newComment];
            setComments(newComments)
            setCommentText('');
        })
        .catch(err => {
            setAlertShowMessage(err.response.data); 
            setAlertShow(true);
            console.log(err)
        })
    }

    return (
        <>
            {
                alertShow
                ? 
                <Warning 
                    alertShow={ alertShow }
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

            <Form onSubmit={ createComment }>
                <Card>
                    <Card.Header as="h5">
                        <Profile 
                            profileImagePath={ profileImagePath } 
                            nickname={ nickname } 
                            nicknameColor="#000" 
                        />
                    </Card.Header>
                    <Card.Body>
                        <Form.Control
                            as="textarea"
                            placeholder="Leave a comment here"
                            style={{ height: '100px' }}
                            onChange={ onChangeComment }
                            value={ commentText }
                        />
                        <Btn 
                            btnText="Save" 
                            btnVariant="outline-primary"
                            margin='10px 0 0 0'
                            type="submit"
                        />
                    </Card.Body>
                </Card>
            </Form>
        </>
    )
}

export default CommentWrite;