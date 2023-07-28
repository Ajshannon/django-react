import React, { useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import {
  Button,
  Grid,
  Typography,
  TextField,
  FormHelperText,
  FormControl,
  Radio,
  RadioGroup,
  FormControlLabel,
} from "@material-ui/core";
import { createRoom } from '../services/api';

const MIN_VOTES_TO_SKIP = 1;

const RoomPropertiesPage = ({ roomDetails, update }) => {
   const defaultRoomDetails = {
    guestCanPause: true,
    votesToSkip: 2,
  };

  const [guestCanPause, setGuestCanPause] = useState(roomDetails?.guestCanPause || defaultRoomDetails.guestCanPause);
  const [votesToSkip, setVotesToSkip] = useState(roomDetails?.votesToSkip || defaultRoomDetails.votesToSkip);
  const history = useHistory();

  useEffect(() => {
    if (roomDetails) {
      setGuestCanPause(roomDetails.guestCanPause);
      setVotesToSkip(roomDetails.votesToSkip);
    }
  }, [roomDetails]);
  
  const handleVotesChange = (e) => {
    setVotesToSkip(e.target.value);
  }

  const handleGuestCanPauseChange = (e) => {
    setGuestCanPause(e.target.value === "true");
  }

  const handleRoomButtonPressed = async (e) => {
    e.preventDefault(); // Prevent the default form submission

    try {
      const response = await createRoom(votesToSkip, guestCanPause);
      console.log(response.data);
      history.push(`/room/${response.data.code}`);
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <Grid container align="center" spacing={1}>
      <Grid item xs={12} align="center">
        <Typography component="h4" variant="h4">
          {update ? "Edit Room Settings" : "Create A Room"}
        </Typography>
      </Grid>
      <Grid item xs={12} align="center">
        <FormControl component="fieldset">
          <FormHelperText>
            <div align="center">Guest Control of Playback State</div>
          </FormHelperText>
          <RadioGroup
            row
            defaultValue="true"
            onChange={handleGuestCanPauseChange}
          >
            <FormControlLabel
              value="true"
              control={<Radio color="primary" />}
              label="Play/Pause"
              labelPlacement="bottom"
            />
            <FormControlLabel
              value="false"
              control={<Radio color="secondary" />}
              label="No Control"
              labelPlacement="bottom"
            />
          </RadioGroup>
        </FormControl>
      </Grid>
      <Grid item xs={12} align="center">
        <FormControl>
          <TextField
            required={true}
            type="number"
            onChange={handleVotesChange}
            defaultValue={MIN_VOTES_TO_SKIP}
            inputProps={{
              min: 1,
              style: { textAlign: "center" },
            }}
          />
          <FormHelperText>
            <div align="center">Votes Required To Skip Song</div>
          </FormHelperText>
          {!update && (
            <Button
              color="primary"
              variant="contained"
              onClick={handleRoomButtonPressed}
            >
              Create A Room
            </Button>
          )}
        </FormControl>
      </Grid>
      {!update && (
        <Grid item xs={12} align="center">
          <Button
            color="secondary"
            variant="contained"
            to="/"
            component={Link}
          >
            Back
          </Button>
        </Grid>
      )}
    </Grid>
  );
};

export default RoomPropertiesPage;
