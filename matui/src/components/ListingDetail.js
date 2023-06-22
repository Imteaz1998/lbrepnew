import React,{useEffect, useState,useRef,useMemo, useContext} from 'react'
import {Grid,Dialog,Typography, Button,Card,CardHeader,CardMedia,CardContent, CircularProgress, TextField, FormControlLabel, Checkbox,InputAdornment, IconButton,CardActions,Breadcrumbs,Link } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { useNavigate,useParams } from 'react-router-dom';
import Axios from 'axios';
import {useImmerReducer } from "use-immer"
import StateContext from '../context/StateContext';
import RoomIcon from '@mui/icons-material/Room';
import defaultProfilePicture from './Assets/defaultProfilePicture.jpg';
import LocalPhoneIcon from '@mui/icons-material/LocalPhone';
import ArrowCircleLeftIcon from '@mui/icons-material/ArrowCircleLeft';
import ArrowCircleRightIcon from '@mui/icons-material/ArrowCircleRight';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import { MapContainer, TileLayer, useMap,Marker, Popup } from 'react-leaflet'
import StadiumIconPng from './Assets/Mapicons/stadium.png';
import HospitalIconPng from './Assets/Mapicons/hospital.png';
import UniversityIconPng from './Assets/Mapicons/university.png';
import {Icon} from 'leaflet';
import ListingUpdate from './ListingUpdate';
const useStyles=makeStyles({
    sliderContainer:{
        position:'relative',
        marginTop:"1rem",

    },
    LeftArrow:{
        position:"absolute",
        cursor:"pointer",
        color:"white",
        fontSize:'3rem',
        color:'white',
        top:'50%',
        left:'27.5%',
        "&:hover":{
            backgroundColor:"black",
        },


    },
    RightArrow:{
        position:"absolute",
        cursor:"pointer",
        color:"white",
        fontSize:'3rem',
        color:'white',
        top:'50%',
        right:'27.5%',
        "&:hover":{
            backgroundColor:"black",
        },


    },
}
)

