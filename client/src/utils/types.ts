import React from "react";

// eventType 
export type InputEventType = React.ChangeEvent<HTMLInputElement>;
export type SelectEventType = React.ChangeEvent<HTMLSelectElement>;
export type FormEventType = React.ChangeEvent<HTMLFormElement>;
export type BtnMouseEventType = React.MouseEvent<HTMLButtonElement, MouseEvent>;

// setStateType
export type SetStateActionStringType = React.Dispatch<React.SetStateAction<string>>

// 공통 Types
export interface Types {
    // string
    nickname: string;
    nicknameColor: string; 
    profileImagePath: string;
    forumId: string;
    titleText: string;
    mainText: string;
    attachImageName: string;
    attachImagePath: string;
    commentId: string;
    commentText: string;
    createdAt: string;
    margin: string;

    // boolean
    disabled: boolean;
    warnBtn: boolean;
    primaryBtn: boolean;
    alertShow: boolean;
    heartFill: boolean;

    // number
    heartCount: number;
    viewCount: number

    // onClick
    BtnOnClick: (e: BtnMouseEventType) => void; 

    // else
    size: "sm" | "lg";
    type: "submit";
    btnText: "Forum" | "Update" | "Sign in" | "Sign out" | "Sign up" | "Withdrawal" | "Delete" | "Close" | "Home" | "Save" | "Update" | "Cancel";
    btnVariant: "outline-primary" | "outline-danger" | "outline-light" | "danger" | "secondary" | "primary";
    alertVariant: "danger" | "primary";
    primaryBtnText: "Update" | "Write" | "Save" | "Sign in" | "Sign up";
    warnBtnText: "Withdrawal" | "Delete";
    alertTitleText: "Alert" | "Info";
}

// Props ( Atoms & Warning )
export interface BtnType {
    btnText: Types['btnText'];
    btnVariant: Types['btnVariant'];
    margin: Types['margin'];
    size?: Types['size'];
    type?: Types['type'];
    disabled?: Types['disabled'];
    onClick?: Types['BtnOnClick'];
}

export interface EyeCountType {
    viewCount: Types['viewCount'];
}

export interface HeartCountType {
    heartCount: Types['heartCount'];
    heartFill: Types['heartFill'];
    onClick: Types['BtnOnClick'];
}

export interface ProfileType {
    profileImagePath: Types['profileImagePath'];
    nickname: Types['nickname'];
    nicknameColor?: Types['nicknameColor'];
}

export interface TitleType {
    titleText: Types['titleText'];
    warnBtn?: Types['warnBtn'];
    primaryBtn?: Types['primaryBtn'];
    primaryBtnText?: Types['primaryBtnText'];
    warnBtnText?: Types['warnBtnText'];
    clickWarnBtn?: Types['BtnOnClick'];
    clickPrimaryBtn?: Types['BtnOnClick'];
}

export interface WarningType {
    alertShow?: Types['alertShow'];
    alertTitleText: Types['alertTitleText'];
    mainText: Types['mainText'];
    btnText: Types['btnText'];
    alertVariant: Types['alertVariant'];
    btnVariant: Types['btnVariant'];
    onClickBtn: Types['BtnOnClick'];
    onClose: Types['BtnOnClick'];
}

// Forum
export interface ForumType extends EyeCountType, ProfileType, HeartCountType {
    forumId: Types['forumId'];
    titleText: Types['titleText'];
    mainText: Types['mainText'];
    attachImagePath: Types['attachImagePath'];
    attachImageName: Types['attachImageName'];
    createdAt: Types['createdAt'];
}

// Comment
export interface CommentType extends ProfileType, HeartCountType {
    commentId: Types['commentId'];
    commentText: Types['commentText'];
    createdAt: Types['createdAt'];
} 

// Comment Props
export interface CommentPropsType extends ProfileType {
    forumId: Types['forumId'];
} 

// CommentWrite Props
export interface CommentWritePropsType extends CommentPropsType {
    comments: CommentType[];
    setComments: React.Dispatch<React.SetStateAction<CommentType[]>>;
} 

// Pagination
export type PagingType = {
    activePage: number;
    itemsCountPerPage: number;
    totalItemsCount: number;
    onChangePage: (pageNumber: number) => void;
}

// onChangeText 중복 함수
type onChangeTextType = (
    e: InputEventType | SelectEventType,
    setState: SetStateActionStringType
 ) => void;

export const onChangeText: onChangeTextType = (e, setState) => {
    const newText = e.target.value;
    setState(newText)
}

// onChangeImageSrc 중복 함수
type onChangeImageType = (
    e: InputEventType,
    setState: SetStateActionStringType
) => void;

export const onChangeImageSrc: onChangeImageType = (e, setState) => {
    if(e.target.files){
        const fileBlob = e.target.files[0]
        const reader = new FileReader();
        reader.readAsDataURL(fileBlob);
        return new Promise<void>((resolve) => {
            reader.onload = () => {
                setState(reader.result as string);
                resolve();
            };
        });
    }
}