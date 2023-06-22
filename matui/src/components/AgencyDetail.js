import React,{useEffect, useState,useRef,useMemo, useContext} from 'react'
import {Grid,AppBar,Typography, Button,Card,CardHeader,CardMedia,CardContent, CircularProgress, TextField, FormControlLabel, Checkbox,InputAdornment, IconButton,CardActions } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { useNavigate,useParams } from 'react-router-dom';
import Axios from 'axios';
import {useImmerReducer } from "use-immer"
import StateContext from '../context/StateContext';
import defaultProfilePicture from './Assets/defaultProfilePicture.jpg';
import LocalPhoneIcon from '@mui/icons-material/LocalPhone';
const useStyles=makeStyles({
}
)

function AgencyDetail() {
    const classes=useStyles();
    const navigate=useNavigate();
    const GlobalState=useContext(StateContext)
    const params=useParams();
    const initialState={
        userProfile:{
          agencyName:"",
          phoneNumber:"",
          profilepic:"",
          bio:"",
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
            const response = await Axios.get(`http://127.0.0.1:8000/api/profiles/${params.id }/`);
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
      if(state.dataIsLoading === true){
        return (
          <Grid container justifyContent="center" alignItems="center" style={{height:"100vh"}}>
            <CircularProgress/>
          </Grid>
        )
      }

  return (
    <div>
         <Grid container style={{width:"50%",marginLeft:"auto",marginRight:"auto",marginTop:"1rem",border:"5px solid black",padding:"5px"}}>
            <Grid item xs={5.5}>
                <img style={{ height:"15rem", width:"15rem", borderRadius:"50%"}} src={state.userProfile.profilepic !==null? state.userProfile.profilepic: defaultProfilePicture}/>

            </Grid>
            <Grid item container direction="column" justifyContent="center" xs={5.5}>
                <Grid item>
                <Typography
        variant='h5'
        style={{ textAlign:"center",marginTop:"1rem"}}>
          <span style={{ color:"green",fontWeight:"bolder"}}>
                {state.userProfile.agencyName }
            </span>


        </Typography>

                </Grid>

                <Grid item>
                <Typography
        variant='h5'
        style={{ textAlign:"center",marginTop:"1rem"}}>
            <IconButton>
            <LocalPhoneIcon/>{state.userProfile.phoneNumber}

            </IconButton>
      
                


        </Typography>
                    
                    </Grid>
            </Grid>
            <Grid item style={{marginTop:"1rem",padding:"5px"}}>
                {state.userProfile.bio}

            </Grid>
        </Grid>

        <Grid container justifyContent="flex-start" spacing={2} style={{padding:"10px"}}>
    
    {state.userProfile.sellerListings.map((listing)=>{
       
        return(
            <Grid key={listing.id} item style={{marginTop:"1rem",maxWidth:"20rem"}}>

           
            <Card>
            <CardMedia
              sx={{ height: 140 }}
              image={`http://127.0.0.1:8000/${listing.picture1}` ? `http://127.0.0.1:8000/${listing.picture1}`: defaultProfilePicture  }
              title="profilepicture"
              alt="Listing Picture"
              onClick={()=>navigate(`/listings/${listing.id}`)}
              style={{curosr:"pointer"}}
            />
            <CardContent>
              <Typography gutterBottom variant="h5" component="div">
                {listing.title}
              </Typography>
              <Typography variant="body2" color="text.secondary">
               {listing.description.substring(0,100)}...
              </Typography>
            </CardContent>
            <CardActions>
                {listing.property_status === "Sale"
                ? (`${listing.listing_type}:$${listing.price}`)
                :(`${listing.listing_type}: $${listing.price}/${listing.rental_frequency}`)}
              
            </CardActions>
          </Card>
          </Grid>
        )
        


    })}
    </Grid>
    </div>
  )
}

export default AgencyDetail