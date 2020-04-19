# Git Commit Scoreboard

[View here](https://git-commit-scoreboard.herokuapp.com/)

## About

The concept for this project was to make a scoreboard of everyone in the class that is sortable by a few different parameters.

## Challenges

Finding the best way to utilise the github API took some time. Firtly I was going to query the user for all their repositories, then query the repositories for all their commits. This approach would miss commits a user has made to respositories thay don't own as well as take quite a lot of time for all the api calls to complete. Was then going to use the user events end point then manually sort out the push events and then get the commits. This approach would have worked but due to paginiation the code got a bit messy. I then learned about the search endpoint that allows one to search by user for all their commits. This method returns the total commit count as well as the 30 most recent.

The search endpoint only allows 30 api calls per minute. This is fine in theory, as there are about 25 students in the class, so all of these could be done on a page load. The issue would be if the page is reloaded constantly or the page receives multiple views in the span of a minute. To get around this limitation the first version of this app cached the results for 2 minutes and would only fetch new results if the cached results were over 2 minutes old.

The caching method worked however the github api has a limitation where if it's busy it'll only return partial results. This was causing some large variences on page load, one pageload a user cold have 150 commits then a few minutes later they would only have 10. To get around this issue I implemented MongoDB to store my own copies of all the commits.

The MongoDB instance is hosted on the mongo atlas site. Now when a user loads the page the backend will query the MongoDB for the results and send them back to the frontend.

In the backend script there is a process running every few minutes that queries the github api for all the commits of all the users. If the commit doesn't already exist in the database, it's added. This leads to much more consistent results.


## Future improvements

Currently the page load is quite slow. This is due to the MongoDB queries taking time to excecute before they can be sent back. To get around this I could either host the two instances on the same service or potentially cache the results every few minutes.

## Resources I used to complete this project

[Coding Train @ YouTube](https://www.youtube.com/playlist?list=PLRqwX-V7Uu6YxDKpFzf_2D84p0cyk4T7X)

[This Stack overflow thread](https://stackoverflow.com/questions/21869795/github-api-retrieve-user-commits)

[Medium article that finally made the penny drop regarding promises in Javascript](https://medium.com/javascript-scene/master-the-javascript-interview-what-is-a-promise-27fc71e77261)
