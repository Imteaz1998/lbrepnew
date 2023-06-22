import React,{useState,useContext} from 'react'
import {Link, useNavigate} from 'react-router-dom'
import { Button,Typography,Grid,AppBar,Toolbar,Menu,MenuItem } from '@mui/material';
import { makeStyles } from '@mui/styles';
import StateContext from '../context/StateContext';
import DispatchContext from '../context/DispatchContext';
import Axios from 'axios';

const useStyles=makeStyles({
  leftNav:{
    marginRight:"auto",
  },
  rightNav: {
    marginLeft:"auto",
    marginRight: "10rem",
  },
 
  propertyBtn:{
    backgroundColor:"green",
    color:"white",
    width:"15rem",
    fontSize:"1.1rem",
    marginRight:"1rem",
    '&:hover':{
      backgroundColor:"blue",
    },



  },
  loginBtn:{
    backgroundColor:"white",
    color:"black",
    width:"15rem",
    fontSize:"1.1rem",
    marginLeft:"1rem",
    '&:hover':{
      backgroundColor:"orangered",
      color:"white",
    },
  },
  profileBtn:{
    color:'black',
    backgroundColor:'white',
    width:"15rem",
    fontWeight:"bolder",
    borderRadius:"15px",
    marginBottom:"0.25rem",
    
  },
  logoutBtn:{
    color:'black',
    backgroundColor:'white',
    width:"15rem",
    fontWeight:"bolder",
    borderRadius:"15px"
  }


  


});

function Header() {
    const classes=useStyles();
    const navigate=useNavigate();
    const GlobalState=useContext(StateContext)
    const GlobalDispatch=useContext(DispatchContext)

  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  function HandleProfile(){
    setAnchorEl(null);
    navigate('/profile')
  }
  async function HandleLogout(){
    setAnchorEl(null);
    const confirmLogout=window.confirm("Are you sure you want to logout?")
   if(confirmLogout){
    try{
      const response=await Axios.post('http://127.0.0.1:8000/api-auth-djoser/token/logout/',GlobalState.userToken,
    { headers:{Authorization:'Token '.concat(GlobalState.userToken)}})
    console.log(response)
    GlobalDispatch({type:'logout'})
    navigate("/")


    }catch(e){
      console.log(e.response)
    }
   }
    
  }

  return (
    <>
     <AppBar position="static" style={{ backgroundColor:"black"}}>
        <Toolbar>
          <div className={classes.leftNav}>
          <Button onClick={()=>navigate("/")}  color="inherit"><Typography variant="h4">LBREP</Typography> </Button>
          </div>

          <div>
          <Button onClick={()=>navigate("/listings")} color="inherit" style={{marginRight:'2rem'}}><Typography varient="h6">Listings</Typography></Button>
          <Button onClick={()=>navigate("/agencies")} color="inherit" style={{marginRight:'2rem'}}><Typography varient="h6">Agencies</Typography></Button>
            
          </div>

          <div  className={classes.rightNav}>
          <Button onClick={()=>navigate("/addproperty")}  className={classes.propertyBtn}>Add property</Button>
          { GlobalState.userIsLogged ? (
            <Button 
            onClick={handleClick}
            //onClick={()=>navigate("/login")} 

            className={classes.loginBtn}>{GlobalState.userUsername}</Button>
          ):(
            <Button onClick={()=>navigate("/login")} className={classes.loginBtn}>Login</Button>
          )}
        <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
      >
        <MenuItem className={classes.profileBtn}onClick={HandleProfile}>Profile</MenuItem>
       
        <MenuItem className={classes.logoutBtn} onClick={HandleLogout}>Logout</MenuItem>
      </Menu>
          
            
          </div>
          
          
         
          
        </Toolbar>
      </AppBar>
    </>
  )
}

export default Header