import { Button } from "@mui/material"
import { useNavigate } from "react-router-dom"

function LinkButton(props) {

    const navigate = useNavigate()
    function handleOnClick() {
        navigate(props.link)
    }

    return (
        <Button 
            startIcon={props.startIcon}
            endIcon={props.endIcon}
            variant={props.type} 
            onClick={handleOnClick}
            style={{minWidth:"auto"}}>
                {props.label}
        </Button>
    )
}

export default LinkButton