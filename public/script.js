//Select page elements
const tableOutput = document.querySelector(".result-output");

//Fn to process api response
const processResults = (responseArray) => {

    //Sort response array based on number of commits
    responseArray.sort((a, b) => {
        return b.data.total_count - a.data.total_count;
    });
    console.log(responseArray);
    
    //For each user call the create row fn
    responseArray.forEach((person, index) => {
        createRow(person, index + 1);
    });
}

//Fn to add a row to the page
const createRow = (person, position) => {

    //HTML template with all info
    htmlString = `
    <tr>
        <td scope="row">${position}</td>
        <td><img class="git-avatar" src="${person.data.items[0]?person.data.items[0].author.avatar_url:""}"><a href="https://github.com/${person.username}" target="_blank" rel="noopener noreferrer">${person.name}</a></td>
        <td>${person.data.total_count}</td>
        <td>${person.data.total_count? `<a href="${person.data.items[0].repository.html_url}" target="_blank" rel="noopener noreferrer">${person.data.items[0].repository.name}</a>`:"No commits =("}</td>
        <td>${person.data.total_count? moment(person.data.items[0].commit.author.date).fromNow():"-"}</td>
    </tr>`;

    //Push to page
    tableOutput.innerHTML += htmlString;
}

//Query api to get everyones commits
$.ajax({
    url: "/api",
    method: "GET",
    success: processResults,
    error: (xhr, status, err) => {
        console.log(`Status: ${status}, Error: ${err}`);
    }
});