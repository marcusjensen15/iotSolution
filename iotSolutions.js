// What I would have done if I had a bit more time/fully understood the problem after reading it in detail:


async function avgRotorSpeed(statusQuery, parentId){

    const allApiDataByStatusQuery = await collectAllApiDataByStatusQuery(statusQuery);

    const filteredDataByParentId = filterApiDataByParentId(allApiDataByStatusQuery, parentId);

    // In production this will be a 'return' not console.log

    console.log(executeAverageRotorSpeedCalculation(filteredDataByParentId));

};

//In the real world, would use 'fetch' below.

function getApiDataByPage(statusQuery, pageNumber) {
    var https = require('https');

    return new Promise((resolve, reject) => {
        https.get(`https://jsonmock.hackerrank.com/api/iot_devices/search?status=${statusQuery}&page=${pageNumber}`, (res) => {
            res.setEncoding('utf8');
            let rawData = '';

            res.on('data', (chunk) => {
                rawData += chunk;
            });

            res.on('end', () => {

                    const parsedData = JSON.parse(rawData);
                    resolve(parsedData);

            });
        });
    });
};


// Collecting all of the data from all of the pages based on the statusQuery

async function collectAllApiDataByStatusQuery(statusQuery){

  const totalNumberOfPagesForStatus = await getApiDataByPage(statusQuery, 0).then(result => {return result.total_pages });

  const allPagesOfDataByStatus = [];

  //starting the loop at 0 will double count it (any page number less than 1 returns the first page).

    for (var i = 1; i <= totalNumberOfPagesForStatus; i++){

         let resultsForPageNumber = await getApiDataByPage(statusQuery, i);
         allPagesOfDataByStatus.push(resultsForPageNumber.data);
     }

     // this returns a 2-D array. Flattening it so it is easier to work with.

      return allPagesOfDataByStatus.flat();

};


//Filtering returned data by parentId. Could have been done using the 'filter' method.

function filterApiDataByParentId(allApiDataByStatusQuery, parentId){

    const resultsMatchingParentId = [];

    for (const entry of allApiDataByStatusQuery){
        if (entry.parent && entry.parent.id === parentId){
            resultsMatchingParentId.push(entry);
        }
    }

    return resultsMatchingParentId;
};

// could also use reduce method here:

function executeAverageRotorSpeedCalculation(filteredData){

    const totalNumberOfMachines = filteredData.length;

    var sumOfRotorSpeed = 0;

    for (var i = 0; i < totalNumberOfMachines; i++){

        sumOfRotorSpeed = sumOfRotorSpeed + filteredData[i].operatingParams.rotorSpeed;

    }

     return sumOfRotorSpeed / totalNumberOfMachines;

};

avgRotorSpeed("RUNNING",2);



// Page number (in GET request returns only the results for that page.
// Need to write a loop to go through all of the pages, regardless of how many there are.
// EG: 'RUNNING' has 4 pages, 'STOP' has 3 pages of data.
// Pages start at page 0.

// getApiDataByPageAndStatusQuery -> collectAllApiDataByStatusQuery -> filterApiDataByParentID -> calculateAverageRotorSpeed -> (Return calculateAverageRotorSpeed)

// Could add rejection statement to getApiDataByPageAndStatusQuery

// Final function will flow together like this (calling all of them separately):

// async function avgRotorSpeed (statusQuery, parentId) {

    // const AllApiDataByStatusQuery = await collectAllApiDataByStatusQuery(statusQuery);

    // const filteredDataByParentId = filterApiDataByParentId(apiDataByStatusQuery, parentId);

    // return executeAverageCalculation(filteredDataByParentId);


// }

