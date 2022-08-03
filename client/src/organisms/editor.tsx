import { useState, useRef, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Navigate } from 'react-router-dom';
import styled from 'styled-components';

// Toast 에디터
import '@toast-ui/editor/dist/toastui-editor.css';
import { Editor as ToastEditor } from '@toast-ui/react-editor';
import 'tui-color-picker/dist/tui-color-picker.css';
import '@toast-ui/editor-plugin-color-syntax/dist/toastui-editor-plugin-color-syntax.css';
import colorSyntax from '@toast-ui/editor-plugin-color-syntax';
import fontSize from "tui-editor-plugin-font-size";
import "tui-editor-plugin-font-size/dist/tui-editor-plugin-font-size.css";

import instance from '../utils/instance';
import axios, { AxiosRequestConfig, AxiosResponse} from 'axios';
import { FormEventType } from '../utils/types';
import { InputEventType, SetStateActionStringType } from '../utils/types';

interface EditorType {
    onChangeMain: (
        e: InputEventType,
        setState: SetStateActionStringType
    ) => void,
    setMainText: SetStateActionStringType,
    mainText: string,
    attachImageNames: string[],
    setAttachImageNames: React.Dispatch<React.SetStateAction<string[]>>,
    isSubmit: boolean,
}

const Editor = ({ 
    onChangeMain,
    setMainText,
    mainText,
    attachImageNames,
    setAttachImageNames,
    isSubmit,
}: EditorType): React.ReactElement => {

    const editorRef = useRef<ToastEditor>(null);

    const [imgTagLength, setImgTagLength] = useState(0);

    const navigate = useNavigate();
    
    const onChangeEditor = () => {
        const newMainText = editorRef.current?.getInstance().getHTML();
        if(newMainText) setMainText(newMainText)
        console.log(newMainText)

        const newImgTagLength = document.getElementsByTagName("img").length

        if(imgTagLength > newImgTagLength){
            const targetImageName = attachImageNames.find(attachImageName => newMainText.includes(attachImageName) === false)
            deleteImage(targetImageName);
        }

        setImgTagLength(newImgTagLength)
    }

    const uploadImage = async (blob: Blob | File, callback: Function): Promise<void> => {
        const formData = new FormData();
        formData.append('image', blob);

        const config: AxiosRequestConfig = {
            url: "/api/forum/get/image/url",
            method: "post",
            headers: {
                "content-type": "multipart/form-data"
            },
            data: formData
        }

        try{
            const res = await axios(config);
            const data = res.data;
            const attachImagePath = data.attachImagePath;
            const attachImageName = data.attachImageName;
            /*
            useCallback(
                () => {
                    setAttachImageNames(attachImageNames => 
                        [...attachImageNames, attachImageName]
                    )
                },
                [attachImageNames],
            )
            */
            setAttachImageNames(attachImageNames => {
                const newAttachImageNames = [...attachImageNames, attachImageName];
                return newAttachImageNames
            })
            console.log(attachImageNames)
            callback(attachImagePath, '첨부사진');
        } catch (err) {
            console.log(err)
        }
    }

    const deleteImage = async (attachImageName: string) => {
        const body = {
            attachImageName: attachImageName
        }

        try{
            const res = await axios.delete("/api/forum/delete/image", {params: body})
            console.log(res.data)
            setAttachImageNames(attachImageNames => {
                const newAttachImageNames = attachImageNames.filter(el => el !== attachImageName)
                return newAttachImageNames
            });
            console.log(attachImageNames)
        } catch (err) {
            console.log(err)
        }
    }

    const deleteImages = async () => {
        const body = {
            attachImageNames: attachImageNames
        }

        try{
            const res = await axios.delete("/api/forum/delete/images", {params: body})
            console.log(res.data)
        } catch (err) {
            console.log(err)
        }
    }

    useEffect(() => {
        const imgTagLength = document.getElementsByTagName("img").length;
        setImgTagLength(imgTagLength);
    }, []);
    /*
    useEffect(() => {
        console.log(attachImageNames)
    }, [attachImageNames, isSubmit]);
    */

    const isFirstRender = useRef(true)

    useEffect(() => {
        if (!isFirstRender.current) {
            console.log(attachImageNames) // do something after state has updated
        }
    }, [attachImageNames])

    useEffect(() => { 
        isFirstRender.current = false // toggle flag after first render/mounting
    }, [])

    useEffect(() => {
        if(isSubmit) navigate('/');
        
        return(() => {
            console.log('return isSubmit: ' + isSubmit);
            console.log('return attachImageNames: ' + attachImageNames);
            if(!isSubmit && attachImageNames) deleteImages() // attachImageNames가 안잡힘
        })
    }, [isSubmit])
    
    return (
        <ToastEditor
            initialValue={ mainText }
            previewStyle="vertical" // 미리보기 스타일 지정
            height="500px" // 에디터 창 높이
            initialEditType="wysiwyg" // 초기 입력모드 설정(디폴트 markdown)
            toolbarItems={[
                // 툴바 옵션 설정
                ['heading', 'bold', 'italic', 'strike'],
                ['hr', 'quote'],
                ['ul', 'ol', 'task', 'indent', 'outdent'],
                ['table', 'image', 'link'],
                ['code', 'codeblock']
            ]}
            ref={ editorRef }
            onChange={ onChangeEditor }
            hooks={{
                addImageBlobHook: uploadImage
            }}
            plugins={[
                fontSize, colorSyntax
            ]}
        />
    );
}

export default Editor;
