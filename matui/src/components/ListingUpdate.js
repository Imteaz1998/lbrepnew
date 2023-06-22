import React,{useEffect, useState,useRef,useMemo, useContext} from 'react'
import {Grid,AppBar,Typography, Button,Card,CardHeader,CardMedia,CardContent, CircularProgress, TextField, FormControlLabel, Checkbox,InputAdornment } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { useNavigate } from 'react-router-dom';
import Axios from 'axios';
import {useImmerReducer } from "use-immer"

import StateContext from '../context/StateContext';
const useStyles=makeStyles({
    formContainer:{
        width:"75%",
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

const outerUttaraOptions = [
	{
		value: "",
		label: "",
	},
	{
		value: "Khilkhet",
		label: "khilkhet",
	},
	{
		value: "Nikunju",
		label: "Nikunju",
	},
	{
		value: "Airport",
		label: "Airport",
	},
	{
		value: "Ashulia",
		label: "Ashulia",
	},
	{
		value: "Mirpur 1",
		label: "Mirpur 1",
	},
	{
		value: "Kazipara",
		label: "Kazipara",
	},
	{
		value: "Shewrapara",
		label: "Shewrapara",
	},
	{
		value: "Mirpur 2",
		label: "Mirpur 2",
	},
	{
		value: "Mirpur 10",
		label: "Mirpur 10",
	},
	{
		value: "Abdullahpur",
		label: "Abdullahpur",
	},
	{
		value: "Mohammadpur",
		label: "Mohammadpur",
	},
	{
		value: "Malibhag",
		label: "Malibhag",
	},
	{
		value: "Firmgate",
		label: "Firmgate",
	},
	{
		value: "Kawranbazar",
		label: "Kawranbazar",
	},
	{
		value: "Bhasundhara",
		label: "Bhasundhara",
	},
	{
		value: "Shahbhag",
		label: "Shahbhag",
	},
	{
		value: "Gulistan",
		label: "Gulistan",
	},
	{
		value: "Gulshan 1",
		label: "Gulshan 1",
	},
	{
		value: "Banani",
		label: "Banani",
	},
	{
		value: "Gulshan 2",
		label: "Gulshan 2",
	},
];
const listingTypeOptions=[
  {
    value:"",
    label:"",
  },
  {
    value:"Apartment",
    label:"Apartment",
  },
  {
    value:"House",
    label:"House",
  },
  {
    value:"Office",
    label:"Office",
  },
]
const propertyTypeOptions=[
  {
    value:"",
    label:"",
  },
  {
    value:"Sale",
    label:"Sale",
  },
  {
    value:"Rent",
    label:"Rent",
  },

]
const rentalFrequencyOptions=[
  {
    value:"",
    label:"",
  },
  {
    value:"Day",
    label:"Day",
  },
  {
    value:"Week",
    label:"Week",
  },
  {
    value:"Month",
    label:"Month",
  },

]




function ListingUpdate(props) {
const classes=useStyles();
const navigate=useNavigate();
const GlobalState=useContext(StateContext)

const initialState={
    titleValue:props.listingData.title,
    listingTypeValue:props.listingData.listing_type,
    descriptionValue:props.listingData.description,
    propertyStatusValue:props.listingData.property_status,
    priceValue:props.listingData.price,
    rentalFrequencyValue:props.listingData.rental_frequency,
    roomsValue:props.listingData.rooms,
    furnishedValue:props.listingData.furnished,
    poolValue:props.listingData.pool,
    elevatorValue:props.listingData.elevator,
    cctvValue:props.listingData.cctv,
    parkingValue:props.listingData.parking,
    sendRequest:0,
  }
  function ReducerFunction(draft,action){
    switch(action.type){
      case "changeSendRequest":
        draft.sendRequest=draft.sendRequest+1;
        break;
  
      case 'catchTitleChange':
        draft.titleValue=action.TitleChosen
        break;
      case 'catchListingTypeChange':
            draft.listingTypeValue=action.listingTypeChosen
            break;
      case 'catchDescriptionChange':
                draft.descriptionValue=action.DescriptionChosen
                break;
    
        case 'catchPropertyStatusChange':
                            draft.propertyStatusValue=action.PropertyStatusChosen
                            break;
        case 'catchPriceChange':
                                draft.priceValue=action.PriceChosen
                                break;
                                case 'catchRentalFrequencyChange':
                                    draft.rentalFrequencyValue=action.RentalFrequencyChosen
                                    break;
                                    case 'catchRoomChange':
                                        draft.roomsValue=action.RoomChosen
                                        break;
                                        case 'catchFurnishedChange':
                                            draft.furnishedValue=action.FurnishedChosen
                                            break;
                                            case 'catchPoolChange':
                                                draft.poolValue=action.PoolChosen
                                                break;
                                                case 'catchElevatorChange':
                                                draft.elevatorValue=action.ElevatorChosen
                                                break;
                                                case 'catchCCTVChange':
                                                    draft.cctvValue=action.CCTVChosen
                                                    break;
                                                    case 'catchParkingChange':
                                                        draft.parkingValue=action.ParkingChosen
                                                        break;
                                                        
        
  
    }
  
  }
  const[state,dispatch]=useImmerReducer(ReducerFunction,initialState)

 

  //pictures uploading




  //No longer need it might delete later

  function priceDisplay(){
    if (state.propertyStatusValue === 'Rent' && state.rentalFrequencyValue==='Day'){
       return 'Price per day*'
    }
    else if (state.propertyStatusValue === 'Rent' && state.rentalFrequencyValue==='Week'){
      return 'Price per Week*'
   }
   else if (state.propertyStatusValue === 'Rent' && state.rentalFrequencyValue==='Month'){
    return 'Price per Month*'
  }
  else{
    return 'Price*'

  }
  }
 

  // request for profile info


  //Formsubmit

function FormSubmit(e){
    e.preventDefault();
    console.log("Form is submitted");
    dispatch({type:"changeSendRequest"});
}
useEffect(()=>{
  if(state.sendRequest){
    async function UpdateProperty(){
      const formData= new FormData()
      if(state.listingTypeValue === "Office"){

        formData.append('title',state.titleValue)
        formData.append('description',state.descriptionValue)
        formData.append('listing_type',state.listingTypeValue)
        formData.append('property_status',state.propertyStatusValue)
        formData.append('price',state.priceValue)
        formData.append('rental_frequency',state.rentalFrequencyValue)
        formData.append('rooms',0)
        formData.append('furnished',state.furnishedValue)
        formData.append('pool',state.poolValue)
        formData.append('elevator',state.elevatorValue)
        formData.append('cctv',state.cctvValue)
        formData.append('parking',state.parkingValue)
        formData.append("seller",GlobalState.userId)

      }
      else{
      formData.append('title',state.titleValue)
      formData.append('description',state.descriptionValue)
      formData.append('listing_type',state.listingTypeValue)
      formData.append('property_status',state.propertyStatusValue)
      formData.append('price',state.priceValue)
      formData.append('rental_frequency',state.rentalFrequencyValue)
      formData.append('rooms',state.roomsValue)
      formData.append('furnished',state.furnishedValue)
      formData.append('pool',state.poolValue)
      formData.append('elevator',state.elevatorValue)
      formData.append('cctv',state.cctvValue)
      formData.append('parking',state.parkingValue)
      formData.append("seller",GlobalState.userId)

      }
      


      try{
        const response = await Axios.patch(
            `http://127.0.0.1:8000/api/listings/${props.listingData.id}/update/`
        ,formData);
        console.log(response.data)
        navigate(0)

      }catch(e){
        console.log(e.response)
      }

    }
    UpdateProperty()
  }

},[state.sendRequest])

// Changing the map view depending on the chosen borough


return (
    <div className={classes.formContainer}>
        <form onSubmit={FormSubmit}>
        <Grid item container justifyContent="center">
            <Typography variant='h4'>Update property</Typography>

            </Grid>
            <Grid item container style={{marginTop : "1rem" }}>
            <TextField 
            id="title" 
            label="Title*" 
            variant="outlined" fullWidth color="secondary"
            value={state.titleValue}
            onChange={(e)=>dispatch({type:'catchTitleChange',
            TitleChosen:e.target.value})}/>

            </Grid>
            <Grid item container justifyContent='space-between'>
            <Grid xs={5.5} item container style={{marginTop : "1rem" }}>
            <TextField 
            id="listingType" 
            label="Listing Type*" 
            variant="standard" fullWidth color="secondary"
            value={state.listingTypeValue}
            onChange={(e)=>dispatch({type:'catchListingTypeChange',
            listingTypeChosen:e.target.value})}
            select
            SelectProps={{
              native: true,
            }}
            >

             {listingTypeOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
             ))}

            </TextField>

            </Grid>
            <Grid xs={5.5} item container style={{marginTop : "1rem" }}>
            <TextField 
            id="propertystatus" 
            label="Property Status*" 
            variant="standard" fullWidth color="secondary"
            value={state.propertyStatusValue}
            onChange={(e)=>dispatch({type:'catchPropertyStatusChange',
          PropertyStatusChosen:e.target.value})}
          select
          SelectProps={{
            native: true,
          }}
          >
            {propertyTypeOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
             ))}
            </TextField>

            </Grid>
            </Grid>

           
            
           <Grid item container justifyContent="space-between">
           
            <Grid item container justifyContent='space-between'>
            <Grid  xs={5.5} item container style={{marginTop : "1rem" }}>
            <TextField 
            id="rentalFrequency" 
            label="Rental Frequency" 
            variant="standard" fullWidth color="secondary"
            disabled={state.propertyStatusValue === "Sale"?true: false}
            value={state.rentalFrequencyValue}
            onChange={(e)=>dispatch({type:'catchRentalFrequencyChange',
            RentalFrequencyChosen:e.target.value})}
            select
            SelectProps={{
              native: true,
            }}
            >
              {rentalFrequencyOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
             ))}
              </TextField>

            </Grid>
       
            <Grid  xs={5.5} item container style={{marginTop : "1rem" }}>
            <TextField 
            id="price" 
            type="number"
            label={priceDisplay()}
            variant="outlined" fullWidth color="secondary"
            
            value={state.priceValue}
            onChange={(e)=>dispatch({type:'catchPriceChange',
            PriceChosen:e.target.value})}/>

            </Grid>
            </Grid>
            
            <Grid item container style={{marginTop : "1rem" }}>
            <TextField 
            id="description" 
            label="Description" 
            variant="outlined" fullWidth color="secondary"
            multiline
            rows={6}
            value={state.descriptionValue}
            onChange={(e)=>dispatch({type:'catchDescriptionChange',
            DescriptionChosen:e.target.value})}/>

            </Grid>
          {state.listingTypeValue === "Office" ?(
            ""
            ):(
            
              <Grid xs={3} item container style={{marginTop : "1rem" }}>
              <TextField 
              id="room" 
              type="number"
              label="Room number" 
              variant="outlined" fullWidth color="secondary"
              value={state.roomsValue}
              onChange={(e)=>dispatch({type:'catchRoomChange',
              RoomChosen:e.target.value})}/>
  
              </Grid>
          )}
          <Grid item container justifyContent="space-between">

          <Grid item xs={2} style={{marginTop : "1rem" }}>
              <FormControlLabel
              control={<Checkbox checked={state.furnishedValue}
              onChange={(e)=>dispatch({
              type:'catchFurnishedChange',
              FurnishedChosen:e.target.checked})}
              />}
              label="Furnished"
              
              />
         
            </Grid>
            <Grid item xs={2} style={{marginTop : "1rem" }}>
            <FormControlLabel
              control={<Checkbox checked={state.poolValue}
              onChange={(e)=>dispatch({
              type:'catchPoolChange',
              PoolChosen:e.target.checked})}
              />}
              label="Pool"
              
              />
            </Grid>
            <Grid item xs={2} style={{marginTop : "1rem" }}>
            <FormControlLabel
              control={<Checkbox checked={state.elevatorValue}
              onChange={(e)=>dispatch({
              type:'catchElevatorChange',
              ElevatorChosen:e.target.checked})}
              />}
              label="Elevator"
              
              />
            </Grid>
            
            <Grid item xs={2} style={{marginTop : "1rem" }}>
            <FormControlLabel
              control={<Checkbox checked={state.cctvValue}
              onChange={(e)=>dispatch({
              type:'catchCCTVChange',
              CCTVChosen:e.target.checked})}
              />}
              label="CCTV"
              
              />
            </Grid>
            <Grid item xs={2} style={{marginTop : "1rem" }}>
            <FormControlLabel
              control={<Checkbox checked={state.parkingValue}
              onChange={(e)=>dispatch({
              type:'catchParkingChange',
              ParkingChosen:e.target.checked})}
              />}
              label="Parking"
              
              />
            </Grid>

          </Grid>





</Grid>








            
            
           
            <Grid item xs={8} container style={{marginTop : "1rem",marginLeft:"auto",marginRight:"auto" }}>
            <Button variant='contained'
            fullWidth
            type="submit"
            className={classes.registerBtn}>
                UPDATE

            </Button>
            </Grid>
           
        
       
        
        </form>
        <Button variant='contained' onClick={props.closeDialog}>Close</Button>
        
    
        

    </div>
  )
}

export default ListingUpdate