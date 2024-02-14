import axios from 'axios';
import { MEMBERS_API_CALL } from '../constants';

export const membersList = () => {
  return axios.get(MEMBERS_API_CALL)
    .then(response => {
      return response.data; 
    })
    .catch(error => {
      console.log('Error for members: ', error);
      throw error;
    });
};
