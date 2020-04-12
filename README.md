# Git Commit Scoreboard

## About

The concept for this project was to make a scoreboard of everyone in the class that is sortable by a few different parameters.

## Challenges

Finding the best way to utilise the github API took some time. Firtly I was going to query the user for all their repositories, then query the repositories for all their commits. This approach would miss commits a user has made to respositories thay don't own as well as take quite a lot of time for all the api calls to complete. Was then going to use the user events end point then manually sort out the push events and then get the commits. This approach would have worked but due to paginiation the code got a bit messy. I then learned about the search endpoint that allows one to search by user for all their commits. This method returns the total commit count as well as the 30 most recent.

The search endpoint only allows 30 api calls per minute. This is fine in theory, as there are about 25 students in the class, so all of these could be done on a page load. The issue would be if the page is reloaded constantly or the page receives multiple views in the span of a minute. To get around this limitation the node server will cache the most recently retrived results and if data is requested in the next 2 minutes it'll serve the cached data rather than doing a fresh api call.

## Future improvements

Currently if the github api is busy it'll only return partial results, this can lead to some users having a lower commit count than what the true number is. In order to combat this a database could be setup and periodically the github api could be called, and any new commits could be added to the database. Then when a user loads the page the backend could query the database and serve the results.

This would allow for more fine grained control of the results returned, such as a commits in the last 7 days column and even commits in the last hour etc etc.

## Resources I used to complete this project

[Coding Train @ YouTube](https://www.youtube.com/playlist?list=PLRqwX-V7Uu6YxDKpFzf_2D84p0cyk4T7X)

[This Stack overflow thread](https://stackoverflow.com/questions/21869795/github-api-retrieve-user-commits)

[Medium article that finally made the penny drop regarding promises in Javascript](https://medium.com/javascript-scene/master-the-javascript-interview-what-is-a-promise-27fc71e77261)