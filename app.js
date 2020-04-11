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

    const queryGitHub = (user) => {
        const url = `https://api.github.com/search/commits?q=author:${user.git_user}&sort=author-date&order=desc`;
        return new Promise(resolve => {

            fetch(url, {
                method: 'GET',
                headers: {
                    'Authorization': 'Basic ' + btoa(`hexagonatron:${API_KEY}`),
                    'Accept': "application/vnd.github.cloak-preview"
                }
            })
                .then(APIresponse => {
                    // console.log("#################  API Response  #################");
                    // console.log(APIresponse);
                    return APIresponse.json();
                })
                .then(data => {
                    resolve(
                        {
                            name: user.display,
                            username: user.git_user,
                            data: data
                        }
                    );
                })
        });

    }

    const gitUsers = [
        {
            display: "Ben F",
            git_user: "hexagonatron"
        },
        {
            display: "Brock",
            git_user: "bhamann-collab"
        },
        {
            display: "Alex",
            git_user: "Alex-Waite"
        },
        {
            display: "Test Account",
            git_user: "gitcommitscoreboard"
        },
        {
            display: "Trent",
            git_user: "trentstollery"
        },
        {
            display: "Ben C",
            git_user: "BenBugs"
        },
        {
            display: "Nima",
            git_user: "kneema"
        },
        {
            display: "Claire",
            git_user: "clairevandeneberg"
        }
    ];
    // const gitUsers = ["hexagonatron"];
    const API_KEY = process.env.API_KEY;

    resultsArray = gitUsers.map(user => {
        return queryGitHub(user);
    });

    Promise.all(resultsArray).then(data => {

        res.json(data);
    });
});
