//Select page elements
const tableOutput = document.querySelector(".result-output");

const commitNumSortToggle = document.querySelector(".sort-arrow.commitnum");
const lastCommitSortToggle = document.querySelector(".sort-arrow.lastcommit");
const commitNumWeekSortToggle = document.querySelector(".sort-arrow.commitnumweek");



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

const getAvatar = (username) => {
    return new Promise( (res, rej) => {
        fetch(`https://api.github.com/users/${username}`,
                {
                    method: "GET",
                    headers: {
                        "Accept": "application/vnd.github.v3+json"
                    }
                })
                .then(res => {
                    return res.json()
                })
                .then(json => {
                    res(json.avatar_url);
                });
    })
}



//Sort functions
const commitDes = (a, b) => b.commit_count_all_time - a.commit_count_all_time;

const commitAsc = (a, b) => a.commit_count_all_time - b.commit_count_all_time;

const commitWeekDes = (a, b) => b.commit_count_last_week - a.commit_count_last_week;

const commitWeekAsc = (a, b) => a.commit_count_last_week - b.commit_count_last_week;

const lastCommitDes = (a, b) => moment(b.commit_count_all_time?b.commits[0].commit.author.date:0).unix() - moment(a.commit_count_all_time?a.commits[0].commit.author.date:0).unix();

const lastCommitAsc = (a, b) => moment(a.commit_count_all_time?a.commits[0].commit.author.date:Infinity).unix() - moment(b.commit_count_all_time?b.commits[0].commit.author.date:Infinity).unix();


//Fn to add a row to the page
const createRow = (person, position) => {

    //HTML template with all info
    htmlString = `
    <tr>
        <td scope="row">${position}</td>
        <td><img class="git-avatar" src="${person.commit_count_all_time?person.commits[0].author.avatar_url:getAvatar(person.user_name)}"><a href="https://github.com/${person.user_name}" target="_blank" rel="noopener noreferrer">${person.name}</a></td>
        <td>${person.commit_count_all_time}</td>
        <td>${person.commit_count_last_week}</td>
        <td>${person.commit_count_all_time? `<a href="${person.commits[0].repository.html_url}" target="_blank" rel="noopener noreferrer">${person.commits[0].repository.name}</a>`:"No commits =("}</td>
        <td>${person.commit_count_all_time? moment(person.commits[0].commit.author.date).fromNow():"-"}</td>
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
    commitNumWeekSortToggle.classList.remove("fa-sort-up","fa-sort-down");
    commitNumSortToggle.classList.add("fa-sort");
    commitNumWeekSortToggle.classList.add("fa-sort");
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
    commitNumWeekSortToggle.classList.remove("fa-sort-up","fa-sort-down");
    commitNumWeekSortToggle.classList.add("fa-sort");

});

commitNumWeekSortToggle.addEventListener("click", (event) => {
    if(commitNumWeekSortToggle.classList.contains("fa-sort")){
        commitNumWeekSortToggle.classList.remove("fa-sort");
        commitNumWeekSortToggle.classList.add("fa-sort-up");
        displayResults(dataArray, commitWeekDes);
    } else if(commitNumWeekSortToggle.classList.contains("fa-sort-up")){
        commitNumWeekSortToggle.classList.remove("fa-sort-up");
        commitNumWeekSortToggle.classList.add("fa-sort-down");
        displayResults(dataArray, commitWeekAsc);
    } else if(commitNumWeekSortToggle.classList.contains("fa-sort-down")){
        commitNumWeekSortToggle.classList.remove("fa-sort-down");
        commitNumWeekSortToggle.classList.add("fa-sort-up");
        displayResults(dataArray, commitWeekDes);
    }
    lastCommitSortToggle.classList.remove("fa-sort-up","fa-sort-down");
    lastCommitSortToggle.classList.add("fa-sort");
    commitNumSortToggle.classList.remove("fa-sort-up","fa-sort-down");
    commitNumSortToggle.classList.add("fa-sort");

});