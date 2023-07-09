import {
    Spinner, Button, Icon, Text,
    Avatar, Modal, ModalOverlay,
    ModalContent, ModalHeader, ModalFooter,
    ModalBody, ModalCloseButton, FormControl,
    Image, Input, FormLabel, Select, Menu,
    MenuButton,
    MenuList,
    MenuItem,
    MenuDivider,
    useToast, AvatarBadge
} from "@chakra-ui/react";
import React from "react";
import { useNavigate } from "react-router-dom";
import { FiPlusSquare } from "react-icons/fi";
import { AiOutlineLogout } from "react-icons/ai";
import { API_URL } from "../helper";
import Axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { userReducer } from "../Reducers/userReducer";
import { newpostAction, uploadedAction } from "../Actions/newpostAction";
import { logoutAction } from "../Actions/userAction";

const Navbar = (props) => {
    const navigate = useNavigate();
    const { pathname } = window.location;
    const [toggle, setToggle] = React.useState(false); // untuk membuka/menutup modal
    const [image, setImage] = React.useState("");
    const [caption, setCaption] = React.useState("");
    const [post, setPost] = React.useState("");
    const [navbarToggler, setNavbarToggler] = React.useState(false); // untuk membuka/menutup modal
    const [coba, setCoba] = React.useState(true);
    const [imagePreview, setImagePreview] = React.useState('');
    const [cobaResend, setCobaResend] = React.useState(true);
    const [data, setData] = React.useState([]);
    const [profpic, setProfpic] = React.useState('');
console.log('ini image', image)

    const toast = useToast();
    const dispatch = useDispatch();

    //Untuk navbar berubah depends on sudah login atau belum (currently tidak digunakan)
    const global = useSelector((state) => {
        // console.log(state.userReducer.email)
        return {
            idusers: state.userReducer.idusers,
            username: state.userReducer.username,
            email: state.userReducer.email,
            status: state.userReducer.status,
            profilepic: state.userReducer.profilepic,
            login: state.userReducer.login,
            image: state.newpostReducer.image,
            idpost: state.newpostReducer.idpost,
            caption: state.newpostReducer.caption,
            done: state.newpostReducer.done,
            datecreated: state.newpostReducer.datecreated
        }
    });

    const newPost = () => {
        let today = new Date().toJSON()
        setCoba(!coba);
        let idusers = global.idusers;
        let formData = new FormData();
        formData.append('data', JSON.stringify({
            caption,
            idusers,
            datecreated:today
        }));
        formData.append('image', image);
        Axios.post(API_URL + '/post/newpost', formData).then((res) => {
            setTimeout(() => {
                if (res.data.success) {
                    setPost({ image, caption });
                    setToggle(!toggle);
                    dispatch(newpostAction({...res.data.isiNewpost, done:'nok'}));
                    setTimeout(()=>dispatch(uploadedAction()),5000);
                };
                setCoba(coba)
                setImage('');
                setImagePreview('');
            }, 3000);
        }).catch((err) => {
            console.log(`Axios post (newpost) failed : ${err}`)
        })
    }

    const onLogout = () => {
        dispatch(logoutAction());
        navigate('/', { replace: true });
    }

    const onImage = (e) => {
        setImage(e.target.files[0])
        setImagePreview(URL.createObjectURL(e.target.files[0]));
    };

    const handleResendLink = () => {
        setCobaResend(!cobaResend);
        Axios.post(API_URL + '/auth/resendlink', {
            emailVerif: global.email
        })
            .then((res) => {
                if (res.data.success) {
                    toast({
                        title: 'Email verification has been sent.',
                        description: 'Please check your mailbox for account verification.',
                        status: 'success',
                        duration: 3000,
                        isClosable: true
                    });
                    setCobaResend(cobaResend);
                }
                localStorage.setItem('userLog', res.data.token);
            }).catch((err) => {
                setCobaResend(cobaResend);
                console.log(`Axios post (resendLink) failed : ${err}`)
            })

    }

    return <div style={{ background: "#151033", color: 'white', position:'sticky', top:0, zIndex:100 }}>
        {
            global.login == 'true' ?
                <div className="container">
                    <div className="navbar navbar-dark bg-transparent">
                        <div className="navbar-brand">
                            <Text fontSize='xl' className="fw-bold" onClick={() => navigate('/homepage')}>Podscript.</Text>
                        </div>
                        <div className="d-flex align-items-center">
                            <Icon as={FiPlusSquare} w={8} h={8} onClick={() => global.status=='VERIFIED'? setToggle(!toggle) : null}/>
                            <Menu>
                                <MenuButton>
                                    <Avatar className="ms-4" size='sm' name='Dan Abrahmov' src={global.profilepic == null || global.profilepic == '' ? 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAAAMFBMVEXFxcX////CwsLGxsb7+/vT09PJycn19fXq6urb29ve3t7w8PDOzs7n5+f5+fnt7e30nlkBAAAFHUlEQVR4nO2dC5qqMAyFMTwUBdz/bq+VYYrKKJCkOfXmXwHna5uTpA+KwnEcx3Ecx3Ecx3Ecx3Ecx3Ecx3Ecx3Ecx3EcA2iO9cdIc5PUdO257y+BU39u66b4HplE3fk6VIcnqmNfl1+gksr6+iIucjl3WYukor7+re6Hoe1y1UhNO3zUd+fUFRmKpOa0Tt6dY5ubRCrOG/QFLk1WGmnt/JxzykcjdZ/jyxJDLlOV2l36AtcsJJb9boG3YcR3DuqODIE3ztYKPkDdmwRmpUToUaSaq++AvRgZMWbOpbQW8hdCAm8ZDugoikzREdCJ2okJPBx6azFLNOwoOgcxojJ98JkaTSJxMpklKrCAKhZGI0drTY/wU5lXoJYibannV9NYy4oozNEAkPHTjop+DTDxVGkIgYJNoyQQJtiIW+EMjGAjm649AjGIaqswcEFQKJ2QPlJbqytki6ZXAAZRJ52J2McaUowzAfs+uFzrYhnzaapphiPWdaJWShqxjqa6kTTQ205TVbsfMa6htL0iYOsXpJrQjHSmCkv1QGPtiHqlYcQ21Gj7fcDU8xOEUuNgSltPzexh+HqFlanCBHZ4OLhCV+gK/3OF6vWvucLv98MUOY2pwu/PS/+D2qJU7pYGbOvDFDW+bbON9p3o3oRxn0bfLgZTgSn6pSfrtr56qLHemtHPTK2319SzGvtjQ9qeb39WgS66Cm073nd0U1PzDdJCO3Gzn6TKpl9Zq7ujGWsQhlA3NwWIMwG9zM08Y/tBrR9VWeczv5CSQuuUNKIUTk23ZJ5RKfVhjnkXotfWIlgX2BSCDYbZR+QTcLhb3dKZDUY2M0d4KWItwhHRah/zsrOgKw4wycwjcgEVcgQDQo23CqSiWEJkFAfod2oE1uIFdA1OsCPqFXYNTjCfb8Ez+iX2x5sKLlVbhtqdDcar9ZevhnbZxoBUD35k23t0d304LYs1ELVbnfFaZ/REJJX9niP8Q19moZGo3m8XR/yBvOnjFfsXcI2c8ZuNo7WMP5HQh6yRGrlmFOJTnyTcT+zRlqPUBI2gTVWNUzUna1ERgecgF4GpNBQ38jGqxVLzQA1A31Rrhk6Yz9QEh/WND0GnuG9huhiTXJkxfAizTHLr6cbJKN6UCU6x/2DTRE1xEeEXi3O0ZUqBN4nJRzHhFB1JPlFTBZlI2kQ8zc3KJ1Le8DIRmFJiknuVS6RK4Ej/JtBfJErDSzOBiY4wJHX6Z1I4v1GUmdCPNirnLLeg3oJLcbX5PcpHNbRvOa1A956QmRPOUXVF+zkaUJynpkYR0bOMJH2nNej1pqyV/aKkz9jr5yj5vrXXz1F5SQLACiMapmierj2ikLyleKdlA/I/2oFxiglxx9B+mHwz0lf34IZQfhDRhlD6bhvgEAoPYooHkTczSIZTLC+cEExsoNKZiGBiY9cCfo/Y/SjIOBMQizWWTe73CMUasJx7jlD+DdKdWUKoY4PRYFtGpO0G1Lx4RaadgTtJhf4fiGqGIwKWCGuGIwKWqP+7IxYCzygjR9IAO5pC7Da9g70TBVpWRNgFBlgT8RV2WxHbKwJMv4BOaEaYaU2K16yZMN/qgV+G7IWIvwyZCxHeDQMsR8wg0DBDDXB5H2EV+hkEGmaoySHQsEJNFoGGFWrAq98JRhUMX1iMMMqLLEIpK5jCbd4vw9nSt/72lewXiN6jmdjfq8Hdknlk92ZwJnbIMMRM7JBhiFlUFoHd1UWaP1QKsPsHA5mkNB+Smn9JqV3wskatnQAAAABJRU5ErkJggg==' : API_URL + global.profilepic} />
                                </MenuButton>
                                <MenuList textColor='black' className="w-100 justify-content-end">
                                    {
                                        global.status == "VERIFIED" ?
                                            <div>
                                                <MenuItem onClick={() => {localStorage.setItem('profileLog','post'); navigate('/profile')}}>Profile</MenuItem>
                                                <MenuItem onClick={() => navigate('/editprofile')}>Edit Profile</MenuItem>
                                            </div>
                                            :
                                            <div>
                                                <MenuItem>Please verify your account to continue surfing Podscript.</MenuItem>
                                                <Button colorScheme="pink" variant="solid" className="ms-2 my-3 " onClick={handleResendLink}>Resend verification link</Button>
                                            </div>
                                    }
                                    <MenuDivider />
                                    <MenuItem onClick={onLogout}>Signout<AiOutlineLogout className='ms-2' /></MenuItem>
                                </MenuList>
                            </Menu>
                        </div>
                        <Modal isOpen={toggle} onClose={() => setToggle(!toggle)} size='xl'>
                            <ModalOverlay />
                            <ModalContent className="p-3">
                                <ModalHeader>Create new post</ModalHeader>
                                <ModalCloseButton />
                                <ModalBody>
                                    <FormControl >
                                        <Image className='shadow-sm' boxSize='100% 50%' margin='auto' objectFit='cover' src={imagePreview} fallbackSrc='https://media.istockphoto.com/vectors/image-preview-icon-picture-placeholder-for-website-or-uiux-design-vector-id1222357475?k=20&m=1222357475&s=612x612&w=0&h=jPhUdbj_7nWHUp0dsKRf4DMGaHiC16kg_FSjRRGoZEI=' alt='add-product' />
                                        <FormLabel className="mt-4 fw-bold">New Post</FormLabel>
                                        <Input type='file' onChange={onImage} placeholder='Insert image here' />

                                        {/* <Input type='file' onChange={(e) => setImage(e.target.files[0])} placeholder='Insert image here' /> */}
                                        <FormLabel className="mt-4 fw-bold">Caption</FormLabel>
                                        <Input type='text' onChange={(e) => setCaption(e.target.value)} placeholder='Insert caption here' />
                                    </FormControl>
                                </ModalBody>
                                <ModalFooter>
                                    {
                                        coba ? <Button colorScheme="pink" variant="solid" className="fw-bold" onClick={newPost} size='lg' >Post</Button>
                                            : <Button colorScheme="pink" variant="solid" className="fw-bold" disabled><Spinner size='sm' className="me-3" />Uploading</Button>
                                    }
                                </ModalFooter>
                            </ModalContent>
                        </Modal>
                    </div>
                </div>
                :
                <div className="container">
                    <div className="navbar navbar-dark bg-transparent">
                        <div className="navbar-brand">
                            <Text fontSize='xl' className="fw-bold" onClick={() => navigate('/')}>Podscript.</Text>
                        </div>
                        <div className="d-none d-md-flex align-items-center">
                            <Text fontSize='l' className="fw-bold me-3" style={{ color: '#D53F8C' }} onClick={() => navigate('/login')}>Sign In</Text>
                            <Button colorScheme="pink" variant='outline' onClick={() => navigate('/register')}>Sign Up</Button>
                        </div>
                        <div className="d-flex d-md-none">

                            <Menu>
                                <MenuButton className="navbar-toggler bg-transparent">
                                    {/* <Button className="navbar-toggler bg-transparent"> */}
                                    <span className="navbar-toggler-icon"></span>
                                    {/* </Button> */}
                                </MenuButton>
                                <MenuList textColor='#151033'>
                                    <div>
                                        <MenuItem onClick={() => navigate('/login')}>Sign In</MenuItem>
                                        <MenuItem onClick={() => navigate('/register')}>Sign Up</MenuItem>
                                    </div>
                                </MenuList>
                            </Menu>
                        </div>
                    </div>
                </div>
        }
    </div>
}

export default Navbar;