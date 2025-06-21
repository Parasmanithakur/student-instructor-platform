import axios from 'axios';
import { BaseApi } from './Constants';



export const registerUser = async (form) => {
    const url = BaseApi + '/register';
    const res = await axios.post(url, form, {
        headers: { 'Content-Type': 'application/json' }
    });
    return res.data;
};
