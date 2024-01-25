import { Button } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import userpool from '../userpool'
import { logout } from '../services/authenticate';
import axios from "axios";

const Dashboard = () => {

  const Navigate = useNavigate();
  const [database, setDatabase] = useState([])

  useEffect(() => {
    let user = userpool.getCurrentUser();
    console.log(user);
    if (!user) {
      Navigate('/login');
    } else {
      // SuccessLoggedIn();
      const config = {
        method: 'get',
        url: "http://localhost:3020" + "/scanTable"
      };
      axios(config).then((response) => {
        var responseDataJson = JSON.parse(response.data)
        setDatabase(responseDataJson);
        console.log("RESPONSE...........................", response.data)
      });

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

      <h1>Response</h1>

      <table id="users">
        <tr>
          <th>UserId</th>
          <th>UserName</th>
          <th>Points</th>
        </tr>
        {
          database && database.map((oneEntry) => (
            <DatabaseDisplay UserId={oneEntry.UserId.S} UserName={oneEntry.UserName.S} Points={oneEntry.Points.N} />
          ))
        }

      </table>
    </div>
  )
}

function DatabaseDisplay(props) {
  console.log("props UserId S..........", props.UserId.S)
  console.log("props User Id ========================", props.UserId)

  console.log("Points ^^^^^^^^^^^^^^^^^^^^^", props.Points)
  return (
    <>
      <tr>
        <td>{props.UserId}</td>
        <td>{props.UserName}</td>
        <td>{props.Points}</td>
      </tr>
    </>
  )
}

/*
async function SuccessLoggedIn() {

  const config = {
    method: 'get',
    url: "http://localhost:3020" + "/getItem"
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
*/
export default Dashboard