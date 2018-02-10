import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import fetch from 'isomorphic-fetch';

import './App.css';

import { createStore, combineReducers, applyMiddleware} from 'redux';
import thunkMiddleware from 'redux-thunk';
import {Provider} from 'react-redux';

import SdkMap from '@boundlessgeo/sdk/components/map';
import SdkMapReducer from '@boundlessgeo/sdk/reducers/map';
import SdkZoomControl from '@boundlessgeo/sdk/components/map/zoom-control';

import * as SdkMapActions from '@boundlessgeo/sdk/actions/map';

import BookmarkComponent from './bookmarks';
import MoveButtonComponent from './moveButton';
import AddBookmarkComponent from './addBookmark';

import bookmarkReducer from './reducer';
import * as bookmarkAction from './action';

import SdkPopup from '@boundlessgeo/sdk/components/map/popup';

const store = createStore(combineReducers({
  map: SdkMapReducer, bookmark: bookmarkReducer,
}), window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__(),
applyMiddleware(thunkMiddleware));

class MarkFeaturesPopup extends SdkPopup {

  constructor(props) {
    super(props);
    this.markFeatures = this.markFeatures.bind(this);
  }

  markFeatures(evt) {
    const feature_ids = [];
    const features = this.props.features;

    for (let i = 0, ii = features.length; i < ii; i++) {
      // create an array of ids to be removed from the map.
      feature_ids.push(features[i].properties.Title);
      // set the feature property to "marked".
      features[i].properties.isMarked = true;
    }

    // remove the old unmarked features
    //store.dispatch(SdkMapActions.removeFeatures('points', ['in', 'id'].concat(feature_ids)));
    // add the new freshly marked features.
    //store.dispatch(SdkMapActions.addFeatures('points', features));
    // close this popup.
    this.close(evt);
  }

  render() {
    const feature_ids = this.props.features.map(f => f.properties.Title);
    console.log(this.props.features)
    return this.renderPopup((
      <div className="sdk-popup-content">
        <p>
          { feature_ids.join(', ') }
        </p>
      </div>
    ));
  }
}

class App extends Component {

  componentDidMount() {
    // load in the map style from a external .json
    store.dispatch(SdkMapActions.setView([90.37,23.94], 6));
    // add the OSM source
    store.dispatch(SdkMapActions.addSource('osm', {
      type: 'raster',
      tileSize: 256,
      tiles: [
        'https://a.tile.openstreetmap.org/{z}/{x}/{y}.png',
        'https://b.tile.openstreetmap.org/{z}/{x}/{y}.png',
        'https://c.tile.openstreetmap.org/{z}/{x}/{y}.png',
      ],
    }));

    // add an OSM layer
    store.dispatch(SdkMapActions.addLayer({
      id: 'osm',
      source: 'osm',
    }));

    store.dispatch(SdkMapActions.addSource('stlouis', {
      type: 'geojson',
        data: {
          "type": "FeatureCollection",
          "name": "Map_pins",
          "crs": { "type": "name", "properties": { "name": "urn:ogc:def:crs:OGC:1.3:CRS84" } },
          "features": [
            { "type": "Feature", "properties": { "pkuid": 1, "Title": "Dhunot", "Story": null, "Summary": null, "Link_video": null, "Link_Image": null, "Date": null }, "geometry": { "type": "Point", "coordinates": [ 89.540207679982643, 24.681778761020187 ] } },
            { "type": "Feature", "properties": { "pkuid": 2, "Title": "Nadigram", "Story": null, "Summary": null, "Link_video": null, "Link_Image": null, "Date": null }, "geometry": { "type": "Point", "coordinates": [ 89.247858964457834, 24.647041610326482 ] } },
            { "type": "Feature", "properties": { "pkuid": 3, "Title": "Sherpur", "Story": null, "Summary": null, "Link_video": null, "Link_Image": null, "Date": null }, "geometry": { "type": "Point", "coordinates": [ 89.420253914284515, 24.663183693273464 ] } },
            { "type": "Feature", "properties": { "pkuid": 4, "Title": "Kutibari", "Story": null, "Summary": null, "Link_video": null, "Link_Image": null, "Date": null }, "geometry": { "type": "Point", "coordinates": [ 89.350039191291202, 24.85956606418393 ] } },
            { "type": "Feature", "properties": { "pkuid": 5, "Title": "Nikli", "Story": null, "Summary": null, "Link_video": null, "Link_Image": null, "Date": null }, "geometry": { "type": "Point", "coordinates": [ 90.939401757462207, 24.327018066009312 ] } },
            { "type": "Feature", "properties": { "pkuid": 1, "Title": "Dhunot", "Story": null, "Summary": null, "Link_video": null, "Link_Image": null, "Date": null }, "geometry": { "type": "Point", "coordinates": [ 89.540207679982643, 24.681778761020187 ] } },
            { "type": "Feature", "properties": { "pkuid": 2, "Title": "Nadigram", "Story": null, "Summary": null, "Link_video": null, "Link_Image": null, "Date": null }, "geometry": { "type": "Point", "coordinates": [ 89.247858964457834, 24.647041610326482 ] } },
            { "type": "Feature", "properties": { "pkuid": 3, "Title": "Sherpur", "Story": null, "Summary": null, "Link_video": null, "Link_Image": null, "Date": null }, "geometry": { "type": "Point", "coordinates": [ 89.420253914284515, 24.663183693273464 ] } },
            { "type": "Feature", "properties": { "pkuid": 4, "Title": "Kutibari", "Story": null, "Summary": null, "Link_video": null, "Link_Image": null, "Date": null }, "geometry": { "type": "Point", "coordinates": [ 89.350039191291202, 24.85956606418393 ] } },
            { "type": "Feature", "properties": { "pkuid": 5, "Title": "Nikli", "Story": null, "Summary": null, "Link_video": null, "Link_Image": null, "Date": null }, "geometry": { "type": "Point", "coordinates": [ 90.939401757462207, 24.327018066009312 ] } }
          ]
        }
    }));
    store.dispatch(SdkMapActions.addLayer({
      id: 'stlouis',
      type: 'circle',
      source: 'stlouis',
      paint: {
        'circle-radius': 5,
        'circle-color': '#f46b42',
        'circle-stroke-color': '#3a160b',
      }
    }));

    this.test();
  }

