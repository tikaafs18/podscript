import { FormErrorMessage, ModalFooter, Spinner, Image, ModalBody, FormControl, FormLabel, Input, Text, Wrap, WrapItem, Avatar, Button, Modal, ModalOverlay, ModalContent, ModalHeader, useToast } from "@chakra-ui/react";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { API_URL } from "../helper";
import Axios from "axios";
import { editProfileAction } from "../Actions/userAction";

const EditProfilePage = () => {
    const [fullname, setFullname] = React.useState('');
    const [bio, setBio] = React.useState('');
    const [toggle, setToggle] = React.useState(false);
    const [profpic, setProfpic] = React.useState("");
    const [imagePreview, setImagePreview] = React.useState('');
    const [coba, setCoba] = React.useState(true);
    const [data, setData] = React.useState([]);
    const [unameCheck, setUnameCheck] = React.useState(true);
    const [allUname, setAllUname] = React.useState([]);
    const [newUname, setNewUname] = React.useState('');

    const global = useSelector((state) => {
        return {
            idusers: state.userReducer.idusers,
            username: state.userReducer.username,
            image: state.userReducer.image,
            idpost: state.userReducer.idpost,
            caption: state.userReducer.caption,
            status: state.userReducer.status,
            profilepic: state.userReducer.profilepic,
            email: state.userReducer.email,
        }
    })

    const toast = useToast();
    const dispatch = useDispatch();

    const getProfile = () => {
        Axios.get(API_URL + `/profile/info/users?idusers=${global.idusers}`)
            .then((res) => {
                setData(res.data);
            }).catch((error) => {
                console.log(error)
            })
    }

    React.useEffect(() => {
        getProfile()
    }, [])

    const getAllUsername = () => {
        Axios.get(API_URL + `/profile/username`)
            .then((res) => {
                setAllUname(res.data);
            }).catch((error) => {
                console.log(error)
            })
    }

    React.useEffect(() => {
        getAllUsername()
    }, [])

    const cekUname = (e) => {
        let a = e.target.value;

        if (a != global.username) {
            let idx = allUname.findIndex(val => val == a);

            if (idx != -1) {
                setUnameCheck(false)
            } else {
                setNewUname(a)
                setUnameCheck(true)
            }
        } else {
            setUnameCheck(true)
            setNewUname('')
        }

    }

    const onSubmit = () => {
        setCoba(!coba);
        let formData = new FormData();
        formData.append('data', JSON.stringify({
            fullname: fullname ? fullname : data.fullname,
            username: newUname == false ? global.username : newUname,
            bio: bio ? bio : data.bio,
            idusers: global.idusers
        }));
        formData.append('profpic', profpic ? profpic : global.profilepic);
        Axios.patch(API_URL + '/profile/edit', formData).then((res) => {
            setTimeout(() => {
                if (res.data.success) {
                    dispatch(editProfileAction(res.data.isiProfile));

                    toast({
                        title: 'Edit Profile Success',
                        status: 'success',
                        duration: 3000,
                        isClosable: true
                    });
                    getProfile();
                    getAllUsername();
                }
                setFullname('');
                setBio('');
                setProfpic('');
                setNewUname('');
                setUnameCheck(true);
                setImagePreview('');
                setCoba(coba);
                setAllUname('');

            }, 3000);
        }).catch((err) => {
            setCoba(coba)
            console.log(`Axios patch (editProfile) failed : ${err}`)
        })
    }

    const onImage = (e) => {
        setProfpic(e.target.files[0])
        setImagePreview(URL.createObjectURL(e.target.files[0]));
    };


    return <div>
        <div className="container">
            <div className="row py-2 py-lg-5 my-5">
                <div className="col-12 d-none col-lg-3 d-lg-flex">
                    <div>
                        <Text fontSize='lg'>Edit Profile</Text>
                        <Text fontSize='lg' className="mt-3">Change Password</Text>
                    </div>
                </div>
                <div className="col-12 col-lg-9 align-items-center pe-4 border-start border-lg-secondary">
                    <form className="row g-3">
                        <div className="col-3 me-3 text-end mb-2">
                            <Avatar size='lg' src={
                                imagePreview != ''
                                    ? imagePreview
                                    :
                                    global.profilepic != ''
                                        ?
                                        API_URL + global.profilepic
                                        : 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAAAMFBMVEXFxcX////CwsLGxsb7+/vT09PJycn19fXq6urb29ve3t7w8PDOzs7n5+f5+fnt7e30nlkBAAAFHUlEQVR4nO2dC5qqMAyFMTwUBdz/bq+VYYrKKJCkOfXmXwHna5uTpA+KwnEcx3Ecx3Ecx3Ecx3Ecx3Ecx3Ecx3Ecx3EcA2iO9cdIc5PUdO257y+BU39u66b4HplE3fk6VIcnqmNfl1+gksr6+iIucjl3WYukor7+re6Hoe1y1UhNO3zUd+fUFRmKpOa0Tt6dY5ubRCrOG/QFLk1WGmnt/JxzykcjdZ/jyxJDLlOV2l36AtcsJJb9boG3YcR3DuqODIE3ztYKPkDdmwRmpUToUaSaq++AvRgZMWbOpbQW8hdCAm8ZDugoikzREdCJ2okJPBx6azFLNOwoOgcxojJ98JkaTSJxMpklKrCAKhZGI0drTY/wU5lXoJYibannV9NYy4oozNEAkPHTjop+DTDxVGkIgYJNoyQQJtiIW+EMjGAjm649AjGIaqswcEFQKJ2QPlJbqytki6ZXAAZRJ52J2McaUowzAfs+uFzrYhnzaapphiPWdaJWShqxjqa6kTTQ205TVbsfMa6htL0iYOsXpJrQjHSmCkv1QGPtiHqlYcQ21Gj7fcDU8xOEUuNgSltPzexh+HqFlanCBHZ4OLhCV+gK/3OF6vWvucLv98MUOY2pwu/PS/+D2qJU7pYGbOvDFDW+bbON9p3o3oRxn0bfLgZTgSn6pSfrtr56qLHemtHPTK2319SzGvtjQ9qeb39WgS66Cm073nd0U1PzDdJCO3Gzn6TKpl9Zq7ujGWsQhlA3NwWIMwG9zM08Y/tBrR9VWeczv5CSQuuUNKIUTk23ZJ5RKfVhjnkXotfWIlgX2BSCDYbZR+QTcLhb3dKZDUY2M0d4KWItwhHRah/zsrOgKw4wycwjcgEVcgQDQo23CqSiWEJkFAfod2oE1uIFdA1OsCPqFXYNTjCfb8Ez+iX2x5sKLlVbhtqdDcar9ZevhnbZxoBUD35k23t0d304LYs1ELVbnfFaZ/REJJX9niP8Q19moZGo3m8XR/yBvOnjFfsXcI2c8ZuNo7WMP5HQh6yRGrlmFOJTnyTcT+zRlqPUBI2gTVWNUzUna1ERgecgF4GpNBQ38jGqxVLzQA1A31Rrhk6Yz9QEh/WND0GnuG9huhiTXJkxfAizTHLr6cbJKN6UCU6x/2DTRE1xEeEXi3O0ZUqBN4nJRzHhFB1JPlFTBZlI2kQ8zc3KJ1Le8DIRmFJiknuVS6RK4Ej/JtBfJErDSzOBiY4wJHX6Z1I4v1GUmdCPNirnLLeg3oJLcbX5PcpHNbRvOa1A956QmRPOUXVF+zkaUJynpkYR0bOMJH2nNej1pqyV/aKkz9jr5yj5vrXXz1F5SQLACiMapmierj2ikLyleKdlA/I/2oFxiglxx9B+mHwz0lf34IZQfhDRhlD6bhvgEAoPYooHkTczSIZTLC+cEExsoNKZiGBiY9cCfo/Y/SjIOBMQizWWTe73CMUasJx7jlD+DdKdWUKoY4PRYFtGpO0G1Lx4RaadgTtJhf4fiGqGIwKWCGuGIwKWqP+7IxYCzygjR9IAO5pC7Da9g70TBVpWRNgFBlgT8RV2WxHbKwJMv4BOaEaYaU2K16yZMN/qgV+G7IWIvwyZCxHeDQMsR8wg0DBDDXB5H2EV+hkEGmaoySHQsEJNFoGGFWrAq98JRhUMX1iMMMqLLEIpK5jCbd4vw9nSt/72lewXiN6jmdjfq8Hdknlk92ZwJnbIMMRM7JBhiFlUFoHd1UWaP1QKsPsHA5mkNB+Smn9JqV3wskatnQAAAABJRU5ErkJggg=='
                                    }
                            />
                        </div>
                        <div className="col-8 mb-2">
                            <Text fontSize='xl' className="fw-bold">{data.username}</Text>
                            <Button variant="link" color="#D53F8C" className="fw-bold" onClick={() => setToggle(!toggle)}>Change profile picture</Button>
                        </div>
                        <div className="col-3 me-3 mt-4">
                            <input type="text" readOnly className="form-control-plaintext fw-bold" style={{ textAlign: "right" }} placeholder="Full Name" />
                        </div>
                        <div className="col-8 mt-4">
                            <input type="text" className="form-control" defaultValue={data.fullname} onChange={(e) => setFullname(e.target.value)} placeholder="Full Name" />
                        </div>
                        <div className="col-3 me-3 mt-4">
                            <input type="text" readOnly className="form-control-plaintext fw-bold" style={{ textAlign: "right" }} placeholder="Email" />
                        </div>
                        <div className="col-8 mt-4">
                            <input type="text" className="form-control" defaultValue={global.email} disabled />
                        </div>
                        <div className="col-3 me-3 mt-4">
                            <input type="text" readOnly className="form-control-plaintext fw-bold" style={{ textAlign: "right" }} placeholder="Username" />
                        </div>
                        <div className="col-8 mt-4">
                            <FormControl isInvalid={unameCheck != true}>
                                <Input type="text" className="form-control" defaultValue={data.username} onChange={cekUname} placeholder="Username" />
                                {unameCheck == true ?
                                    (
                                        <div></div>
                                    ) :
                                    (
                                        <FormErrorMessage>
                                            Username is unavailable
                                        </FormErrorMessage>
                                    )
                                }
                            </FormControl>
                        </div>
                        <div className="col-3 me-3 mt-4">
                            <input type="name" readOnly className="form-control-plaintext fw-bold" style={{ textAlign: "right" }} placeholder="Bio" />
                        </div>
                        <div className="col-8 mt-4">
                            <textarea type="text" className="form-control" defaultValue={data.bio} onChange={(e) => setBio(e.target.value)} placeholder="Bio" />
                            {
                                coba ? <Button className="mt-3" colorScheme="pink" variant="solid" onClick={onSubmit} disabled={fullname == false && bio == false && profpic == false && newUname == false || unameCheck == false ? true : false}>Submit</Button>

                                    : <Button colorScheme="pink" variant="solid" className="fw-bold mt-3" disabled><Spinner size='sm' className="me-3" />Submitting</Button>
                            }
                        </div>
                    </form>

                    <Modal isOpen={toggle} onClose={() => setToggle(!toggle)} size='xl'>
                        <ModalOverlay />
                        <ModalContent className="p-3">
                            <ModalHeader style={{ textAlign: "center" }} className="py-4 border-bottom fw-bold">Change Profile Photo</ModalHeader>
                            <ModalBody>
                                <FormControl >
                                    <Image className='shadow-sm' boxSize='100% 50%' margin='auto' objectFit='cover' src={imagePreview}
                                        fallbackSrc={global.profilepic ? API_URL + global.profilepic : 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAAAMFBMVEXFxcX////CwsLGxsb7+/vT09PJycn19fXq6urb29ve3t7w8PDOzs7n5+f5+fnt7e30nlkBAAAFHUlEQVR4nO2dC5qqMAyFMTwUBdz/bq+VYYrKKJCkOfXmXwHna5uTpA+KwnEcx3Ecx3Ecx3Ecx3Ecx3Ecx3Ecx3Ecx3EcA2iO9cdIc5PUdO257y+BU39u66b4HplE3fk6VIcnqmNfl1+gksr6+iIucjl3WYukor7+re6Hoe1y1UhNO3zUd+fUFRmKpOa0Tt6dY5ubRCrOG/QFLk1WGmnt/JxzykcjdZ/jyxJDLlOV2l36AtcsJJb9boG3YcR3DuqODIE3ztYKPkDdmwRmpUToUaSaq++AvRgZMWbOpbQW8hdCAm8ZDugoikzREdCJ2okJPBx6azFLNOwoOgcxojJ98JkaTSJxMpklKrCAKhZGI0drTY/wU5lXoJYibannV9NYy4oozNEAkPHTjop+DTDxVGkIgYJNoyQQJtiIW+EMjGAjm649AjGIaqswcEFQKJ2QPlJbqytki6ZXAAZRJ52J2McaUowzAfs+uFzrYhnzaapphiPWdaJWShqxjqa6kTTQ205TVbsfMa6htL0iYOsXpJrQjHSmCkv1QGPtiHqlYcQ21Gj7fcDU8xOEUuNgSltPzexh+HqFlanCBHZ4OLhCV+gK/3OF6vWvucLv98MUOY2pwu/PS/+D2qJU7pYGbOvDFDW+bbON9p3o3oRxn0bfLgZTgSn6pSfrtr56qLHemtHPTK2319SzGvtjQ9qeb39WgS66Cm073nd0U1PzDdJCO3Gzn6TKpl9Zq7ujGWsQhlA3NwWIMwG9zM08Y/tBrR9VWeczv5CSQuuUNKIUTk23ZJ5RKfVhjnkXotfWIlgX2BSCDYbZR+QTcLhb3dKZDUY2M0d4KWItwhHRah/zsrOgKw4wycwjcgEVcgQDQo23CqSiWEJkFAfod2oE1uIFdA1OsCPqFXYNTjCfb8Ez+iX2x5sKLlVbhtqdDcar9ZevhnbZxoBUD35k23t0d304LYs1ELVbnfFaZ/REJJX9niP8Q19moZGo3m8XR/yBvOnjFfsXcI2c8ZuNo7WMP5HQh6yRGrlmFOJTnyTcT+zRlqPUBI2gTVWNUzUna1ERgecgF4GpNBQ38jGqxVLzQA1A31Rrhk6Yz9QEh/WND0GnuG9huhiTXJkxfAizTHLr6cbJKN6UCU6x/2DTRE1xEeEXi3O0ZUqBN4nJRzHhFB1JPlFTBZlI2kQ8zc3KJ1Le8DIRmFJiknuVS6RK4Ej/JtBfJErDSzOBiY4wJHX6Z1I4v1GUmdCPNirnLLeg3oJLcbX5PcpHNbRvOa1A956QmRPOUXVF+zkaUJynpkYR0bOMJH2nNej1pqyV/aKkz9jr5yj5vrXXz1F5SQLACiMapmierj2ikLyleKdlA/I/2oFxiglxx9B+mHwz0lf34IZQfhDRhlD6bhvgEAoPYooHkTczSIZTLC+cEExsoNKZiGBiY9cCfo/Y/SjIOBMQizWWTe73CMUasJx7jlD+DdKdWUKoY4PRYFtGpO0G1Lx4RaadgTtJhf4fiGqGIwKWCGuGIwKWqP+7IxYCzygjR9IAO5pC7Da9g70TBVpWRNgFBlgT8RV2WxHbKwJMv4BOaEaYaU2K16yZMN/qgV+G7IWIvwyZCxHeDQMsR8wg0DBDDXB5H2EV+hkEGmaoySHQsEJNFoGGFWrAq98JRhUMX1iMMMqLLEIpK5jCbd4vw9nSt/72lewXiN6jmdjfq8Hdknlk92ZwJnbIMMRM7JBhiFlUFoHd1UWaP1QKsPsHA5mkNB+Smn9JqV3wskatnQAAAABJRU5ErkJggg=='} alt='add-product' />
                                    <FormLabel className="mt-4 fw-bold">Profile Picture</FormLabel>
                                    <Input type='file' onChange={onImage} />
                                </FormControl>
                            </ModalBody>
                            <ModalFooter>
                                {
                                    coba ?
                                        <div className="d-flex">
                                            <Button colorScheme="gray" variant="solid" className="fw-bold me-2" onClick={() => setToggle(!toggle)} size='lg' >Cancel</Button>
                                            <Button colorScheme="pink" variant="solid" className="fw-bold" onClick={() => setToggle(!toggle)} size='lg' >OK</Button>
                                        </div>
                                        :
                                        <div className="d-flex">
                                            <Button colorScheme="gray" variant="solid" className="fw-bold me-2" disabled >Cancel</Button>
                                            <Button colorScheme="pink" variant="solid" className="fw-bold" disabled><Spinner size='sm' className="me-3" />Uploading</Button>
                                        </div>
                                }
                            </ModalFooter>
                        </ModalContent>
                    </Modal>

                </div>
            </div>
        </div>
    </div>
}

export default EditProfilePage;
