import { Button } from '@mui/material';
import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import userpool from '../userpool';
import { logout, getAccessToken } from '../services/authenticate';
import axios from 'axios';
import DOMPurify from 'dompurify';
import * as yup from 'yup';

var jwt_token;

console.log("********************RE-RENDER********************")
// Save token to localStorage


const Dashboard = () => {
  const Navigate = useNavigate();
  const [database, setDatabase] = useState([]);
  const [changes, setChanges] = useState({});
  const [authToken, setAuthToken] = useState(null);
  // const [accessToken, setAccessToken] = useState(getAccessToken());
  // console.log(accessToken)



  useEffect(() => {
    const user = userpool.getCurrentUser();
    console.log(user);
    if (!user) {
      Navigate('/login');
    } else {



      // Retrieve token from localStorage
      jwt_token = localStorage.getItem('jwtToken');

      if (jwt_token) {
        // Set the authentication state using the stored token
        setAuthToken(jwt_token);
        // Perform any additional actions based on the presence of the token
      }

      console.log("................JWT TOKEN is.................", jwt_token);
      console.log("=================AUTH TOKEN is===========", authToken);

      const config = {
        method: 'get',
        headers: {
          'Authorization': `Bearer ${jwt_token}`,
        },
        url: 'http://localhost:3020' + '/scanTable',
      };
      axios(config).then((response) => {
        const responseDataJson = JSON.parse(response.data);
        setDatabase(responseDataJson);
        console.log('RESPONSE...........................', response.data);
      });
    }
  }, []);

  const handleLogout = () => {
    logout();
  };

  const saveChanges = () => {
    console.log('Saving changes....', changes);

    // SessionStorage is a bit more secure because it deletes the
    // cookie when browser is closed. But the expiration date is
    // really fast on this cookie so its about the same with local
    // storage anyways.
    jwt_token = localStorage.getItem('jwtToken');
    // Implement your save logic here using the 'changes' state
    // For example, send the changes to the server or update the database
    for (const [key, value] of Object.entries(changes)) {
      console.log("%%%%%%%%%%%%%TOKEN%%%%%%%%%%%%%%%%%%%%%", jwt_token)
      const config = {
        method: 'patch',
        headers: {
          'Authorization': `Bearer ${jwt_token}`,
        },
        url: 'http://localhost:3020' + `/api/v1/users/${key}/${value}`,
      };
      axios(config).then((response) => {
        const responseDataJson = JSON.parse(response.data);
        console.log('RESPONSE...........................', response.data);
      }).catch((error) => console.log("Axios Error:", error));
    }
  };

  const cancelChanges = () => {
    console.log('Cancelling.....');
    // Reset the 'changes' state to discard any unsaved changes
    setChanges({});
    window.location.reload(); // Refresh the page so all changes are discarded.
  };

  const handleInputChange = async (userId, newValue) => {

    newValue = DOMPurify.sanitize(newValue); // santize the input 

    // Validate the input
    const schema = yup.object().shape({
      newValue: yup.number().required().positive().integer(),
    });

    // Validate the input
    try {
      await schema.validate({ newValue });
    } catch (error) {
      console.error('Validation failed:', error);
      return;
    }

    setChanges((prevChanges) => ({
      ...prevChanges,
      [userId]: newValue,
    }));
  };

  return (
    <div className='Dashboard'>
      <Button style={{ margin: '10px' }} variant='contained' onClick={handleLogout}>
        Logout
      </Button>

      <h1>Response</h1>

      <table id='users'>
        <thead>
          <tr>
            <th>Edit</th>
            <th>UserId</th>
            <th>UserName</th>
            <th>Points</th>
          </tr>
        </thead>
        <tbody>
          {database &&
            database.map((oneEntry, index) => (
              <DatabaseDisplay
                key={oneEntry.UserId.S}
                UserId={oneEntry.UserId.S}
                UserName={oneEntry.UserName.S}
                Points={oneEntry.Points.N}
                onInputChange={handleInputChange}
              />
            ))}
        </tbody>
      </table>
      <button className='saveChangesBtn' type='button' onClick={saveChanges}>
        Save Changes
      </button>
      <button className='cancelChangesBtn' type='button' onClick={cancelChanges}>
        Cancel
      </button>
    </div>
  );
};

//document.getElementById(previousRadioId).disabled = false;
//document.getElementById(previousRadioId).disabled = true;

const DatabaseDisplay = (props) => {
  const [inputValue, setInputValue] = useState(props.Points);
  //const [previousRadioId, setPreviousRadioId] = useState(0);

  const handleInputChange = (e) => {
    const newValue = e.target.value;
    console.log(`Input for UserId ${props.UserId} changed:`, newValue);
    setInputValue(newValue);
    props.onInputChange(props.UserId, newValue);
  };

  const radioChecked = () => {
    console.log("user id...................", props.UserId);

    var radioInputElement = document.getElementById(`myRadio-${props.UserId}`);
    var pointsInputElement = document.getElementById(`myInput-${props.UserId}`);

    // Enable the corrosponding points text box when the radio button is checked.
    if (radioInputElement.checked) { pointsInputElement.disabled = false }
    if (!radioInputElement.checked) { pointsInputElement.disabled = true }

    // All of the radio buttons that are not currently selected, disable the input for
    // all points input text box
    const allInputBtns = document.querySelectorAll(".formInputPoints")
    allInputBtns.forEach((input) => {
      if (input.id != `myInput-${props.UserId}`) { input.disabled = true; }
    });

  };

  return (
    <tr>
      <input type="radio" className="myRadioBtns" id={`myRadio-${props.UserId}`} name="fav_language" onChange={radioChecked} />
      <td>{props.UserId}</td>
      <td>{props.UserName}</td>
      <td>
        <input
          id={`myInput-${props.UserId}`}
          className='formInputPoints'
          name={`myInput-${props.UserId}`}
          value={inputValue}
          defaultValue={props.Points}
          onChange={handleInputChange}
          disabled="disabled"
        />
      </td>
    </tr>
  );
};

export default Dashboard;