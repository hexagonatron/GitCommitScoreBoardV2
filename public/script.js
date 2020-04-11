
//https://api.github.com/repos/hexagonatron/BootcampW2Activity/commits?author=hexagonatron&since=2020-01-01T00:00:00Z
const tableOutput = document.querySelector(".result-output");

const processResults = (responseArray) => {
    responseArray.sort((a, b) => {
        return b.data.total_count - a.data.total_count;
    });
    console.log(responseArray);
    responseArray.forEach((person, index) => {
        createRow(person, index + 1);
    });
}

const createRow = (person, position) => {
    htmlString = `
    <tr>
        <td scope="row">${position}</td>
        <td><a href="https://https://github.com/${person.username}" target="_blank" rel="noopener noreferrer">${person.name}</a></td>
        <td>${person.data.total_count}</td>
        <td>${person.data.total_count? `<a href="${person.data.items[0].repository.html_url}" target="_blank" rel="noopener noreferrer">${person.data.items[0].repository.name}</a>`:"No commits =("}</td>
        <td>${person.data.total_count? moment(person.data.items[0].commit.author.date).fromNow():"-"}</td>
    </tr>`;

    tableOutput.innerHTML += htmlString;
}

$.ajax({
    url: "/api",
    method: "GET",
    success: processResults,
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