function ListingDetail() {
    const classes=useStyles();
    const navigate=useNavigate();
    const GlobalState=useContext(StateContext)
    const params=useParams();
    const StadiumIcon= new Icon(
      {
      iconUrl:StadiumIconPng,
      iconSize:[40,40],
      }
    )
    const HospitalIcon= new Icon(
      {
      iconUrl:HospitalIconPng,
      iconSize:[40,40],
      }
    )
    const UniversityIcon= new Icon(
      {
      iconUrl:UniversityIconPng,
      iconSize:[40,40],
      }
    )
    const initialState={
        
        dataIsLoading: true,
        listingInfo:"",
        sellerProfileInfo:"",

       
      }
      function ReducerFunction(draft,action){
        switch(action.type){
          case "catchUserListingInfo":
            draft.listingInfo =action.listingObject
            
            break;
            case 'loadingDone':
                draft.dataIsLoading=false;
                break;
            case 'catchSellerProfileInfo':
                draft.sellerProfileInfo=action.profileObject
                break;

        

      
        }
      
      }
      const[state,dispatch]=useImmerReducer(ReducerFunction,initialState)
    
      useEffect(()=>{
        async function GetListingInfo(){
          try{
            const response = await Axios.get(`http://127.0.0.1:8000/api/listings/${params.id }/`);
            console.log(response.data);
            dispatch({type:"catchUserListingInfo",
            listingObject:response.data});
          
    
          }
         
          catch(e){
            console.log(e.response)
          
    
          }
          
        }
        GetListingInfo();
    
      },[])
// Listing to get listing info 
      useEffect(()=>{
       if(state.listingInfo){
        async function GetProfileInfo(){
            try{
              const response = await Axios.get(`http://127.0.0.1:8000/api/profiles/${state.listingInfo.seller}/`);
              console.log(response.data);
              dispatch({type:'catchSellerProfileInfo',
              profileObject:response.data});
              dispatch({type: 'loadingDone'})
      
            }
           
            catch(e){
              console.log(e.response)
            
      
            }
            
          }
          GetProfileInfo();
       }
    
      },[state.listingInfo])

      const listingPictures =[
        state.listingInfo.picture1,
        state.listingInfo.picture2,
        state.listingInfo.picture3,
        state.listingInfo.picture4,

      ].filter((picture) => picture !==null)
      const [currentPicture,setCurrentPicture]=useState(0);
      function NextPicture(){

        if(currentPicture ===listingPictures.length-1){
            return setCurrentPicture(0)
        }
        else{
            setCurrentPicture(currentPicture+1)

        }

        
      }
      function PreviousPicture(){
        
        if(currentPicture ===0){
            return setCurrentPicture(listingPictures.length-1)
        }
        else{
            setCurrentPicture(currentPicture-1)

        }
      }
      const date=new Date(state.listingInfo.date_posted)
      const formatedDate= `${date.getMonth()+1}/${date.getDate()}/${date.getFullYear()}`


      async function DeleteHandler(){
        const confirmDelete=window.confirm("Are you sure you want to delete?")
        if(confirmDelete){
          try{
            const response =await Axios.delete(`http://127.0.0.1:8000/api/listings/${params.id}/delete/`)
            console.log(response.data);
            navigate("/listings")
  
          }
          catch(e){
            console.log(e.response.data)
        }
      
        }

      }
      const [open, setOpen] = React.useState(false);

      const handleClickOpen = () => {
        setOpen(true);
      };
    
      const handleClose = () => {
        setOpen(false);
      };
      // render request
      if(state.dataIsLoading === true){
        return (
          <Grid container justifyContent="center" alignItems="center" style={{height:"100vh"}}>
            <CircularProgress/>
          </Grid>
        )
      }
  return (
    <div style={{marginLeft:"2rem",marginRight:"2rem",marginBottom:"2rem"}}>
        <Grid item style={{marginTop:"1rem"}}>
        <Breadcrumbs aria-label="breadcrumb">
  <Link underline="hover" color="inherit" style={{cursor:"pointer"}} onClick={()=>navigate("/listings")}>
    Listings
  </Link>
  <Typography color="text.primary">{state.listingInfo.title}</Typography>
</Breadcrumbs>
        </Grid>
        {/* Image slider*/}
       {listingPictures.length > 0? (

<Grid item container justifyContent="center" className={classes.sliderContainer}>
{listingPictures.map((picture,index)=>{
    return(
        <div key={index}>
            {index === currentPicture ? (<img src={picture} style={{width:"45rem",height:"35rem"}}/>):("")}
        </div>
    )
})}
<ArrowCircleLeftIcon onClick={PreviousPicture} className={classes.LeftArrow}/>
<ArrowCircleRightIcon onClick={NextPicture} className={classes.RightArrow}/>

</Grid>

       ):""}
      <Grid item container style={{padding:"1rem", border:"1px solid black",marginTop:'1rem'}}>

      <Grid item container xs={7} direction='column' spacing={1}>
        <Grid item>
            <Typography variant='h5'>{state.listingInfo.title}</Typography>

        </Grid>
        <Grid item>
            <RoomIcon/>
            <Typography variant='h6'>{state.listingInfo.borough}</Typography>

        </Grid>
        <Grid item>
            <Typography variant='subtitle1'>{formatedDate}</Typography>

        </Grid>
       </Grid>
       <Grid item container xs={5} alignItems="center">
        <Typography variant='h6' style={{fontWeight:"bolder",color:"green"}}>
            {state.listingInfo.listing_type} | {state.listingInfo.property_status === 'Sale'? `$${state.listingInfo.price}` : `$${state.listingInfo.price}/${state.listingInfo.rental_frequency}`}
        </Typography>
       </Grid>


      </Grid>
      <Grid item container justifyContent="flex-start" style={{padding:"1rem", border:"1px solid black",marginTop:'1rem'}}>
      {state.listingInfo.rooms?
        (
            <Grid xs={2} item style={{display:"flex"}}>
               <Typography variant='h6'>{state.listingInfo.rooms} Rooms</Typography>

            </Grid>
 
        ):("")}


        {state.listingInfo.furnished?
        (
            <Grid xs={2} item style={{display:"flex"}}>
                <CheckBoxIcon style={{color:"green", fontSize:"2rem"}}/><Typography variant='h6'>Furnished</Typography>

            </Grid>
 
        ):("")}

       {state.listingInfo.pool?
        (
            <Grid xs={2} item style={{display:"flex"}}>
                <CheckBoxIcon style={{color:"green", fontSize:"2rem"}}/><Typography variant='h6'>Pool</Typography>

            </Grid>
 
        ):("")}

        

{state.listingInfo.cctv?
        (
            <Grid xs={2} item style={{display:"flex"}}>
                <CheckBoxIcon style={{color:"green", fontSize:"2rem"}}/><Typography variant='h6'>CCTV</Typography>

            </Grid>
 
        ):("")}

{state.listingInfo.parking?
        (
            <Grid item xs={2} style={{display:"flex"}}>
                <CheckBoxIcon style={{color:"green", fontSize:"2rem"}}/><Typography variant='h6'>Parking</Typography>

            </Grid>
 
        ):("")}

{state.listingInfo.elevator?
        (
            <Grid  xs={2} item style={{display:"flex"}}>
                <CheckBoxIcon style={{color:"green", fontSize:"2rem"}}/><Typography variant='h6'>Elevator</Typography>

            </Grid>
 
        ):("")}




      </Grid>

      {/*Description */}

     {state.listingInfo.description ? (
         <Grid item style={{padding:"1rem", border:"1px solid black",marginTop:'1rem'}}>
         <Typography variant='h5'>Description</Typography>
         <Typography variant='h6'>{state.listingInfo.description}</Typography>
       </Grid>
 
     ):("")}

      {/*Seller Info */}

      <Grid container style={{width:"50%",marginLeft:"auto",marginRight:"auto",marginTop:"1rem",border:"5px solid black",padding:"5px"}}>
            <Grid item xs={5.5}>
                <img style={{ height:"15rem", width:"15rem", borderRadius:"50%", cursor:"pointer"}} src={state.sellerProfileInfo.profile_picture !==null? state.sellerProfileInfo.profile_picture: defaultProfilePicture}
                onClick={()=>navigate(`/agencies/${state.sellerProfileInfo.seller}`)}
                />

            </Grid>
            <Grid item container direction="column" justifyContent="center" xs={5.5}>
                <Grid item>
                <Typography
        variant='h5'
        style={{ textAlign:"center",marginTop:"1rem"}}>
          <span style={{ color:"green",fontWeight:"bolder"}}>
                {state.sellerProfileInfo.agency_name }
            </span>


        </Typography>

                </Grid>

                <Grid item>
                <Typography
        variant='h5'
        style={{ textAlign:"center",marginTop:"1rem"}}>
            <IconButton>
            <LocalPhoneIcon/>{state.sellerProfileInfo.phone_number}

            </IconButton>
      
                


        </Typography>
                    
                    </Grid>
            </Grid>
            {GlobalState.userId ==state.listingInfo.seller ? (
                <Grid item container justifyContent="space-around">
                <Button variant="contained" color="primary" onClick={handleClickOpen}>Update</Button>
                <Button variant="contained" color="error" onClick={DeleteHandler}>Delete</Button>

                {/*Update*/}

                <Dialog open={open} onClose={handleClose} fullScreen closeDialog={handleClose} >
        <ListingUpdate listingData={state.listingInfo} closeDialog={handleClose}/>
      </Dialog>
              </Grid>
            ):("")}
          
       
        </Grid>
        <Grid>
         
        </Grid>

        {/* Map */}
        <Grid item container style={{marginTop:"1rem"}} spacing={1} justifyContent="space-between">
          <Grid item xs={3} style={{overflow:"auto",height:"35rem"}} >

            

          {state.listingInfo.listing_pois_within_10km.map(poi=>{
function DegreeToRadian(coordinate){
  return coordinate*Math.PI/180

}
function CalculateDistance() {
  const latitude1=DegreeToRadian(state.listingInfo.latitude)
  const longitude1=DegreeToRadian(state.listingInfo.longitude)
  
  const latitude2=DegreeToRadian(poi.location.coordinates[0])
  const longitude2=DegreeToRadian(poi.location.coordinates[1])



  // The formula
  const latDiff = latitude2 - latitude1;
  const lonDiff = longitude2 - longitude1;
  const R = 6371000 / 1000;

  const a =
    Math.sin(latDiff / 2) * Math.sin(latDiff / 2) +
    Math.cos(latitude1) *
      Math.cos(latitude2) *
      Math.sin(lonDiff / 2) *
      Math.sin(lonDiff / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  const d = R * c;

  const dist =
    Math.acos(
      Math.sin(latitude1) * Math.sin(latitude2) +
        Math.cos(latitude1) *
          Math.cos(latitude2) *
          Math.cos(lonDiff)
    ) * R;
  return dist.toFixed(2);
}
   
    return(

      <div key={poi.id} style={{marginBottom:"0.5rem", border:"1px solid black"}}>
        <Typography variant='h6'>
          {poi.name}
        </Typography>
        <Typography variant='subtitle1'>
          {poi.type} | <span style={{fontWeight:"bolder",color:"green"}}>{CalculateDistance()} kilometers</span>
        </Typography>


      </div>
      
     

    )
  })}

          </Grid>
          <Grid item xs={9} style={{height:"35rem"}}>

          <MapContainer center={[state.listingInfo.latitude,state.listingInfo.longitude]} zoom={14} scrollWheelZoom={true}>
  <TileLayer
    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
  />
  <Marker position={[state.listingInfo.latitude,state.listingInfo.longitude]}>
    <Popup>
      {state.listingInfo.title}
    </Popup>
  </Marker>
  {state.listingInfo.listing_pois_within_10km.map(poi=>{
    function PoiIcon(){
      if(poi.type=== 'Stadium'){
        return StadiumIcon
      }
      else if(poi.type=== 'University'){
        return UniversityIcon

      }
      else if(poi.type=== 'Hospital'){
        return HospitalIcon
      }
      
    }
    return(
      
      <Marker key={poi.id} position={[poi.location.coordinates[0],poi.location.coordinates[1]]}
      icon={PoiIcon()}
      >
        <Popup>
          {poi.name}
        </Popup>
      </Marker>

    )
  })}


</MapContainer>

          </Grid>

        </Grid>



       

    </div>
  )
}

export default ListingDetail