import { Card, Form } from 'react-bootstrap';
import Profile from '../atoms/profile';
import Btn from '../atoms/button';
import { useState } from 'react';
import axios from 'axios';
import Warning from './warning'
import instance from '../utils/instance';

const CommentWrite = ({ profileImagePath, nickname, forumId, getComments }) => {

    const [commentText, setCommentText] = useState('');

    const [alertShow, setAlertShow] = useState(false);
    const [alertShowMessage, setAlertShowMessage] = useState('');

    const alertClose = () => setAlertShow(false);

    const onChangeComment = e => {
        const newCommentText = e.target.value;
        setCommentText(newCommentText);
    }

    const createComment = async (e) => {
        e.preventDefault();
        
        const body = {
            _forum: forumId,
            commentText: commentText
        }
        try{
            const res = await instance.post(`/api/comment/post`, body);
            console.log(res.data)
            setCommentText('');
            getComments();
        } catch(err){
            console.log(err);
            setAlertShowMessage(err.response.data);
            setAlertShow(true);
        }
    }

    return (
        <>
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

            <Form onSubmit={ createComment }>
                <Card>
                    <Card.Header as="h5">
                        <Profile 
                            src={ profileImagePath } 
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
                            value="Save" 
                            variant="outline-primary"
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