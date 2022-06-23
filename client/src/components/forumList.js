import { Table, Row, Col, FloatingLabel, Form } from 'react-bootstrap'
import { useEffect, useState } from 'react';
import Title from '../atoms/title'
import Profile from '../atoms/profile'
import EyeCount from '../atoms/eyeCount'
import HeartCount from '../atoms/heartCount'
import Btn from '../atoms/button'
import Warning from '../organisms/warning'
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useSelector } from 'react-redux'
import axios from 'axios'
import Pagination from '../organisms/pagination'
import instance from '../utils/instance';

const Td = styled.td`
    line-height:45px;
    padding-left:10px !important;
`

const ForumList = () => {
    const signin = useSelector(state => state.user.signin);
    const user = useSelector(state => state.user.user);

    const [forums, setForums] = useState([]);
    const [forumId, setForumId] = useState('');
    const [alertShow, setAlertShow] = useState(false);
    const [searchValue, setSearchValue] = useState('');
    const [selectValue, setSelectValue] = useState('latestOrder');
    const [pageOfForums, setPageOfForums] = useState([]);

    const navigate = useNavigate();

    const onChangeSearch = (e) => {
        let newSearchValue = e.target.value;
        setSearchValue(newSearchValue);
    }

    const onChangeSelect = (e) => {
        const newSelectValue = e.target.value;
        setSelectValue(newSelectValue);
        getForums(newSelectValue);
    }
    
    const deleteForum = async () => {
        const targetForum = forums.find(el => el._id === forumId);
        const attachImageName = targetForum.attachImageName;

        const params = {
            attachImageName: attachImageName
        }

        try{            
            const res = await instance.delete(`/api/forum/delete/${forumId}`, { params: params });
            console.log(res.data);
            setAlertShow(false);
            getForums(selectValue);
        } catch(err){
            console.log(err);
        }
    }

    const clickDeleteBtn = (forumId) => {
        setForumId(forumId);
        setAlertShow(true);
    }

    const clickUpdateBtn = (id) => {
        navigate(`/forum/update/${id}`)
    }
    
    const updateForumHeart = async (e, forumId, heartClickUsers) => {  
        e.preventDefault();
        const body = {
            heartClickUsers: heartClickUsers
        }
        try{
            const res = await instance.patch(`/api/forum/heart/update/${forumId}`, body);
            console.log(res.data);
            ( searchValue ? getSearchForums(e) : getForums(selectValue) )
        } catch(err){
            console.log(err);
        }
    }

    const onChangePage = (pageOfForums) => {
        console.log(pageOfForums)
        setPageOfForums(pageOfForums)
    }

    const getSearchForums = async (e) => {
        e.preventDefault();
        const body = {
            searchValue: searchValue
        }
        try{
            const res = await axios.get('/api/forum/search/get', {params: body})
            const data = res.data;
            console.log(data)
            setSelectValue('latestOrder')
            setForums(data);
        } catch(err){
            console.log(err);
        }
    }

    const getForums = async (selectValue) => {
        try{
            const res = await axios.get('/api/forum/get')
            const data = res.data;
            console.log(data)

            if(selectValue === 'latestOrder' || selectValue === undefined){
                setForums(data);
            } else if(selectValue === 'viewOrder'){
                const viewOrder = data.sort((a, b) => b.viewCount - a.viewCount)
                setForums(viewOrder);
            } else if(selectValue === 'heartOrder'){
                const heartOrder = data.sort((a, b) => b.heart.count - a.heart.count)
                setForums(heartOrder);
            } else if(selectValue === 'whatIWrote'){
                const whatIWrote = data.filter(el => el._user.nickname === user.nickname)
                setForums(whatIWrote);
            } else{
                const whatILike = data.filter(el => el.heart.user.includes(user._id))
                setForums(whatILike);
            }
            setSearchValue('')
        } catch(err){
            console.log(err);
        }
    }

    useEffect(() => {
        getForums()
    }, [])
    
    return (
        <div>
            <Title 
                titleText='Forum' 
                primaryBtn={true}
                primaryBtnText='글쓰기'
                clickPrimaryBtn={ () => navigate('/forum/write') }
            />

            {
                alertShow  
                ?   <Warning 
                        onClickBtn={ deleteForum } 
                        onClose={ () => {setAlertShow(false)} }
                        titleText="경고" 
                        mainText="게시물을 지우면 복구할 수 없습니다.&nbsp; 정말로 삭제하겠습니까?"
                        btnText="삭제하기"
                        variant="danger"
                        btnVariant="outline-danger"
                    />
                : null
            }

            {/* 서치박스 & 셀렉박스 */}
            <Row className="g-2" style={{ marginBottom:50 }}>
                <Col md>
                    <Form onSubmit={ getSearchForums }>
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
                    </Form>
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
                            { signin
                                ?   <>
                                        <option value="whatIWrote">내가 쓴 글</option>
                                        <option value="whatILike">내가 좋아한 글</option>
                                    </>
                                : null
                            }
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
                                                src={forum._user.profileImagePath} 
                                                nickname={forum._user.nickname} 
                                                nicknameColor="#000" 
                                            />
                                        </Td>
                                        <Td onClick={() => {navigate(`/forum/view/${forum._id}`)}} style={{cursor:'pointer'}}>
                                            { forum.titleText.slice(0, 40) }
                                        </Td>
                                        <Td>{ forum.createdAt.slice(0,10) }</Td>
                                        <Td>
                                            <EyeCount count={forum.viewCount} />
                                        </Td>
                                        <Td>
                                            <HeartCount 
                                                src={ false }
                                                count={forum.heart.count} 
                                                fill={(forum.heart.user.includes(user._id) ? true : false)} 
                                                onClick={ (e) => {updateForumHeart(e, forum._id, forum.heart.user)} } 
                                            />
                                        </Td>
                                        <Td>
                                            <Btn 
                                                onClick={ () => {clickUpdateBtn(forum._id)}} 
                                                value="수정"
                                                variant="secondary"
                                                size="sm"
                                                disabled={ forum._user.nickname === user.nickname ? false : true }
                                            />
                                        </Td>
                                        <Td>
                                            <Btn 
                                                onClick={ () => {clickDeleteBtn(forum._id)} } 
                                                value="삭제"
                                                variant="danger"
                                                size="sm"
                                                disabled={ forum._user.nickname === user.nickname ? false : true }
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
            <Pagination 
                items={forums}
                onChangePage={ pageOfForums => onChangePage(pageOfForums) } 
            />
        </div>
    )
}

export default ForumList;