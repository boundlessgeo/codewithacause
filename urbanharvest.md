### Adding react / webSDK to square space page
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
