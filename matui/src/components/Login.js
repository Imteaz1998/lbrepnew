import React,{useEffect,useContext} from 'react'
import {Grid,AppBar,Typography, Button,Card,CardHeader,CardMedia,CardContent, CircularProgress, TextField } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { useNavigate } from 'react-router-dom';
import {useImmerReducer } from "use-immer"
import Axios from 'axios';
import DispatchContext from '../context/DispatchContext';
import StateContext from '../context/StateContext';

const useStyles=makeStyles({
    formContainer:{
        width:"50%",
        marginLeft: "auto",
        marginRight: "auto",
        marginTop: "3rem",
        border:"5px solid black",
        padding:"3rem",
    },
     loginBtn:{
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
//Contexts

function Login() {
const classes=useStyles();
const navigate=useNavigate();
const GlobalDispatch=useContext(DispatchContext)
const GlobalState=useContext(StateContext)

//Immer functions 

const initialState={
  userNameValue:'',
 
  PasswordValue:'',

  sendRequest:'',
  token:'',

}
function ReducerFunction(draft,action){
  switch(action.type){
    case "catchUsernmeChange":
      draft.userNameValue=action.usernameChoice
      break;
   
    case "catchpasswordChange":
        draft.PasswordValue=action.passwordChoice
        break;
    
    case "changeSendRequest":
      draft.sendRequest=draft.sendRequest+1;
      break;
    case 'catchToken':
      draft.token=action.tokenValue;
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

  async function SignIn(){
    try{
      const response=await Axios.post('http://127.0.0.1:8000/api-auth-djoser/token/login/',
      {
          username:state.userNameValue,
         
          password:state.PasswordValue,
         
      },{cancelToken:source.token});
      console.log(response);
      dispatch({type:'catchToken',tokenValue:response.data.auth_token})
      GlobalDispatch({type:'catchToken',tokenValue:response.data.auth_token})
      //navigate('/')
    

    }catch(error){
      console.log(error.response)

    }
    
  }
  SignIn();

  return ()=>{
    source.cancel();
     
  }
  }
},[state.sendRequest]);
//get user info
useEffect(()=>{
  if(state.token!==""){
      const source=Axios.CancelToken.source();

  async function GetUserInfo(){
    try{
      const response=await Axios.get('http://127.0.0.1:8000/api-auth-djoser/users/me/',
      {
        headers:{Authorization:'Token '.concat(state.token)}
          
      },{cancelToken:source.token});
      console.log(response);
      GlobalDispatch({type:"userSignedIn",usernameInfo: response.data.username,emailInfo: response.data.email,IdInfo:response.data.id})
      navigate('/')
    

    }catch(error){
      console.log(error.response);
     

    }
    
  }
  GetUserInfo();

  return ()=>{
    source.cancel();
     
  }
  }
},[state.token]);
  return (
    <div className={classes.formContainer}>
        <form onSubmit={FormSubmit}>
        <Grid item container justifyContent="center">
            <Typography variant='h4'>LOGIN</Typography>

            </Grid>
            <Grid item container style={{marginTop : "1rem" }}>
            <TextField id="username" label="Username" variant="outlined" fullWidth color="secondary"
            value={state.userNameValue}
            onChange={(e)=>dispatch({type:'catchUsernmeChange',usernameChoice:e.target.value})}
            />

            </Grid>
           
            <Grid item container style={{marginTop : "1rem" }}>
            <TextField id="password" label="Password" variant="outlined" fullWidth color="secondary" type="password"
             value={state.PasswordValue}
             onChange={(e)=>dispatch({type:'catchpasswordChange',passwordChoice:e.target.value})}
              />
            </Grid>
    
            <Grid item xs={8} container style={{marginTop : "1rem",marginLeft:"auto",marginRight:"auto" }}>
            <Button className={classes.loginBtn} variant='contained' fullWidth type="submit">LOGIN</Button>
            </Grid>
           
        
       
        
        </form>
       


        <Grid item container justifyContent="center" style={{marginTop : "1rem" }}>
           <Typography variant="small"> Don't have an account? <span onClick={()=>navigate('/register')} style={{ cursor:"pointer", color:"green"}}>SIGN UP</span></Typography>
            </Grid>
        

    </div>
  )
}

export default Login