import axios from "axios";

export const blackbriarInstance = axios.create({
    baseURL:
        "https://bb-arizona-assets.s3-us-west-2.amazonaws.com/json/universities/",
});

export const caInstance = axios.create({
    baseURL: "http://localhost:8000/",
});
