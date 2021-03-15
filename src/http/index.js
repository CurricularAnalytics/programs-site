import axios from "axios";

export const blackbriarInstance = axios.create({
    baseURL: process.env.VUE_APP_BB_URL,
});

export const caInstance = axios.create({
    baseURL: process.env.VUE_APP_CA_URL,
});
