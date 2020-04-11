//Dependancies
const express = require('express');
const fetch = require('node-fetch');
const btoa = require('btoa');
require('dotenv').config();

//Intialise Express
const app = express();

//Set port Number
const PORT = process.env.PORT || 3000;

//Start server
app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});

//Setup static pages
app.use(express.static('public'));

//Track last query time and result
let lastQueryTime = 0;
let lastQueryResult;

//If API endpoint hit
app.get('/api', (req, res) => {

    //Define query Fn
    const queryGitHub = (user) => {

        //Setup url
        const url = `https://api.github.com/search/commits?q=author:${user.git_user}&sort=author-date&order=desc`;
        return new Promise(resolve => {

            //API call
            fetch(url, {
                method: 'GET',
                headers: {
                    'Authorization': 'Basic ' + btoa(`hexagonatron:${API_KEY}`),
                    'Accept': "application/vnd.github.cloak-preview"
                }
            })
                .then(APIresponse => {
                    return APIresponse.json();
                })
                .then(data => {
                    //Construct response object and resolve promise
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

    //Array of git users
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
        },
        {
            display: "Matt M",
            git_user: "Macca473"
        },
        {
            display: "Udara",
            git_user: "udara"
        },
        {
            display: "Mariusz",
            git_user: "borucltd"
        },
        {
            display: "Craig",
            git_user: "craigfbarry"
        },
        {
            display: "Alvaro",
            git_user: "Anieto86"
        },
        {
            display: "Thayer",
            git_user: "omarthayer"
        },
        {
            display: "Angelo",
            git_user: "vlad916"
        },
        {
            display: "Damien",
            git_user: "damian545"
        },
        {
            display: "Astrid",
            git_user: "AstridSuhartono"
        },
        {
            display: "Matt T",
            git_user: "trojanface"
        },
        {
            display: "Karthik",
            git_user: "karthikkovi"
        },
        {
            display: "Nathan",
            git_user: "NathanTeakle"
        },
        {
            display: "Ana",
            git_user: "amarr001"
        },
        {
            display: "Ruma",
            git_user: "RumaRDas"
        },
        {
            display: "Nicole",
            git_user: "NicoleGeorge"
        }
    ];

    //Load API Key from env
    const API_KEY = process.env.API_KEY;

    //If last call was over 2 mins ago
    if((new Date().getTime() - lastQueryTime) > (1000*60 * 2)){

        //Update last queryTime
        lastQueryTime = new Date().getTime();

        //Iterate through users and call the query fn
        resultsArray = gitUsers.map(user => {
            return queryGitHub(user);
        });
    
        //When results from all api queries have been returned
        Promise.all(resultsArray).then(data => {

            //Save the data into variable
            lastQueryResult = [...data];
            console.log("Return New");

            //Return data to frontend
            res.json(data);
        });
    } else {
        //If last query was less than 2 mins ago return the saved results

        console.log("Return prev");
        res.json(lastQueryResult);
    }
});
