* Follow directions to upload js file
  * https://answers.squarespace.com/questions/6556/where-do-i-upload-javascript-files.html
* Bundle SDK
  * Follow all the steps including eject - https://www.npmjs.com/package/@boundlessgeo/sdk
* Copy SDK js/css into Project
  * https://developers.squarespace.com/custom-javascript/
  * Should be one `.min.js` and `.css`

https://answers.squarespace.com/questions/6556/where-do-i-upload-javascript-files.html

Run Yarn Build on ejected app
Copy in JS file using above directions




### Alternative plan
#### Adding react / webSDK to square space page using dev tools
* Pull down the site to develop locally
  * Follow direction here - https://developers.squarespace.com/quick-start/
* Bundle SDK
  * Follow all the steps including eject - https://www.npmjs.com/package/@boundlessgeo/sdk
* Copy SDK js/css into Project
  * https://developers.squarespace.com/custom-javascript/
  * Should be one `.min.js` and `.css`
* Update .region file to include js and react dom element to render
  * `<squarespace:script src="main.ea008526.js" />`
  * `<div id="root"></div>`


