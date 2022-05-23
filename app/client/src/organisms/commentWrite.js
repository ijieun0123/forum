import { Card, Form } from 'react-bootstrap';
import Profile from '../atoms/profile';
import Btn from '../atoms/button';
import { useState } from 'react';
import axios from 'axios';

const CommentWrite = ({ profileImage, nickname, _user, _forum, getComment }) => {

    const [commentText, setCommentText] = useState('');

    const onChangeComment = e => {
        const newCommentText = e.target.value;
        setCommentText(newCommentText);
    }

    const createComment = async (e) => {
        e.preventDefault();
        
        const body = {
            _user: _user,
            _forum: _forum,
            commentText: commentText
        }
        try{
            const res = await axios.post(`/api/comment/post`, body);
            console.log(res.data)
            setCommentText('');
            getComment();
        } catch(err){
            console.log(err);
        }
    }

    return (
        <Form onSubmit={ createComment }>
            <Card>
                <Card.Header as="h5">
                    <Profile 
                        src={ profileImage } 
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
    )
}

export default CommentWrite;