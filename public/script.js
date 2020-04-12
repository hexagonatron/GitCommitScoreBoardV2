//Select page elements
const tableOutput = document.querySelector(".result-output");

const commitNumSortToggle = document.querySelector(".sort-arrow.commitnum");
const lastCommitSortToggle = document.querySelector(".sort-arrow.lastcommit");



let dataArray;

//Fn to process api response
const displayResults = (inputArray, sortFn = commitDes) => {
    //Clear table
    tableOutput.innerHTML = "";
    
    //Sort response array based on number of commits
    inputArray.sort(sortFn);
    console.log(inputArray);
    
    //For each user call the create row fn
    inputArray.forEach((person, index) => {
        createRow(person, index + 1);
    });
}

const processResults = (responseArray) => {
    dataArray = [...responseArray];
    displayResults(dataArray);
}



//Sort functions
const commitDes = (a, b) => b.data.total_count - a.data.total_count;

const commitAsc = (a, b) => a.data.total_count - b.data.total_count;

const lastCommitDes = (a, b) => moment(b.data.total_count?b.data.items[0].commit.author.date:0).unix() - moment(a.data.total_count?a.data.items[0].commit.author.date:0).unix();

const lastCommitAsc = (a, b) => moment(a.data.total_count?a.data.items[0].commit.author.date:Infinity).unix() - moment(b.data.total_count?b.data.items[0].commit.author.date:Infinity).unix();


//Fn to add a row to the page
const createRow = (person, position) => {

    //HTML template with all info
    htmlString = `
    <tr>
        <td scope="row">${position}</td>
        <td><img class="git-avatar" src="${person.data.total_count?person.data.items[0].author.avatar_url:""}"><a href="https://github.com/${person.username}" target="_blank" rel="noopener noreferrer">${person.name}</a></td>
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

lastCommitSortToggle.addEventListener("click", (event) => {
    if(lastCommitSortToggle.classList.contains("fa-sort")){
        lastCommitSortToggle.classList.remove("fa-sort");
        lastCommitSortToggle.classList.add("fa-sort-up");
        displayResults(dataArray,lastCommitDes);
    } else if(lastCommitSortToggle.classList.contains("fa-sort-up")){
        lastCommitSortToggle.classList.remove("fa-sort-up");
        lastCommitSortToggle.classList.add("fa-sort-down");
        displayResults(dataArray,lastCommitAsc);
    } else if(lastCommitSortToggle.classList.contains("fa-sort-down")){
        lastCommitSortToggle.classList.remove("fa-sort-down");
        lastCommitSortToggle.classList.add("fa-sort-up");
        displayResults(dataArray,lastCommitDes);
    }
    commitNumSortToggle.classList.remove("fa-sort-up","fa-sort-down");
    commitNumSortToggle.classList.add("fa-sort");
});

commitNumSortToggle.addEventListener("click", (event) => {
    if(commitNumSortToggle.classList.contains("fa-sort")){
        commitNumSortToggle.classList.remove("fa-sort");
        commitNumSortToggle.classList.add("fa-sort-up");
        displayResults(dataArray, commitDes);
    } else if(commitNumSortToggle.classList.contains("fa-sort-up")){
        commitNumSortToggle.classList.remove("fa-sort-up");
        commitNumSortToggle.classList.add("fa-sort-down");
        displayResults(dataArray, commitAsc);
    } else if(commitNumSortToggle.classList.contains("fa-sort-down")){
        commitNumSortToggle.classList.remove("fa-sort-down");
        commitNumSortToggle.classList.add("fa-sort-up");
        displayResults(dataArray, commitDes);
    }
    lastCommitSortToggle.classList.remove("fa-sort-up","fa-sort-down");
    lastCommitSortToggle.classList.add("fa-sort");

});