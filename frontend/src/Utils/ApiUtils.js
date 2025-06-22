import axios from 'axios';
import { BaseApi } from './Constants';


export const registerUser = async (form) => {
    try {
        const url = BaseApi + '/signup';
        const res = await axios.post(url, form, {
            headers: { 'Content-Type': 'application/json' }
        });
        return res.data;
    } catch (error) {
        return error;
    }
};

export const loginUser = async ({ username, password, role }) => {
    const url = BaseApi + '/login';
    const res = await axios.post(url, { username, password, role }, {
        headers: { 'Content-Type': 'application/json' }
    });
    return res.data;
};
export const getCourses = async (token) => {
    const url = BaseApi + '/student/courses';
    const res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return await res.json();
};