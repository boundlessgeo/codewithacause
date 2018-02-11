import React, { Component } from 'react';

import fetch from 'isomorphic-fetch';

import './App.css';

import { createStore, combineReducers, applyMiddleware} from 'redux';
import thunkMiddleware from 'redux-thunk';
import {Provider} from 'react-redux';

import SdkMap from '@boundlessgeo/sdk/components/map';
import SdkMapReducer from '@boundlessgeo/sdk/reducers/map';

import * as SdkMapActions from '@boundlessgeo/sdk/actions/map';

import BookmarkComponent from './bookmarks';
import MarkFeaturesPopup from './popup';

import bookmarkReducer from './reducer';
import * as bookmarkAction from './action';

const store = createStore(combineReducers({
  map: SdkMapReducer, bookmark: bookmarkReducer,
}), window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__(),
applyMiddleware(thunkMiddleware));

class App extends Component {

  componentDidMount() {
    // load in the map style from a external .json
    //store.dispatch(SdkMapActions.setView([90.37,23.94], 6));
    store.dispatch(SdkMapActions.setView([86.3, 24.683], 6));
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

    const addDataFromGeoJSON = (url) => {

      return fetch(url)
      .then(
        response => response.json(),
        error => console.error('An error occured.', error),
      )

      .then(json => {
        store.dispatch(SdkMapActions.addSource('stories', {
          type: 'geojson',
          data: json
        }));
        store.dispatch(SdkMapActions.addLayer({
          id: 'stories',
          type: 'circle',
          source: 'stories',
          paint: {
            'circle-radius': 5,
            'circle-color': '#f46b42',
            'circle-stroke-color': '#3a160b',
          }
        }));
      });
    }

    addDataFromGeoJSON('map_data/Map_pins.geojson');
    store.dispatch(bookmarkAction.changeSource('stories'));

  }

  render() {
    return (
      <div className="App">
        <Provider store={store}>
          <div className='mapContainer'>
            <SdkMap
              className="map"
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
                  var id = features[0].properties.pkuid;
                  // Show the super advanced fun popup!
                  map.addPopup(<MarkFeaturesPopup coordinate={xy} features={features} />);
                  store.dispatch(bookmarkAction.moveSlide(id));
                }
                });
              }}
            />
            <BookmarkComponent/>
          </div>
        </Provider>
      </div>
    );
  }
}

export default App;
