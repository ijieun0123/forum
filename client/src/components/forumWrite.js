import { FloatingLabel, Form, Stack, Button } from 'react-bootstrap';
import { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Title from '../atoms/title';
import { useSelector } from 'react-redux';
import axios from 'axios';
import Warning from '../organisms/warning'

const ForumWrite = () => {
    const [titleText, setTitleText] = useState('')
    const [mainText, setMainText] = useState('')
    const [attachImagePath, setAttachImagePath] = useState('');
    const [attachImageName, setAttachImageName] = useState('');

    const [alertShow, setAlertShow] = useState(false);
    const [alertShowMessage, setAlertShowMessage] = useState('');

    const user = useSelector(state => state.user.user);
    const { userId } = user;

    const { id } = useParams();
    const navigate = useNavigate();

    const alertClose = () => setAlertShow(false);

    const onChangeTitle = e => {
        const newTitle = e.target.value;
        setTitleText(newTitle);
    }

    const onChangeMain = e => {
        const newMain = e.target.value;
        setMainText(newMain);
    }

    const onChangeattachImagePath = e => {
        const newattachImagePath = e.target.value;
        console.log(newattachImagePath)
        setAttachImagePath(newattachImagePath);
    }

    const deleteattachImagePath = () => {
        setAttachImagePath('');
    }
  
    const formReset = () => {
        setTitleText('');
        setMainText('');
        setAttachImagePath('');
    }

    const createForum = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        formData.get('titleText');
        formData.get('mainText');
        formData.append('_user', userId)
        formData.append('attachImagePath', attachImagePath);

        if( !titleText || !mainText ) {
            setAlertShowMessage('제목과 본문을 입력하세요.')
            setAlertShow(true)
        } else{
            let config = {
                method: "post",
                url: "/api/forum/post",
                headers: {
                  "content-type": "application/json",
                  "content-type": "multipart/form-data"
                },
                data: formData,
            };
    
            try{
                const res = await axios(config);
                console.log(res.data)
                formReset();
                navigate(`/`);
            } catch(err){
                console.log(err);
                if(err.response.status === 413) {
                    setAlertShowMessage('사진이 용량을 초과하였습니다.')
                    setAlertShow(true);
                }
            }
        }
    }

    const editForum = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        formData.get('titleText');
        formData.get('mainText');
        formData.append('attachImageName', attachImageName);
        formData.append('attachImagePath', attachImagePath);

        if( !titleText || !mainText ) {
            setAlertShowMessage('제목과 본문을 입력하세요.')
            setAlertShow(true)
        } else{
            let config = {
                method: "put",
                url: `/api/forum/update/${id}`,
                headers: {
                  "content-type": "application/json",
                  "content-type": "multipart/form-data"
                },
                data: formData,
            };
    
            try{
                const res = await axios(config);
                console.log(res.data)
                formReset();
                navigate(`/`);
            } catch(err){
                console.log(err);
                if(err.response.status === 413) {
                    setAlertShowMessage('사진이 용량을 초과하였습니다.')
                    setAlertShow(true);
                }
            }
        }
    }

    const onSubmit = e => {
        e.preventDefault();
        (id ? editForum(e) : createForum(e))
    }

    const getForum = async () => {
        try{
            const res = await axios.get(`/api/forum/get/${id}`);
            const data = res.data;
            setTitleText(data.titleText);
            setMainText(data.mainText);
            setAttachImagePath(data.attachImagePath);
            setAttachImageName(data.attachImageName);
            console.log(data)
        } catch(err){
            console.log(err);
        }
    }

    useEffect(() => {
        if(id) getForum();
    }, [])

    return (
        <div>
            {
                alertShow
                ? 
                <Warning 
                    onClickBtn={ alertClose } 
                    onClose={ () => {setAlertShow(false)} }
                    titleText="안내" 
                    mainText={ alertShowMessage }
                    btnText="닫기"
                    variant="danger"
                    btnVariant="outline-danger"
                />
                : null
            }

            <Form onSubmit={ onSubmit }>
                <Title 
                    text='Forum Write'
                    deleteBtn={ false }
                    updateBtn={ true }
                    updateBtnText="저장하기"
                />

                <Form.Group controlId="formFile" className="mb-3">
                    <FloatingLabel controlId="floatingTextarea" label="제목" className="mb-3">
                        <Form.Control 
                            name="titleText"
                            as="textarea" 
                            placeholder="Leave a comment here" 
                            value={ titleText }
                            onChange={ onChangeTitle }
                            maxLength='40'
                        />
                    </FloatingLabel>
                </Form.Group>
                <Form.Group controlId="formFile" className="mb-3">
                    <FloatingLabel controlId="floatingTextarea2" label="본문">
                        <Form.Control
                            name="mainText"
                            as="textarea"
                            placeholder="Leave a comment here"
                            style={{ minHeight: '100px' }}
                            value={ mainText }
                            onChange={ onChangeMain }
                        />
                    </FloatingLabel>
                </Form.Group>

                <Form.Group controlId="formFileMultiple" className="mb-3">
                    <Stack gap={0}>
                        <div>
                            <Form.Label style={{cursor:'pointer'}}>파일첨부</Form.Label>
                            <img 
                                src="../../img/close.svg" 
                                alt="삭제" 
                                style={{ cursor:'pointer', width:25, marginLeft:5 }}
                                onClick={ deleteattachImagePath }
                            />
                        </div>
                        <div>
                            <Form.Control 
                                name="attachImagePath"
                                type="file" 
                                onChange={ onChangeattachImagePath }
                                accept="image/jpg,image/png,image/jpeg"
                                style={{ display:'none' }}
                            />
                            <FloatingLabel controlId="floatingTextarea2" label="파일명">
                                <Form.Control
                                    type="text" 
                                    value={ attachImagePath }
                                    readOnly
                                />
                            </FloatingLabel>
                        </div>
                    </Stack>
                </Form.Group>

                <Button type="submit" style={{ display:'none' }}/>
            </Form>
        </div>
    )
}

export default ForumWrite;