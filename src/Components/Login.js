import { Email, Key, Visibility, VisibilityOff } from "@mui/icons-material";
import { Alert, Button, Divider, FormControl, FormHelperText, Grid, IconButton, Input, InputAdornment, InputLabel, Typography } from "@mui/material";
import React, { useCallback, useState } from "react";
import { NavLink, Navigate, useLocation, useNavigate } from "react-router-dom";
import authValidations from "../helpers/authValidations"
import axiosInstance from "../config/axiosConfig"
import { GoogleAuthProvider, getAuth, signInWithPopup, signOut } from 'firebase/auth'
import fireabseApp from '../firebase/Firebase'

const SIGNUP_SOURCE_APP = "app"
const SIGNUP_SOURCE_GOOGLE = "google"

const provider = new GoogleAuthProvider()
const auth = getAuth(fireabseApp)

function Login(props){

    const { state } = useLocation()
    console.log(state)
    const navigate = useNavigate()

    const [showPassword, setShowPassword] = useState(false)

    const [email, setEmail] = useState(state ? state.email : "")
    const [txtEmailError, setTxtEmailError] = useState(null)
    const [password, setPassword] = useState("")
    const [txtPasswordError, setTxtPasswordError] = useState(null)
    const [otherError, setOtherError] = useState(props.otherError)

    const [apiCallState, setApiCallState] = useState({loading: false, data: null, error: null})

    const handleEmailChange = useCallback((event) => {
        setEmail(event.target.value)
    }, [setEmail])

    const handlePasswordChange = useCallback((event) => {
        setPassword(event.target.value)
    }, [setPassword])

    function togglePasswordVisibility(event) {
        setShowPassword((show) => !show)
    }

    function handleSubmit(event) {
        if(apiCallState.loading) return
        event.preventDefault()
        let errors = {}
        let isDataValid = true
        try{
            authValidations.validateAuthenticateUser(email, password, SIGNUP_SOURCE_APP, errors)
            isDataValid = true
        } catch(exception){
            showErrorData(exception)
        }
        if(isDataValid) {
            makeAuthenticateUserApiCall(email, password, SIGNUP_SOURCE_APP)
        }
    }

    function showErrorData(errors) {
        setTxtEmailError(errors.email)
        setTxtPasswordError(errors.password)
        setOtherError(errors.other)
    }

    async function makeAuthenticateUserApiCall(email, password, source) {
        setApiCallState({...apiCallState, loading:true})
        try {
            const response = await axiosInstance.post("auth/login",{
                email: email,
                password: password,
                source: source
            })
            setApiCallState({...apiCallState, loading:false})
            if(response.status === 200) {
                if(response.data.email) {
                    localStorage.setItem("token", response.data.token)
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
                makeAuthenticateUserApiCall(result.user.email, null, SIGNUP_SOURCE_GOOGLE)
            } else {
                showErrorData({other: "Could not log you in at this moment please try after some time."})
            }
        } catch(exception) {
            showErrorData({other: "Could not log you in at this moment please try after some time."})
        }
    }

    let token = localStorage.getItem("token")
    if(token) {
        return <Navigate to="/"/>
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
                            <Typography variant="h4">Login</Typography>
                            {otherError &&
                                <Alert severity="error" sx={{mt:3}}>{otherError}</Alert>
                            }
                        </Grid>
                        <Grid item xs={12} sx={{mt:4}}>
                            <FormControl variant="outlined" sx={{width:"100%"}} error={txtEmailError}>
                                <InputLabel htmlFor="email">Email Address</InputLabel>
                                <Input 
                                    value={email}
                                    onChange={handleEmailChange}
                                    aria-describedby="emailInfo"
                                    id="email" 
                                    type="email" 
                                    fullwidth="true"
                                    startAdornment={
                                    <InputAdornment position="start">
                                        <Email></Email>
                                    </InputAdornment>
                                }/>
                                <FormHelperText id="emailInfo">{txtEmailError ? txtEmailError : ""}</FormHelperText>
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
                                <FormHelperText id="passwordInfo">{txtPasswordError ? txtPasswordError : ""}</FormHelperText>
                            </FormControl>
                        </Grid>       
                        <Grid item xs={12} sx={{mt:3}}>
                            <Button fullWidth={true} variant="contained" id="signup" name="signup" type="submit" disabled={apiCallState.loading}>{apiCallState.loading ? "Loggin in" : "Log in"}</Button>
                        </Grid>  
                        <Grid item xs={12} sx={{mt:3}}>
                            <Divider orientation="horizontal"></Divider>
                        </Grid>
                        <Grid item xs={12} sx={{mt:5}}>
                            <Button fullWidth={true} variant="contained" onClick={loginWithGoogle} disabled={apiCallState.loading}>Login with Google</Button>
                        </Grid>
                        <Grid item xs={12} sx={{mt:5}}>
                            <Typography variant="body1" component="p">Do not have an account? <NavLink to="/auth/signup">Sign up here</NavLink></Typography>
                        </Grid>
                    </Grid>
                </form>
            </Grid>
        </Grid>
    )
}

export default Login