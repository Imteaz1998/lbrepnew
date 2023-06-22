import React,{useEffect, useState,useRef,useMemo, useContext} from 'react'
import {Grid,AppBar,Typography, Button,Card,CardHeader,CardMedia,CardContent, CircularProgress, TextField, FormControlLabel, Checkbox,InputAdornment } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { useNavigate } from 'react-router-dom';
import Axios from 'axios';
import {useImmerReducer } from "use-immer"
import StateContext from '../context/StateContext';
import ProfileUpdate from './ProfileUpdate';
import defaultProfilePicture from './Assets/defaultProfilePicture.jpg';

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
function Profile() {
    const classes=useStyles();
    const navigate=useNavigate();
    const GlobalState=useContext(StateContext)
    const initialState={
        userProfile:{
          agencyName:"",
          phoneNumber:"",
          profilepic:"",
          bio:"",
          sellerId:"",
          sellerListings:[],
        },
        dataIsLoading: true,

       
      }
      function ReducerFunction(draft,action){
        switch(action.type){
          case "catchUserProfileInfo":
            draft.userProfile.agencyName=action.profileObject.agency_name;
            draft.userProfile.phoneNumber=action.profileObject.phone_number;
            draft.userProfile.profilepic=action.profileObject.profile_picture;
            draft.userProfile.bio=action.profileObject.bio;
            draft.userProfile.sellerListings=action.profileObject.seller_listings;
            draft.userProfile.sellerId=action.profileObject.seller;
            break;
            case 'loadingDone':
                draft.dataIsLoading=false;
                break;
        

      
        }
      
      }
      const[state,dispatch]=useImmerReducer(ReducerFunction,initialState)
    
      useEffect(()=>{
        async function GetProfileInfo(){
          try{
            const response = await Axios.get(`http://127.0.0.1:8000/api/profiles/${GlobalState.userId}/`);
            console.log(response.data);
            dispatch({type:"catchUserProfileInfo",
            profileObject:response.data});
            dispatch({type: 'loadingDone'})
    
          }
         
          catch(e){
            console.log(e.response)
          
    
          }
          
        }
        GetProfileInfo();
    
      },[])

      // render request

  
      function PropertyDisplay(){
        if(state.userProfile.sellerListings.length===0){
          return(
            <Button disabled size="small">
                No properties
                </Button>
          )

        }
        else if(state.userProfile.sellerListings.length === 1){
          return(
            <Button 
            onClick={()=>navigate(`/agencies/${state.userProfile.sellerId}`)}
            size="small">
            One property
            </Button>
            
          )
        }
        else{
          return(

            <Button 
            onClick={()=>navigate(`/agencies/${state.userProfile.sellerId}`)}
            size="small">
            {state.userProfile.sellerListings.length} Properties
            </Button>

          )
        }
      }
    
function WelcomeDisplay(){
    if(state.userProfile.agencyName===null || state.userProfile.agencyName===""|| state.userProfile.phoneNumber=== null || state.userProfile.phoneNumber === ""){
        return(
        <Typography
        variant='h5'
        style={{ textAlign:"center",marginTop:"1rem"}}>
            Welcome <span style={{ color:"green",fontWeight:"bolder"}}>
                {GlobalState.userUsername}
            </span>, please submit this form below to update your profile


        </Typography>
        )
    }
    else{
        return(
        <Grid container style={{width:"50%",marginLeft:"auto",marginRight:"auto",marginTop:"1rem",border:"5px solid black",padding:"5px"}}>
            <Grid item xs={5.5}>
                <img style={{ height:"15rem", width:"15rem", borderRadius:"50%"}} src={state.userProfile.profilepic !==null? state.userProfile.profilepic: defaultProfilePicture}/>

            </Grid>
            <Grid item container direction="column" justifyContent="center" xs={5.5}>
                <Grid item>
                <Typography
        variant='h5'
        style={{ textAlign:"center",marginTop:"1rem"}}>
            Welcome <span style={{ color:"green",fontWeight:"bolder"}}>
                {GlobalState.userUsername}
            </span>


        </Typography>

                </Grid>

                <Grid item>
                <Typography
        variant='h5'
        style={{ textAlign:"center",marginTop:"1rem"}}>
           You have {PropertyDisplay()}
                


        </Typography>
                    
                    </Grid>
            </Grid>
        </Grid>
        )

    }

}
if(state.dataIsLoading === true){
    return (
      <Grid container justifyContent="center" alignItems="center" style={{height:"100vh"}}>
        <CircularProgress/>
      </Grid>
    )
  }
    
  return (
    <div>
        <div>
            {WelcomeDisplay()}
       

            </div>
            <ProfileUpdate userProfile={state.userProfile}/>

           
    </div>
  )
}

export default Profile