// api.js
import axios from 'axios';
import Cookies from 'js-cookie';

export function createRoom(votesToSkip, guestCanPause) {
  const csrfToken = Cookies.get('csrftoken');
  const headers = {
    'Content-Type': 'application/json',
    'X-CSRFToken': csrfToken
  };
  const data = { votes_to_skip: votesToSkip, guest_can_pause: guestCanPause };

  return axios.post('/api/create-room', data, { headers: headers });
}

export function updateRoom(votesToSkip, guestCanPause) {
  const csrfToken = Cookies.get('csrftoken');
  const headers = {
    'Content-Type': 'application/json',
    'X-CSRFToken': csrfToken
  };
  const data = { votes_to_skip: votesToSkip, guest_can_pause: guestCanPause };

  return axios.patch('/api/update-room', data, { headers: headers });
}

export function getRoom(roomCode) {
  return axios.get('/api/get-room', {
    params: {
      code: roomCode
    }
  });
}

export function joinRoom(roomCode) {
  const csrfToken = Cookies.get('csrftoken');
  const headers = {
    'Content-Type': 'application/json',
    'X-CSRFToken': csrfToken
  };
  const data = { code: roomCode };

  return axios.post('/api/join-room', data, { headers: headers });
}

export function getUserInRoom() {
  return axios.get('/api/user-in-room')
    .then((response) => response.data)
    .then((data) => {
      return data;
    })
    .catch((error) => {
      console.log(error);
    });
}

export function deleteAllRooms() {
  const csrfToken = Cookies.get('csrftoken');
  const headers = {
    'X-CSRFToken': csrfToken,
  };

  return axios.delete('/api/delete-user-rooms/', { headers: headers });
}

export function deleteRoomByCode(roomCode) {
  const csrfToken = Cookies.get('csrftoken');
  const headers = {
    'X-CSRFToken': csrfToken,
  };

  return axios.delete('/api/delete-room/', { data: { code: roomCode }, headers: headers });
}