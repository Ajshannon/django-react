import React, { useState, useEffect } from "react";
import { getRoom, deleteRoomByCode } from "../services/api";
import { useParams, useHistory } from "react-router-dom";
import { Typography, Grid, Button } from "@material-ui/core";
import { Link } from "react-router-dom";
import RoomPropertiesPage from "./RoomPropertiesPage";

const Room = () => {
    const [roomDetails, setRoomDetails] = useState({
        votesToSkip: 2,
        guestCanPause: false,
        isHost: false,
    });
    const [showSettings, setShowSettings] = useState(false);
    const [error, setError] = useState("");
    const [rooms, setRooms] = useState([]);
    const history = useHistory();

    const { roomCode } = useParams();

    useEffect(() => {
        getRoom(roomCode)
            .then((response) => {
                const data = response.data;
                setRoomDetails({
                    votesToSkip: data.votes_to_skip,
                    guestCanPause: data.guest_can_pause,
                    isHost: data.is_host,
                });
            })
            .catch((error) => {
                console.error('There was an error!', error);
            });
    }, [roomCode]);

    const handleDeleteRoom = async (roomCode) => {
        try {
            await deleteRoomByCode(roomCode);
            console.log(`Room with code ${roomCode} deleted successfully.`);
            setRooms((prevRooms) => prevRooms.filter((room) => room.code !== roomCode));
            history.push("/")
        } catch (error) {
            console.log(error);
        }
    };

    const renderSettings = () => {
        return (
            <Grid container spacing={1}>
                <Grid item xs={12} align="center">
                    <RoomPropertiesPage update={true} roomDetails={roomDetails}></RoomPropertiesPage>
                </Grid>
                <Grid item xs={12} align="center">
                    <Button variant="contained" color="secondary" onClick={() => setShowSettings(false)}>
                        Close
                    </Button>
                    <Button variant="contained" color="primary" onClick={() => handleDeleteRoom(roomCode)}>
                        Delete
                    </Button>
                </Grid>
            </Grid>
        );
    };

    if (showSettings) {
        return renderSettings();
    }
    return (
        <Grid container spacing={1}>
            <Grid item xs={12} align="center">
                <Typography variant="h4" component="h4">
                    Code: {roomCode}
                </Typography>
            </Grid>
            <Grid item xs={12} align="center">
                <Typography variant="h6" component="h6">
                    Votes: {roomDetails.votesToSkip}
                </Typography>
            </Grid>
            <Grid item xs={12} align="center">
                <Typography variant="h6" component="h6">
                    Guest Can Pause: {roomDetails.guestCanPause.toString()}
                </Typography>
            </Grid>
            <Grid item xs={12} align="center">
                <Typography variant="h6" component="h6">
                    Host: {roomDetails.isHost.toString()}
                </Typography>
            </Grid>
            <Grid item xs={12} align="center">
                <Button variant="contained" color="secondary" to="/" component={Link}>
                    Leave Room
                </Button>
                <Button variant="contained" color="primary" onClick={() => setShowSettings(true)}>
                    Edit
                </Button>
            </Grid>
        </Grid>
    );
};
export default Room;
