import React,{useEffect, useState,useRef,useMemo, useContext} from 'react'
import {Grid,AppBar,Typography, Button,Card,CardHeader,CardMedia,CardContent, CircularProgress, TextField, FormControlLabel, Checkbox,InputAdornment } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { useNavigate } from 'react-router-dom';
import Axios from 'axios';
import {useImmerReducer } from "use-immer"
import { MapContainer, TileLayer, useMap,Marker } from 'react-leaflet'
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
const areaOptions=[
  {
    value:'',
    label:'',
  },
  {
    value:'Inner Uttara',
    label:'Inner Uttara',
  },
  {
    value:'Outer Uttara',
    label:'Outer Uttara',
  },

]

const innerUttaraOptions = [
	{
		value: "",
		label: "",
	},
	{
		value: "Sector 1",
		label: "Sector 1",
	},
	{
		value: "Sector 2",
		label: "Sector 2",
	},
	{
		value: "Sector 3",
		label: "Sector 3",
	},
	{
		value: "Sector 4",
		label: "Sector 4",
	},
	{
		value: "Sector 5",
		label: "Sector 5",
	},
	{
		value: "Sector 6",
		label: "Sector 6",
	},
	{
		value: "Sector 7",
		label: "Sector 7",
	},
	{
		value: "Sector 8",
		label: "Sector 8",
	},
	{
		value: "Sector 9",
		label: "Sector 9",
	},
	{
		value: "Sector 10",
		label: "Sector 10",
	},
	{
		value: "Sector 11",
		label: "Sector 11",
	},
	{
		value: "Sector 12",
		label: "Sector 12",
	},
	{
		value: "Sector 13",
		label: "Sector 13",
	},
];

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


