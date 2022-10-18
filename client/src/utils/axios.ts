import axios, { AxiosRequestConfig, AxiosResponse} from 'axios';
import instance from "./instance.ts";
import { ForumType, CommentType } from "./types";

const responseBody = (response: AxiosResponse) => response.data;

// Forum axios
interface getForumsBody {
    selectValue?: string;
    searchValue?: string;
    nickname?: string;
}

interface postForumBody {
    titleText: string;
    mainText: string;
    attachImageNames?: string[];
}

interface deleteForumParams {
    attachImageName?: string
}

const forumRequests = {
    getForumsRequest: (url: string, body: getForumsBody) => instance.post<ForumType>(url, body).then(responseBody),
    getForumRequest: (url: string) => instance.get<ForumType>(url).then(responseBody),
    postForumRequest: (url: string, body: postForumBody) => instance.post<ForumType>(url, body).then(responseBody),
    putForumRequest: (url: string, body: postForumBody) => instance.put<ForumType>(url, body).then(responseBody),
    deleteForumRequest: (url: string, params: deleteForumParams) => instance.delete<ForumType>(url, { params }).then(responseBody),
};

export const Forums = {
    getForums : (body: getForumsBody) : Promise<ForumType[]> => forumRequests.getForumsRequest('/api/forum/get', body),
    getForum : (id: string) : Promise<ForumType> => forumRequests.getForumRequest(`/api/forum/write/get/${id}`),
    getForumView : (id: string) : Promise<ForumType> => forumRequests.getForumRequest(`/api/forum/view/get/${id}`),
    getForumGetViewCount : (id: string) : Promise<ForumType> => forumRequests.getForumRequest(`/api/forum/view/get/${id}`),
    postForum : (body: postForumBody) : Promise<ForumType> => forumRequests.postForumRequest("/api/forum/post", body),
    putForum : (body: postForumBody, id: string) : Promise<ForumType> => forumRequests.putForumRequest(`/api/forum/update/${id}`, body),
    deleteForum : (params: deleteForumParams, id: string) : Promise<ForumType> => forumRequests.deleteForumRequest(`/api/forum/delete/${id}`, params),
}

// Comment axios
interface postCommentsBody {
    _forum: string;
    commentText: string;
}

interface updateCommentBody {
    commentText: string;
}

interface deleteCommentParams {
    _forum: string;
}

const commentRequest = {
    getCommentsRequest: (url: string) => instance.get<CommentType>(url).then(responseBody),
    postCommentRequest: (url: string, body: postCommentsBody) => instance.post<CommentType>(url, body).then(responseBody),
    updateCommentRequest: (url: string, body: updateCommentBody) => instance.patch<CommentType>(url, body).then(responseBody),
    deleteCommentRequest: (url: string, params: deleteCommentParams) => instance.delete<CommentType>(url, { params }).then(responseBody),
};

export const Comments = {
    getComments : (forumId: string) : Promise<CommentType[]> => commentRequest.getCommentsRequest(`/api/comment/get/${forumId}`),
    postComment : (body: postCommentsBody) : Promise<CommentType> => commentRequest.postCommentRequest(`/api/comment/post`, body),
    updateComment : (body: updateCommentBody, commentId: string) : Promise<CommentType> => commentRequest.updateCommentRequest(`/api/comment/update/${commentId}`, body),
    deleteComment : (params: deleteCommentParams, commentId: string) : Promise<CommentType> => commentRequest.deleteCommentRequest(`/api/comment/delete/${commentId}`, params),
}

// Heart axios
interface postHeartBody {
    _forum: string;
    _comment?: string;
}

interface HeartResponse {
    fixHeartCount: number;
    heartFill: boolean;
    msg: string;
}

const heartRequest = {
    postHeartRequest: (url: string, body: postHeartBody) => instance.post<HeartResponse>(url, body).then(responseBody)
}

export const Hearts = {
    postHeart : (body: postHeartBody) : Promise<HeartResponse> => heartRequest.postHeartRequest(`/api/heart/update`, body)
}

// User axios
interface authBody {
    email: string;
    password: string;
}

interface profileResponse {
    userName: string;
    email: string;
    nickname: string;
    profileImageName: string;
    profileImagePath: string;
}

interface signinResponse {
    accessToken: string;
    refreshTokenId: string;
    user: profileResponse;
}

const userRequest = {
    signupRequest: (config: AxiosRequestConfig) => instance.request<AxiosResponse>(config).then(responseBody),
    authRequest: (url: string, body: authBody) => instance.post<signinResponse>(url, body).then(responseBody),
    signoutRequest: (url: string) => instance.delete(url).then(responseBody),
    updateProfileRequest: (config: AxiosRequestConfig) => instance.request<profileResponse>(config).then(responseBody),
}

export const Users = {
    signup : (config: AxiosRequestConfig) : Promise<AxiosResponse> => userRequest.signupRequest(config),
    signin : (body: authBody) : Promise<signinResponse> => userRequest.authRequest('/api/user/signin', body),
    signout : () => userRequest.signoutRequest('/api/user/signout'),
    withdrawal : (body: authBody) => userRequest.authRequest(`/api/user/withdrawal`, body),
    updateProfile : (config: AxiosRequestConfig) : Promise<profileResponse> => userRequest.updateProfileRequest(config),
}
