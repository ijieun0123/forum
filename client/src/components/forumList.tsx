import { Table, Row, Col, FloatingLabel, Form } from 'react-bootstrap'
import { useEffect, useState } from 'react';
import Title from '../atoms/title.tsx'
import Profile from '../atoms/profile.tsx'
import EyeCount from '../atoms/eyeCount.tsx'
import HeartCount from '../atoms/heartCount.tsx'
import Btn from '../atoms/button.tsx'
import Warning from '../organisms/warning.tsx'
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import { ReducerType } from '../app/store.ts';
import { User } from '../features/userSlice.ts'
import instance from '../utils/instance';
import Paging from '../organisms/pagination.tsx';
import { Forums, Hearts } from '../utils/axios.ts';
import { 
    ForumType, 
    onChangeText, 
    InputEventType, 
    SelectEventType, 
    BtnMouseEventType,
    Types
} from '../utils/types.ts';
import { FORUM_POST, FORUM_DELETE } from '../features/forumSlice.ts'
import { Forum } from '../features/forumSlice'

const Td = styled.td`
    line-height:45px;
    padding-left:10px !important;
`

const ForumList = () => {
    const signin = useSelector<ReducerType, User['signin']>(state => state.user.signin);
    const user = useSelector<ReducerType, User['user']>(state => state.user.user);
    const forum = useSelector<ReducerType, Forum['forum']>(state => state.forum.forum);

    const [forums, setForums] = useState<ForumType[]>([]);
    const [forumId, setForumId] = useState('');
    const [alertShow, setAlertShow] = useState(false);
    const [searchValue, setSearchValue] = useState('');
    const [selectValue, setSelectValue] = useState('latestOrder');

    const [totalItemsCount, setTotalItemsCount] = useState(0); 
    const [activePage, setActivePage] = useState(1); 
    const [itemsCountPerPage] = useState(5); //페이지당 아이템 개수

    const [indexOfLastPost, setIndexOfLastPost] = useState(0);
    const [indexOfFirstPost, setIndexOfFirstPost] = useState(0);
    const [pageOfForums, setPageOfForums] = useState<ForumType[]>([]);

    const onChangePage = (pageNumber: number) => {
        setActivePage(pageNumber);
    };

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const onChangeSearch = (e: InputEventType) => onChangeText(e, setSearchValue);
    const onChangeSelect = (e: SelectEventType) => onChangeText(e, setSelectValue);
    

    const deleteForum = async () => {
        const targetForum = forums.find(forum => forum.forumId === forumId);
        let attachImageNames = [];

        if(targetForum) attachImageNames = targetForum.attachImageNames;

        const params = {
            attachImageNames: attachImageNames
        }

        Forums.deleteForum(params, forumId)
        .then(() => {
            const newForums = forums.filter(forum => forum.forumId !== forumId);
            dispatch(FORUM_DELETE({ forumId: forumId }))
            setAlertShow(false);
            setForums(newForums)
        })
        .catch((err) => {
            console.log(err);
        })
    }

    const clickDeleteBtn = (forumId: Types['forumId']) => {
        setForumId(forumId);
        setAlertShow(true);
    }

    const clickUpdateBtn = (forumId: Types['forumId']) => {
        navigate(`/forum/update/${forumId}`)
    }
    
    const updateHeart = async (e: BtnMouseEventType, forumId: Types['forumId']) => {  
        e.preventDefault();

        const body = {
            _forum: forumId,
        }

        Hearts.postHeart(body)
        .then((data) => {
            let newForums = [...forums];
            const findIndex = forums.findIndex(el => el.forumId == forumId);
            const newHeartCount = forums[findIndex].heartCount + data.fixHeartCount;
            const newHeartFill = data.heartFill;

            if(findIndex !== -1) {
                newForums[findIndex] = {
                    ...newForums[findIndex], 
                    heartCount: newHeartCount, 
                    heartFill: newHeartFill
                };
                
                if(selectValue === 'whatILike'){
                    newForums = newForums.filter(forum => forum.heartFill === true);
                } else if(selectValue === 'heartOrder') {
                    newForums = newForums.sort((a, b) => b.heartCount - a.heartCount)
                } 
    
                setForums(newForums)
            }
        })
        .catch((err) => {
            console.log(err);
        })
    }

    const getForums = () => {
        const body = {
            selectValue: selectValue,
            searchValue: searchValue,
            nickname: user.nickname
        }

        Forums.getForums(body)
        .then((data) => {
            console.log(data)
            setForums(data)
            dispatch(FORUM_POST(data))
            setActivePage(1);
        })
        .catch((err) => {
            console.log(err);
        })
    }

    useEffect(() => {
        getForums()
    }, [selectValue, searchValue])

    useEffect(() => {
        setTotalItemsCount(forums.length);
        setIndexOfLastPost(activePage * itemsCountPerPage);
        setIndexOfFirstPost(indexOfLastPost - itemsCountPerPage);
        setPageOfForums(forums.slice(indexOfFirstPost, indexOfLastPost));
    }, [activePage, indexOfFirstPost, indexOfLastPost, forums, itemsCountPerPage]);
    
    return (
        <div>
            <Title 
                titleText='Forum' 
                primaryBtn={true}
                primaryBtnText='Write'
                clickPrimaryBtn={ () => navigate('/forum/write') }
            />

            {
                alertShow  
                ?   <Warning 
                        onClickBtn={ deleteForum } 
                        onClose={ () => {setAlertShow(false)} }
                        alertTitleText="Alert" 
                        mainText="게시물을 지우면 복구할 수 없습니다.&nbsp; 정말로 삭제하겠습니까?"
                        btnText="Delete"
                        alertVariant="danger"
                        btnVariant="outline-danger"
                    />
                : null
            }

            {/* 서치박스 & 셀렉박스 */}
            <Row className="g-2" style={{ marginBottom:50 }}>
                <Col md>
                    <FloatingLabel 
                        controlId="floatingInputGrid" 
                        label="Search" 
                    >
                        <Form.Control 
                            type="text" 
                            placeholder="검색하세요" 
                            value={ searchValue }
                            onChange={ onChangeSearch }
                        />
                    </FloatingLabel>
                </Col>
                <Col md>
                    <FloatingLabel controlId="floatingSelectGrid" label="Select">
                        <Form.Select 
                            aria-label="Select" 
                            onChange={ onChangeSelect } 
                            value={ selectValue }
                        >
                            <option value="latestOrder">최신순</option>
                            <option value="viewOrder">조회순</option>
                            <option value="heartOrder">인기순</option>
                            <option value="whatIWrote" disabled={!signin}>내가 쓴 글</option>
                            <option value="whatILike" disabled={!signin}>내가 좋아한 글</option>
                        </Form.Select>
                    </FloatingLabel>
                </Col>
            </Row>
            
            { /* forumList */
                forums.length !== 0
                ?
                <Table hover>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>작성자</th>
                            <th>제목</th>
                            <th>날짜</th>
                            <th>조회수</th>
                            <th>하트</th>
                            <th>수정</th>
                            <th>삭제</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            pageOfForums.map((forum, i) => {
                                return (
                                    <tr key={i}>
                                        <Td>{1+i}</Td>
                                        <Td>
                                            <Profile 
                                                profileImagePath={forum.profileImagePath} 
                                                nickname={forum.nickname} 
                                                nicknameColor="#000" 
                                            />
                                        </Td>
                                        <Td onClick={() => {navigate(`/forum/view/${forum.forumId}`)}} style={{cursor:'pointer'}}>
                                            { forum.titleText.slice(0, 40) }
                                        </Td>
                                        <Td>{ forum.createdAt.slice(0,10) }</Td>
                                        <Td>
                                            <EyeCount viewCount={forum.viewCount} />
                                        </Td>
                                        <Td>
                                            <HeartCount 
                                                heartCount={forum.heartCount} 
                                                heartFill={forum.heartFill} 
                                                onClick={ (e) => {updateHeart(e, forum.forumId)} } 
                                            />
                                        </Td>
                                        <Td>
                                            <Btn 
                                                onClick={ () => {clickUpdateBtn(forum.forumId)}} 
                                                btnText="Update"
                                                btnVariant="secondary"
                                                size="sm"
                                                margin="none"
                                                disabled={ forum.nickname === user.nickname ? false : true }
                                            />
                                        </Td>
                                        <Td>
                                            <Btn 
                                                onClick={ () => {clickDeleteBtn(forum.forumId)} } 
                                                btnText="Delete"
                                                btnVariant="danger"
                                                size="sm"
                                                margin="none"
                                                disabled={ forum.nickname === user.nickname ? false : true }
                                            />
                                        </Td>
                                    </tr>
                                )
                            })
                        }
                    </tbody>
                </Table>
                :
                <p>게시물이 없습니다.</p>
            }

            {/* 페이지네이션 */}
            <Paging
                activePage={activePage}
                itemsCountPerPage={itemsCountPerPage}
                totalItemsCount={totalItemsCount}
                onChangePage={onChangePage}
            />
        </div>
    )
}

export default ForumList;