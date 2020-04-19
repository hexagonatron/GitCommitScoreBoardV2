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

const API_KEY = process.env.API_KEY;

const loggerOn = process.env.LOGGING == "true" ? true : false;

console.log(loggerOn);

//Connect to DB
mongoose.connect(`mongodb+srv://Admin:${process.env.DB_PASS}@cluster0-1mfc4.mongodb.net/gitcommitscoreboard?retryWrites=true&w=majority`, { useNewUrlParser: true, useUnifiedTopology: true });

let db = mongoose.connection;

//Log status once connected or errored
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
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

//Delay Fn

const delay = (time) => {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve();
        }, time);
    });
}

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

        let query = { node_id: el.node_id };

        let options = { upsert: true };

        Commit.updateOne(query, update, options, callback);
    });
}

//If API endpoint hit
app.get('/api', (req, res) => {

    const date = new Date();
    let weekAgomillis = date.getTime() - 1000*60*60*24*7;
    weekAgo = new Date();
    weekAgo.setTime(weekAgomillis);

    const responseArray = gitUsers.map(user => {
        const name = user.display;
        const userName = user.git_user;
        const count = Commit.countDocuments({ "author.login": userName });
        const lastCommit = Commit.find({"author.login": userName}).sort({"commit.committer.date": -1}).limit(5);
        const commitsLastWeek = Commit.find({"author.login": userName, "commit.author.date": {$gt: weekAgo.toISOString()}}).count();

        
        
      /*   , {skip:0, limit: 2, sort: {"commit.commiter.date": -1}},(err, results) => {
            if(err) console.log(err);
            // console.log(results);
            return results;

            2020-04-01T22:27:19+10:30
            2020-04-01T11:57:19.144Z

        }) */

        return Promise.all([count, lastCommit, commitsLastWeek]).then((queryResults) => {
            responseObj = {
                "name": name,
                "user_name": userName,
                "commit_count_all_time": queryResults[0],
                "commit_count_last_week": queryResults[2],
                "commits": queryResults[1]
            }
            return responseObj;
        })
    });

    Promise.all(responseArray).then(array =>{
        res.json(array);
    });
});

//Fn to log events to file if logging is enabled
const logger = (message) => {
    if (loggerOn) {
        const messageToLog = new Date().toISOString() + ": " + message + "\n";

        fs.appendFile("./log/log.txt", messageToLog, "utf8", (err) => {
            if (err) console.log(err);
        })
    }
}

const queryAll = (urlArray) => {

    const queryGitHubOnce = (url) => {
        logger(`Querying for ${url}`);
        return new Promise((resolve, reject) => {
            fetch(url, {
                method: 'GET',
                headers: {
                    'Authorization': 'Basic ' + btoa(`gitcommitscoreboard:${API_KEY}`),
                    'Accept': "application/vnd.github.cloak-preview"
                }
            })
                .then(apiResponse => {
                    apiResponse.json().then(json => {
                        //Add to DB

                        if (json.items) {
                            logger(`Length of ${url} response = ${json.items.length}`);
                            let commitArray = [...json.items];

                            addCommits(commitArray, function (err, response) {
                                if (err) return console.log(err);
                                // console.log(`Commits added to DB for ${url}`);
                                // logger(`Commits added to DB for ${url}`);
                            });
                        } else {
                            logger(`Doesn't seem to be any commits for ${url}`);
                        }

                        i++

                        if (i >= urlArray.length) {
                            logger(`Resolving promise for i: ${i} and url: ${url}`);
                            resolve();
                            return;
                        }

                        const rateLimitRemain = apiResponse.headers.get('x-ratelimit-remaining');
                        logger(`Rate limit at ${url} is : ${rateLimitRemain}`);
                        if (rateLimitRemain > 0) {
                            logger(`Calling next fn recursively instantly i: ${i} Rate limit : ${rateLimitRemain} next url: ${urlArray[i]}`);
                            return queryGitHubOnce(urlArray[i]);
                        } else {
                            const rateLimitReset = +apiResponse.headers.get('x-ratelimit-reset') * 1000;
                            const nowTime = new Date().getTime();
                            const timeToWait = rateLimitReset - nowTime + 1000 * 40;
                            console.log(`Waiting for ${timeToWait}ms`);
                            logger(`Waiting for ${timeToWait}ms to call query for i: ${i} url: ${urlArray[i]}`);
                            return delay(timeToWait)
                                .then(next => {
                                    logger(`return from then block after setTimeout`);
                                    return queryGitHubOnce(urlArray[i]);
                                });
                        }
                    })
                        .then(done => {
                            logger(`Resolving promise in then block for ${url}`);
                            resolve();
                        });
                });
        })
    }

    let i = 0;

    if(urlArray.length === 0){
        return
    }

    return queryGitHubOnce(urlArray[i]);

}

const queryGitHub = () => {

    const firstResults = gitUsers.map((user) => {

        const url = `https://api.github.com/search/commits?q=author:${user.git_user}&sort=author-date&order=desc`;


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
                    if (lastPageNo) {
                        lastPageNo = lastPageNo[1];
                        let urls = [];
                        for (let i = 2; i <= lastPageNo; i++) {
                            let nexturl = `https://api.github.com/search/commits?q=author%3A${user.git_user}&sort=author-date&order=desc&page=${i}`;
                            urls.push(nexturl);
                        }
                        resolve(urls);
                    } else {
                        resolve();
                    }

                    return apiResponse.json();
                })
                .then(jsonData => {

                    if (jsonData.items) {

                        let commitArray = [...jsonData.items];

                        addCommits(commitArray, function (err, response) {
                            if (err) {
                                reject();
                            } else {
                                // console.log(`Commits added to DB for ${url}`);
                            }
                        });
                    }
                });
        })

    });

    Promise.all(firstResults).then(data => {
        data = data.flat().filter((a) => a);
        console.log("All results fetched");
        console.log(`Url list:`);
        console.log(data);
        //Wait 90 secs
        console.log("Waiting 30 secs");
        logger("Waiting 30 secs");
        return delay(1000 * 30).then(nothing => {
            return queryAll(data);
        });
    })
        .then(next => {
            console.log("Finished fetching list of urls");
            delay(1000 * 90).then(nothing => {
                queryGitHub();
            });
        })
        .catch(error => {
            console.log("Error: ", error);
        })


}

queryGitHub();