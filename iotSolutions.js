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


// Strategy to solve:
//
// 1. Make single API Call: Write a function that returns API data given the statusQuery and pageNumber
// 2. Collect all relevant data: Write a function that loops through and calls function #1 for 'i' number of pages, collects this data, and returns all of it (based on statusQuery).
// 3. Filter Data: Write a function that accepts the result of function #2, and filters based on parentId.
// 4. Calculate average: Write a function that accepts the filtered data, and calculates the average rotor speed.
// 5. Execute: Write a function calling all of these functions so the execution stack is clear and readable.

