import { Delete, Edit, Email, Facebook, Instagram, Key, Notes, Person, Rtt, Twitter, Visibility, VisibilityOff } from "@mui/icons-material"
import { Alert, Box, Button, Divider, FormControl, FormHelperText, Grid, IconButton, Input, InputAdornment, InputLabel, Modal, Stack, Typography } from "@mui/material"
import React, { useCallback, useEffect, useRef, useState } from "react"
import usersValidations from '../helpers/usersValidations'
import axiosInstance from "../config/axiosConfig"
import { Navigate } from "react-router-dom"

const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: "50%",
    backgroundColor: '#FFFFFF',
    border: '1px solid #000',
    boxShadow: 24,
};

const USERNAME_INFO = "Your username should be at least 6 character long and should contain alphabets and number."
const PASSWORD_INFO = "Your password should be at least 8 character long and should contain at least one uppercase, one lowercase, one number and one special character."
const IMAGE_PATH = "http://localhost:4000/uploads/images/"
function MyProfile() {

    const txtInputFile = useRef(null)

    const [isPasswordSet, setIsPasswordSet] = useState(false)

    const [passwordModalState, setPasswordModalState] = useState(false)
    const handlePasswordModalStateOpen = () => setPasswordModalState(true)
    const handlePasswordModalStateClose = () => {
        resetPasswordFields()
        setPasswordModalState(false)
    }

    const [showCurrentPassword, setShowCurrentPassword] = useState()
    const [showPassword, setShowPassword] = useState()
    const [showConfirmPassword, setShowConfirmPassword] = useState()

    const [image, setImage] = useState(null)
    const [imageError, setImageError] = useState(null)
    const [firstName, setFirstName] = useState("")
    const [txtFirstnameError, setTxtFirstNameError] = useState(null)
    const [lastName, setLastName] = useState("")
    const [txtLastNameError, setTxtLastNameError] = useState(null)
    const [bio, setBio] = useState("")
    const [txtBioError, setTxtBioError] = useState(null)
    const [email, setEmail] = useState("")
    const [txtEmailError, setTxtEmailError] = useState(null)
    const [username, setUsername] = useState("")
    const [txtUsernameError, setTxtUsernameError] = useState(null)
    const [currentPassword, setCurrentPassword] = useState("")
    const [txtCurrentPasswordError, setTxtCurrentPasswordError] = useState(null)
    const [newPassword, setNewPassword] = useState("")
    const [txtNewPasswordError, setTxtNewPasswordError] = useState(null)
    const [confirmPassword, setConfirmPassword] = useState("")
    const [txtConfirmPasswordSuccess, setTxtConfirmPasswordSuccess] = useState(null)
    const [txtConfirmPasswordError, setTxtConfirmPasswordError] = useState(null)
    const [fbLink, setFBLink] = useState("")
    const [txtFBLinkError, setTxtFBLinkError] = useState(null)
    const [igLink, setIGLink] = useState("")
    const [txtIGLinkError, setTxtIGLinkError] = useState(null)
    const [twitterLink, setTwitterLink] = useState("")
    const [txtTwitterLinkError, setTxtTwitterLinkError] = useState(null)
    const [otherError, setOtherError] = useState("")
    const [successMessage, setSuccessMessage] = useState("")
    const [otherPasswordsError, setOtherPasswordsError] = useState("")
    const [apiCallState, setApiCallState] = useState({loading: false, data: null, error: null, navigateToLogin: false})

    const handleFirstNameChange = useCallback((event) => {
        setFirstName(event.target.value)
    }, [setFirstName])

    const handleLastNameChange = useCallback((event) => {
        setLastName(event.target.value)
    }, [setLastName])

    const handleBioChange = useCallback((event) => {
        setBio(event.target.value)
    }, [setBio])

    const handleEmailChange = useCallback((event) => {
        setEmail(event.target.value)
    }, [setEmail])

    const handleUsernameChange = useCallback((event) => {
        setUsername(event.target.value)
    }, [setUsername])

    const handleCurrentPasswordChange = useCallback((event) => {
        setCurrentPassword(event.target.value)
    },[setCurrentPassword])

    const handleNewPasswordChange = useCallback((event) => {
        setNewPassword(event.target.value)
        checkPasswordEquality(event.target.value, confirmPassword)
    }, [setNewPassword, confirmPassword])

    const handleConfirmPasswordChange = useCallback((event) => {
        setConfirmPassword(event.target.value)
        checkPasswordEquality(newPassword, event.target.value)
    }, [setConfirmPassword, newPassword])

    const handleFbLinkChange = useCallback((event) => {
        setFBLink(event.target.value)
    }, [setFBLink])

    const handleIGLinkChange = useCallback((event) => {
        setIGLink(event.target.value)
    }, [setIGLink])

    const handleTwitterLinkChange = useCallback((event) => {
        setTwitterLink(event.target.value)
    }, [setTwitterLink])

    useEffect(()=>{loadData()},[])
    async function loadData() {
        setApiCallState({...apiCallState, loading:true})
        try {
            const response = await axiosInstance.get("/myprofile")
            if(response.data){
                fillData(response.data)
            }
        } catch (exception) {  
            setApiCallState({...apiCallState, loading:false})
            if(exception.response && exception.response.data) {
                let errorData = exception.response.data
                if(errorData.sessionExpired){
                    localStorage.removeItem("token")
                    setApiCallState({...apiCallState, navigateToLogin:true})
                } else {
                    showErrorData(errorData)
                }
            } else {
                showErrorData({other: "Could not load your information at this moment please try after some time."})
            }
        }
    }

    function fillData(data) {
        setApiCallState({...apiCallState, loading: false, data: data})
        setFirstName(data.firstName)
        setLastName(data.lastName)
        setBio(data.bio)
        setImage(`${IMAGE_PATH}${data.image}`)
        setEmail(data.email)
        setUsername(data.username)
        setFBLink(data.fbLink)
        setIGLink(data.igLink)
        setTwitterLink(data.twitterLink)
        setIsPasswordSet(data.isPasswordSet)

        resetPasswordFields()
    }

    function resetPasswordFields(){
        setCurrentPassword("")
        setNewPassword("")
        setConfirmPassword("")
        setTxtCurrentPasswordError(null)
        setTxtNewPasswordError(null)
        setTxtConfirmPasswordError(null)
        setTxtConfirmPasswordSuccess(null)
    }

    function openFileOpener(event) {
        txtInputFile.current.click()
    }
    
    function deleteProfilePicture() {
        setImage(null)
    }

    function showChangedImage(event) {
        if(event.target.files && event.target.files[0]) {
            setImage(URL.createObjectURL(event.target.files[0]))
        } else {
            setImage(null)
        }
    }

    function toggleCurrentPasswordVisibility() {
        setShowCurrentPassword((show) => !show)
    }   

    function togglePasswordVisibility() {
        setShowPassword((show) => !show)
    }

    function toggleConfirmPasswordVisibility() {
        setShowConfirmPassword((show) => !show)
    }

    function checkPasswordEquality(_password, _confirmPassword) {
        if(!_confirmPassword) return
        if(_confirmPassword.length === 0) return
        if(_password === _confirmPassword) {
            setTxtConfirmPasswordError("")
            setTxtConfirmPasswordSuccess("Password match")
        } else {    
            setTxtConfirmPasswordSuccess("")
            setTxtConfirmPasswordError("Confirm password do not match with new password.")
        }
    }

    function performChangePasswordOp() {
        let errors = {}
        let isDataValid = false
        try {
            usersValidations.checkChangePasswords(currentPassword, newPassword, confirmPassword, errors)
            isDataValid = true
        } catch(exception) {
            showPasswordErrorData(exception)
        }

        if(isDataValid) {
            makeChangePasswordApiCall()
        } 
    }

    function performSetPasswordOp() {
        let errors = {}
        let isDataValid = false
        try {
            usersValidations.checkSetPasswords(newPassword, confirmPassword, errors)
            isDataValid = true
        } catch(exception) {
            showPasswordErrorData(exception)
        }

        if(isDataValid) {
            makeSetPasswordApiCall()
        }
    }

    function handlePasswordUpdateClick() {
        if(isPasswordSet) {
            performChangePasswordOp()
        } else {
            performSetPasswordOp()
        }
    }
    
    async function makeUpdateProfileInfoApiCall() {
        setApiCallState({...apiCallState, loading: true})
        try {
            let formData = createFormData()
        } catch(exception) {

        }
    }

    async function makeChangePasswordApiCall() {
        setApiCallState({...apiCallState, loading: true})
        try {
            let response = await axiosInstance.patch("/myprofile/changePassword", {
                currentPassword: currentPassword,
                newPassword: newPassword,
                confirmPassword: confirmPassword
            })
            setApiCallState({...apiCallState, loading:false})
            if(response && response.data) {
                let user = response.data
                handlePasswordModalStateClose()
                setSuccessMessage("Password updated successfully.")
                fillData(user)
            }
        } catch(exception) {
            setApiCallState({...apiCallState, loading:false})
            if(exception.response && exception.response.data) {
                let errorData = exception.response.data
                if(errorData.sessionExpired){
                    localStorage.removeItem("token")
                    setApiCallState({...apiCallState, navigateToLogin:true})
                } else {
                    showPasswordErrorData(errorData)
                }
            } else {
                showPasswordErrorData({otherPasswords: "Could not change your password at this moment. Please try after some time."})
            }
        }
    }

    async function makeSetPasswordApiCall() {
        setApiCallState({...apiCallState, loading: true})
        try {
            let response = await axiosInstance.patch("/myprofile/setPassword", {
                newPassword: newPassword,
                confirmPassword: confirmPassword
            })
            setApiCallState({...apiCallState, loading:false})
            if(response && response.data) {
                let user = response.data
                handlePasswordModalStateClose()
                setSuccessMessage("Password updated successfully.")
                fillData(user)
            }
        } catch(exception) {
            setApiCallState({...apiCallState, loading:false})
            if(exception.response && exception.response.data) {
                let errorData = exception.response.data
                if(errorData.sessionExpired){
                    localStorage.removeItem("token")
                    setApiCallState({...apiCallState, navigateToLogin:true})
                } else {
                    showPasswordErrorData(errorData)
                }
            } else {
                showPasswordErrorData({otherPasswords: "Could not set your password at this moment. Please try after some time."})
            }
        }
    }

    function handleSubmit(event) {
        event.preventDefault()
        let errors = {}
        let isDataValid = false
        try {
            usersValidations.validateMyProfileData(image, firstName, lastName, bio, email, username, fbLink, igLink, twitterLink, errors)
            isDataValid = true
        } catch(exception) {
            showErrorData(exception)
        }
        if(isDataValid) {
            makeUpdateProfileInfoApiCall()
        }
    }

    function showErrorData(errors) {
        setImageError(errors.profilePicture)
        setTxtFirstNameError(errors.firstName)
        setTxtLastNameError(errors.lastName)
        setTxtBioError(errors.bio)
        setTxtEmailError(errors.email)
        setTxtUsernameError(errors.username)
        setTxtFBLinkError(errors.fbLink)
        setTxtIGLinkError(errors.igLink)
        setTxtTwitterLinkError(errors.twitterLink)
        setOtherError(errors.other)
    }

    function showPasswordErrorData(errors) {
        setTxtCurrentPasswordError(errors.currentPassword)
        setTxtNewPasswordError(errors.newPassword)
        setTxtConfirmPasswordError(errors.confirmPassword)
        setOtherPasswordsError(errors.otherPasswords)
    }

    function createFormData(){
        let formData = new FormData()
        formData.append("firstName", firstName)
        formData.append("lastName", lastName)
        formData.append("bio", bio)
        formData.append("email", email)
        formData.append("username", username)
        formData.append("fbLink", fbLink)
        formData.append("igLink", igLink)
        formData.append("twitterLink", twitterLink)
        // TODO match server image and uploaded image then add image to server
        return formData
    }

    function getText(_isPasswordSet){
        if(apiCallState.loading && _isPasswordSet){
            return "Changing Password."
        } else if(apiCallState.loading && !_isPasswordSet) {
            return "Setting Password"
        } else if(_isPasswordSet) {
            return "Change"
        } else {
            return "Set"
        }
    }

    let token = localStorage.getItem("token")
    if(!token) {
        return <Navigate to="/auth/login"/>
    }

    if(apiCallState.navigateToLogin) {
        return <Navigate to="/auth/login"/>
    }

    return (
        <Grid container sx={{mt:3, mb:5}}>
            <Grid item xs={3}></Grid>
            <Grid item xs={6}>
                <Grid item xs={12}>
                    <Typography variant="h4" component="h1">My Profile</Typography>
                    { otherError && <Alert severity="error" sx={{mt:3}}>{otherError}</Alert> }
                    { successMessage && <Alert severity="success" sx={{mt:3}}>{successMessage}</Alert> }
                    { apiCallState.loading && <Alert severity="info" sx={{mt:3}}>Loading your data</Alert> }
                </Grid>
                <form onSubmit={handleSubmit}>
                    <Grid container sx={{mt:5,direction:"column", alignItems:"center", justifyContent:"center"}}>
                        <Box
                            sx={{
                                borderRadius:"50%",
                                width:"192px", 
                                height:"192px",
                                display:"block",
                                position:"relative"
                            }}>
                            <Box 
                                component="img" 
                                src={image} 
                                sx={{borderRadius:"50%", width:"192px", height:"192px"}}
                                style={{background: "url(/preview.jpeg) no-repeat scroll 0 0"}}/>
                            <Box 
                                sx={{
                                    background:"linear-gradient(0deg, rgba(0,0,0,.8), rgba(0,0,0,0) 85%)",
                                    width:"100%",
                                    height:"100%",
                                    borderRadius:"50%",
                                    top:"0",
                                    left:"0",
                                    position:"absolute",
                                }} display="flex" flexDirection="column" justifyContent="flex-end" textAlign="center">
                                    <input type="file" name="profilePicture" ref={txtInputFile} style={{display: 'none'}} onChange={showChangedImage} accept="image/png, image/jpeg, image/jpg"/>
                                    <Stack
                                        direction="row"
                                        justifyContent="center"
                                        alignItems="center" 
                                        spacing={1}>
                                        <IconButton
                                            sx={{mb:0, color:"white", "&:hover":{backgroundColor:"transparent"}}}
                                            aria-label="Change profile picture"
                                            onClick={openFileOpener}>
                                            <Edit/>
                                        </IconButton>
                                        <IconButton
                                            sx={{mb:0, color:"white", "&:hover":{backgroundColor:"transparent"}}}
                                            aria-label="Delete profile picture"
                                            onClick={deleteProfilePicture}>
                                            <Delete/>
                                        </IconButton>
                                        
                                    </Stack>
                                    {/* <Button variant="text" onClick={openFileOpener} sx={{mb:0, color:"white", "&:hover":{backgroundColor:"transparent"}}}>Update</Button> */}
                            </Box>
                        </Box>
                        <Typography variant="caption" sx={{color:"#FF0000"}}>{imageError ? imageError : ""}</Typography>
                    </Grid>
                    <Grid container spacing={2} sx={{mt:3}}>
                        <Grid item xs={6} >
                            <FormControl sx={{width:"100%"}} error={txtFirstnameError}>
                                <InputLabel htmlFor="firstName">First name</InputLabel>
                                <Input 
                                    value={firstName}
                                    onChange={handleFirstNameChange}
                                    aria-describedby="firstNameInfo"
                                    id="firstName" 
                                    fullWidth={true} 
                                    startAdornment={
                                        <InputAdornment position="start">
                                            <Person></Person>
                                        </InputAdornment>
                                }/>
                                <FormHelperText id="firstNameInfo">{txtFirstnameError}</FormHelperText>
                            </FormControl>
                        </Grid>
                        <Grid item xs={6}>
                        <FormControl sx={{width:"100%"}} error={txtLastNameError}>
                                <InputLabel htmlFor="lastName">Last name</InputLabel>
                                <Input 
                                    value={lastName}
                                    onChange={handleLastNameChange}
                                    aria-describedby="lastNameInfo"
                                    id="lastName" 
                                    fullWidth={true} 
                                    startAdornment={
                                        <InputAdornment position="start">
                                            <Person></Person>
                                        </InputAdornment>
                                }/>
                                <FormHelperText id="lastNameInfo">{txtLastNameError}</FormHelperText>
                            </FormControl>
                        </Grid>
                    </Grid>
                    <Grid item xs={12} sx={{mt:3}}>
                        <FormControl sx={{width:"100%"}} error={txtBioError}>
                            <InputLabel htmlFor="bio">Bio</InputLabel>
                            <Input 
                                value={bio}
                                onChange={handleBioChange}
                                aria-describedby="bioInfo"
                                rows={3}
                                id="bio"
                                fullWidth={true}
                                startAdornment = {
                                    <InputAdornment position="start">
                                        <Notes></Notes>
                                    </InputAdornment>
                                }/>
                                <FormHelperText id="bioInfo">{txtBioError}</FormHelperText>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} sx={{mt:3}} error={txtEmailError}>
                        <FormControl sx={{width:"100%"}} >
                            <InputLabel htmlFor="email">Email Address</InputLabel>
                            <Input 
                                value={email}
                                onChange={handleEmailChange}
                                disabled={true}
                                aria-describedby="emailInfo"
                                id="email" 
                                type="email" 
                                fullWidth={true} 
                                startAdornment={
                                    <InputAdornment position="start">
                                        <Email></Email>
                                    </InputAdornment>
                            }/>
                            <FormHelperText id="emailInfo">{txtEmailError}</FormHelperText>
                        </FormControl>
                    </Grid>
                    <Grid container spacing={2} sx={{mt:3}}>
                        <Grid item xs={7}>
                            <FormControl sx={{width:"100%"}} error={txtUsernameError}>
                                <InputLabel htmlFor="username">Username</InputLabel>
                                <Input
                                    value={username}
                                    onChange={handleUsernameChange}
                                    aria-describedby="usernameInfo"
                                    id="username"
                                    type="text"
                                    fullWidth={true}
                                    startAdornment= {
                                        <InputAdornment position="start">
                                            <Person></Person>
                                        </InputAdornment>
                                    }/>
                                    <FormHelperText id="usernameInfo">{txtUsernameError}</FormHelperText>
                                    <FormHelperText id="usernameInstruction">{USERNAME_INFO}</FormHelperText>
                            </FormControl>
                        </Grid>
                        <Grid item xs={5}>
                            <Button
                                variant="contained"
                                fullWidth={true}
                                id="btnPassword"
                                type="button"
                                onClick={handlePasswordModalStateOpen}>
                                    {isPasswordSet ? "Change Password" : "Set Password"}
                            </Button>
                        </Grid>
                    </Grid>
                    <Grid item xs={12} sx={{mt:3}}>
                        <FormControl sx={{width:"100%"}} error={txtFBLinkError}>
                            <InputLabel htmlFor="facebookLink">Facebook profile link</InputLabel>
                            <Input
                                value={fbLink}
                                onChange={handleFbLinkChange}
                                aria-describedby="facebookInfo"
                                id="facebookLink"
                                type="url"
                                fullWidth={true}
                                startAdornment={
                                    <InputAdornment position="start">
                                        <Facebook></Facebook>
                                    </InputAdornment>
                                }/>
                                <FormHelperText id="facebookInfo">{txtFBLinkError}</FormHelperText>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} sx={{mt:3}}>
                        <FormControl sx={{width:"100%"}} error={txtIGLinkError}>
                            <InputLabel htmlFor="instagramLink">Instagram profile link</InputLabel>
                            <Input
                                value={igLink}
                                onChange={handleIGLinkChange}
                                aria-describedby="instagramInfo"
                                id="instagramLink"
                                type="url"
                                fullWidth={true}
                                startAdornment={
                                    <InputAdornment position="start">
                                        <Instagram></Instagram>
                                    </InputAdornment>
                                }/>
                                <FormHelperText id="instagramInfo">{txtIGLinkError}</FormHelperText>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} sx={{mt:3}}>
                        <FormControl sx={{width:"100%"}} error={txtTwitterLinkError}>
                            <InputLabel htmlFor="twitterLink">Twitter profile link</InputLabel>
                            <Input
                                value={twitterLink}
                                onChange={handleTwitterLinkChange}
                                aria-describedby="twitterInfo"
                                id="twitterLink"
                                type="url"
                                fullWidth={true}
                                startAdornment={
                                    <InputAdornment position="start">
                                        <Twitter></Twitter>
                                    </InputAdornment>
                                }/>
                                <FormHelperText id="twitterInfo">{txtTwitterLinkError}</FormHelperText>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} sx={{mt:5}}>
                        <Button
                            type="submit"
                            variant="contained"
                            fullWidth={true}>
                                Update information
                        </Button>
                    </Grid>
                </form>
            </Grid>
            <Grid item xs={3}></Grid>
            <Modal
                open={passwordModalState}
                onClose={handlePasswordModalStateClose}>
                <Box style={modalStyle} sx={{p:4}}>
                    <Typography id="modal-modal-title" variant="h6" component="h2">
                        { isPasswordSet ? "Change Password" : "Set Password"}
                    </Typography>
                    <Typography id="modal-modal-description" variant="subtitle1">
                        { isPasswordSet ? 
                            "Update your current password." :
                            "Set your new password so you can login with your email and password only."
                        }
                    </Typography>
                    { otherPasswordsError && <Alert severity="error" sx={{mt:3}}>{otherPasswordsError}</Alert> }
                    <Divider sx={{mt:1}} />
                    <Grid container>
                        {isPasswordSet && 
                            <Grid item xs={12} sx={{mt:3}}>
                                <FormControl sx={{width:"100%"}} error={txtCurrentPasswordError}>
                                    <InputLabel htmlFor="currentPassword">Current Password</InputLabel>
                                    <Input
                                        value={currentPassword}
                                        onChange={handleCurrentPasswordChange}
                                        aria-describedby="currentPasswordInfo"
                                        id="currentPassword"
                                        fullWidth={true}
                                        type={showCurrentPassword ? "text" : "password"}
                                        startAdornment= {
                                            <InputAdornment position="start">
                                                <Key></Key>
                                            </InputAdornment>
                                        }
                                        endAdornment={
                                            <InputAdornment position="end">
                                                <IconButton
                                                    aria-label="current password visibility"
                                                    onClick={toggleCurrentPasswordVisibility}>
                                                        {showCurrentPassword ? <VisibilityOff/> : <Visibility/>}
                                                    </IconButton>
                                            </InputAdornment>
                                        }/>
                                        <FormHelperText id="currentPasswordInfo">{txtCurrentPasswordError ? txtCurrentPasswordError : ""}</FormHelperText>
                                </FormControl>
                            </Grid>
                        }
                        
                        <Grid item xs={12} sx={{mt:3}}>
                            <FormControl sx={{width:"100%"}} error={txtNewPasswordError}>
                                <InputLabel htmlFor="password">New password</InputLabel>
                                <Input
                                    value={newPassword}
                                    onChange={handleNewPasswordChange}
                                    aria-describedby="passwordInfo"
                                    id="password"
                                    fullWidth={true}
                                    type={showPassword ? "text" : "password"}
                                    startAdornment={
                                        <InputAdornment position="start">
                                            <Key></Key>
                                        </InputAdornment>
                                    }
                                    endAdornment={
                                        <InputAdornment position="end">
                                            <IconButton 
                                                aria-label="password visibility"
                                                onClick={togglePasswordVisibility}>
                                                {showPassword ? <VisibilityOff/> : <Visibility/>}
                                            </IconButton>
                                        </InputAdornment>
                                }/>
                                <FormHelperText id="passwordInfo">{txtNewPasswordError ? txtNewPasswordError : ""}</FormHelperText>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sx={{mt:3}}>
                            <FormControl sx={{width:"100%"}} error={txtConfirmPasswordError}>
                                <InputLabel htmlFor="confirmPassword">Confirm password</InputLabel>
                                <Input
                                    value={confirmPassword}
                                    onChange={handleConfirmPasswordChange}
                                    aria-describedby="confirmPasswordInfo"
                                    id="confirmPassword"
                                    fullWidth={true}
                                    type={showConfirmPassword ? "text" : "password"}                               
                                    startAdornment={
                                        <InputAdornment position="start">
                                            <Key></Key>
                                        </InputAdornment>
                                    }
                                    endAdornment={
                                        <InputAdornment position="end">
                                            <IconButton 
                                                aria-label="password visibility"
                                                onClick={toggleConfirmPasswordVisibility}>
                                                {showConfirmPassword ? <VisibilityOff/> : <Visibility/>}
                                            </IconButton>
                                        </InputAdornment>
                                }/>
                                {txtConfirmPasswordSuccess && <FormHelperText id="confirmPasswordInfo" sx={{color:"green"}}>Password match</FormHelperText>}
                                <FormHelperText id="confirmPasswordInfo">{txtConfirmPasswordError ? txtConfirmPasswordError : ""}</FormHelperText>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sx={{mt:3}}>
                            <Typography variant="caption">{PASSWORD_INFO}</Typography>
                        </Grid>
                        <Grid item xs={12} sx={{mt:3}}>
                            <Box
                                m={1}
                                display="flex"
                                justifyContent="space-between"
                                alignItems="center">
                                    <Button variant="text" onClick={handlePasswordModalStateClose}>Cancel</Button>
                                    <Button variant="contained" onClick={handlePasswordUpdateClick} disabled={apiCallState.loading}>{getText(isPasswordSet)}</Button>
                            </Box>
                        </Grid>
                    </Grid>
                </Box>
            </Modal>
        </Grid>
    )
}
export default MyProfile