import { Card, Form, Stack } from 'react-bootstrap';
import Btn from '../atoms/button';
import Profile from '../atoms/profile';
import HeartCount from '../atoms/heartCount';

const CommentCard = ({ 
                        src, 
                        nickname, 
                        date, 
                        updateId, 
                        commentId, 
                        onChangeComment, 
                        formControlValue, 
                        cardText, 
                        authorNickname, 
                        clickPrimaryBtn, 
                        clickWarnBtn,
                        heartCount,
                        heartFill,
                        updateHeart 
                    }) => {
                    return (
                            <Card>
                                <Card.Header as="h5">
                                    <Stack direction="horizontal" gap={3}>
                                        <div>
                                            <Profile 
                                                src={ src } 
                                                nickname={ authorNickname } 
                                                nicknameColor="#000" 
                                            />
                                        </div>
                                        <div className="ms-auto" style={{ color:'#888', fontSize:15 }}>
                                            <HeartCount src={false} count={heartCount} fill={heartFill} onClick={ updateHeart } />
                                        </div>
                                    </Stack>
                                </Card.Header>
                                <Card.Body>
                                    {
                                        updateId === commentId?
                                        <Form.Control
                                            as="textarea"
                                            placeholder="Leave a comment here"
                                            style={{ height: '100px' }}
                                            onChange={ onChangeComment }
                                            value={ formControlValue }
                                        />
                                        : <Card.Text>{ cardText }</Card.Text>
                                    }
                                    {
                                        nickname === authorNickname?
                                        <div>
                                            <Btn 
                                                value={ updateId ? "Save" : "Update" } 
                                                variant="outline-primary"
                                                margin='10px 10px 0 0'
                                                onClick={ clickPrimaryBtn }
                                            />
                                            <Btn 
                                                value={ updateId ? "Cancel" : "Delete" }
                                                variant="outline-danger"
                                                margin='10px 0 0 0'
                                                onClick={ clickWarnBtn }
                                            />
                                        </div>
                                        : null
                                    }
                                </Card.Body>  
                                <Card.Footer style={{ color:'#888', fontSize:15, textAlign:'center' }}>{ date }</Card.Footer> 
                            </Card>
                        )
                    }

export default CommentCard;