const express = require('express');
const fetch = require('node-fetch');
const path = require('path');
const btoa = require('btoa');
require('dotenv').config();

const app = express();

const PORT = process.env.PORT || 3000;


app.listen(3000, () => {
    console.log(`Server started on port ${PORT}`);
});

app.use(express.static('public'));
app.use(express.json({ limit: '1mb' }));


app.get('/api', (req, res) => {
    const gitUsers = ["hexagonatron","bhamann-collab","Alex-Waite","gitcommitscoreboard"];
    const API_KEY = process.env.API_KEY;

    let allCommits = [];

    resultsArray = gitUsers.map(user => {
        const url = `https://api.github.com/users/${user}/events`
        return new Promise(async resolve => {

            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Authorization': 'Basic ' + btoa(`hexagonatron:${API_KEY}`)
                }
            });
            responseHeaders = await response.headers
            // console.log(responseHeaders.get("link"));
            responseJSON = await response.json().then(data => {
                if(response.headers.has("link")){
                    console.log(response.headers.get("link").split(','));

                }
                resolve(data);
            });
            // console.log(responseJSON);
        });
        
    });

    let fetchedData = Promise.all(resultsArray).then(data => {
        res.json(data);
    });
});
