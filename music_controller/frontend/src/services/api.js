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