function AddProperty() {
const classes=useStyles();
const navigate=useNavigate();
const GlobalState=useContext(StateContext)

const initialState={
    titleValue:'',
    listingTypeValue:'',
    descriptionValue:'',
    areaValue:'',
    boroughValue:'',
    latitudeValue:'',
    longitudeValue:'',
    propertyStatusValue:'',
    priceValue:'',
    rentalFrequencyValue:'',
    roomsValue:'',
    furnishedValue:false,
    poolValue:false,
    elevatorValue:false,
    cctvValue:false,
    parkingValue:false,
    picture1Value:"",
    picture2Value:"",
    picture3Value:"",
    picture4Value:"",
    mapInstance: null,
    markerPosition: {
      lat: "23.863756509243302", 
      lng:"90.40416202576878",

    },
    uploadedPictures:[],
    sendRequest:0,
    userProfile:{
      agencyName:"",
      phoneNumber:"",
    }

  
  }
  function ReducerFunction(draft,action){
    switch(action.type){
      case "catchUserProfileInfo":
        draft.userProfile.agencyName=action.profileObject.agency_name;
        draft.userProfile.phoneNumber=action.profileObject.phone_number;
        break;

      case "changeSendRequest":
        draft.sendRequest=draft.sendRequest+1;
        break;
  
      case "catchUploadedPictures":
        draft.uploadedPictures=action.pictureChosen

      case 'catchTitleChange':
        draft.titleValue=action.TitleChosen
        break;
      case 'catchListingTypeChange':
            draft.listingTypeValue=action.listingTypeChosen
            break;
      case 'catchDescriptionChange':
                draft.descriptionValue=action.DescriptionChosen
                break;
       case 'catchAreaChange':
                    draft.areaValue=action.AreaChosen
                    break;
        case 'catchBoroughChange':
                        draft.boroughValue=action.BoroughChosen
                        break;
    
       case 'catchlatitudeChange':
                    draft.latitudeValue=action.latitudeChosen
                    break;
       case 'catchlongitudeChange':
                        draft.longitudeValue=action.longitudeChosen
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
                                                        case 'catchPicture1Change':
                                                            draft.picture1Value=action.Picture1Chosen
                                                            break;
                                                            case 'catchPicture2Change':
                                                                draft.picture2Value=action.Picture2Chosen
                                                                break;
                                                                case 'catchPicture3Change':
                                                                    draft.picture3Value=action.Picture3Chosen
                                                                    break;
                                                                    case 'catchPicture4Change':
                                                                        draft.picture4Value=action.Picture4Chosen
                                                                        break;

                                                                    case "getMap":
                                                                      draft.mapInstance =action.mapData
                                                                      break;
           case 'changeMarkerPosition':
            draft.markerPosition.lat=action.changeLatitude
            draft.markerPosition.lng=action.changeLongiitude
            draft.latitudeValue=""
            draft.longitudeValue=""
  
    }
  
  }
  const[state,dispatch]=useImmerReducer(ReducerFunction,initialState)
  function TheMapComponent(){
    const map=useMap();
    dispatch({ type:"getMap",mapData:map})
    return null;
  
  
  }
  //Draggable marker


  const markerRef = useRef(null)
  const eventHandlers = useMemo(
    () => ({
      dragend() {
        const marker = markerRef.current
        dispatch({type:'catchlatitudeChange',latitudeChosen: marker.getLatLng().lat})
        dispatch({type:'catchlongitudeChange',longitudeChosen: marker.getLatLng().lng})
        //console.log(marker.getLatLng());
      },
    }),
    [],
  )

  //pictures uploading
  useEffect(()=>{
    if(state.uploadedPictures[0]){
      dispatch({
        type:'catchPicture1Change',
        Picture1Chosen:state.uploadedPictures[0]
      })
    }


  },[state.uploadedPictures[0]])
  useEffect(()=>{
    if(state.uploadedPictures[1]){
      dispatch({
        type:'catchPicture2Change',
        Picture2Chosen:state.uploadedPictures[1]
      })
    }


  },[state.uploadedPictures[1]])
  useEffect(()=>{
    if(state.uploadedPictures[2]){
      dispatch({
        type:'catchPicture3Change',
        Picture3Chosen:state.uploadedPictures[2]
      })
    }


  },[state.uploadedPictures[2]])
  useEffect(()=>{
    if(state.uploadedPictures[3]){
      dispatch({
        type:'catchPicture4Change',
        Picture4Chosen:state.uploadedPictures[3]
      })
    }


  },[state.uploadedPictures[3]])

  //No longer need it might delete later

  useEffect(()=>{
    console.log(state.latitudeValue,state.longitudeValue)

  },[state.latitudeValue,state.longitudeValue]);
 
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
  function submitButtonDisplay(){
    if(GlobalState.userIsLogged && state.userProfile.agencyName !== null && state.userProfile.agencyName !=='' && state.userProfile.phoneNumber !==null && state.userProfile.phoneNumber !==""){
      return (
        <Button className={classes.registerBtn} variant='contained' fullWidth type="submit">ADD</Button>
      )
    }
    else if(GlobalState.userIsLogged && (state.userProfile.agencyName === null || state.userProfile.agencyName === "" || state.userProfile.phoneNumber=== null || state.userProfile.phoneNumber ===""))
    {
      return(
      <Button className={classes.registerBtn} onClick={()=>navigate("/profile")} variant='outlined' fullWidth>Complete your profile to add a property</Button>

    )}
    else if(!GlobalState.userIsLogged)
    {
      return(
      <Button className={classes.registerBtn} onClick={()=>navigate("/login")} variant='outlined' fullWidth >Sign in to add a property</Button>

    )}
  }

  // request for profile info
  useEffect(()=>{
    async function GetProfileInfo(){
      try{
        const response = await Axios.get(`http://127.0.0.1:8000/api/profiles/${GlobalState.userId}/`);
        console.log(response.data);
        dispatch({type:"catchUserProfileInfo",
        profileObject:response.data})

      }
     
      catch(e){
        console.log(e.response)
      

      }
      
    }
    GetProfileInfo();

  },[])

  //Formsubmit

function FormSubmit(e){
    e.preventDefault();
    console.log("Form is submitted");
    dispatch({type:"changeSendRequest"});
}
useEffect(()=>{
  if(state.sendRequest){
    async function AddProperty(){
      const formData= new FormData()
      formData.append('title',state.titleValue)
      formData.append('description',state.descriptionValue)
      formData.append('area',state.areaValue)
      formData.append('borough',state.boroughValue)
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
      formData.append('latitude',state.latitudeValue)
      formData.append('longitude',state.longitudeValue)
      formData.append('picture1',state.picture1Value)
      formData.append('picture2',state.picture2Value)
      formData.append('picture3',state.picture3Value)
      formData.append('picture4',state.picture4Value)
      formData.append("seller",GlobalState.userId)


      try{
        const response = await Axios.post(
          "http://127.0.0.1:8000/api/listings/create/"
        ,formData);
        console.log(response.data)
        navigate('/listings')

      }catch(e){
        console.log(e.response)
      }

    }
    AddProperty()
  }

},[state.sendRequest])

// Changing the map view depending on the chosen borough

useEffect(() => {
	if (state.boroughValue === "Sector 1") {
		state.mapInstance.setView([23.858468148963926, 90.39986230425127], 12);
    dispatch({
      type:'changeMarkerPosition',
      changeLatitude:23.858468148963926,
      changeLongiitude: 90.39986230425127,
    })
	} else if (state.boroughValue === "Sector 2") {
		state.mapInstance.setView([23.834563590406848, 90.50760574120679], 12);
    dispatch({
      type:'changeMarkerPosition',
      changeLatitude:23.834563590406848,
      changeLongiitude: 90.50760574120679,
    })
	} else if (state.boroughValue === "Sector 3") {
		state.mapInstance.setView([23.8637254132743, 90.39682355854261], 12);
    dispatch({
      type:'changeMarkerPosition',
      changeLatitude:23.8637254132743,
      changeLongiitude: 90.39682355854261,
    })
  } else if (state.boroughValue === "Sector 4") {
		state.mapInstance.setView([23.86446566029261, 90.40241227377115], 12);
    dispatch({
      type:'changeMarkerPosition',
      changeLatitude:23.86446566029261,
      changeLongiitude: 90.40241227377115,
    })
  } else if (state.boroughValue === "Sector 5") {
		state.mapInstance.setView([23.864414161429966, 90.39023075675748], 12);
    dispatch({
      type:'changeMarkerPosition',
      changeLatitude:23.864414161429966,
      changeLongiitude:  90.39023075675748,
    })
  } else if (state.boroughValue === "Sector 6") {
		state.mapInstance.setView([23.871141551240694, 90.40331834467936], 12);
    dispatch({
      type:'changeMarkerPosition',
      changeLatitude:23.871141551240694,
      changeLongiitude: 90.40331834467936,
    })
  } else if (state.boroughValue === "Sector 7") {
		state.mapInstance.setView([23.87055959829721, 90.3980406358967], 12);
    dispatch({
      type:'changeMarkerPosition',
      changeLatitude:23.87055959829721,
      changeLongiitude: 90.3980406358967,
    })
  } else if (state.boroughValue === "Sector 8") {
		state.mapInstance.setView([23.880450950903885, 90.41372353648283], 12);
    dispatch({
      type:'changeMarkerPosition',
      changeLatitude:23.880450950903885,
      changeLongiitude: 90.41372353648283,
    })
  } else if (state.boroughValue === "Sector 9") {
		state.mapInstance.setView([23.877285894431754, 90.39791165251687], 12);
    dispatch({
      type:'changeMarkerPosition',
      changeLatitude:23.877285894431754,
      changeLongiitude: 90.39791165251687,
    })
  } else if (state.boroughValue === "Sector 10") {
		state.mapInstance.setView([23.886915594845753, 90.39589352076206], 12);
    dispatch({
      type:'changeMarkerPosition',
      changeLatitude:23.886915594845753,
      changeLongiitude: 90.39589352076206,
    })
  } else if (state.boroughValue === "Sector 11") {
		state.mapInstance.setView([23.8765273561886, 90.38989930492542], 12);
    dispatch({
      type:'changeMarkerPosition',
      changeLatitude:23.8765273561886,
      changeLongiitude: 90.38989930492542,
    })
  } else if (state.boroughValue === "Sector 12") {
		state.mapInstance.setView([23.87107757045702, 90.38175348623444], 12);
    dispatch({
      type:'changeMarkerPosition',
      changeLatitude:23.87107757045702,
      changeLongiitude: 90.38175348623444,
    })
  } else if (state.boroughValue === "Sector 13") {
		state.mapInstance.setView([23.87199993242535, 90.38770795393395], 12);
    dispatch({
      type:'changeMarkerPosition',
      changeLatitude:23.87199993242535,
      changeLongiitude: 90.38770795393395,
    })
  } else if (state.boroughValue === "Khilkhet") {
		state.mapInstance.setView([23.832262816764644, 90.42691838043548], 12);
    dispatch({
      type:'changeMarkerPosition',
      changeLatitude:23.832262816764644,
      changeLongiitude: 90.42691838043548,
    })
  } else if (state.boroughValue === "Nikunju") {
		state.mapInstance.setView([23.823981056965454, 90.41887399993149], 12);
    dispatch({
      type:'changeMarkerPosition',
      changeLatitude:23.823981056965454,
      changeLongiitude: 90.41887399993149,
    })
  } else if (state.boroughValue === "Airport") {
		state.mapInstance.setView([23.850918449521952, 90.42057797471409], 12);
    dispatch({
      type:'changeMarkerPosition',
      changeLatitude:23.850918449521952,
      changeLongiitude: 90.42057797471409,
    })
  } else if (state.boroughValue === "Ashulia") {
		state.mapInstance.setView([23.89804042573808, 90.32563042591593], 12);
    dispatch({
      type:'changeMarkerPosition',
      changeLatitude:23.89804042573808,
      changeLongiitude: 90.32563042591593,
    })
  } else if (state.boroughValue === "Mirpur 1") {
		state.mapInstance.setView([23.793108887964014, 90.35673370036803], 12);
    dispatch({
      type:'changeMarkerPosition',
      changeLatitude:23.793108887964014,
      changeLongiitude: 90.35673370036803,
    })
  } else if (state.boroughValue === "Kazipara") {
		state.mapInstance.setView([23.799780548649892, 90.37508535382693], 12);
    dispatch({
      type:'changeMarkerPosition',
      changeLatitude:23.799780548649892,
      changeLongiitude: 90.37508535382693,
    })
  } else if (state.boroughValue === "Shewrapara") {
		state.mapInstance.setView([23.79173799620649, 90.37617303237536], 12);
    dispatch({
      type:'changeMarkerPosition',
      changeLatitude:23.79173799620649,
      changeLongiitude: 90.37617303237536,
    })
  } else if (state.boroughValue === "Mirpur 2") {
		state.mapInstance.setView([23.80579537094268, 90.35773523393217], 12);
    dispatch({
      type:'changeMarkerPosition',
      changeLatitude:23.80579537094268,
      changeLongiitude: 90.35773523393217,
    })
  } else if (state.boroughValue === "Mirpur 10") {
		state.mapInstance.setView([23.807867279989107, 90.36845214698715], 12);
    dispatch({
      type:'changeMarkerPosition',
      changeLatitude:23.807867279989107,
      changeLongiitude: 90.36845214698715,
    })
  } else if (state.boroughValue === "Abdullahpur") {
		state.mapInstance.setView([23.8779379482967, 90.40221605670028], 12);
    dispatch({
      type:'changeMarkerPosition',
      changeLatitude:23.8779379482967,
      changeLongiitude: 90.40221605670028,
    })
  } else if (state.boroughValue === "Mohammadpur") {
		state.mapInstance.setView([23.76548159182932, 90.3598129219601], 12);
    dispatch({
      type:'changeMarkerPosition',
      changeLatitude:23.76548159182932,
      changeLongiitude: 90.3598129219601,
    })
  } else if (state.boroughValue === "Malibhag") {
		state.mapInstance.setView([23.746439923285664, 90.41341500442319], 12);
    dispatch({
      type:'changeMarkerPosition',
      changeLatitude:23.746439923285664,
      changeLongiitude: 90.41341500442319,
    })
  } else if (state.boroughValue === "Firmgate") {
		state.mapInstance.setView([23.75657554360276, 90.3872156693241], 12);
    dispatch({
      type:'changeMarkerPosition',
      changeLatitude:23.75657554360276,
      changeLongiitude: 90.3872156693241,
    })
  } else if (state.boroughValue === "Kawranbazar") {
		state.mapInstance.setView([23.752284830606083, 90.39384799291224], 12);
    dispatch({
      type:'changeMarkerPosition',
      changeLatitude:23.752284830606083,
      changeLongiitude: 90.39384799291224,
    })
  } else if (state.boroughValue === "Bhasundhara") {
		state.mapInstance.setView([23.820552062272363, 90.44975576201469], 12);
    dispatch({
      type:'changeMarkerPosition',
      changeLatitude:23.820552062272363,
      changeLongiitude: 90.44975576201469,
    })
  } else if (state.boroughValue === "Shahbhag") {
		state.mapInstance.setView([23.740442147597673, 90.39464288251014], 12);
    dispatch({
      type:'changeMarkerPosition',
      changeLatitude:23.740442147597673,
      changeLongiitude: 90.39464288251014,
    })
  } else if (state.boroughValue === "Gulistan") {
		state.mapInstance.setView([23.72229888546666, 90.41468183111041], 12);
    dispatch({
      type:'changeMarkerPosition',
      changeLatitude:23.72229888546666,
      changeLongiitude: 90.41468183111041,
    })
  } else if (state.boroughValue === "Gulshan 1") {
		state.mapInstance.setView([23.78179798247175, 90.41665453961255], 12);
    dispatch({
      type:'changeMarkerPosition',
      changeLatitude:23.78179798247175,
      changeLongiitude: 90.41665453961255,
    })
  } else if (state.boroughValue === "Banani") {
		state.mapInstance.setView([23.79349833028766, 90.40527634049668], 12);
    dispatch({
      type:'changeMarkerPosition',
      changeLatitude:23.79349833028766,
      changeLongiitude: 90.40527634049668,
    })
  } else if (state.boroughValue === "Gulshan 2") {
		state.mapInstance.setView([23.796741449291236, 90.41396139320099], 12);
    dispatch({
      type:'changeMarkerPosition',
      changeLatitude:23.796741449291236,
      changeLongiitude: 90.41396139320099,
    })
  }
}, [state.boroughValue]);
return (
    <div className={classes.formContainer}>
        <form onSubmit={FormSubmit}>
        <Grid item container justifyContent="center">
            <Typography variant='h4'>ADD A PROPERTY</Typography>

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
           
            <Grid item container justifyContent="space-between">

            <Grid xs={5.5}item container style={{marginTop : "1rem" }}>
            <TextField 
            id="area" 
            label="Area*" 
            variant="standard" fullWidth color="secondary"
            value={state.areaValue}
            onChange={(e)=>dispatch({type:'catchAreaChange',
          AreaChosen:e.target.value})}
          select
          SelectProps={{
            native: true,
          }}

          >
              {areaOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
            

            </TextField>

            </Grid>
            <Grid xs={5.5} item container style={{marginTop : "1rem" }}>
            <TextField 
            id="borough" 
            label="Borough*" 
            variant="standard" fullWidth color="secondary"
            value={state.boroughValue}
            onChange={(e)=>dispatch({type:'catchBoroughChange',
          BoroughChosen:e.target.value})}
          select
          SelectProps={{
            native: true,
          }}

          >
             

          {state.areaValue === 'Inner Uttara'?  innerUttaraOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          )): "" }

           {state.areaValue === 'Outer Uttara'?  outerUttaraOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          )): "" }
            

            </TextField>

            </Grid>

            </Grid>

            

      

          
            </Grid>


            <Grid item container style={{height:"35rem",marginTop:"1rem"}}>
            <MapContainer center={[23.863756509243302, 90.40416202576878]} zoom={14} scrollWheelZoom={true}>
  <TileLayer
    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
  />
  <TheMapComponent/>

  <Marker
      draggable
      eventHandlers={eventHandlers}
      position={state.markerPosition}
      ref={markerRef}>
      
    </Marker>

