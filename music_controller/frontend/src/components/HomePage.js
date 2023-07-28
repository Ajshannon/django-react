import RoomPropertiesPage from "./RoomPropertiesPage";
import RoomJoinPage from "./RoomJoinPage";
import HomeContent from "./HomeContent";

import React, { useState, useEffect } from "react";
import { getUserInRoom } from "../services/api";
import Room from "./Room";
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";


const HomePage = () => {
  const [rooms, setRooms] = useState([]);

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

  return (
    <div className="center">
      <Router>
        <Switch>
          <Route exact path="/" component={HomeContent}/>
          <Route path="/join" component={RoomJoinPage} />
          <Route path="/create" component={RoomPropertiesPage} />
          <Route path="/room/:roomCode" component={Room} />
        </Switch>
      </Router>
    </div>
  );
};

export default HomePage;
