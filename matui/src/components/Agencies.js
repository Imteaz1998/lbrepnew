import React,{useEffect, useState,useRef,useMemo, useContext} from 'react'
import {Grid,AppBar,Typography, Button,Card,CardHeader,CardMedia,CardContent, CircularProgress, TextField, FormControlLabel, Checkbox,InputAdornment,CardActions } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { useNavigate } from 'react-router-dom';
import Axios from 'axios';
import {useImmerReducer } from "use-immer"
import StateContext from '../context/StateContext';
import ProfileUpdate from './ProfileUpdate';
import defaultProfilePicture from './Assets/defaultProfilePicture.jpg';

const useStyles=makeStyles({

}
)

function Agencies() {

    const classes=useStyles();
    const navigate=useNavigate();
    const GlobalState=useContext(StateContext)
    const initialState={

        dataIsLoading: true,
        agenciesList:[],
       

       
      }
      function ReducerFunction(draft,action){
        switch(action.type){
            case "catchAgencies":
                draft.agenciesList=action.agenciesArray
                break;
            case 'loadingDone':
                draft.dataIsLoading=false;
                break;

          

      
        }
      
      }
      const[state,dispatch]=useImmerReducer(ReducerFunction,initialState)
     // request to get our profiles
      useEffect(()=>{
        async function GetAgencies(){
          try{
            const response = await Axios.get(`http://127.0.0.1:8000/api/profiles/`);
            console.log(response.data);
            dispatch({type:"catchAgencies",
            agenciesArray:response.data});
            dispatch({type: 'loadingDone'})
    
          }
         
          catch(e){
            console.log(e.response)
          
    
          }
          
        }
        GetAgencies();
    
      },[])
      if(state.dataIsLoading === true){
        return (
          <Grid container justifyContent="center" alignItems="center" style={{height:"100vh"}}>
            <CircularProgress/>
          </Grid>
        )
      }
  return (
    <Grid container justifyContent="flex-start" spacing={2} style={{padding:"10px"}}>
    
    {state.agenciesList.map((agency)=>{
      function PropertyDisplay(){
        if(agency.seller_listings.length===0){
          return(
            <Button disabled size="small">
                No properties
                </Button>
          )

        }
        else if(agency.seller_listings.length===1){
          return(
            <Button 
            onClick={()=>navigate(`/agencies/${agency.seller}`)}
            size="small">
            One property
            </Button>
            
          )
        }
        else{
          return(

            <Button
            onClick={()=>navigate(`/agencies/${agency.seller}`)}
            size="small">
            {agency.seller_listings.length} Properties
            </Button>

          )
        }
      }
        if(agency.agency_name && agency.phone_number){
        return(
            <Grid key={agency.id} item style={{marginTop:"1rem",maxWidth:"20rem"}}>

           
            <Card>
            <CardMedia
              sx={{ height: 140 }}
              image={agency.profile_picture ? agency.profile_picture: defaultProfilePicture  }
              title="profilepicture"
            />
            <CardContent>
              <Typography gutterBottom variant="h5" component="div">
                {agency.agency_name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
               {agency.bio.substring(0,100)}...
              </Typography>
            </CardContent>
            <CardActions>
              {PropertyDisplay()}
              
            </CardActions>
          </Card>
          </Grid>
        )
        }


    })}
    </Grid>
  )
}

export default Agencies