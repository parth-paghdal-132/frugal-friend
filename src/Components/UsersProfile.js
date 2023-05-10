import React, { useEffect, useState } from "react";
import { Navigate, useParams } from "react-router-dom";
import axiosInstance from "../config/axiosConfig";
import { Alert, Box, Grid, Typography, useTheme } from "@mui/material";

const IMAGE_PATH = "http://localhost:4000/uploads/images/"

const boxStyle = {
    marginTop:"3px",
    border: "1px solid #80808047",
    borderRadius: "10px",
    background: "#00000017",
    padding: "5px",
    boxShadow: "0px 0px 0px 4px #ededed40"
}

function UsersProfile() {
    let {userId} = useParams()
    
    const [image, setImage] = useState("")
    const [firstName, setFirstName] = useState("")
    const [lastName, setLastName] = useState("")
    const [bio, setBio] = useState("")
    const [username, setUsername] = useState("")
    const [email, setEmail] = useState("")
    const [fbLink, setFBLink] = useState("")
    const [igLink, setIGLink] = useState("")
    const [twitterLink, setTwitterLink] = useState("")
    const [apiCallState, setApiCallState] = useState({loading: false, data: null, error: null, navigateToLogin: false})
    const [otherError, setOtherError] = useState(null)

    useEffect(() => {
        loadData()
    },[])
    async function loadData() {
        setApiCallState((prev) => ({...prev, loading: true}))
        try{    
            let response = await axiosInstance.get(`/user-profile/${userId}`)
            if(response.data) {
                setApiCallState((prev) => ({...prev, loading: false, data: response.data}))
                fillData(response.data)
            } else {
                showErrorData({other: "Could not load information at this moment please try after some time."})
            }
        } catch(exception) {
            setApiCallState({...apiCallState, loading:false})
            if(exception.response && exception.response.data) {
                let errorData = exception.response.data
                if(errorData.sessionExpired){
                    removeUserFromLocalStorage()
                    setApiCallState({...apiCallState, navigateToLogin:true})
                } else {
                    showErrorData(errorData)
                }
            } else {
                showErrorData({other: "Could not load information at this moment please try after some time."})
            }
        }
    }    

    function fillData(user) {
        setImage(`${IMAGE_PATH}${user.image}`)
        setFirstName(user.firstName)
        setLastName(user.lastName)
        setBio(user.bio)
        setUsername(user.username)
        setEmail(user.email)
        setFBLink(user.fbLink)
        setIGLink(user.igLink)
        setTwitterLink(user.twitterLink)

        showErrorData({})
    }

    function showErrorData(errors) {
        setOtherError(errors.other)
    }

    function removeUserFromLocalStorage() {
		localStorage.removeItem("token")
		localStorage.removeItem("user")
        window.dispatchEvent(new Event("storage"))
	}

    let token = localStorage.getItem("token")
    if(!token) {
        return <Navigate to="/auth/login" state={{otherError: "Please login see others' profile."}}/>
    }

    if(apiCallState.navigateToLogin) {
        return <Navigate to="/auth/login" state={{otherError: "Please login to see others' profile."}}/>
    }

    if(apiCallState.loading) {
        return(<Alert severity="info" sx={{mt:3}}>Loading profile data</Alert>)
    }
    if(otherError) {
        return <Grid container sx={{mt:3, mb:5}}>
            <Grid item xs={12} direction="column" alignItems="center" textAlign="center" sx={{mt:5, mb:5}}>
                <Typography variant="h4" component="h1">Profile information</Typography>
                { otherError && <Alert severity="error" sx={{mt:3}}>{otherError}</Alert> }
            </Grid>
        </Grid>
    }
    return (
        <Grid container sx={{mt:3, mb:5}} justifyItems="center" justifyContent="center" alignItems="center">
            <Grid item xs={12} alignItems="center" textAlign="center" sx={{mt:5, mb:5}}>
                <Typography variant="h4" component="h1">Profile information</Typography>
                { otherError && <Alert severity="error" sx={{mt:3}}>{otherError}</Alert> }
            </Grid>
            <Grid item xs={6} sx={{pl:5, pr:5}} >
                <Grid container direction="column" alignItems="center" sx={{mt:3}}>
                    <Box 
                        component="img" 
                        src={image} 
                        aria-label="user image"
                        sx={{borderRadius:"50%", border:"1px solid #80808047", width:"192px", height:"192px", boxShadow:15,mb:1}}
                        style={{background: "url(/preview.jpeg) no-repeat scroll 0 0"}}/>
                    <Typography variant="h5" component="h2">{firstName} {lastName}</Typography>
                </Grid>
                <Grid container>
                    <Grid item xs={12}>
                        {bio && 
                            <Box style={boxStyle}>
                                <Typography variant="subtitle1" component="p">{bio}</Typography>
                            </Box>
                        }
                        {username && 
                            <Box style={boxStyle}>
                                <Typography variant="subtitle1" component="p" sx={{color:"#0086f9"}}>@{username}</Typography>
                            </Box>
                        }
                    </Grid>
                </Grid>
                <Grid container>
                    <Grid item xs={12}>
                        <Typography variant="h6" sx={{mt:3}} component="h3">Connect with me</Typography>
                        <Box style={boxStyle}>
                            <ul>
                                <li><a href={`mailto:${email}`} target="_blank" style={{color:"#0068c4"}}>{email}</a></li>
                                { fbLink &&<li><a href={fbLink} target="_blank" style={{color:"#0068c4"}}>{fbLink}</a></li> }
                                { igLink &&<li><a href={igLink} target="_blank" style={{color:"#0068c4"}}>{igLink}</a></li> }
                                { twitterLink &&<li><a href={twitterLink} target="_blank" style={{color:"#0068c4"}}>{twitterLink}</a></li> }
                            </ul>
                        </Box>
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    )
}

export default UsersProfile