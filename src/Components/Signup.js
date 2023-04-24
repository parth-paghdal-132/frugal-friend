import { Email, Key, Person, Visibility, VisibilityOff } from "@mui/icons-material"
import { Alert, Button, Divider, FormControl, FormHelperText, Grid, IconButton, Input, InputAdornment, InputLabel, Typography } from "@mui/material"
import React, { useCallback, useState } from "react";
import { NavLink, useNavigate, Navigate } from "react-router-dom"
import authValidations from "../helpers/authValidations"
import axiosInstance from "../config/axiosConfig"
import { GoogleAuthProvider, signInWithPopup, signOut, getAuth } from "firebase/auth";
import fireabseApp from '../firebase/Firebase'

const USERNAME_INFO = "Your username should be at least 6 character long and should contain alphabets and number."
const PASSWORD_INFO = "Your password should be at least 8 character long and should contain at least one uppercase, one lowercase, one number and one special character."
const SIGNUP_SOURCE_APP = "app"
const SIGNUP_SOURCE_GOOGLE = "google"

const provider = new GoogleAuthProvider()
const auth = getAuth(fireabseApp)

function Signup(){

    const navigate = useNavigate()
    
    const [showPassword, setShowPassword] = useState()
    const [showConfirmPassword, setShowConfirmPassword] = useState()

    const [firstName, setFirstName] = useState("")
    const [txtFirstNameError, setTxtFirstNameError] = useState(null)
    const [lastName, setLastName] = useState("")
    const [txtLastnameError, setTxtLastNameError] = useState(null)
    const [email, setEmail] = useState("")
    const [txtEmailError, setTxtEmailError] = useState(null)
    const [username, setUsername] = useState("")
    const [txtUsernameError, setTxtUsernameError] = useState(null)
    const [password, setPassword] = useState("")
    const [txtPasswordError, setTxtPasswordError] = useState(null)
    const [confirmPassword, setConfirmPassword] = useState("")
    const [txtConfirmaPasswordSuccess, setTxtConfirmaPasswordSuccess] = useState(null)
    const [txtConfirmPasswordError, setTxtConfirmPasswordError] = useState(null)
    const [otherError, setOtherError] = useState("")

    const [apiCallState, setApiCallState] = useState({loading: false, data: null, error: null, navigateToLogin: false})

    const handleFirstNameChange = useCallback((event) => {
        setFirstName(event.target.value);
    }, [setFirstName]);
 
    const handleLastNameChange = useCallback((event) => {
        setLastName(event.target.value)
    }, [setLastName])

    const handleEmailChange = useCallback((event) => {
        setEmail(event.target.value)
    }, [setEmail])

    const handleUsernameChange = useCallback((event) => {
        setUsername(event.target.value)
    }, [setUsername])

    const handlePasswordChange = useCallback((event) => {
        setPassword(event.target.value)
        checkPasswordEquality(event.target.value, confirmPassword)
    }, [setPassword, confirmPassword])

    const handleConfirmPasswordChange = useCallback((event) => {
        setConfirmPassword(event.target.value)
        checkPasswordEquality(password, event.target.value)
    }, [setConfirmPassword, password])

    function togglePasswordVisibility(){
        setShowPassword((show) => !show)
    }

    function toggleConfirmPasswordVisibility() {
        setShowConfirmPassword((show) => !show)
    }

    function handleSubmit(event) {
        if(apiCallState.loading) return
        event.preventDefault()
        let errors = {}
        let isDataValid = false
        try{
            authValidations.validateCreateUserData(firstName, lastName, email, username, password, confirmPassword, errors)
            isDataValid = true
        } catch(exception){
            showErrorData(exception)
        }
        if(isDataValid) {
            makeCreateUserApiCall()
        }
    }

    async function makeCreateUserApiCall() {
        setApiCallState({...apiCallState, loading:true})
        try {
            const response = await axiosInstance.post("auth/signup",{
                firstName: firstName,
                lastName: lastName,
                email: email,
                username: username,
                password: password,
                confirmPassword: confirmPassword,
                source: SIGNUP_SOURCE_APP
            })
            setApiCallState({...apiCallState, loading:false})
            if(response.status === 200) {
                if(response.data.email) {
                    setApiCallState({...apiCallState, navigateToLogin: true, data: response.data})
                } else {
                    showErrorData({other: "Could not create user at this moment please try after some time."})
                }
            }
        } catch(exception) {
            setApiCallState({...apiCallState, loading:false})
            if(exception.response && exception.response.data){
                showErrorData(exception.response.data)
            } else {
                showErrorData({other: "Could not create user at this moment please try after some time."})
            }
        }
    }

    function showErrorData(errors) {
        setTxtFirstNameError(errors.firstName)
        setTxtLastNameError(errors.lastName)
        setTxtEmailError(errors.email)
        setTxtUsernameError(errors.username)
        setTxtPasswordError(errors.password)
        if(errors.confirmPassword) {
            setTxtConfirmaPasswordSuccess("")
            setTxtConfirmPasswordError(errors.confirmPassword)
        }
        setOtherError(errors.other)
    }

    function checkPasswordEquality(_password, _confirmPassword) {
        if(!_confirmPassword) return
        if(_confirmPassword.length === 0) return
        if(_password === _confirmPassword) {
            setTxtConfirmPasswordError("")
            setTxtConfirmaPasswordSuccess("Password match")
        } else {    
            setTxtConfirmaPasswordSuccess("")
            setTxtConfirmPasswordError("Confirm password do not match with password.")
        }
    }

    async function makeAuthenticateUserApiCall(email, password, displayName, source) {
        setApiCallState({...apiCallState, loading:true})
        try {
            const response = await axiosInstance.post("auth/login",{
                email: email,
                password: password,
                displayName: displayName,
                source: source
            })
            setApiCallState({...apiCallState, loading:false})
            if(response.status === 200) {
                if(response.data.email) {
                    setUserToLocalStorage(response.data)
                    setApiCallState({...apiCallState, data: response.data})
                    navigate("/", { replace: true }, 1)
                } else {
                    showErrorData({other: "Could not log you in at this moment please try after some time."})
                    signOut(auth)
                }
            }
        } catch(exception) {
            setApiCallState({...apiCallState, loading:false})
            signOut(auth)
            if(exception.response && exception.response.data){
                showErrorData(exception.response.data)
            } else {
                showErrorData({other: "Could not log you in at this moment please try after some time."})
            }
        }
    }

    async function loginWithGoogle(){
        try {
            let result = await signInWithPopup(auth, provider)
            if(result.user){
                makeAuthenticateUserApiCall(result.user.email, null, result.user.displayName, SIGNUP_SOURCE_GOOGLE)
            } else {
                showErrorData({other: "Could not log you in at this moment please try after some time."})
            }
        } catch(exception) {
            showErrorData({other: "Could not log you in at this moment please try after some time."})
        }
    }

    function setUserToLocalStorage(user) {
        localStorage.setItem("token", user.token)
        localStorage.setItem("user", JSON.stringify(user))
        window.dispatchEvent(new Event("storage"))
    }

    const token = localStorage.getItem("token")
    if(token) {
        return <Navigate to="/"/>
    }

    if(apiCallState.navigateToLogin) {
        console.log(apiCallState.data)
        return <Navigate to="/auth/login" state={{email: apiCallState.data.email}}/>
    }

    return (
        <Grid container
            alignItems="center"
            justifyContent="center"
            style={{ minHeight: '100vh' }}
            sx={{mt:5, mb:5}}>
            <Grid item xs={5} sx={{border:1, borderColor:'primary.light', borderRadius:"5%", p:3}}>
                <form onSubmit={handleSubmit}>
                    <Grid container>
                        <Grid item xs={12}>
                            <Typography variant="h4">Signup</Typography>
                            {otherError &&
                                <Alert severity="error" sx={{mt:3}}>{otherError}</Alert>
                            }
                        </Grid>
                        <Grid container spacing={2}>
                            <Grid item xs={6} sx={{mt:4}}>
                                <FormControl sx={{width:"100%"}} error={txtFirstNameError}>
                                    <InputLabel htmlFor="firstName">First name</InputLabel>
                                    <Input 
                                        value={firstName} 
                                        onChange={handleFirstNameChange}
                                        aria-describedby="firstNameInfo"
                                        id="firstName" 
                                        fullWidth="true" 
                                        startAdornment={
                                            <InputAdornment position="start">
                                                <Person></Person>
                                            </InputAdornment>
                                    }/>
                                    <FormHelperText id="firstNameInfo">{txtFirstNameError}</FormHelperText>
                                </FormControl>
                            </Grid>
                            <Grid item xs={6} sx={{mt:4}}>
                                <FormControl sx={{width:"100%"}} error={txtLastnameError}>
                                    <InputLabel htmlFor="lastName">Last name</InputLabel>
                                    <Input 
                                        value={lastName}
                                        onChange={handleLastNameChange}
                                        aria-describedby="lastNameInfo"
                                        id="lastName"
                                        fullWidth="true" 
                                        startAdornment={
                                            <InputAdornment position="start">
                                                <Person></Person>
                                            </InputAdornment>
                                    }/>
                                    <FormHelperText id="lastNameInfo">{txtLastnameError}</FormHelperText>
                                </FormControl>
                            </Grid>
                        </Grid>
                        <Grid item xs={12} sx={{mt:3}}>
                            <FormControl sx={{width:"100%"}} error={txtEmailError}>
                                <InputLabel htmlFor="email">Email Address</InputLabel>
                                <Input 
                                    value={email}
                                    onChange={handleEmailChange}
                                    aria-describedby="emailInfo"
                                    id="email" 
                                    type="email" 
                                    fullWidth="true" 
                                    startAdornment={
                                        <InputAdornment position="start">
                                            <Email></Email>
                                        </InputAdornment>
                                }/>
                                <FormHelperText id="emailInfo">{txtEmailError}</FormHelperText>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sx={{mt:3}}>
                            <FormControl sx={{width:"100%"}} error={txtUsernameError}>
                                <InputLabel htmlFor="username">Username</InputLabel>
                                <Input 
                                    value={username}
                                    onChange={handleUsernameChange}
                                    aria-describedby="usernameInfo"
                                    id="username" 
                                    type="text" 
                                    fullWidth="true" 
                                    startAdornment={
                                        <InputAdornment position="start">
                                            <Person></Person>
                                        </InputAdornment>
                                }/>
                                <FormHelperText id="usernameInfo">{txtUsernameError}</FormHelperText>
                                <FormHelperText id="usernameInstruction">{USERNAME_INFO}</FormHelperText>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sx={{mt:3}}>
                            <FormControl sx={{width:"100%"}} error={txtPasswordError}>
                                <InputLabel htmlFor="password">Password</InputLabel>
                                <Input
                                    value={password}
                                    onChange={handlePasswordChange}
                                    aria-describedby="passwordInfo"
                                    id="password"
                                    fullWidth="true"
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
                                <FormHelperText id="passwordInfo">{txtPasswordError}</FormHelperText>
                                <FormHelperText id="passwordInstruction">{PASSWORD_INFO}</FormHelperText>
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
                                    fullWidth="true"
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
                                {txtConfirmaPasswordSuccess && <FormHelperText id="confirmPasswordInfo" sx={{color:"green"}}>Password match</FormHelperText>}
                                <FormHelperText id="confirmPasswordInfo">{txtConfirmPasswordError}</FormHelperText>
                            </FormControl>
                        </Grid> 
                        <Grid item xs={12} sx={{mt:3}}>
                        <Button fullWidth="true" variant="contained" id="signup" name="signup" type="submit" disabled={apiCallState.loading}>{apiCallState.loading ? "Signing in" : "Sign up"}</Button>
                        </Grid>  
                        <Grid item xs={12} sx={{mt:3}}>
                            <Divider orientation="horizontal"></Divider>
                        </Grid>
                        <Grid item xs={12} sx={{mt:5}}>
                            <Button fullWidth="true" variant="contained" onClick={loginWithGoogle} disabled={apiCallState.loading}>Signup with Google</Button>
                        </Grid>
                        <Grid item xs={12} sx={{mt:5}}>
                            <Typography variant="body1" component="p">Already have an account? <NavLink to="/auth/login">Login here</NavLink></Typography>
                        </Grid>
                    </Grid>
                </form>
            </Grid>
        </Grid>
    )
}

export default Signup

