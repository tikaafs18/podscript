import React from "react";
import {
    Text, Avatar, Wrap, WrapItem, Icon, Button, Input,
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    MenuDivider,
    useToast, Modal, ModalOverlay,
    ModalContent, ModalHeader, ModalFooter,
    ModalBody, ModalCloseButton, FormControl,
    Image, FormLabel, Divider,
    AlertDialog,
    AlertDialogBody,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogContent,
    AlertDialogOverlay,
    useDisclosure, Textarea
} from '@chakra-ui/react'
import { AiOutlineHeart, AiOutlineSmile, AiFillHeart, AiOutlineLogout } from "react-icons/ai";
import { FiMoreHorizontal } from "react-icons/fi";
import { FaRegComment } from "react-icons/fa";
import { IoPaperPlaneOutline } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { API_URL } from "../helper";
import Axios from "axios";
import { useParams } from "react-router-dom";
import { loginAction } from "../Actions/userAction";
import { newpostAction } from "../Actions/userAction";

const PostPage = (props) => {

    const [data, setData] = React.useState([]);
    const [allComment, setAllComment] = React.useState([]);
    const [queryend, setQueryend] = React.useState(5);
    const [totalLike, setTotalLike] = React.useState(0);
    const [addComment, setAddComment] = React.useState('');
    const [editCaption, setEditCaption] = React.useState(false);
    const [newCaption, setNewCaption] = React.useState('');
    const [melike, setMelike] = React.useState([]);
    
    const count = (addComment) => {
        return addComment.length
    }
    
    const global = useSelector((state) => {
        return {
            idusers: state.userReducer.idusers
        }
    })
    
    const params = useParams();

    const getData = () => {
        Axios.patch(API_URL + `/post/pagedetail/users?idpost=${params.idpost}`)
            .then((res) => {
                setData(res.data[0]);
            })
            .catch((error) => {
                console.log(error);
            })
    }

    React.useEffect(() => {
        getData()
    }, [])

    const getComment = () => {
        Axios.patch(API_URL + `/post/tesgetcomment/users?idpost=${params.idpost}`,
            {
                queryend
            })
            .then((res) => {
                setAllComment(res.data)
            })
            .catch((error) => {
                console.log(error);
            })
    }

    React.useEffect(() => {
        getComment();
    }, [])

    const printComment = () => {
        getComment();
        return allComment.map((val, idx) => {
            return <div key={val.idcomment} className={val.comment.length <= 44 ? "d-flex align-items-center mt-4" : "d-flex mt-4"}>
                <Avatar size='sm' name='Ryan' src={API_URL + val.profilepic} />
                <div>
                    <Text fontSize='sm' className="ms-3"><span className="fw-bold">{val.username}</span> {val.comment}</Text>
                    <Text fontSize='xs' className="ms-3 text-muted">{val.datecomment}</Text>
                </div>
            </div>
        })
    }

    const handleComment = (idx) => {
        let today = new Date().toJSON();
        if (addComment.length <= 300) {
            Axios.post(API_URL + '/post/comment', {
                idusers: global.idusers,
                idpost: idx,
                comment: addComment,
                datecomment: today
            })
                .then((res) => {
                    // console.log(res.data);
                    setAllComment(res.data);
                    console.log(document.getElementById("comment").value)

                    // getComment();
                    document.getElementById("comment").value = null;
                    likedByme();
                    getTotalLike();
                })
                .catch((error) => {
                    console.log(' handlecomment error')

                    console.log(error)
                })
        } else {
            alert('Comment must be below 300 characters');
        }
    }

    const getTotalLike = () => {
        Axios.patch(API_URL + `/post/gettotallike/users?idpost=${params.idpost}`)
            .then((res) => {
                if (res.data[0]) {
                    setTotalLike(res.data[0].total_like)
                } else {
                    setTotalLike(0)
                }
            })
            .catch((error) => {
                console.log(error);
            })
    }

    React.useEffect(() => {
        getTotalLike();
    }, [])

    const onLike = (idpost) => {
        Axios.post(API_URL + '/post/like',
            {
                idusers_likers: global.idusers,
                idpost
            })
            .then((res) => {
                console.log(res.data);
                if (res.data.success == 'true') {
                    likedByme();
                    getTotalLike();
                } else {
                    console.log('Ini res.data.success false', res.data)
                    likedByme();
                    getTotalLike();
                }
            })
            .catch((error) => {
                console.log('onLike error', error);
            })
    }

    const likedByme = () => {
        Axios.patch(API_URL + `/post/likedbyme/users?idusers=${global.idusers}`)
            .then((res) => {
                setMelike(res.data);
                getTotalLike();
            })
            .catch((error) => {
                console.log(error);
                getTotalLike();
            })
    }

    React.useEffect(() => {
        likedByme()
    }, []);

    const handleEdit = (idx) => {
        Axios.patch(API_URL + '/post/editcaption',
            {
                idpost: idx,
                caption: newCaption
            })
            .then((res) => {
                getData();
            })
            .catch((error) => {
                console.log(error)
            });
    }

    return <div style={{ color: '#151033' }}>
        <div className="container">
            <div className="card my-3 my-lg-5">
                <div className="p-1 p-lg-4">
                    <div className="card-body row">
                        <div className="col-12 col-lg-7">
                            <img src={data.image ? API_URL + data.image : 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAAAMFBMVEXFxcX////CwsLGxsb7+/vT09PJycn19fXq6urb29ve3t7w8PDOzs7n5+f5+fnt7e30nlkBAAAFHUlEQVR4nO2dC5qqMAyFMTwUBdz/bq+VYYrKKJCkOfXmXwHna5uTpA+KwnEcx3Ecx3Ecx3Ecx3Ecx3Ecx3Ecx3Ecx3EcA2iO9cdIc5PUdO257y+BU39u66b4HplE3fk6VIcnqmNfl1+gksr6+iIucjl3WYukor7+re6Hoe1y1UhNO3zUd+fUFRmKpOa0Tt6dY5ubRCrOG/QFLk1WGmnt/JxzykcjdZ/jyxJDLlOV2l36AtcsJJb9boG3YcR3DuqODIE3ztYKPkDdmwRmpUToUaSaq++AvRgZMWbOpbQW8hdCAm8ZDugoikzREdCJ2okJPBx6azFLNOwoOgcxojJ98JkaTSJxMpklKrCAKhZGI0drTY/wU5lXoJYibannV9NYy4oozNEAkPHTjop+DTDxVGkIgYJNoyQQJtiIW+EMjGAjm649AjGIaqswcEFQKJ2QPlJbqytki6ZXAAZRJ52J2McaUowzAfs+uFzrYhnzaapphiPWdaJWShqxjqa6kTTQ205TVbsfMa6htL0iYOsXpJrQjHSmCkv1QGPtiHqlYcQ21Gj7fcDU8xOEUuNgSltPzexh+HqFlanCBHZ4OLhCV+gK/3OF6vWvucLv98MUOY2pwu/PS/+D2qJU7pYGbOvDFDW+bbON9p3o3oRxn0bfLgZTgSn6pSfrtr56qLHemtHPTK2319SzGvtjQ9qeb39WgS66Cm073nd0U1PzDdJCO3Gzn6TKpl9Zq7ujGWsQhlA3NwWIMwG9zM08Y/tBrR9VWeczv5CSQuuUNKIUTk23ZJ5RKfVhjnkXotfWIlgX2BSCDYbZR+QTcLhb3dKZDUY2M0d4KWItwhHRah/zsrOgKw4wycwjcgEVcgQDQo23CqSiWEJkFAfod2oE1uIFdA1OsCPqFXYNTjCfb8Ez+iX2x5sKLlVbhtqdDcar9ZevhnbZxoBUD35k23t0d304LYs1ELVbnfFaZ/REJJX9niP8Q19moZGo3m8XR/yBvOnjFfsXcI2c8ZuNo7WMP5HQh6yRGrlmFOJTnyTcT+zRlqPUBI2gTVWNUzUna1ERgecgF4GpNBQ38jGqxVLzQA1A31Rrhk6Yz9QEh/WND0GnuG9huhiTXJkxfAizTHLr6cbJKN6UCU6x/2DTRE1xEeEXi3O0ZUqBN4nJRzHhFB1JPlFTBZlI2kQ8zc3KJ1Le8DIRmFJiknuVS6RK4Ej/JtBfJErDSzOBiY4wJHX6Z1I4v1GUmdCPNirnLLeg3oJLcbX5PcpHNbRvOa1A956QmRPOUXVF+zkaUJynpkYR0bOMJH2nNej1pqyV/aKkz9jr5yj5vrXXz1F5SQLACiMapmierj2ikLyleKdlA/I/2oFxiglxx9B+mHwz0lf34IZQfhDRhlD6bhvgEAoPYooHkTczSIZTLC+cEExsoNKZiGBiY9cCfo/Y/SjIOBMQizWWTe73CMUasJx7jlD+DdKdWUKoY4PRYFtGpO0G1Lx4RaadgTtJhf4fiGqGIwKWCGuGIwKWqP+7IxYCzygjR9IAO5pC7Da9g70TBVpWRNgFBlgT8RV2WxHbKwJMv4BOaEaYaU2K16yZMN/qgV+G7IWIvwyZCxHeDQMsR8wg0DBDDXB5H2EV+hkEGmaoySHQsEJNFoGGFWrAq98JRhUMX1iMMMqLLEIpK5jCbd4vw9nSt/72lewXiN6jmdjfq8Hdknlk92ZwJnbIMMRM7JBhiFlUFoHd1UWaP1QKsPsHA5mkNB+Smn9JqV3wskatnQAAAABJRU5ErkJggg=='} width="100%" alt="imgHome" />
                        </div>
                        <div className="col-12 col-lg-5 d-flex ps-4 mt-3 mt-lg-0 flex-column aligm-items-start ">
                            <div>
                                <div className="d-flex align-items-center justify-content-between">
                                    <div className="d-flex align-items-center">
                                        <Avatar size='sm' name='Prosper Otemuyiwa' src={data.profilepic ? API_URL + data.profilepic : 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAAAMFBMVEXFxcX////CwsLGxsb7+/vT09PJycn19fXq6urb29ve3t7w8PDOzs7n5+f5+fnt7e30nlkBAAAFHUlEQVR4nO2dC5qqMAyFMTwUBdz/bq+VYYrKKJCkOfXmXwHna5uTpA+KwnEcx3Ecx3Ecx3Ecx3Ecx3Ecx3Ecx3Ecx3EcA2iO9cdIc5PUdO257y+BU39u66b4HplE3fk6VIcnqmNfl1+gksr6+iIucjl3WYukor7+re6Hoe1y1UhNO3zUd+fUFRmKpOa0Tt6dY5ubRCrOG/QFLk1WGmnt/JxzykcjdZ/jyxJDLlOV2l36AtcsJJb9boG3YcR3DuqODIE3ztYKPkDdmwRmpUToUaSaq++AvRgZMWbOpbQW8hdCAm8ZDugoikzREdCJ2okJPBx6azFLNOwoOgcxojJ98JkaTSJxMpklKrCAKhZGI0drTY/wU5lXoJYibannV9NYy4oozNEAkPHTjop+DTDxVGkIgYJNoyQQJtiIW+EMjGAjm649AjGIaqswcEFQKJ2QPlJbqytki6ZXAAZRJ52J2McaUowzAfs+uFzrYhnzaapphiPWdaJWShqxjqa6kTTQ205TVbsfMa6htL0iYOsXpJrQjHSmCkv1QGPtiHqlYcQ21Gj7fcDU8xOEUuNgSltPzexh+HqFlanCBHZ4OLhCV+gK/3OF6vWvucLv98MUOY2pwu/PS/+D2qJU7pYGbOvDFDW+bbON9p3o3oRxn0bfLgZTgSn6pSfrtr56qLHemtHPTK2319SzGvtjQ9qeb39WgS66Cm073nd0U1PzDdJCO3Gzn6TKpl9Zq7ujGWsQhlA3NwWIMwG9zM08Y/tBrR9VWeczv5CSQuuUNKIUTk23ZJ5RKfVhjnkXotfWIlgX2BSCDYbZR+QTcLhb3dKZDUY2M0d4KWItwhHRah/zsrOgKw4wycwjcgEVcgQDQo23CqSiWEJkFAfod2oE1uIFdA1OsCPqFXYNTjCfb8Ez+iX2x5sKLlVbhtqdDcar9ZevhnbZxoBUD35k23t0d304LYs1ELVbnfFaZ/REJJX9niP8Q19moZGo3m8XR/yBvOnjFfsXcI2c8ZuNo7WMP5HQh6yRGrlmFOJTnyTcT+zRlqPUBI2gTVWNUzUna1ERgecgF4GpNBQ38jGqxVLzQA1A31Rrhk6Yz9QEh/WND0GnuG9huhiTXJkxfAizTHLr6cbJKN6UCU6x/2DTRE1xEeEXi3O0ZUqBN4nJRzHhFB1JPlFTBZlI2kQ8zc3KJ1Le8DIRmFJiknuVS6RK4Ej/JtBfJErDSzOBiY4wJHX6Z1I4v1GUmdCPNirnLLeg3oJLcbX5PcpHNbRvOa1A956QmRPOUXVF+zkaUJynpkYR0bOMJH2nNej1pqyV/aKkz9jr5yj5vrXXz1F5SQLACiMapmierj2ikLyleKdlA/I/2oFxiglxx9B+mHwz0lf34IZQfhDRhlD6bhvgEAoPYooHkTczSIZTLC+cEExsoNKZiGBiY9cCfo/Y/SjIOBMQizWWTe73CMUasJx7jlD+DdKdWUKoY4PRYFtGpO0G1Lx4RaadgTtJhf4fiGqGIwKWCGuGIwKWqP+7IxYCzygjR9IAO5pC7Da9g70TBVpWRNgFBlgT8RV2WxHbKwJMv4BOaEaYaU2K16yZMN/qgV+G7IWIvwyZCxHeDQMsR8wg0DBDDXB5H2EV+hkEGmaoySHQsEJNFoGGFWrAq98JRhUMX1iMMMqLLEIpK5jCbd4vw9nSt/72lewXiN6jmdjfq8Hdknlk92ZwJnbIMMRM7JBhiFlUFoHd1UWaP1QKsPsHA5mkNB+Smn9JqV3wskatnQAAAABJRU5ErkJggg=='} />
                                        <Text fontSize='sm' className="ms-3 fw-bold">{data.username}</Text>
                                    </div>
                                    <Menu>
                                        <MenuButton>
                                            <Icon as={FiMoreHorizontal} w={7} h={7} className="ms-4" />
                                        </MenuButton>
                                        <MenuList textColor='black'>
                                            {
                                                global.idusers == data.idusers ?
                                                    <div>
                                                        <MenuItem onClick={() => setEditCaption(!editCaption)}>Edit</MenuItem>
                                                        <MenuItem >Delete</MenuItem>
                                                        <MenuItem >Share</MenuItem>
                                                    </div>
                                                    :
                                                    <MenuItem >Share</MenuItem>
                                            }
                                        </MenuList>
                                    </Menu>

                                </div>
                                <div className="border-bottom mt-3"></div>
                                {
                                    data.caption ?
                                        <div className="d-flex align-items-center mt-3">
                                            <Avatar size='sm' name='Prosper Otemuyiwa' src={data.profilepic ? API_URL + data.profilepic : 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAAAMFBMVEXFxcX////CwsLGxsb7+/vT09PJycn19fXq6urb29ve3t7w8PDOzs7n5+f5+fnt7e30nlkBAAAFHUlEQVR4nO2dC5qqMAyFMTwUBdz/bq+VYYrKKJCkOfXmXwHna5uTpA+KwnEcx3Ecx3Ecx3Ecx3Ecx3Ecx3Ecx3Ecx3EcA2iO9cdIc5PUdO257y+BU39u66b4HplE3fk6VIcnqmNfl1+gksr6+iIucjl3WYukor7+re6Hoe1y1UhNO3zUd+fUFRmKpOa0Tt6dY5ubRCrOG/QFLk1WGmnt/JxzykcjdZ/jyxJDLlOV2l36AtcsJJb9boG3YcR3DuqODIE3ztYKPkDdmwRmpUToUaSaq++AvRgZMWbOpbQW8hdCAm8ZDugoikzREdCJ2okJPBx6azFLNOwoOgcxojJ98JkaTSJxMpklKrCAKhZGI0drTY/wU5lXoJYibannV9NYy4oozNEAkPHTjop+DTDxVGkIgYJNoyQQJtiIW+EMjGAjm649AjGIaqswcEFQKJ2QPlJbqytki6ZXAAZRJ52J2McaUowzAfs+uFzrYhnzaapphiPWdaJWShqxjqa6kTTQ205TVbsfMa6htL0iYOsXpJrQjHSmCkv1QGPtiHqlYcQ21Gj7fcDU8xOEUuNgSltPzexh+HqFlanCBHZ4OLhCV+gK/3OF6vWvucLv98MUOY2pwu/PS/+D2qJU7pYGbOvDFDW+bbON9p3o3oRxn0bfLgZTgSn6pSfrtr56qLHemtHPTK2319SzGvtjQ9qeb39WgS66Cm073nd0U1PzDdJCO3Gzn6TKpl9Zq7ujGWsQhlA3NwWIMwG9zM08Y/tBrR9VWeczv5CSQuuUNKIUTk23ZJ5RKfVhjnkXotfWIlgX2BSCDYbZR+QTcLhb3dKZDUY2M0d4KWItwhHRah/zsrOgKw4wycwjcgEVcgQDQo23CqSiWEJkFAfod2oE1uIFdA1OsCPqFXYNTjCfb8Ez+iX2x5sKLlVbhtqdDcar9ZevhnbZxoBUD35k23t0d304LYs1ELVbnfFaZ/REJJX9niP8Q19moZGo3m8XR/yBvOnjFfsXcI2c8ZuNo7WMP5HQh6yRGrlmFOJTnyTcT+zRlqPUBI2gTVWNUzUna1ERgecgF4GpNBQ38jGqxVLzQA1A31Rrhk6Yz9QEh/WND0GnuG9huhiTXJkxfAizTHLr6cbJKN6UCU6x/2DTRE1xEeEXi3O0ZUqBN4nJRzHhFB1JPlFTBZlI2kQ8zc3KJ1Le8DIRmFJiknuVS6RK4Ej/JtBfJErDSzOBiY4wJHX6Z1I4v1GUmdCPNirnLLeg3oJLcbX5PcpHNbRvOa1A956QmRPOUXVF+zkaUJynpkYR0bOMJH2nNej1pqyV/aKkz9jr5yj5vrXXz1F5SQLACiMapmierj2ikLyleKdlA/I/2oFxiglxx9B+mHwz0lf34IZQfhDRhlD6bhvgEAoPYooHkTczSIZTLC+cEExsoNKZiGBiY9cCfo/Y/SjIOBMQizWWTe73CMUasJx7jlD+DdKdWUKoY4PRYFtGpO0G1Lx4RaadgTtJhf4fiGqGIwKWCGuGIwKWqP+7IxYCzygjR9IAO5pC7Da9g70TBVpWRNgFBlgT8RV2WxHbKwJMv4BOaEaYaU2K16yZMN/qgV+G7IWIvwyZCxHeDQMsR8wg0DBDDXB5H2EV+hkEGmaoySHQsEJNFoGGFWrAq98JRhUMX1iMMMqLLEIpK5jCbd4vw9nSt/72lewXiN6jmdjfq8Hdknlk92ZwJnbIMMRM7JBhiFlUFoHd1UWaP1QKsPsHA5mkNB+Smn9JqV3wskatnQAAAABJRU5ErkJggg=='} />
                                            <Text fontSize='sm' className="ms-3"><span className="fw-bold" >{data.username}</span> {data.caption}</Text>
                                        </div>
                                        : null
                                }
                                {printComment()}
                                <Text fontSize='sm' className="mt-4 text-muted fw-bold" onClick={() => setQueryend(queryend + 5)}> {allComment.toString() ? "See more comments" : "No Comment Yet"} </Text>
                            </div>
                            <div className="mt-auto" >
                                <div className="border-bottom my-3"></div>
                                <div className="d-flex align-items-center">
                                    {
                                        melike.findIndex(v => v.idpost == params.idpost) != -1 ?
                                            <Icon as={AiFillHeart} w={6} h={6} color="#D53F8C" onClick={() => onLike(data.idpost)} />
                                            :
                                            <Icon as={AiOutlineHeart} w={6} h={6} onClick={() => onLike(data.idpost)} />
                                    }
                                    <Icon as={FaRegComment} w={5} h={5} className="ms-2" />
                                    <Icon as={IoPaperPlaneOutline} w={5} h={5} className="ms-2" />
                                </div>
                                <Text fontSize='sm' className="mt-2">Liked by <span className="fw-bold">{totalLike ? totalLike : 0} others</span></Text>
                                <Text fontSize='sm' className="mt-2 text-muted">{data.datecreated}</Text>
                                <div className="d-flex align-items-center mt-3">
                                    <Icon as={AiOutlineSmile} w={6} h={6} />
                                    <Input id='comment' color={count(addComment) > 300 ? 'red' : 'black'} size='sm' variant='unstyled' placeholder='Add a comment...' type='text' className="ms-2 ps-2" onChange={(e) => setAddComment(e.target.value)} />
                                    <Text fontSize='sm' className="text-muted me-2">{count(addComment)}/300</Text>
                                    <Button size='sm' style={{ color: '#D53F8C' }} className="fw-bold" variant='link' disabled={count(addComment) > 300 ? true : false}
                                        onClick={() => handleComment(params.idpost)}>Post</Button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="card-body row d-none">
                        <div className="card mb-4 mb-lg-5">
                            <div className="px-2 px-lg-4 pb-3">
                                <div className="card-title px-4 pt-4 d-flex justify-content-between">
                                    <Wrap>
                                        <WrapItem>
                                            <Avatar size='sm' name='Kent Dodds' src={data.profilepic == null || '' ? 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAAAMFBMVEXFxcX////CwsLGxsb7+/vT09PJycn19fXq6urb29ve3t7w8PDOzs7n5+f5+fnt7e30nlkBAAAFHUlEQVR4nO2dC5qqMAyFMTwUBdz/bq+VYYrKKJCkOfXmXwHna5uTpA+KwnEcx3Ecx3Ecx3Ecx3Ecx3Ecx3Ecx3Ecx3EcA2iO9cdIc5PUdO257y+BU39u66b4HplE3fk6VIcnqmNfl1+gksr6+iIucjl3WYukor7+re6Hoe1y1UhNO3zUd+fUFRmKpOa0Tt6dY5ubRCrOG/QFLk1WGmnt/JxzykcjdZ/jyxJDLlOV2l36AtcsJJb9boG3YcR3DuqODIE3ztYKPkDdmwRmpUToUaSaq++AvRgZMWbOpbQW8hdCAm8ZDugoikzREdCJ2okJPBx6azFLNOwoOgcxojJ98JkaTSJxMpklKrCAKhZGI0drTY/wU5lXoJYibannV9NYy4oozNEAkPHTjop+DTDxVGkIgYJNoyQQJtiIW+EMjGAjm649AjGIaqswcEFQKJ2QPlJbqytki6ZXAAZRJ52J2McaUowzAfs+uFzrYhnzaapphiPWdaJWShqxjqa6kTTQ205TVbsfMa6htL0iYOsXpJrQjHSmCkv1QGPtiHqlYcQ21Gj7fcDU8xOEUuNgSltPzexh+HqFlanCBHZ4OLhCV+gK/3OF6vWvucLv98MUOY2pwu/PS/+D2qJU7pYGbOvDFDW+bbON9p3o3oRxn0bfLgZTgSn6pSfrtr56qLHemtHPTK2319SzGvtjQ9qeb39WgS66Cm073nd0U1PzDdJCO3Gzn6TKpl9Zq7ujGWsQhlA3NwWIMwG9zM08Y/tBrR9VWeczv5CSQuuUNKIUTk23ZJ5RKfVhjnkXotfWIlgX2BSCDYbZR+QTcLhb3dKZDUY2M0d4KWItwhHRah/zsrOgKw4wycwjcgEVcgQDQo23CqSiWEJkFAfod2oE1uIFdA1OsCPqFXYNTjCfb8Ez+iX2x5sKLlVbhtqdDcar9ZevhnbZxoBUD35k23t0d304LYs1ELVbnfFaZ/REJJX9niP8Q19moZGo3m8XR/yBvOnjFfsXcI2c8ZuNo7WMP5HQh6yRGrlmFOJTnyTcT+zRlqPUBI2gTVWNUzUna1ERgecgF4GpNBQ38jGqxVLzQA1A31Rrhk6Yz9QEh/WND0GnuG9huhiTXJkxfAizTHLr6cbJKN6UCU6x/2DTRE1xEeEXi3O0ZUqBN4nJRzHhFB1JPlFTBZlI2kQ8zc3KJ1Le8DIRmFJiknuVS6RK4Ej/JtBfJErDSzOBiY4wJHX6Z1I4v1GUmdCPNirnLLeg3oJLcbX5PcpHNbRvOa1A956QmRPOUXVF+zkaUJynpkYR0bOMJH2nNej1pqyV/aKkz9jr5yj5vrXXz1F5SQLACiMapmierj2ikLyleKdlA/I/2oFxiglxx9B+mHwz0lf34IZQfhDRhlD6bhvgEAoPYooHkTczSIZTLC+cEExsoNKZiGBiY9cCfo/Y/SjIOBMQizWWTe73CMUasJx7jlD+DdKdWUKoY4PRYFtGpO0G1Lx4RaadgTtJhf4fiGqGIwKWCGuGIwKWqP+7IxYCzygjR9IAO5pC7Da9g70TBVpWRNgFBlgT8RV2WxHbKwJMv4BOaEaYaU2K16yZMN/qgV+G7IWIvwyZCxHeDQMsR8wg0DBDDXB5H2EV+hkEGmaoySHQsEJNFoGGFWrAq98JRhUMX1iMMMqLLEIpK5jCbd4vw9nSt/72lewXiN6jmdjfq8Hdknlk92ZwJnbIMMRM7JBhiFlUFoHd1UWaP1QKsPsHA5mkNB+Smn9JqV3wskatnQAAAABJRU5ErkJggg==' : API_URL + data.profilepic} />
                                            <Text fontSize='xl' className="ms-3 fw-bold">{data.username}</Text>
                                        </WrapItem>
                                    </Wrap>
                                    <Menu>
                                        <MenuButton>
                                            <Icon as={FiMoreHorizontal} w={7} h={7} className="ms-4" />
                                        </MenuButton>

                                        <MenuList textColor='black'>
                                            {
                                                global.idusers == data.idusers ?
                                                    <div>
                                                        <MenuItem>Edit</MenuItem>
                                                        <MenuItem >Delete</MenuItem>
                                                        <MenuItem >Share</MenuItem>
                                                    </div>
                                                    :
                                                    <MenuItem >Share</MenuItem>
                                            }
                                        </MenuList>
                                    </Menu>
                                </div>
                                <div className="card-body">
                                    {
                                        data?.image?.includes('http') ?
                                            <img src={data.image} width="100%" alt="imgHome" />
                                            : <img src={API_URL + data.image} width="100%" alt="imgHome" />
                                    }
                                    <div className="d-flex align-items-center justify-content-between">
                                        <div className="d-flex mt-3 align-items-center">
                                            {
                                                melike.findIndex(v => v.idpost == data.idpost) != -1 ?
                                                    <Icon as={AiFillHeart} w={8} h={8} color="#D53F8C" />
                                                    :
                                                    <Icon as={AiOutlineHeart} w={8} h={8} />
                                            }
                                            <Icon as={FaRegComment} w={7} h={7} className="ms-4" />
                                            <Icon as={IoPaperPlaneOutline} w={7} h={7} className="ms-4" />
                                        </div>
                                        <Text fontSize='md' className="mt-2 text-muted">{data.datecreated}</Text>
                                    </div>
                                    <Text fontSize='lg' className="mt-2">Liked by <span className="fw-bold"> others</span></Text>
                                    <div className="d-flex">
                                        <Text fontSize='lg' className="mt-2 d-flex align-items-center">
                                            <span className="fw-bold">{data.username}</span>
                                            <span className="ms-1">{data.caption}</span>
                                        </Text>
                                    </div>
                                    <Text fontSize='lg' className="mt-2 text-muted fw-bold" >View all comments</Text>
                                    <div className="d-flex align-items-center mt-3">
                                        <Icon as={AiOutlineSmile} w={8} h={8} />
                                        {/* {
                                            spinner ?
                                                <div className="m-auto">
                                                    <Spinner defaultValue={comment} emptyColor='transparent' />
                                                </div>
                                                : */}
                                                <Input id='comment' size='lg' variant='unstyled' placeholder='Add a comment...' type='text' className="ms-2 ps-2" />
                                        {/* } */}
                                        <Button size='lg' style={{ color: '#D53F8C' }} className="fw-bold" variant='link' >Post</Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <Modal id='modalCaption' isOpen={editCaption} onClose={() => setEditCaption(!editCaption)} size='lg' isCentered>
            {/* <Modal id='mymodal' isOpen={detailPage} onClose={() => setDetailPage(!detailPage)} size='xl' isCentered> */}
            <ModalOverlay />
            <ModalContent className="p-3">
                <ModalHeader className="d-flex justify-content-between align-items-center border-bottom mb-3">
                    <Button size='lg' colorScheme="gray" className="fw-bold me-2" variant='link' onClick={() => setEditCaption(!editCaption)}>Cancel</Button>
                    Edit Caption
                    <Button size='lg' colorScheme="pink" className="fw-bold" variant='link' onClick={() => { handleEdit(data.idpost); setEditCaption(!editCaption) }}>Done</Button>
                </ModalHeader>
                <ModalBody className="row">
                    <div className="col-6">
                        <Image className='shadow-sm' boxSize='100% 50%' margin='auto' objectFit='cover' fallbackSrc={API_URL + data.image} alt='add-product' />
                    </div>
                    <div className="col-6 d-flex flex-column border-start">
                        <div className="d-flex align-items-center ">
                            <Avatar size='sm' name='Prosper Otemuyiwa' src={data.profilepic ? API_URL + data.profilepic : 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAAAMFBMVEXFxcX////CwsLGxsb7+/vT09PJycn19fXq6urb29ve3t7w8PDOzs7n5+f5+fnt7e30nlkBAAAFHUlEQVR4nO2dC5qqMAyFMTwUBdz/bq+VYYrKKJCkOfXmXwHna5uTpA+KwnEcx3Ecx3Ecx3Ecx3Ecx3Ecx3Ecx3Ecx3EcA2iO9cdIc5PUdO257y+BU39u66b4HplE3fk6VIcnqmNfl1+gksr6+iIucjl3WYukor7+re6Hoe1y1UhNO3zUd+fUFRmKpOa0Tt6dY5ubRCrOG/QFLk1WGmnt/JxzykcjdZ/jyxJDLlOV2l36AtcsJJb9boG3YcR3DuqODIE3ztYKPkDdmwRmpUToUaSaq++AvRgZMWbOpbQW8hdCAm8ZDugoikzREdCJ2okJPBx6azFLNOwoOgcxojJ98JkaTSJxMpklKrCAKhZGI0drTY/wU5lXoJYibannV9NYy4oozNEAkPHTjop+DTDxVGkIgYJNoyQQJtiIW+EMjGAjm649AjGIaqswcEFQKJ2QPlJbqytki6ZXAAZRJ52J2McaUowzAfs+uFzrYhnzaapphiPWdaJWShqxjqa6kTTQ205TVbsfMa6htL0iYOsXpJrQjHSmCkv1QGPtiHqlYcQ21Gj7fcDU8xOEUuNgSltPzexh+HqFlanCBHZ4OLhCV+gK/3OF6vWvucLv98MUOY2pwu/PS/+D2qJU7pYGbOvDFDW+bbON9p3o3oRxn0bfLgZTgSn6pSfrtr56qLHemtHPTK2319SzGvtjQ9qeb39WgS66Cm073nd0U1PzDdJCO3Gzn6TKpl9Zq7ujGWsQhlA3NwWIMwG9zM08Y/tBrR9VWeczv5CSQuuUNKIUTk23ZJ5RKfVhjnkXotfWIlgX2BSCDYbZR+QTcLhb3dKZDUY2M0d4KWItwhHRah/zsrOgKw4wycwjcgEVcgQDQo23CqSiWEJkFAfod2oE1uIFdA1OsCPqFXYNTjCfb8Ez+iX2x5sKLlVbhtqdDcar9ZevhnbZxoBUD35k23t0d304LYs1ELVbnfFaZ/REJJX9niP8Q19moZGo3m8XR/yBvOnjFfsXcI2c8ZuNo7WMP5HQh6yRGrlmFOJTnyTcT+zRlqPUBI2gTVWNUzUna1ERgecgF4GpNBQ38jGqxVLzQA1A31Rrhk6Yz9QEh/WND0GnuG9huhiTXJkxfAizTHLr6cbJKN6UCU6x/2DTRE1xEeEXi3O0ZUqBN4nJRzHhFB1JPlFTBZlI2kQ8zc3KJ1Le8DIRmFJiknuVS6RK4Ej/JtBfJErDSzOBiY4wJHX6Z1I4v1GUmdCPNirnLLeg3oJLcbX5PcpHNbRvOa1A956QmRPOUXVF+zkaUJynpkYR0bOMJH2nNej1pqyV/aKkz9jr5yj5vrXXz1F5SQLACiMapmierj2ikLyleKdlA/I/2oFxiglxx9B+mHwz0lf34IZQfhDRhlD6bhvgEAoPYooHkTczSIZTLC+cEExsoNKZiGBiY9cCfo/Y/SjIOBMQizWWTe73CMUasJx7jlD+DdKdWUKoY4PRYFtGpO0G1Lx4RaadgTtJhf4fiGqGIwKWCGuGIwKWqP+7IxYCzygjR9IAO5pC7Da9g70TBVpWRNgFBlgT8RV2WxHbKwJMv4BOaEaYaU2K16yZMN/qgV+G7IWIvwyZCxHeDQMsR8wg0DBDDXB5H2EV+hkEGmaoySHQsEJNFoGGFWrAq98JRhUMX1iMMMqLLEIpK5jCbd4vw9nSt/72lewXiN6jmdjfq8Hdknlk92ZwJnbIMMRM7JBhiFlUFoHd1UWaP1QKsPsHA5mkNB+Smn9JqV3wskatnQAAAABJRU5ErkJggg=='} />
                            <Text fontSize='sm' className="ms-3 fw-bold">{data.username}</Text>
                        </div>
                        <Textarea size='sm' variant='outline' defaultValue={data.caption} type='text' className="ps-2 mt-3" onChange={(e) => setNewCaption(e.target.value)} />
                    </div>
                </ModalBody>
                <ModalFooter>
                </ModalFooter>
            </ModalContent>
        </Modal>
    </div >
}

export default PostPage;