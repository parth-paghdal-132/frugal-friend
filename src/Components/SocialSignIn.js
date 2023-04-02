import React, { useCallback, useState } from "react"
import { GoogleAuthProvider, getAuth, getRedirectResult, signInWithPopup, signInWithRedirect } from 'firebase/auth'
import fireabseApp from '../firebase/Firebase'
import { Button } from "@mui/material"

const provider = new GoogleAuthProvider()
const auth = getAuth(fireabseApp)

function SocialSignIn(props) {
    async function loginWithGoogle(){
        let result = await signInWithPopup(auth, provider)
        console.log(result)
        // signInWithPopup(auth, provider)
        //     .then((result) => {
        //         const credential = GoogleAuthProvider.credentialFromResult(result)
        //         const token = credential.accessToken
        //         const user = result.user
        //         console.log("then")
        //         console.log(user)
        //     })
        //     .catch((error) => {
        //         const errorCode = error.code
        //         const errorMessage = error.message
        //         const email = error.customData.email
        //         const credential = GoogleAuthProvider.credentialFromError(error)
        //         console.log("catch")
        //         console.log(error)
        //     })
    }
    
    return <Button 
            fullWidth={true} 
            variant="contained" 
            onClick={loginWithGoogle} 
            disabled={props.loading}>
                Login with Google
        </Button>
}   

export default SocialSignIn
