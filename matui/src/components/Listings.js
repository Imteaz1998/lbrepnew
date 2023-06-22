import { height } from '@mui/system'
import React,{useState,useEffect} from 'react'
import {Grid,AppBar,Typography, Button,Card,CardHeader,CardMedia,CardContent, CircularProgress,IconButton, CardActions } from '@mui/material';
//React leaflet
import { MapContainer, TileLayer, useMap,Marker,Popup, Polyline,Polygon } from 'react-leaflet'
import RoomIcon from '@mui/icons-material/Room';
import Axios from  "axios";
import houseIconpic from "./Assets/Mapicons/house.png";
import apartmentIconpic from "./Assets/Mapicons/apartment.png";
import officeIconpic from "./Assets/Mapicons/office.png";
import { useImmerReducer } from 'use-immer';
import { useNavigate } from 'react-router-dom';
import {Icon} from "leaflet";
import img1 from './Assets/image1.jpg'

import myListings from "./Assets/Data/Dummydata";
//Mui
import { makeStyles } from '@mui/styles';
import polygonOne from './Shape';
const useStyles=makeStyles({
  cardStyle:{
    margin:"0.5rem",
    border:'1px solid black',
    position:'relative',
  },
  pictureStyle:{
    paddingRight:'1rem',
    paddingLeft:"1rem",
    height:"20rem",
    width:"30rem",
    cursor:"pointer",

  },
  priceOverlay:{
    position:"absolute",
    backgroundColor:"green",
    zIndex:"1000",
    color:"white",
    top:"100px",
    left:"20px",
    padding:"5px"

  }
});

function Listings() {
  //fetch("http://127.0.0.1:8000/api/listings/").then((response)=>response.json()).then((data)=>console.log(data));
  const classes=useStyles();
  const navigate=useNavigate()
  const houseIcon= new Icon({
    iconUrl:houseIconpic,
    iconSize:[40,40],
  });
  const apartmentIcon= new Icon({
    iconUrl:apartmentIconpic,
    iconSize:[40,40],
  });
  const officeIcon= new Icon({
    iconUrl:officeIconpic,
    iconSize:[40,40],
  });
  const [latitude,setLatitude]=useState(23.863756509243302)
  const [longitude,setLongitude]=useState(90.40416202576878)

  //Map indicator

  const initialState={
    
    mapInstance: null,
   
  
  }
  function ReducerFunction(draft,action){
    switch(action.type){
  

      case "getMap":
      draft.mapInstance =action.mapData
      break;
        
  
    }
  
  }
  const[state,dispatch]=useImmerReducer(ReducerFunction,initialState)
  function TheMapComponent(){
    const map=useMap();
    dispatch({ type:"getMap",mapData:map})
    return null;
  
  
  }

  const polyOne = [
    [51.505, -0.09],
    [51.51, -0.1],
    [51.51, -0.12],
  ]
  const [allListings,setallListings]=useState([]);
  const [dataIsLoading,setDataIsLoading]=useState(true)
  useEffect(()=>{
    const source=Axios.CancelToken.source();

    async function GetAllListings(){
      try{
        const response=await Axios.get("http://127.0.0.1:8000/api/listings/",{cancelToken:source.token})
      //console.log(response);
      setallListings(response.data);
      setDataIsLoading(false)

      }catch(error){
        console.log(error.response)

      }
      
    }
    GetAllListings();

    return ()=>{
      source.cancel();
       
    }


  },[]);
  if(dataIsLoading===false){
    console.log(allListings[0].location);
  }

  if(dataIsLoading === true){
    return (
      <Grid container justifyContent="center" alignItems="center" style={{height:"100vh"}}>
        <CircularProgress/>
      </Grid>
    )
  }

 


  return (
    <Grid container>
      <Grid item xs={4}>
      {allListings.map((listing)=>{
        return(

          <Card key={listing.id} className={classes.cardStyle}>
      <CardHeader
        action={
        <IconButton aria-label="settings" 
        onClick={()=>state.mapInstance.flyTo([listing.latitude, listing.longitude],16)}
        >
         <RoomIcon />
          </IconButton>
        }
        title={listing.title}
       
      />
      <CardMedia
      className={classes.pictureStyle}
        component="img"
        image={listing.picture1}
        alt={listing.title}
        onClick={()=>navigate(`/listings/${listing.id}`)}
      />
      <CardContent>
        <Typography variant="body2">
         {listing.description.substring(0,200)}...
        </Typography>
      </CardContent>
      {listing.property_status==='Sale'?(<Typography className={classes.priceOverlay}>{listing.listing_type}: ৳{listing.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</Typography>
     ):(<Typography className={classes.priceOverlay}>{listing.listing_type}: ৳{listing.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}/{listing.rental_frequency}</Typography>
     )}
     <CardActions disableSpacing>
      <IconButton aria-label="add to favourites">

        {listing.seller_agency_name}

      </IconButton>

     </CardActions>
      
      
    </Card>

        );
      })}
        </Grid>
      <Grid item xs={8} style={{marginTop:"0.5rem"}}>
        <AppBar position="sticky">
        <div style={{height: "100vh"}}>
      <MapContainer center={[23.863756509243302, 90.40416202576878]} zoom={14} scrollWheelZoom={true}>
         <TileLayer
     attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
     url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <TheMapComponent/>
     
      {allListings.map((listing)=>{
        function IconDisplay(){
          if(listing.listing_type === 'House'){
            return houseIcon
          }
          else if(listing.listing_type === 'Apartment'){
            return apartmentIcon
          }
          else if(listing.listing_type === 'Office'){
            return officeIcon

          }
        }
        return(
          <Marker 
          key={listing.id}
          icon={IconDisplay()}
          position={[
            listing.latitude,
            listing.longitude,
          ]}
          >

       <Popup>
        <Typography variant='h5'>{listing.title}</Typography>
        <img src={listing.picture1} style={{height:"14rem",width:"18rem",cursor:"pointer"}}
        onClick={()=>navigate(`/listings/${listing.id}`)}/>
        <Typography variant='body1'>{listing.description.substring(0,150)}...
        </Typography>
        
        <Button variant='contained' fullWidth  onClick={()=>navigate(`/listings/${listing.id}`)}>Details</Button>
       
       </Popup>
            
            
          </Marker>

        );
      })}
     
      </MapContainer>
    </div>
        </AppBar>
     
      </Grid>

    </Grid>
    
 
    
  );
}

export default Listings

