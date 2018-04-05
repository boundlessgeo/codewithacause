// Client ID and API key from the Developer Console
var CLIENT_ID = '464130035398-va5ab04a9fvti6v8oqm4obfjciivm7gp.apps.googleusercontent.com';
var API_KEY = 'AIzaSyBhpTPe8JSiumJI_4_myyyOzabqhMIc8aU';

// Array of API discovery doc URLs for APIs used by the quickstart
var DISCOVERY_DOCS = ["https://sheets.googleapis.com/$discovery/rest?version=v4"];

// Authorization scopes required by the API; multiple scopes can be
// included, separated by spaces.
var SCOPES = "https://www.googleapis.com/auth/spreadsheets.readonly";

var authorizeButton = document.getElementById('authorize-button');
var signoutButton = document.getElementById('signout-button');

/**
 *  On load, called to load the auth2 library and API client library.
 */
export function handleClientLoad() {
  window.gapi.load('client:auth2', initClient);
}

/**
 *  Initializes the API client library and sets up sign-in state
 *  listeners.
 */
export function initClient() {
  window.gapi.client.init({
    apiKey: API_KEY,
    clientId: CLIENT_ID,
    discoveryDocs: DISCOVERY_DOCS,
    scope: SCOPES
  })
  // .then(function () {
  //   // Listen for sign-in state changes.
  //   window.gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);
  //
  //   // Handle the initial sign-in state.
  //   updateSigninStatus(window.gapi.auth2.getAuthInstance().isSignedIn.get());
  //   authorizeButton.onclick = handleAuthClick;
  //   signoutButton.onclick = handleSignoutClick;
  // });
}

/**
 *  Called when the signed in status changes, to update the UI
 *  appropriately. After a sign-in, the API is called.
 */
function updateSigninStatus(isSignedIn) {
  if (isSignedIn) {
    authorizeButton.style.display = 'none';
    signoutButton.style.display = 'block';
    getGeo();
  } else {
    authorizeButton.style.display = 'block';
    signoutButton.style.display = 'none';
  }
}

/**
 *  Sign in the user upon button click.
 */
function handleAuthClick(event) {
  window.gapi.auth2.getAuthInstance().signIn();
}

/**
 *  Sign out the user upon button click.
 */
function handleSignoutClick(event) {
  window.gapi.auth2.getAuthInstance().signOut();
}

/**
 * Append a pre element to the body containing the given message
 * as its text node. Used to display the results of the API call.
 *
 * @param {string} message Text to be placed in pre element.
 */
function appendPre(message) {
  var pre = document.getElementById('content');
  var textContent = document.createTextNode(message + '\n');
  pre.appendChild(textContent);
}

/**
 * Print the names and majors of students in a sample spreadsheet:
 * https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit
 */
 export function getGeo() {
   window.gapi.client.sheets.spreadsheets.values.get({
     spreadsheetId: '15pHl5fQ1vd6bEys0AzOnoMsHsxJHtFQSNRCC-qmL4Sk',
     range: 'Sheet2!A2:L',
   }).then(function(response) {
     var range = response.result;
     if (range.values.length > 0) {
       var geo = {};
       var feature = {};
       var features = [];
       for (let i = 0; i < range.values.length; i++) {
         var row = range.values[i];
         // Print columns A and E, which correspond to indices 0 and 4.
         feature = {
              "wkt_geom":row[1],
              "pkuid":[i],
              "title":row[2],
              "Story":row[3],
              "Summary":row[4],
              "Link_video":row[5],
              "Link_Image":row[6],
              "Date":row[7],
              "xcoord":row[8],
              "ycoord":row[9],
              "Type":row[10],
              "District":row[11]

         }
         features.push(feature);
         appendPre(feature);
         appendPre(feature["title"]);
       }
         appendPre(features)
         geo = {
            "type":"FeatureCollection",
            "name":"Map_pins",
            "crs": { "type": "name", "properties": { "name": "urn:ogc:def:crs:OGC:1.3:CRS84" } },
            "features": features
      }
        appendPre(geo);
    }else {
      appendPre('No data found.');
    }
  }, function(response) {
    appendPre('Error: ' + response.result.error.message);
  });
}
