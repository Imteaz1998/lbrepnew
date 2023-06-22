import React,{useEffect, useState} from 'react'
import {Grid,AppBar,Typography, Button,Card,CardHeader,CardMedia,CardContent, CircularProgress, TextField } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { useNavigate } from 'react-router-dom';
import Axios from 'axios';
import {useImmerReducer } from "use-immer"

const useStyles=makeStyles({
    formContainer:{
        width:"50%",
        marginLeft: "auto",
        marginRight: "auto",
        marginTop: "3rem",
        border:"5px solid black",
        padding:"3rem",
    },
    registerBtn:{
        backgroundColor:"#01FF70",
        color:"black",
        
        fontSize:"1.1rem",
        marginLeft:"1rem",
        '&:hover':{
          backgroundColor:"#B10DC9",
          color:"white",
        },
    }
}
)
function Register() {
const classes=useStyles();
const navigate=useNavigate();
const initialState={
  userNameValue:'',
  EmailValue:'',
  PasswordValue:'',
  Password2Value:'',
  sendRequest:'',

}
function ReducerFunction(draft,action){
  switch(action.type){
    case "catchUsernmeChange":
      draft.userNameValue=action.usernameChoice
      break;
    case "catchemailChange":
        draft.EmailValue=action.emailChoice
        break;
    case "catchpasswordChange":
        draft.PasswordValue=action.passwordChoice
        break;
    case "catchpassword2Change":
        draft.Password2Value=action.password2Choice
        break;
    case "changeSendRequest":
      draft.sendRequest=draft.sendRequest+1;
      break;

  }

}
const[state,dispatch]=useImmerReducer(ReducerFunction,initialState)

function FormSubmit(e){
    e.preventDefault();
    console.log("Form is submitted");
    dispatch({type:"changeSendRequest"});
}

useEffect(()=>{
    if(state.sendRequest){
        const source=Axios.CancelToken.source();

    async function SignUp(){
      try{
        const response=await Axios.post('http://127.0.0.1:8000/api-auth-djoser/users/',
        {
            username:state.userNameValue,
            email:state.EmailValue,
            password:state.PasswordValue,
            re_password:state.Password2Value,

        },{cancelToken:source.token});
        console.log(response);
        navigate('/')
      

      }catch(error){
        console.log(error.response)

      }
      
    }
    SignUp();

    return ()=>{
      source.cancel();
       
    }
    }
  },[state.sendRequest]);
  return (
    <div className={classes.formContainer}>
        <form onSubmit={FormSubmit}>
        <Grid item container justifyContent="center">
            <Typography variant='h4'>CREATE AN ACCOUNT</Typography>

            </Grid>
            <Grid item container style={{marginTop : "1rem" }}>
            <TextField id="username" label="Username" variant="outlined" fullWidth color="secondary"
            value={state.userNameValue}
            onChange={(e)=>dispatch({type:'catchUsernmeChange',usernameChoice:e.target.value})}/>

            </Grid>
            <Grid item container style={{marginTop : "1rem" }}>
            <TextField id="email" label="Email" variant="outlined" fullWidth color="secondary"
            value={state.EmailValue}
            onChange={(e)=>dispatch({type:'catchemailChange',emailChoice:e.target.value})}/>
            </Grid>
            <Grid item container style={{marginTop : "1rem" }}>
            <TextField id="password" label="Password" variant="outlined" fullWidth color="secondary" type="password" 
            value={state.PasswordValue}
            onChange={(e)=>dispatch({type:'catchpasswordChange',passwordChoice:e.target.value})}/>
            </Grid>
            <Grid item container style={{marginTop : "1rem" }}>
            <TextField id="password2" label="Verify password" variant="outlined" fullWidth color="secondary" type="password"
            value={state.Password2Value}
            onChange={(e)=>dispatch({type:'catchpassword2Change',password2Choice:e.target.value})} />
            </Grid>
            <Grid item xs={8} container style={{marginTop : "1rem",marginLeft:"auto",marginRight:"auto" }}>
            <Button className={classes.registerBtn} variant='contained' fullWidth type="submit">SIGNUP</Button>
            </Grid>
           
        
       
        
        </form>
        <Grid item container justifyContent="center" style={{marginTop : "1rem" }}>
           <Typography variant="small"> Already have an account? <span onClick={()=>{navigate('/login')}} style={{ cursor:"pointer", color:"green"}}>SIGN IN</span></Typography>
            </Grid>
        

    </div>
  )
}

export default Register