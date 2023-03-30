import { Email, Key, Person, Visibility, VisibilityOff } from "@mui/icons-material";
import { Button, Divider, FormControl, Grid, IconButton, Input, InputAdornment, InputLabel, makeStyles, Typography, useTheme } from "@mui/material";
import React, { useState } from "react";

const error = {
    color: 'red'
}

const success = {
    color: 'green'
}


const USERNAME_INFO = "Your username should be at least 6 character long and should contain alphabets and number."
const PASSWORD_INFO = "Your password should be at least 8 character long and should contain at least one uppercase, one lowercase, one number and one special character."
function Signup(){
    const theme = useTheme()

    const [showPassword, setShowPassword] = useState()
    const [showConfirmPassword, setShowConfirmPassword] = useState()
    const [isPasswordEqual, setIsPasswordEqual] = useState(false)

    function togglePasswordVisibility(){
        setShowPassword((show) => !show)
    }

    function toggleConfirmPasswordVisibility() {
        setShowConfirmPassword((show) => !show)
    }

    function signWithGoogle() {

    }

    function submitForm() {

    }

    function checkPasswordEquality() {
        const txtPassword = document.getElementById("password")
        const txtConfirmPassword = document.getElementById("confirmPassword")

        let password = txtPassword.value
        let confirmPassword = txtConfirmPassword.value

        if(confirmPassword.length === 0) return
        setIsPasswordEqual(password === confirmPassword)
    }

    let usernameText = USERNAME_INFO
    let passwordText = PASSWORD_INFO

    return (
        <Grid container
            alignItems="center"
            justifyContent="center"
            style={{ minHeight: '100vh' }}
            sx={{mt:5, mb:5}}>
            <Grid item xs={5} sx={{border:1, borderColor:'primary.light', borderRadius:"5%", p:3}}>
                <Grid container>
                    <Grid item xs={12}>
                        <Typography variant="h4">Signup</Typography>
                    </Grid>
                    <Grid container spacing={2}>
                        <Grid item xs={6} sx={{mt:4}}>
                            <FormControl variant="outlined" sx={{width:"100%"}}>
                                <InputLabel htmlFor="firstName">First name</InputLabel>
                                <Input id="firstName" variant="filled" fullwidth startAdornment={
                                    <InputAdornment position="start">
                                        <Person></Person>
                                    </InputAdornment>
                                }></Input>
                                <Typography variant="caption" sx={{color:"GrayText", fontSize:"12px"}} style={error}>Invalid name</Typography>
                            </FormControl>
                        </Grid>
                        <Grid item xs={6} sx={{mt:4}}>
                            <FormControl variant="outlined" sx={{width:"100%"}}>
                                <InputLabel htmlFor="lastName">Last name</InputLabel>
                                <Input id="lastName" variant="filled" fullwidth startAdornment={
                                    <InputAdornment position="start">
                                        <Person></Person>
                                    </InputAdornment>
                                }></Input>
                                <Typography variant="caption" sx={{color:"GrayText", fontSize:"12px"}} style={success}>Valid name</Typography>
                            </FormControl>
                        </Grid>
                    </Grid>
                    <Grid item xs={12} sx={{mt:4}}>
                        <FormControl variant="outlined" sx={{width:"100%"}}>
                            <InputLabel htmlFor="email">Email Address</InputLabel>
                            <Input id="email" type="email" variant="filled" fullwidth startAdornment={
                                <InputAdornment position="start">
                                    <Email></Email>
                                </InputAdornment>
                            }></Input>
                            <Typography variant="caption" sx={{color:"GrayText", fontSize:"12px"}} component="span"></Typography>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} sx={{mt:4}}>
                        <FormControl variant="outlined" sx={{width:"100%"}}>
                            <InputLabel htmlFor="username">Username</InputLabel>
                            <Input id="username" type="text" variant="filled" fullwidth startAdornment={
                                <InputAdornment position="start">
                                    <Person></Person>
                                </InputAdornment>
                            }></Input>
                            <Typography variant="caption" sx={{color:"GrayText", fontSize:"12px"}} component="span">{usernameText}</Typography>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} sx={{mt:3}}>
                        <FormControl sx={{width:"100%"}}>
                            <InputLabel htmlFor="password">Password</InputLabel>
                            <Input 
                                id="password"
                                fullWidth
                                variant="filled"
                                type={showPassword ? "text" : "password"}
                                onInput={checkPasswordEquality}
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
                                }>
                            </Input>
                            <Typography variant="caption" sx={{color:"GrayText", fontSize:"12px"}} component="span">{passwordText}</Typography>
                        </FormControl>
                    </Grid> 
                    <Grid item xs={12} sx={{mt:3}}>
                        <FormControl sx={{width:"100%"}}>
                            <InputLabel htmlFor="confirmPassword">Confirm password</InputLabel>
                            <Input 
                                id="confirmPassword"
                                fullWidth
                                variant="filled"
                                type={showConfirmPassword ? "text" : "password"}
                                onInput={checkPasswordEquality}                                
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
                                }>
                            <Typography variant="caption" sx={{color:"GrayText", fontSize:"12px"}} component="span">{isPasswordEqual ? "Password match" : "Password do not match"}</Typography>
                            </Input>
                        </FormControl>
                    </Grid> 
                    <Grid item xs={12} sx={{mt:3}}>
                        <Button fullWidth  variant="contained" onClick={submitForm}>Sign up</Button>
                    </Grid>  
                    <Grid item xs={12} sx={{mt:3}}>
                        <Divider orientation="horizontal"></Divider>
                    </Grid>
                    <Grid item xs={12} sx={{mt:5}}>
                        <Button fullWidth  variant="contained" onClick={signWithGoogle}>Signup with Google</Button>
                    </Grid>
                    <Grid item xs={12} sx={{mt:5}}>
                        <Typography variant="body1" component="p">Already have an account? Login here</Typography>
                    </Grid>
                </Grid>
            </Grid>
            <p>{isPasswordEqual}</p>
        </Grid>
    )
}

export default Signup