  test() {
    // This is the name of the source that the bookmark component will iterate over
    const SOURCENAMES = ['paris-bakeries', 'saint-louis-bakeries'];

    // Change the souce as needed
    const changeSource = (sourceName) => {
      store.dispatch(bookmarkAction.changeSource(sourceName));
    };
    // Add bookmark to redux store
    const addBookmark = () => {
      store.dispatch(bookmarkAction.addBookmark(true));
    };

    // Delete bookmark to redux store
    const deleteBookmark = () => {
      const bookmark = store.getState().bookmark;
      const features = store.getState().map.sources[bookmark.source].data.features;

      // Simple check to make sure we have more feature to remove
      if (features.length > 0) {

        // move to the next feature before it's deleted
        if (features.length > 1) {
          store.dispatch(SdkMapActions.setView(features[bookmark.count + 1].geometry.coordinates, 18));
        }

        // Assumes address is unique
        // In a larger dataset adding in a uuid would be a good idea
        const filter = ['==', 'address', features[bookmark.count].properties.address];
        store.dispatch(SdkMapActions.removeFeatures(bookmark.source, filter));
      } else {
        alert('No features left to delete');
      }
    };

    // Init source for the bookmarks
    //changeSource(SOURCENAMES[0]);
  }

  render() {
    return (
      <div className="App">
        <Provider store={store}>
          <div className='map-container'>
            <SdkMap
              className='map'
              style={{position: 'relative'}}
              includeFeaturesOnClick
              onClick={(map, xy, featurePromise) => {
                featurePromise.then((featureGroups) => {
                // featureGroups is an array of objects. The key of each object
                // is a layer from the map. Here, only one layer is included.
                const layers = Object.keys(featureGroups[0]);
                const layer = layers[0];
                // collect every feature from the layer.
                // in this case, only one feature will be returned in the promise.
                const features = featureGroups[0][layer];

                if (features === undefined) {
                  // no features, :( Let the user know nothing was there.
                  //map.addPopup(<SdkPopup coordinate={xy}><i>This is a popup!</i></SdkPopup>);
                } else {
                  // Show the super advanced fun popup!
                  map.addPopup(<MarkFeaturesPopup coordinate={xy} features={features} />);
                }
                });
              }}
            />
            <div id="bookmark"><BookmarkComponent className='bookmark-item'/></div>
            <AddBookmarkComponent />
          </div>
        </Provider>
      </div>
    );
  }
}

export default App;
