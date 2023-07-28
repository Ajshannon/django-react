import React, { useState, useEffect } from "react";
import { getUserInRoom, deleteAllRooms, deleteRoomByCode, joinRoom } from "../services/api";
import {
  Link,
  useHistory
} from "react-router-dom";
import { Grid, Button, ButtonGroup, Typography, List, ListItem, ListItemText, ListItemSecondaryAction, IconButton } from "@material-ui/core";
import DeleteIcon from '@material-ui/icons/Delete';

const HomeContent = () => {
  const [rooms, setRooms] = useState([]);
  const history = useHistory();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getUserInRoom();
        setRooms(data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, []);

  const handleDeleteAllRooms = async () => {
    try {
      await deleteAllRooms();
      console.log("All rooms deleted successfully.");
      setRooms([]);
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteRoom = async (roomCode) => {
    try {
      await deleteRoomByCode(roomCode);
      console.log(`Room with code ${roomCode} deleted successfully.`);
      setRooms((prevRooms) => prevRooms.filter((room) => room.code !== roomCode));
    } catch (error) {
      console.log(error);
    }
  };

  const handleJoinRoom = async (roomCode) => {
    joinRoom(roomCode)
      .then((response) => {
        if (response.status === 200) {
          history.push(`/room/${roomCode}`);
        } else {
          setRooms({ error: "Room not found." });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <Grid container spacing={3}>
        <Grid item xs={12} align="center">
          <Typography variant="h3" compact="h3">
            House Party
          </Typography>
        </Grid>
        <Grid item xs={12} align="center">
          <ButtonGroup disableElevation variant="contained" color="primary">
            <Button color="primary" to="/join" component={Link}>
              Join a Room
            </Button>
            <Button color="secondary" to="/create" component={Link}>
              Create a Room
            </Button>
            <Button color="secondary" onClick={handleDeleteAllRooms}>
              Delete All Rooms
            </Button>
          </ButtonGroup>
        </Grid>
        <Grid item xs={12} align="center">
          <Typography variant="h5">Your Rooms:</Typography>
          <List>
            {rooms.map((room) => (
              <ListItem key={room.id}>
                <ListItemText primary={`Room Code: ${room.code}`} />
                <ListItemSecondaryAction>
                  <IconButton edge="end" aria-label="delete" onClick={() => handleDeleteRoom(room.code)}>
                    <DeleteIcon />
                  </IconButton>
                  <Button
                    color="primary"
                    onClick={() => handleJoinRoom(room.code)}
                  >Join Room</Button>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
        </Grid>
      </Grid>
  );
};

export default HomeContent;
