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
    const [attachImage, setAttachImage] = useState('');
    const [attachImageValue, setAttachImageValue] = useState('');
    const fileInput = useRef(null);

    const [alertShow, setAlertShow] = useState(false);

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

    const deleteAttachImage = () => {
        setAttachImage('');
        setAttachImageValue('');
    }

    const onChangeAttachImage = e => {
        let reader = new FileReader();
        const file = e.target.files[0];
        if(file) reader.readAsDataURL(file);
        setAttachImageValue(file.name)
        reader.onload = () => {
            if(reader.readyState === 2){
                console.log(reader.result)
                setAttachImage(reader.result);
            }
        }
    }
  
    const formReset = () => {
        setTitleText('');
        setMainText('');
        setAttachImage('');
        setAttachImageValue('');
        fileInput.current.value="";
    }

    const createForum = async () => {
        const body = {
            _user: userId,
            attachImage: attachImage,
            attachImageValue: attachImageValue,
            titleText: titleText,
            mainText: mainText,
        }
        try{
            const res = await axios.post('/api/forum/post', body);
            console.log(res.data)
            formReset();
            navigate(`/`);
        } catch(err){
            console.log(err);
        }
    }

    const updateForum = async () => {
        const body = {
            attachImage: attachImage,
            attachImageValue: attachImageValue,
            titleText: titleText,
            mainText: mainText,
        }
        try{
            const res = await axios.put(`/api/forum/update/${id}`, body);
            console.log(res.data)
            formReset();
            navigate(`/`);
        } catch(err){
            console.log(err);
            if(err.response.status === 413) setAlertShow(true);
        }
    }

    const onSubmit = e => {
        e.preventDefault();
        (id ? updateForum() : createForum())
    }

    const getForum = async () => {
        try{
            const res = await axios.get(`/api/forum/get/${id}`);
            const data = res.data;
            setTitleText(data.titleText);
            setMainText(data.mainText);
            setAttachImage(data.attachImage);
            setAttachImageValue(data.attachImageValue);
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
            <Title 
                text='Forum Write'
                deleteBtn={ false }
                updateBtn={ true }
                clickUpdateBtn={ onSubmit }
                updateBtnText="저장하기"
            />

            {
                alertShow
                ? 
                <Warning 
                    onClickBtn={ alertClose } 
                    onClose={ () => {setAlertShow(false)} }
                    titleText="안내" 
                    mainText="사진이 용량을 초과하였습니다."
                    btnText="닫기"
                    variant="danger"
                    btnVariant="outline-danger"
                />
                : null
            }

            <Form onSubmit={ onSubmit }>
                <Form.Group controlId="formFile" className="mb-3">
                    <FloatingLabel controlId="floatingTextarea" label="제목" className="mb-3">
                        <Form.Control 
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
                                onClick={ deleteAttachImage }
                            />
                        </div>
                        <div>
                            <Form.Control 
                                type="file" 
                                onChange={ onChangeAttachImage }
                                accept="image/jpg,image/png,image/jpeg"
                                ref={ fileInput }
                                multiple 
                                style={{display:'none'}}
                            />
                            <FloatingLabel controlId="floatingTextarea2" label="파일명">
                                <Form.Control
                                    type="text" 
                                    value={ attachImageValue }
                                    readOnly
                                />
                            </FloatingLabel>
                        </div>
                    </Stack>
                </Form.Group>

                <Button type="submit" style={{display:'none'}} />
            </Form>
        </div>
    )
}

export default ForumWrite;