</MapContainer>
            </Grid>

            
           
            
            <Grid item xs={6} container style={{marginTop : "1rem",marginLeft:"auto",marginRight:"auto" }}>
            <Button component="label" className={classes.picturesBtn} variant='contained' fullWidth >Upload pictures (Max 4)
            <input type="file"
            multiple
            accept='image/png, image/gif, image/jpeg, image/jpg'
            hidden
            onChange={(e)=>dispatch({
              type:"catchUploadedPictures",
              pictureChosen: e.target.files
            })}

            />
             </Button>
         
            </Grid>
            <Grid item container>
              <ul>
              {state.picture1Value? <li>{state.picture1Value.name}</li>:" "}
              {state.picture2Value? <li>{state.picture2Value.name}</li>:" "}
              {state.picture3Value? <li>{state.picture3Value.name}</li>:" "}
              {state.picture4Value? <li>{state.picture4Value.name}</li>:" "}
              </ul>
             
            </Grid>
            
            
           
            <Grid item xs={8} container style={{marginTop : "1rem",marginLeft:"auto",marginRight:"auto" }}>
            {submitButtonDisplay()}
            </Grid>
           
        
       
        
        </form>
        <Button onClick={()=>console.log(state.uploadedPictures)}>TEST</Button>
    
        

    </div>
  )
}

export default AddProperty