import React from "react";
import {
    Text, Avatar, Wrap, WrapItem, Icon, Button, Input,
    Menu,
    MenuButton,
    MenuList,
    MenuItem, Modal, ModalOverlay,
    ModalContent, ModalHeader, ModalFooter,
    ModalBody,
    Image,
    AlertDialog,
    AlertDialogBody,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogContent,
    AlertDialogOverlay,
    useDisclosure, Textarea, Spinner
} from '@chakra-ui/react'
import { AiOutlineHeart, AiOutlineSmile, AiFillHeart } from "react-icons/ai";
import { FiMoreHorizontal } from "react-icons/fi";
import { FaRegComment } from "react-icons/fa";
import { IoPaperPlaneOutline } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { API_URL } from "../helper";
import Axios from "axios";
import { useNavigate } from "react-router-dom";
import { newpostAction } from "../Actions/newpostAction";
import InfiniteScroll from "react-infinite-scroll-component";


const HomePage = () => {
    const [data, setData] = React.useState([]);
    const [newCaption, setNewCaption] = React.useState('');
    const [dimage, setDimage] = React.useState('');
    const [dusername, setDusername] = React.useState('');
    const [dcaption, setDcaption] = React.useState('');
    const [dprofilepic, setDprofilepic] = React.useState('');
    const [didpost, setDidpost] = React.useState('');
    const [ddatecreated, setDdatecreated] = React.useState('');
    const [comment, setComment] = React.useState('');
    const [allComment, setAllComment] = React.useState([]);
    const [idPostComment, setIdPostComment] = React.useState([]);
    const [idxDelete, setIdxDelete] = React.useState(null);
    const [done, setDone] = React.useState('nok');
    const [editCaption, setEditCaption] = React.useState(false);
    const [query, setQuery] = React.useState(3);
    const [dataLike, setDataLike] = React.useState([]);
    const [melike, setMelike] = React.useState([]);
    const [spinner, setSpinner] = React.useState(false);

    const { isOpen, onOpen, onClose } = useDisclosure()
    const cancelRef = React.useRef()

    const global = useSelector((state) => {
        return {
            idusers: state.userReducer.idusers,
            username: state.userReducer.username,
            status: state.userReducer.status,
            profilepic: state.userReducer.profilepic,
            email: state.userReducer.email,
            image: state.newpostReducer.image,
            idpost: state.newpostReducer.idpost,
            caption: state.newpostReducer.caption,
            done: state.newpostReducer.done,
            datecreated: state.newpostReducer.datecreated
        }
    })

    const dispatch = useDispatch();
    const toast = useToast();
    const navigate = useNavigate();

    const getLike = () => {
        Axios.get(API_URL + '/post/getlike')
            .then((res) => {
                setDataLike(res.data);
            })
            .catch((error) => {
                console.log(error);
            })
    }

    React.useEffect(() => {
        getLike()
    }, [])

    const onLike = (idpost) => {
        Axios.post(API_URL + '/post/like',
            {
                idusers_likers: global.idusers,
                idpost
            })
            .then((res) => {
                if (res.data.success == 'true') {
                    setDataLike(res.data.dataLike);
                    getLike();
                    likedByme();
                } else {
                    getLike();
                    likedByme();
                }
            })
            .catch((error) => {
                console.log('onLike error', error);
            })
    }

    let totalLikeID = [];
    let totalLike = [];
    const filterTotalLikeID = () => {

        dataLike.forEach((value) => {
            let cek = [];
            let propertiesDATASOURCE = Object.keys(data); 
            let propertiesFILTER = Object.keys(value); 

            propertiesFILTER.forEach((val) => {
                propertiesDATASOURCE.forEach((v) => {
                    if (val == v) {
                        if (data[val] == value[v]) {
                            cek.push(true);
                        } else {
                            cek.push(false);
                        }
                    }
                })
            })

            if (!cek.includes(false)) {
                totalLikeID.push(value.idpost); 
                totalLike.push(value.total_like); 
            }

        })
    }

    React.useEffect(() => {
        filterTotalLikeID()
    }, [])

    const likedByme = () => {
        Axios.patch(API_URL + `/post/likedbyme/users?idusers=${global.idusers}`)
            .then((res) => {
                setMelike(res.data);
            })
            .catch((error) => {
                console.log(error);
            })
    }

    React.useEffect(() => {
        likedByme()
    }, []);

    const onDelete = (idx) => {
        setIdxDelete(null);
        Axios.delete(API_URL + `/post/delete/users?idpost=${idx}`)
            .then((res) => {
                onClose();
                getImage();
                toast({
                    title: 'Delete Photo Success',
                    status: 'success',
                    duration: 3000,
                    isClosable: true
                });
            }).catch((error) => {
                console.log(error)
            })
    }

    const handleEdit = (idx) => {
        setDone('ok');
        dispatch(newpostAction({ done: 'ok' }));
        Axios.patch(API_URL + '/post/editcaption',
            {
                idpost: idx,
                caption: newCaption
            })
            .then((res) => {
                getImage();
            })
            .catch((error) => {
                console.log(error)
            });
    }

    const getComment = () => {
        Axios.get(API_URL + '/post/getcomment')
            .then((res) => {
                setAllComment(res.data);
            }).catch((error) => {
                console.log(error)
            })
    }

    React.useEffect(() => {
        getComment()
    }, [])

    const handleComment = (idx) => {
        let today = new Date().toJSON();

        if (comment.length <= 300) {
            Axios.post(API_URL + '/post/comment', {
                idusers: global.idusers,
                idpost: idx,
                comment,
                datecomment: today
            })
                .then((res) => {
                    setSpinner(true);
                    setTimeout(() => { setSpinner(false); setAllComment(res.data); document.getElementById("comment").value = null; setComment = ('') }, 1000);
                    setTimeout(() =>toast({
                        title: 'Add Comment Success',
                        status: 'success',
                        duration: 3000,
                        isClosable: true
                    }), 1000)
                })
                .catch((error) => {
                    console.log(error)
                })
        } else {
            alert('Comment must be below 300 characters');
        }
    }

    const getImage = () => {
        Axios.post(API_URL + '/post/getimage', {
            query
        })
            .then((res) => {
                setData(res.data);
                setQuery(query + 1);
            }).catch((error) => {
                console.log(error)
            })
    }


    React.useEffect(() => {
        getImage()
    }, [])

    if (global.image) {
        data.unshift(
            {
                idusers: global.idusers,
                username: global.username,
                image: global.image,
                idpost: global.idpost,
                caption: global.caption,
                datecreated: global.datecreated,
                profilepic: global.profilepic
            }
        )
    }

    const printPost = () => {
        filterTotalLikeID()
        localStorage.setItem('homepageLog', 'true');
        return <InfiniteScroll dataLength={data.length} next={getImage} hasMore={true}>
            {data.map((val, idx) => {
                let idLike = totalLikeID.findIndex(value => value == val.idpost);
                return <div key={val.idpost}>
                    <div className="card mb-4 mb-lg-5">
                        <div className="px-2 px-lg-4 pb-3">
                            <div className="card-title px-4 pt-4 d-flex justify-content-between">
                                <Wrap>
                                    <WrapItem>
                                        <Avatar size='sm' name='Kent Dodds' src={val.profilepic == null || '' ? 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAAAMFBMVEXFxcX////CwsLGxsb7+/vT09PJycn19fXq6urb29ve3t7w8PDOzs7n5+f5+fnt7e30nlkBAAAFHUlEQVR4nO2dC5qqMAyFMTwUBdz/bq+VYYrKKJCkOfXmXwHna5uTpA+KwnEcx3Ecx3Ecx3Ecx3Ecx3Ecx3Ecx3Ecx3EcA2iO9cdIc5PUdO257y+BU39u66b4HplE3fk6VIcnqmNfl1+gksr6+iIucjl3WYukor7+re6Hoe1y1UhNO3zUd+fUFRmKpOa0Tt6dY5ubRCrOG/QFLk1WGmnt/JxzykcjdZ/jyxJDLlOV2l36AtcsJJb9boG3YcR3DuqODIE3ztYKPkDdmwRmpUToUaSaq++AvRgZMWbOpbQW8hdCAm8ZDugoikzREdCJ2okJPBx6azFLNOwoOgcxojJ98JkaTSJxMpklKrCAKhZGI0drTY/wU5lXoJYibannV9NYy4oozNEAkPHTjop+DTDxVGkIgYJNoyQQJtiIW+EMjGAjm649AjGIaqswcEFQKJ2QPlJbqytki6ZXAAZRJ52J2McaUowzAfs+uFzrYhnzaapphiPWdaJWShqxjqa6kTTQ205TVbsfMa6htL0iYOsXpJrQjHSmCkv1QGPtiHqlYcQ21Gj7fcDU8xOEUuNgSltPzexh+HqFlanCBHZ4OLhCV+gK/3OF6vWvucLv98MUOY2pwu/PS/+D2qJU7pYGbOvDFDW+bbON9p3o3oRxn0bfLgZTgSn6pSfrtr56qLHemtHPTK2319SzGvtjQ9qeb39WgS66Cm073nd0U1PzDdJCO3Gzn6TKpl9Zq7ujGWsQhlA3NwWIMwG9zM08Y/tBrR9VWeczv5CSQuuUNKIUTk23ZJ5RKfVhjnkXotfWIlgX2BSCDYbZR+QTcLhb3dKZDUY2M0d4KWItwhHRah/zsrOgKw4wycwjcgEVcgQDQo23CqSiWEJkFAfod2oE1uIFdA1OsCPqFXYNTjCfb8Ez+iX2x5sKLlVbhtqdDcar9ZevhnbZxoBUD35k23t0d304LYs1ELVbnfFaZ/REJJX9niP8Q19moZGo3m8XR/yBvOnjFfsXcI2c8ZuNo7WMP5HQh6yRGrlmFOJTnyTcT+zRlqPUBI2gTVWNUzUna1ERgecgF4GpNBQ38jGqxVLzQA1A31Rrhk6Yz9QEh/WND0GnuG9huhiTXJkxfAizTHLr6cbJKN6UCU6x/2DTRE1xEeEXi3O0ZUqBN4nJRzHhFB1JPlFTBZlI2kQ8zc3KJ1Le8DIRmFJiknuVS6RK4Ej/JtBfJErDSzOBiY4wJHX6Z1I4v1GUmdCPNirnLLeg3oJLcbX5PcpHNbRvOa1A956QmRPOUXVF+zkaUJynpkYR0bOMJH2nNej1pqyV/aKkz9jr5yj5vrXXz1F5SQLACiMapmierj2ikLyleKdlA/I/2oFxiglxx9B+mHwz0lf34IZQfhDRhlD6bhvgEAoPYooHkTczSIZTLC+cEExsoNKZiGBiY9cCfo/Y/SjIOBMQizWWTe73CMUasJx7jlD+DdKdWUKoY4PRYFtGpO0G1Lx4RaadgTtJhf4fiGqGIwKWCGuGIwKWqP+7IxYCzygjR9IAO5pC7Da9g70TBVpWRNgFBlgT8RV2WxHbKwJMv4BOaEaYaU2K16yZMN/qgV+G7IWIvwyZCxHeDQMsR8wg0DBDDXB5H2EV+hkEGmaoySHQsEJNFoGGFWrAq98JRhUMX1iMMMqLLEIpK5jCbd4vw9nSt/72lewXiN6jmdjfq8Hdknlk92ZwJnbIMMRM7JBhiFlUFoHd1UWaP1QKsPsHA5mkNB+Smn9JqV3wskatnQAAAABJRU5ErkJggg==' : API_URL + val.profilepic} />
                                        <Text fontSize='xl' className="ms-3 fw-bold">{val.username}</Text>
                                    </WrapItem>
                                </Wrap>
                                <Menu>
                                    <MenuButton>
                                        <Icon as={FiMoreHorizontal} w={7} h={7} className="ms-4" />
                                    </MenuButton>

                                    <MenuList textColor='black'>
                                        {
                                            global.idusers == val.idusers ?
                                                <div>
                                                    <MenuItem onClick={() => { setEditCaption(true); setDimage(val.image); setDusername(val.username); 
                                                        setDcaption(val.caption); setDprofilepic(val.profilepic); setIdPostComment(val.idpost); 
                                                        setDdatecreated(val.datecreated); setDidpost(val.idpost) }}>Edit</MenuItem>
                                                    <MenuItem onClick={() => { onOpen(); setIdxDelete(val.idpost) }} >Delete</MenuItem>
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
                                    val.image.includes('http') ?
                                        <img src={val.image} width="100%" alt="imgHome" />
                                        : <img src={API_URL + val.image} width="100%" alt="imgHome" />
                                }
                                <div className="d-flex align-items-center justify-content-between">
                                    <div className="d-flex mt-3 align-items-center">
                                        {
                                            melike.findIndex(v => v.idpost == val.idpost) != -1 ?
                                                <Icon as={AiFillHeart} w={8} h={8} color="#D53F8C" onClick={() => onLike(val.idpost)} />
                                                :
                                                <Icon as={AiOutlineHeart} w={8} h={8} onClick={() => onLike(val.idpost)} />
                                        }
                                        <Icon as={FaRegComment} w={7} h={7} className="ms-4" />
                                        <Icon as={IoPaperPlaneOutline} w={7} h={7} className="ms-4" />
                                    </div>
                                    <Text fontSize='md' className="mt-2 text-muted">{val.datecreated}</Text>
                                </div>
                                <Text fontSize='lg' className="mt-2">Liked by <span className="fw-bold">{
                                    idLike != -1 ? totalLike[idLike] : 0
                                } others</span></Text>
                                <div className="d-flex">
                                    <Text fontSize='lg' className="mt-2 d-flex align-items-center">
                                        <span className="fw-bold">{val.username}</span>
                                        <span className="ms-1">{val.caption}</span>
                                    </Text>
                                </div>
                                <Text fontSize='lg' className="mt-2 text-muted fw-bold" onClick={() => navigate(`/postpage/${val.idpost}`)}>View all comments</Text>
                                <div className="d-flex align-items-center mt-3">
                                    <Icon as={AiOutlineSmile} w={8} h={8} />
                                    {
                                        spinner ?
                                            <div className="m-auto">
                                                <Spinner defaultValue={comment} emptyColor='transparent' />
                                            </div>
                                            :
                                            <Input id='comment' size='lg' variant='unstyled' placeholder='Add a comment...' type='text' className="ms-2 ps-2" onChange={(e) => setComment(e.target.value)} />
                                    }
                                    <Button size='lg' style={{ color: '#D53F8C' }} className="fw-bold" variant='link' onClick={() => handleComment(val.idpost)}>Post</Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            })}
        </InfiniteScroll>
    }

    return <div style={{ color: '#151033', minHeight:'75vh' }}>
        <div className="container">
            <div className="row py-3 py-lg-5">
                <div className="col-12 col-lg-9">
                    {
                        global.status == "VERIFIED" ?
                            printPost()
                            :
                            <div className="py-5 my-5 ms-5">
                                <Text fontSize='3xl' className="fw-bold">Account Not Verified</Text>
                                <Text fontSize='2xl' >Please verify your email to activate your account.</Text>
                                <Text fontSize='2xl' >Go to your profile to re-send a verification email.</Text>
                            </div>
                    }
                </div>
                <div className="col-12 d-none col-lg-3 d-lg-flex ps-5">
                    <div className="ps-3">
                        <div>
                            <Wrap>
                                <WrapItem className="d-flex align-items-center">
                                    <Avatar size='md' name='Dan Abrahmov' src={global.profilepic == null || global.profilepic == '' ? 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAAAMFBMVEXFxcX////CwsLGxsb7+/vT09PJycn19fXq6urb29ve3t7w8PDOzs7n5+f5+fnt7e30nlkBAAAFHUlEQVR4nO2dC5qqMAyFMTwUBdz/bq+VYYrKKJCkOfXmXwHna5uTpA+KwnEcx3Ecx3Ecx3Ecx3Ecx3Ecx3Ecx3Ecx3EcA2iO9cdIc5PUdO257y+BU39u66b4HplE3fk6VIcnqmNfl1+gksr6+iIucjl3WYukor7+re6Hoe1y1UhNO3zUd+fUFRmKpOa0Tt6dY5ubRCrOG/QFLk1WGmnt/JxzykcjdZ/jyxJDLlOV2l36AtcsJJb9boG3YcR3DuqODIE3ztYKPkDdmwRmpUToUaSaq++AvRgZMWbOpbQW8hdCAm8ZDugoikzREdCJ2okJPBx6azFLNOwoOgcxojJ98JkaTSJxMpklKrCAKhZGI0drTY/wU5lXoJYibannV9NYy4oozNEAkPHTjop+DTDxVGkIgYJNoyQQJtiIW+EMjGAjm649AjGIaqswcEFQKJ2QPlJbqytki6ZXAAZRJ52J2McaUowzAfs+uFzrYhnzaapphiPWdaJWShqxjqa6kTTQ205TVbsfMa6htL0iYOsXpJrQjHSmCkv1QGPtiHqlYcQ21Gj7fcDU8xOEUuNgSltPzexh+HqFlanCBHZ4OLhCV+gK/3OF6vWvucLv98MUOY2pwu/PS/+D2qJU7pYGbOvDFDW+bbON9p3o3oRxn0bfLgZTgSn6pSfrtr56qLHemtHPTK2319SzGvtjQ9qeb39WgS66Cm073nd0U1PzDdJCO3Gzn6TKpl9Zq7ujGWsQhlA3NwWIMwG9zM08Y/tBrR9VWeczv5CSQuuUNKIUTk23ZJ5RKfVhjnkXotfWIlgX2BSCDYbZR+QTcLhb3dKZDUY2M0d4KWItwhHRah/zsrOgKw4wycwjcgEVcgQDQo23CqSiWEJkFAfod2oE1uIFdA1OsCPqFXYNTjCfb8Ez+iX2x5sKLlVbhtqdDcar9ZevhnbZxoBUD35k23t0d304LYs1ELVbnfFaZ/REJJX9niP8Q19moZGo3m8XR/yBvOnjFfsXcI2c8ZuNo7WMP5HQh6yRGrlmFOJTnyTcT+zRlqPUBI2gTVWNUzUna1ERgecgF4GpNBQ38jGqxVLzQA1A31Rrhk6Yz9QEh/WND0GnuG9huhiTXJkxfAizTHLr6cbJKN6UCU6x/2DTRE1xEeEXi3O0ZUqBN4nJRzHhFB1JPlFTBZlI2kQ8zc3KJ1Le8DIRmFJiknuVS6RK4Ej/JtBfJErDSzOBiY4wJHX6Z1I4v1GUmdCPNirnLLeg3oJLcbX5PcpHNbRvOa1A956QmRPOUXVF+zkaUJynpkYR0bOMJH2nNej1pqyV/aKkz9jr5yj5vrXXz1F5SQLACiMapmierj2ikLyleKdlA/I/2oFxiglxx9B+mHwz0lf34IZQfhDRhlD6bhvgEAoPYooHkTczSIZTLC+cEExsoNKZiGBiY9cCfo/Y/SjIOBMQizWWTe73CMUasJx7jlD+DdKdWUKoY4PRYFtGpO0G1Lx4RaadgTtJhf4fiGqGIwKWCGuGIwKWqP+7IxYCzygjR9IAO5pC7Da9g70TBVpWRNgFBlgT8RV2WxHbKwJMv4BOaEaYaU2K16yZMN/qgV+G7IWIvwyZCxHeDQMsR8wg0DBDDXB5H2EV+hkEGmaoySHQsEJNFoGGFWrAq98JRhUMX1iMMMqLLEIpK5jCbd4vw9nSt/72lewXiN6jmdjfq8Hdknlk92ZwJnbIMMRM7JBhiFlUFoHd1UWaP1QKsPsHA5mkNB+Smn9JqV3wskatnQAAAABJRU5ErkJggg==' : API_URL + global.profilepic} />
                                    <Text fontSize='md' className="ms-3 fw-bold">{global.username}</Text>
                                </WrapItem>
                            </Wrap>
                        </div>
                        <div className="my-3">
                            <Text fontSize='md' className="text-muted fw-bold">Suggestions For You</Text>
                        </div>
                        <div className="mb-2">
                            <Wrap>
                                <WrapItem>
                                    <Avatar size='sm' name='Ryan Florence' src='https://bit.ly/ryan-florence' />
                                    <div className="d-block">
                                        <Text fontSize='xs' className="ms-3 fw-bold">ryanf</Text>
                                        <Text fontSize='xs' className="ms-3 fw-bold text-muted">Followed by tikaafs</Text>
                                    </div>
                                </WrapItem>
                            </Wrap>
                        </div>
                        <div className="mb-2">
                            <Wrap>
                                <WrapItem>
                                    <Avatar size='sm' name='Prosper Otemuyiwa' src='https://bit.ly/prosper-baba' />
                                    <div className="d-block">
                                        <Text fontSize='xs' className="ms-3 fw-bold">prosperote</Text>
                                        <Text fontSize='xs' className="ms-3 fw-bold text-muted">Followed by tikaafs</Text>
                                    </div>
                                </WrapItem>
                            </Wrap>
                        </div>
                        <div className="mb-2">
                            <Wrap>
                                <WrapItem>
                                    <Avatar size='sm' name='Christian Nwamba' src='https://bit.ly/code-beast' />
                                    <div className="d-block">
                                        <Text fontSize='xs' className="ms-3 fw-bold">christiannwamba</Text>
                                        <Text fontSize='xs' className="ms-3 fw-bold text-muted">Followed by tikaafs</Text>
                                    </div>
                                </WrapItem>
                            </Wrap>
                        </div>
                    </div>
                </div>

                <Modal id='modalCaption' isOpen={editCaption} onClose={() => setEditCaption(!editCaption)} size='xl' isCentered>
                    <ModalOverlay />
                    <ModalContent className="p-3">
                        <ModalHeader className="d-flex justify-content-between align-items-center border-bottom mb-3">
                            <Button size='lg' colorScheme="gray" className="fw-bold me-2" variant='link' onClick={() => setEditCaption(!editCaption)}>Cancel</Button>
                            Edit Caption
                            <Button size='lg' colorScheme="pink" className="fw-bold" variant='link' onClick={() => { handleEdit(didpost); setEditCaption(!editCaption) }}>Done</Button>
                        </ModalHeader>
                        <ModalBody className="row">
                            <div className="col-6">
                                <Image className='shadow-sm' boxSize='100% 50%' margin='auto' objectFit='cover' fallbackSrc={API_URL + dimage} alt='add-caption' />
                            </div>
                            <div className="col-6 d-flex flex-column border-start">
                                <div className="d-flex align-items-center ">
                                    <Avatar size='sm' name='Prosper Otemuyiwa' src={dprofilepic ? API_URL + dprofilepic : 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAAAMFBMVEXFxcX////CwsLGxsb7+/vT09PJycn19fXq6urb29ve3t7w8PDOzs7n5+f5+fnt7e30nlkBAAAFHUlEQVR4nO2dC5qqMAyFMTwUBdz/bq+VYYrKKJCkOfXmXwHna5uTpA+KwnEcx3Ecx3Ecx3Ecx3Ecx3Ecx3Ecx3Ecx3EcA2iO9cdIc5PUdO257y+BU39u66b4HplE3fk6VIcnqmNfl1+gksr6+iIucjl3WYukor7+re6Hoe1y1UhNO3zUd+fUFRmKpOa0Tt6dY5ubRCrOG/QFLk1WGmnt/JxzykcjdZ/jyxJDLlOV2l36AtcsJJb9boG3YcR3DuqODIE3ztYKPkDdmwRmpUToUaSaq++AvRgZMWbOpbQW8hdCAm8ZDugoikzREdCJ2okJPBx6azFLNOwoOgcxojJ98JkaTSJxMpklKrCAKhZGI0drTY/wU5lXoJYibannV9NYy4oozNEAkPHTjop+DTDxVGkIgYJNoyQQJtiIW+EMjGAjm649AjGIaqswcEFQKJ2QPlJbqytki6ZXAAZRJ52J2McaUowzAfs+uFzrYhnzaapphiPWdaJWShqxjqa6kTTQ205TVbsfMa6htL0iYOsXpJrQjHSmCkv1QGPtiHqlYcQ21Gj7fcDU8xOEUuNgSltPzexh+HqFlanCBHZ4OLhCV+gK/3OF6vWvucLv98MUOY2pwu/PS/+D2qJU7pYGbOvDFDW+bbON9p3o3oRxn0bfLgZTgSn6pSfrtr56qLHemtHPTK2319SzGvtjQ9qeb39WgS66Cm073nd0U1PzDdJCO3Gzn6TKpl9Zq7ujGWsQhlA3NwWIMwG9zM08Y/tBrR9VWeczv5CSQuuUNKIUTk23ZJ5RKfVhjnkXotfWIlgX2BSCDYbZR+QTcLhb3dKZDUY2M0d4KWItwhHRah/zsrOgKw4wycwjcgEVcgQDQo23CqSiWEJkFAfod2oE1uIFdA1OsCPqFXYNTjCfb8Ez+iX2x5sKLlVbhtqdDcar9ZevhnbZxoBUD35k23t0d304LYs1ELVbnfFaZ/REJJX9niP8Q19moZGo3m8XR/yBvOnjFfsXcI2c8ZuNo7WMP5HQh6yRGrlmFOJTnyTcT+zRlqPUBI2gTVWNUzUna1ERgecgF4GpNBQ38jGqxVLzQA1A31Rrhk6Yz9QEh/WND0GnuG9huhiTXJkxfAizTHLr6cbJKN6UCU6x/2DTRE1xEeEXi3O0ZUqBN4nJRzHhFB1JPlFTBZlI2kQ8zc3KJ1Le8DIRmFJiknuVS6RK4Ej/JtBfJErDSzOBiY4wJHX6Z1I4v1GUmdCPNirnLLeg3oJLcbX5PcpHNbRvOa1A956QmRPOUXVF+zkaUJynpkYR0bOMJH2nNej1pqyV/aKkz9jr5yj5vrXXz1F5SQLACiMapmierj2ikLyleKdlA/I/2oFxiglxx9B+mHwz0lf34IZQfhDRhlD6bhvgEAoPYooHkTczSIZTLC+cEExsoNKZiGBiY9cCfo/Y/SjIOBMQizWWTe73CMUasJx7jlD+DdKdWUKoY4PRYFtGpO0G1Lx4RaadgTtJhf4fiGqGIwKWCGuGIwKWqP+7IxYCzygjR9IAO5pC7Da9g70TBVpWRNgFBlgT8RV2WxHbKwJMv4BOaEaYaU2K16yZMN/qgV+G7IWIvwyZCxHeDQMsR8wg0DBDDXB5H2EV+hkEGmaoySHQsEJNFoGGFWrAq98JRhUMX1iMMMqLLEIpK5jCbd4vw9nSt/72lewXiN6jmdjfq8Hdknlk92ZwJnbIMMRM7JBhiFlUFoHd1UWaP1QKsPsHA5mkNB+Smn9JqV3wskatnQAAAABJRU5ErkJggg=='} />
                                    <Text fontSize='sm' className="ms-3 fw-bold">{dusername}</Text>
                                </div>
                                <Textarea size='sm' variant='outline' defaultValue={dcaption} type='text' className="ps-2 mt-3" onChange={(e) => setNewCaption(e.target.value)} />
                            </div>
                        </ModalBody>
                        <ModalFooter>
                        </ModalFooter>
                    </ModalContent>
                </Modal>

                <>
                    <AlertDialog
                        isOpen={isOpen}
                        leastDestructiveRef={cancelRef}
                        onClose={onClose}
                        isCentered
                    >
                        <AlertDialogOverlay>
                            <AlertDialogContent>
                                <AlertDialogHeader fontSize='lg' fontWeight='bold'>
                                    Delete Post
                                </AlertDialogHeader>

                                <AlertDialogBody>
                                    Are you sure? You can't undo this action afterwards.
                                </AlertDialogBody>

                                <AlertDialogFooter>
                                    <Button ref={cancelRef} onClick={onClose}>
                                        Cancel
                                    </Button>
                                    <Button colorScheme='red' onClick={() => onDelete(idxDelete)} ml={3}>
                                        Delete
                                    </Button>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialogOverlay>
                    </AlertDialog>
                </>
            </div>
        </div>
    </div>
}

export default HomePage;