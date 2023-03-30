import { Email, Key, Visibility, VisibilityOff } from "@mui/icons-material";
import { Alert, Button, Divider, FormControl, Grid, IconButton, Input, InputAdornment, InputLabel, Typography, useTheme } from "@mui/material";
import React, { useState } from "react";

function Login(){

    const [showPassword, setShowPassword] = useState(false)

    function togglePasswordVisibility(event) {
        setShowPassword((show) => !show)
    }

    function submitForm(){
        let txtEmail = document.getElementById("email")
        let txtPassword = document.getElementById("password")
        console.log(txtEmail.value)
        console.log(txtPassword.value)
    }

    function loginWithGoogle(){
        console.log("perform login with google")
    }
    return (
        
        <Grid container
            alignItems="center"
            justifyContent="center"
            style={{ minHeight: '100vh' }}
            sx={{mt:5, mb:5}}>
            <Grid item xs={5} sx={{border:1, borderColor:'primary.light', borderRadius:"5%", p:3}}>
                <Grid container>
                    <Grid item xs={12}>
                        <Typography variant="h4">Login</Typography>
                    </Grid>
                    <Grid item xs={12} sx={{mt:3}}>
                        <Alert severity="error">Something went wrong</Alert>
                    </Grid>
                    <Grid item xs={12} sx={{mt:4}}>
                        <FormControl variant="outlined" sx={{width:"100%"}}>
                            <InputLabel htmlFor="email">Email Address</InputLabel>
                            <Input id="email" variant="filled" fullwidth startAdornment={
                                <InputAdornment position="start">
                                    <Email></Email>
                                </InputAdornment>
                            }></Input>
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
                        </FormControl>
                    </Grid>       
                    <Grid item xs={12} sx={{mt:3}}>
                        <Button fullWidth  variant="contained" onClick={submitForm}>Login</Button>
                    </Grid>  
                    <Grid item xs={12} sx={{mt:3}}>
                        <Divider orientation="horizontal"></Divider>
                    </Grid>
                    <Grid item xs={12} sx={{mt:5}}>
                        <Button fullWidth  variant="contained" onClick={loginWithGoogle}>Login with Google</Button>
                    </Grid>
                    <Grid item xs={12} sx={{mt:5}}>
                        <Typography variant="body1" component="p">Do not have an account? Sign up here</Typography>
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    )
}

export default Login