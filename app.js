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

    const queryGitHub = (url) => {
        return new Promise(resolve => {

            fetch(url, {
                method: 'GET',
                headers: {
                    'Authorization': 'Basic ' + btoa(`hexagonatron:${API_KEY}`),
                    'Accept': "application/vnd.github.cloak-preview"
                }
            })
                .then(APIresponse => {
                    console.log("#################  API Response  #################");
                    // console.log(APIresponse);
                    APIresponse.json().then(responseJSON => {
                        console.log("#################  ResponseJSON  #################");
                        // console.log(responseJSON);
                        // userEvents = [...userEvents, responseJSON];
                        if (APIresponse.headers.has("link")) {
                            console.log("#################  Header next url  #################");
                            let nextURL = APIresponse.headers.get("link");
                            console.log("\nRaw: " + nextURL+"\n");
                            urlRegex = /https:\/\/api\.github\.com\/search\/commits\?q=author%3A[\w-]+?&sort=author-date&order=desc&page=\d+?(?=>; rel="next")/g;
                            nextURL = urlRegex.exec(nextURL);
                            console.log(nextURL);
                            
                            if (nextURL){
                                console.log("\nNext URL: " + nextURL[0]+ "\n");
                                queryGitHub(nextURL[0]).then(recursionResults => {
                                    // console.log(recursionResults);
                                    resolve([...responseJSON.items, ...recursionResults]);
                                });
                            } else {
                                // console.log(responseJSON);
                                resolve(responseJSON.items);
                            }
                        } else {
                            // console.log(responseJSON);
                            resolve(responseJSON.items);
                        }
                    });
                });
        });

    }

    const gitUsers = ["hexagonatron", "bhamann-collab", "Alex-Waite", "gitcommitscoreboard"];
    // const gitUsers = ["hexagonatron"];
    const API_KEY = process.env.API_KEY;

    resultsArray = gitUsers.map(user => {
        let userEvents = [];
        const url = `https://api.github.com/search/commits?q=author:${user}&sort=author-date&order=desc`;
        return queryGitHub(url);
    });

    Promise.all(resultsArray).then(data => {

        res.json(data);
    });
});
