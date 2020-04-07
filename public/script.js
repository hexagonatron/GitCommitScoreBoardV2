var people = [
    ["Ben", "hexagonatron"],
    ["Trent", "trentstollery"]
];

//https://api.github.com/repos/hexagonatron/BootcampW2Activity/commits?author=hexagonatron&since=2020-01-01T00:00:00Z

var today = new Date();

var yearAgo = new Date();

var weekAgo = new Date();

weekAgo.setTime(today.getTime() - (1000* 60 * 60 * 24 * 7))

yearAgo.setTime(today.getTime() - (1000 * 60 * 60 * 24 * 365));

var yearAgoISO = yearAgo.toISOString();

console.log(yearAgoISO);

$.ajax({
    url: "/api",
    method: "GET",
    success: (response) => {
        console.log(response);
    },
    error: (xhr, status, err) => {
        console.log(`Status: ${status}, Error: ${err}`);
    }
});


/* people.forEach(person => {

    var gitUser = person[1];

    var url = `https://api.github.com/users/${gitUser}/repos`;

    console.log(url);

    fetch(url)
    .then(response => response.json())
    .then(data => {
        var commitCount = 0;
        console.log(data);
        var repoCount = data.length;
        console.log(repoCount);

        data.forEach(repo => {

            var repoName = repo.name;

            var repoUrl = `https://api.github.com/repos/${gitUser}/${repoName}/commits?since=${yearAgoISO}&author=${gitUser}`

            console.log(repoUrl);

            fetch(repoUrl)
            .then(repoResponse => {
                console.log(repoResponse)
                repoResponse.json()
            })
            .then(function(repoData){
                console.log(repoData);
                commitCount += repoData.length;
                console.log(commitCount);

            })
        })

        console.log(commitCount);
        return commitCount;
    })
    .then(function(count){
        console.log(count);
    })
}); */