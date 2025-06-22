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
export const getStudentCourses = async (token) => {
    const url = BaseApi + '/student/courses';
    const res = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return res.data;
};

export const sendChatMessage = async (input) => {
    try {
        const url = BaseApi + '/chatter';
        const res = await axios.post(url, { message: input }, {
            headers: { 'Content-Type': 'application/json' }
        });
        console.log("Response from API:", res.data);
        return res.data;
    } catch (error) {
        return { error: error.message };
    }
};
export const submitAssignment = async (token, assignmentNumber) => {
    try {
        const url = `${BaseApi}/student/assignments/${assignmentNumber}/submit`;
        const res = await axios.patch(url, {}, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return res.data;
    } catch (error) {
        return { error: error.message };
    }
};