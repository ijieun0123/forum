import { FloatingLabel, Form, Stack, Button } from 'react-bootstrap';
import { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Title from '../atoms/title.tsx';
import Warning from '../organisms/warning.tsx'
import instance from '../utils/instance.ts';
import axios, { AxiosRequestConfig, AxiosResponse} from 'axios';
import { onChangeText, InputEventType, FormEventType } from '../utils/types.ts';
import { Forums } from '../utils/axios.ts'
import Editor from '../organisms/editor.tsx';
import { useDispatch, useSelector } from 'react-redux'
import { ReducerType } from '../app/store.ts';
import { Forum } from '../features/forumSlice.ts'

const ForumWrite = () => {
    const [titleText, setTitleText] = useState('')
    const [mainText, setMainText] = useState('')
    //const [attachImagePath, setAttachImagePath] = useState('');
    const [attachImageNames, setAttachImageNames] = useState<string[]>([]);
    const [isSubmit, setIsSubmit] = useState(false);
    //let isSubmit = false;

    const [alertShow, setAlertShow] = useState(false);
    const [alertShowMessage, setAlertShowMessage] = useState('');

    const { id } = useParams();
    const navigate = useNavigate();

    const forum = useSelector<ReducerType, Forum['forum']>(state => state.forum.forum);
    const forumData = forum.find(el => el.forumId === id);

    const alertClose = () => setAlertShow(false);

    const onChangeTitle = (e: InputEventType) => onChangeText(e, setTitleText);
    const onChangeMain = (e: InputEventType) => onChangeText(e, setMainText);
    //const onChangeAttachImagePath = (e: InputEventType) => onChangeText(e, setAttachImagePath);

    const formReset = () => {
        setTitleText('');
        setMainText('');
    }

    const createForum = async (e: FormEventType) => {
        e.preventDefault();
        const body = {
            titleText: titleText,
            mainText: mainText,
            attachImageNames: attachImageNames
        }

        Forums.postForum(body)
        .then(() => {
            setIsSubmit(isSubmit => !isSubmit);
            formReset();
        })
        .catch((err: any) => {
            setAlertShowMessage(err.response.data)
            setAlertShow(true)
        })
    }

    const editForum = async (e: FormEventType) => {
        e.preventDefault();
        const body = {
            titleText: titleText,
            mainText: mainText,
            attachImageNames: attachImageNames
        }

        Forums.putForum(body, id)
        .then(() => {
            setIsSubmit(isSubmit => !isSubmit);
            formReset();
        })
        .catch((err: any) => {
            setAlertShowMessage(err.response.data)
            setAlertShow(true)
        })
    }

    const onSubmit = (e: FormEventType) => {
        e.preventDefault();
        (id ? editForum(e) : createForum(e))
    }

    const getForum = async () => {
        try{
            if(id){
                setTitleText(forumData.titleText);
                setMainText(forumData.mainText);
                setAttachImageNames(forumData.attachImageNames);
                console.log(forumData)
            }
        } catch(err){
            console.log(err);
        }
    }

    useEffect(() => {
        if(id) getForum();
    }, [])
    /*
    useEffect(() => {
        console.log('forumWrite isSubmit: ' + isSubmit)
        if(isSubmit) navigate('/');
    }, [isSubmit])
    */
    return (
        <div>
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

            <Form onSubmit={ onSubmit }>
                <Title 
                    titleText='Forum Write'
                    primaryBtn={ true }
                    primaryBtnText="Save"
                />

                <Form.Group controlId="formFile" className="mb-3">
                    <FloatingLabel controlId="floatingTextarea" label="제목" className="mb-3">
                        <Form.Control 
                            name="titleText"
                            as="textarea" 
                            placeholder="Leave a comment here" 
                            value={ titleText }
                            onChange={ onChangeTitle }
                            maxLength={40}
                        />
                    </FloatingLabel>
                </Form.Group>
                <Form.Group controlId="formFile" className="mb-3">
                    <FloatingLabel controlId="floatingTextarea2" label="">
                        <Editor 
                            onChangeMain={ onChangeMain }
                            setMainText={ setMainText }
                            mainText={ forumData ? forumData.mainText : '' }
                            attachImageNames={ attachImageNames }
                            setAttachImageNames={ setAttachImageNames }
                            isSubmit={ isSubmit }
                        />
                    </FloatingLabel>
                </Form.Group>
            </Form>
        </div>
    )
}

export default ForumWrite;