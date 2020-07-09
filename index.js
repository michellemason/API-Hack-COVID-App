'use strict';

// by state covid URL
const stateURL = 'https://covidtracking.com/api/v1/states/';
const stateFilename = '/current.json';

// news api
const newsURL = 'https://api.smartable.ai/coronavirus/news/US-'
const subscriptionKey = 'f514bcaac5a941c68c7e7bfa1c67e19a';



// helper function to format url string with chosen state
function formatStatsURL(state) {
    var urlString = stateURL + state + stateFilename;
    return urlString;
}

// helper function to format news URL string with chosen state
function formatNewsURL(state) {
    var urlString = newsURL + state;
    return urlString
}

// helper function to parse date data
function formatDate(updateDate) {
    var year = updateDate.toString().substring(0, 4);
    var month = updateDate.toString().substring(4, 6);
    var day = updateDate.toString().substring(6, 8);
    var totalDate = month + '/' + day + '/' + year;
    return totalDate;
}

// function to fetch state-specific data from URL
function getCovidData(endpointURL) {
    fetch(endpointURL)
    .then(response => response.json())
    .then(responseJson => parseCovidData(responseJson));
}

// function to fetch state-specific news data from URL
function getCovidNews(fullNewsURL) {
    // format request header
    //var reqHeader = new Headers();
    //reqHeader.append('Subscription-Key', subscriptionKey);

    // format GET request with header
    var request = new Request(fullNewsURL, {
        method: 'GET',
        headers: {
            'Subscription-Key': subscriptionKey
        }
    });

    // fetch the news
    fetch(request)
        .then(response => response.json())
        .then(responseJson => parseCovidNews(responseJson));
}

// function to parse out the data for displays
function parseCovidData(covidJson) {
    var numPositive = covidJson.positive;
    var positiveInc = covidJson.positiveIncrease;

    //console.log("Num positive for " + covidJson.state + " = " + numPositive);
    //console.log("Positive increase for " + covidJson.state + " = " + positiveInc);

    $('.date-updated-val').text(formatDate(covidJson.date));
    $('.total-today-val').text(covidJson.positiveIncrease);
    $('.new-deaths-val').text(covidJson.deathIncrease);
    $('.total-positive-val').text(covidJson.positive);
    $('.total-negative-val').text(covidJson.negative);
    $('.total-deaths-val').text(covidJson.death);
    // $('.total-recovered-val').text(covidJson.recovered);
}

function parseCovidNews(newsJson) {
    $('#results-list').empty();
    if (newsJson.news.length == 0) {
        $('#results-list').append(
            `<li><p>No news for this state at this time.</p>
            </li>`
          )
    } else {
    newsJson.news.forEach(newsElement => 
        $('#results-list').append(
            `<li><a href='${newsElement.webUrl}'><h3>${newsElement.title}</h3></a>
            <p>${newsElement.excerpt}</p>
            </li>`
          )
        );
    }

    //console.log(newsJson);

    
}





// JQuery trigger for select box change
$('select').on('change', function () {
    // format the request endpoint url for selected-state covid data
    // then get the data through getCovidData function
    getCovidData(formatStatsURL(this.value));
    
    // format the request endpoint url for selected-state news data
    getCovidNews(formatNewsURL(this.value.toUpperCase()));;
});

// MAP FUNCTIONS

$('#map').on('usmapclick', function(event, data) {
    // format the request endpoint url for selected-state covid data
    // then get the data through getCovidData function
    getCovidData(formatStatsURL(data.name.toLowerCase()));

    // format the request endpoint url for selected-state news data
    getCovidNews(formatNewsURL(data.name));;

    // change value of the select box to be the state the user clicked
    $('select').val(data.name.toLowerCase());
  });

  $('#map').usmap({
    stateHoverStyles: {fill: '#7A151F'}
  });


$(document).ready(function() {
    $('#map').usmap({});
  });

  
