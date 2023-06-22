import React,{useEffect, useState,useRef,useMemo, useContext} from 'react'
import {Grid,AppBar,Typography, Button,Card,CardHeader,CardMedia,CardContent, CircularProgress, TextField, FormControlLabel, Checkbox,InputAdornment } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { useNavigate } from 'react-router-dom';
import Axios from 'axios';
import {useImmerReducer } from "use-immer"
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
    },
    picturesBtn:{
        backgroundColor:"blue",
        color:"white",
        border:"1px solid black",
        fontSize:"0.8rem",
        marginLeft:"1rem",
        
        
  
      }
}
)
function ProfileUpdate(props) {
    const classes=useStyles();
    const navigate=useNavigate();
    const GlobalState=useContext(StateContext)
    console.log(props.userProfile)
    const initialState={
        agencyNameValue:props.userProfile.agencyName,
        phoneNumberValue:props.userProfile.phoneNumber,
        bioValue:props.userProfile.bio,
        uploadedpictureValue:[],
        profilepictureValue:props.userProfile.profilepic,
        sendRequest:"",
    
      
      }
      function ReducerFunction(draft,action){
        switch(action.type){
         
         case  'catchAgencynmeChange':
            draft.agencyNameValue=action.agencyNameChoice;
            break;
        case 'phoneNumberChange':
            draft.phoneNumberValue=action.phoneNumberChoice
            break;
        case 'bioChange':
            draft.bioValue=action.bioChoice
            break;
        case "catchUploadedPicture":
            draft.uploadedpictureValue=action.pictureChosen
            break;
        case 'catchProfilePictureChange':
            draft. profilepictureValue= action.profilePictureChosen
            break;
            case "changeSendRequest":
                draft.sendRequest=draft.sendRequest+1
        

      
        }
      
      }
      const[state,dispatch]=useImmerReducer(ReducerFunction,initialState)
    //useEffct to catch uploaded picture
    useEffect(()=>{
        if(state.uploadedpictureValue[0]){
            dispatch({type:'catchProfilePictureChange',profilePictureChosen:state.uploadedpictureValue[0]})

        }

    },[state.uploadedpictureValue[0]])
    
    

      // render request

      useEffect(()=>{
        if(state.sendRequest){
          async function UpdateProfile(){
            const formData= new FormData();

            if(typeof state.profilepictureValue === "string" || typeof state.profilepictureValue === null ){

                formData.append('agency_name',state.agencyNameValue)
                formData.append('phone_number',state.phoneNumberValue)
                formData.append('bio',state.bioValue)
                formData.append('seller',GlobalState.userId)
       

            }
            else{
                formData.append('agency_name',state.agencyNameValue)
                formData.append('phone_number',state.phoneNumberValue)
                formData.append('bio',state.bioValue)
                formData.append('profile_picture',state.profilepictureValue)
                formData.append('seller',GlobalState.userId)
       
            }
          
      
      
            try{
              const response = await Axios.patch(
                `http://127.0.0.1:8000/api/profiles/${GlobalState.userId}/update/`
              ,formData);
              console.log(response.data)
              navigate(0);
              
      
            }catch(e){
              console.log(e.response)
            }
      
          }
          UpdateProfile()
        }
      
      },[state.sendRequest])

      function FormSubmit(e){
        e.preventDefault()
        dispatch({type:"changeSendRequest"})

      }

      function ProfilePictureDisplay(){

        if(typeof state.profilepictureValue !=="string"){
            return(
                <Grid item container>
                <ul>
                {state.profilepictureValue? (<li>{state.profilepictureValue.name}</li>):(" ")}
  
                </ul>
               
              </Grid>
            )
        }
        else if(typeof state.profilepictureValue ==="string"){
            return(
            <Grid item style={{marginTop:"0.5rem",marginRight:"auto",marginLeft:"auto"}}>
                <img src={props.userProfile.profilepic} style={{height:"5rem",width:"5rem" ,borderRadius:"50%"}}/>
            </Grid>
            )
        }

      }


    
  return (
    <div>

            <div className={classes.formContainer}>
        <form onSubmit={FormSubmit}>
        <Grid item container justifyContent="center">
            <Typography variant='h4'>MY PROFILE</Typography>

            </Grid>
            <Grid item container style={{marginTop : "1rem" }}>
            <TextField id="agencyName" label="Agency Name*" variant="outlined" fullWidth color="secondary"
            value={state.agencyNameValue}
            onChange={(e)=>dispatch({type:'catchAgencynmeChange',agencyNameChoice:e.target.value})}
            />

            </Grid>
           
            <Grid item container style={{marginTop : "1rem" }}>
            <TextField id="phonenumber" label="Phone Number*" variant="outlined" fullWidth color="secondary"
             value={state.phoneNumberValue}
             onChange={(e)=>dispatch({type:'phoneNumberChange',phoneNumberChoice:e.target.value})}
              />
            </Grid>

            <Grid item container style={{marginTop : "1rem" }}>
            <TextField id="bio" label="Bio" variant="outlined" fullWidth color="secondary"
             multiline
             rows={6}
             value={state.bioValue}
             onChange={(e)=>dispatch({type:'bioChange',bioChoice: e.target.value})}
              />
            </Grid>

            <Grid item container>
             {ProfilePictureDisplay()}
            </Grid>

            <Grid item xs={6} container style={{marginTop : "1rem",marginLeft:"auto",marginRight:"auto" }}>
            <Button component="label" className={classes.picturesBtn} variant='contained' fullWidth >Profile picture
            <input type="file"
          
            accept='image/png, image/gif, image/jpeg, image/jpg'
            hidden
            onChange={(e)=>dispatch({
              type:"catchUploadedPicture",
              pictureChosen: e.target.files
            })}

            />
             </Button>
         
            </Grid>

           
    
            <Grid item xs={8} container style={{marginTop : "1rem",marginLeft:"auto",marginRight:"auto" }}>
            <Button  className={classes.loginBtn} variant='contained' fullWidth type="submit">UPDATE</Button>
            </Grid>
           
        
       
        
        </form>
       


       
        

    </div>
    </div>
  )
}

export default ProfileUpdate