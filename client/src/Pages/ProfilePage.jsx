import React from "react";
import { Text, Button, useToast, Spinner, Avatar, Divider, Icon } from "@chakra-ui/react";
import { API_URL } from "../helper";
import Axios from "axios";
import { useSelector } from "react-redux";
import { BsGrid3X3 } from "react-icons/bs";
import { AiFillHeart } from "react-icons/ai";
import { useNavigate } from "react-router-dom";

const ProfilePage = () => {
    const tabLog = localStorage.getItem('profileLog');

    const [cobaResend, setCobaResend] = React.useState(true);
    const [data, setData] = React.useState([]);
    const [tab, setTab] = React.useState(`${tabLog}`);
    const [dataLiked, setDataLiked] = React.useState([]);
    const [colorGrid, setColorGrid] = React.useState('#D53F8C');
    const [colorLoved, setColorLoved] = React.useState('black');


    const toast = useToast();
    const navigate = useNavigate();

    const global = useSelector((state) => {
        return {
            idusers: state.userReducer.idusers,
            username: state.userReducer.username,
            profilepic: state.userReducer.profilepic,
            status: state.userReducer.status
        }
    })

    let emailVerif = localStorage.getItem('emailLog');

    const handleResendLink = () => {
        setCobaResend(!cobaResend);
        Axios.post(API_URL + '/auth/resendlink', {
            emailVerif
        })

            .then((res) => {
                const test = () => {
                    if (res.data.success) {
                        toast({
                            title: 'Email verification has been sent.',
                            description: 'Please check your mailbox for account verification.',
                            status: 'success',
                            duration: 3000,
                            isClosable: true
                        });
                        setCobaResend(!cobaResend);
                    }
                }
                setTimeout(test, 3000);
            }).catch((err) => {
                setCobaResend(cobaResend);
                console.log(`Axios post (resendLink) failed : ${err}`)
            })

    }

    const getImage = () => {
        Axios.post(API_URL + '/post/getimage', {
            idusers: global.idusers
        })
            .then((res) => {
                setData(res.data);
            })
            .catch((error) => {
                console.log('Getimage profilepage error :', error);
            })
    }

    React.useEffect(() => {
        getImage()
    }, [])

    const getLiked = () => {
        Axios.patch(API_URL + `/post/likedbyme/users?idusers=${global.idusers}`)
            .then((res) => {
                setDataLiked(res.data);
            })
            .catch((error) => {
                console.log(error);
            })
    }

    React.useEffect(() => {
        getLiked()
    }, [])

    const printPost = () => {
        return data.map((val, idx) => {
            return <div className="col-12 col-md-6 col-lg-4 my-4" key={val.idpost}>
                <div className="card crop">
                    <img src={API_URL + val.image} alt="imgHome" onClick={() => navigate(`/postpage/${val.idpost}`)}/>
                </div>
            </div>
        })
    }

    const printLiked = () => {
        return dataLiked.map((val, idx) => {
            return <div className="col-12 col-md-6 col-lg-4 my-4 " key={val.idpost}>
                <div className="card crop">
                    <img src={API_URL + val.image} alt="imgHome" onClick={() => navigate(`/postpage/${val.idpost}`)}/>
                </div>
            </div>
        })
    }

    return <div>
        <div className="container">
            {
                global.status == 'VERIFIED' ?
                    <div>
                        <div className="d-flex align-items-center my-5">
                            <Avatar size='2xl' src={API_URL + global.profilepic} />
                            <Text className="ms-3 fw-bold" fontSize='2xl'>{global.username}</Text>
                        </div>
                        <Divider />
                        <div className="d-flex justify-content-center">
                            <div className="d-flex align-items-center mt-3 mb-3">
                                <Icon as={BsGrid3X3} w={7} h={7} onClick={() => {setTab('post');setColorGrid('#D53F8C');setColorLoved('black');localStorage.setItem('profileLog', 'post')}} color={`${colorGrid}`}/>
                                <Text color={`${colorGrid}`} fontSize='md' className="ms-2 fw-bold" onClick={() => {setTab('post');setColorGrid('#D53F8C');setColorLoved('black');localStorage.setItem('profileLog', 'post')}}>POSTS</Text>
                            </div>
                            <div className="d-flex align-items-center ms-5">
                                <Icon as={AiFillHeart} w={7} h={7} onClick={() => {setTab('loved');setColorLoved('#D53F8C');setColorGrid('black');localStorage.setItem('profileLog', 'loved')}} color={`${colorLoved}`}/>
                                <Text color={`${colorLoved}`} fontSize='md' className="ms-2 fw-bold" onClick={() => {setTab('loved');setColorLoved('#D53F8C');setColorGrid('black');localStorage.setItem('profileLog', 'loved')}}>LIKED</Text>
                            </div>
                        </div>
                        <Divider />
                        <div className="row">
                            {
                                tab == 'post' || tabLog == 'post' ?
                                    printPost()
                                    :
                                    printLiked()
                            }
                        </div>
                    </div>


                    :

                    <div className="row py-5">
                        <div className="col-12 col-lg-8">
                            <div className="py-5 my-5">
                                <Text fontSize='3xl' className="fw-bold">Account Not Verified</Text>
                                <Text fontSize='2xl' className="pt-1">Please verify your email to activate your account.</Text>
                                <Text fontSize='2xl' className="pb-3">Go to your profile to re-send a verification email.</Text>
                                {
                                    cobaResend ? <Button colorScheme="pink" variant="solid" onClick={handleResendLink}>Resend verification link</Button>
                                        : <Button colorScheme="pink" variant="solid" disabled><Spinner size='sm' /></Button>
                                }
                            </div>

                        </div>
                    </div>

            }
        </div>
    </div>
}

export default ProfilePage;