import { Button } from '@mui/material'
import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import userpool from '../userpool'
import { logout } from '../services/authenticate';
import axios from "axios";

const Dashboard = () => {

  const Navigate = useNavigate();

  useEffect(() => {
    let user = userpool.getCurrentUser();
    console.log(user);
    if (!user) {
      Navigate('/login');
    } else {
      SuccessLoggedIn();
    }
  }, []);

  const handleLogoout = () => {
    logout();
  };

  return (
    <div className='Dashboard'>
      <Button
        style={{ margin: "10px" }}
        variant='contained'
        onClick={handleLogoout}
      >
        Logout
      </Button>
    </div>
  )
}

async function SuccessLoggedIn() {

  const config = {
    method: 'get',
    url: "http://127.0.0.1:3010" + "/db/list"
  };
  const response = await axios(config);

  console.log("Response is......", response)

  return (
    <>
      <h1>Response....</h1>
      {{ response }}
    </>
  )
}

export default Dashboard