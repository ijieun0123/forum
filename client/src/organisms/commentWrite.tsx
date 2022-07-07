import { Card, Form } from 'react-bootstrap';
import Profile from '../atoms/profile';
import Btn from '../atoms/button';
import React, { useState, Dispatch, SetStateAction } from 'react';
import Warning from './warning'
import instance from '../utils/instance';
import axios, {AxiosError} from 'axios';
import ServerError from 'axios';

interface Comment {
    commentId: string;
    commentText: string;
    createdAt: string;
    heartCount: number;
    heartFill: boolean;
    nickname: string;
    profileImagePath: string;
}

interface CommentWrite {
    profileImagePath: string
    nickname: string;
    forumId: string;
    comments: Array<Comment>;
    setComments: React.Dispatch<React.SetStateAction<Comment[]>>;
}
/*
type CreateCommentRes = {
    commentId: string;
    commentText: string;
    createdAt: string;
    heartCount: number;
    heartFill: boolean | undefined;
    nickname: string | undefined;
    profileImagePath: string | undefined;
};
*/
const CommentWrite = ({ 
    profileImagePath, 
    nickname, 
    forumId, 
    comments, 
    setComments 
}: CommentWrite): React.ReactElement => {

    const [commentText, setCommentText] = useState('');

    const [alertShow, setAlertShow] = useState(false);
    const [alertShowMessage, setAlertShowMessage] = useState('');

    const alertClose = () => setAlertShow(false);

    const onChangeComment = (e: React.ChangeEvent<HTMLInputElement>): void => {
        const newCommentText = e.target.value;
        setCommentText(newCommentText);
    }

    const createComment = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        
        const body = {
            _forum: forumId,
            commentText: commentText
        }

        try{
            const res = await instance.post(`/api/comment/post`, body);
            const newComment = res.data
            const newComments = [...comments, newComment];
            setComments(newComments)
            setCommentText('');
        } catch(err: any){
            setAlertShowMessage(err.response.data); 
            setAlertShow(true);
            console.log(err)
        }
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