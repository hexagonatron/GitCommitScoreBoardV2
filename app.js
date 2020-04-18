//Dependancies
const express = require('express');
const fetch = require('node-fetch');
const btoa = require('btoa');
const mongoose = require('mongoose');
const fs = require('fs');
require('dotenv').config();

//Intialise Express
const app = express();

//Set port Number
const PORT = process.env.PORT || 3000;

//Connect to DB
mongoose.connect(`mongodb+srv://Admin:${process.env.DB_PASS}@cluster0-1mfc4.mongodb.net/gitcommitscoreboard?retryWrites=true&w=majority`, {useNewUrlParser: true, useUnifiedTopology: true});

let db = mongoose.connection;

//Log status once connected or errored
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log("Connected to DB succesfully!");

});

//Setting up mongo schema
let commitSchema = mongoose.Schema({
    url: {
        type: String,
        required: true
    },
    sha: {
        type: String,
        required: true
    },
    node_id: {
        type: String
    },
    html_url: {
        type: String
    },
    comments_url: {
        type: String
    },
    commit: {
        type: Object,
        required: true
    },
    author: {
        type: Object
    },
    committer: {
        type: Object
    },
    repository: {
        type: Object
    },
    score: {
        type: Number
    }
});

let Commit = mongoose.model('Commit', commitSchema);

//Start server
app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});

//Setup static pages
app.use(express.static('public'));

//Track last query time and result
let lastQueryTime = 0;
let lastQueryResult;

const addCommits = (commitArray, callback) => {
    commitArray.forEach(el => {

        let update = {
            $setOnInsert: {
                url: el.url,
                sha: el.sha,
                node_id: el.node_id,
                html_url: el.html_url,
                comments_url: el.comments_url,
                commit: el.commit,
                author: el.author,
                committer: el.committer,
                repository: el.repository,
                score: el.score
            }
        };

        let query = {node_id: el.node_id};

        let options = {upsert: true};

        Commit.update(query,update,options, callback);
    });
}

//If API endpoint hit
app.get('/api', (req, res) => {

    //Define query Fn
    // const queryGitHub = (user) => {

    //     //Setup url
    //     const url = `https://api.github.com/search/commits?q=author:${user.git_user}&sort=author-date&order=desc`;
    //     return new Promise(resolve => {

    //         //API call
    //         fetch(url, {
    //             method: 'GET',
    //             headers: {
    //                 'Authorization': 'Basic ' + btoa(`gitcommitscoreboard:${API_KEY}`),
    //                 'Accept': "application/vnd.github.cloak-preview"
    //             }
    //         })
    //             .then(APIresponse => {
    //                 return APIresponse.json();
    //             })
    //             .then(data => {
                    
    //                 //Add to database
    //                 let commitArray = [...data.items];

    //                 addCommits(commitArray, function(err, response){
    //                     if (err) return console.log(err);
    //                     console.log("Something happened");
    //                 });
                    
    //                 //Construct response object and resolve promise
    //                 resolve(
    //                     {
    //                         name: user.display,
    //                         username: user.git_user,
    //                         data: data
    //                     }
    //                 );
    //             })
    //     });

    // }

    //Array of git users
    

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
    },
    {
        display: "Ziyen",
        git_user: "zyloh89"
    }
];
const queryGitHub = () => {

    const firstResults = gitUsers.map((user) => {

        const url = `https://api.github.com/search/commits?q=author:${user.git_user}&sort=author-date&order=desc`;
        const API_KEY = process.env.API_KEY;

        console.log(`Fetching ${user.git_user}`)
        return new Promise((resolve, reject) => {
            fetch(url, {
                method: 'GET',
                headers: {
                    'Authorization': 'Basic ' + btoa(`gitcommitscoreboard:${API_KEY}`),
                    'Accept': "application/vnd.github.cloak-preview"
                }
            })
            .then(apiResponse => {
                const headers = apiResponse.headers.get("link");
                const lastRegex = /<https:\/\/api\.github\.com\/search\/commits\?q=author%3A[a-z0-9-]+&sort=author-date&order=desc&page=(\d+)>; rel="last"/gim

                let lastPageNo = lastRegex.exec(headers);
                if(lastPageNo){
                    lastPageNo = lastPageNo[1];
                    let urls = [];
                    for(let i = 2; i <= lastPageNo; i++){
                        let nexturl = `https://api.github.com/search/commits?q=author%3A${user.git_user}&sort=author-date&order=desc&page=${i}`;
                        urls.push(nexturl);
                        fs.appendFile("./log/urllist.txt", nexturl + "\n", (err) => {
                            if(err) reject(err);
                        });
                    }
                    resolve(urls);
                } else {
                    resolve();
                }


                fs.appendFile("./log/headers.txt", user.git_user + "\n" + headers + "\n\n",(err) => {
                    if (err) reject(err);
                });
                return apiResponse.json();
            })
            .then(jsonData => {
                console.log(`Fetch of ${user.git_user} complete.`);
                const jsonString = JSON.stringify(jsonData);
                fs.appendFile("./log/responsejson.txt", jsonString + "\n", (err) => {
                    if(err) reject(err);
                });
            })
        })

    });

    Promise.all(firstResults).then(data => {
        console.log("All results fetched");
        console.log(`Url list:`);
        console.log(data.flat());
    })
    .catch(error => {
        console.log("Error: ", error);
    })


}

queryGitHub();