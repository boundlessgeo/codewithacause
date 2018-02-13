import React, { Component } from 'react';

// import fetch from 'isomorphic-fetch';

import './App.css';
import farms from './farms.json';

import { createStore, combineReducers, applyMiddleware} from 'redux';
import thunkMiddleware from 'redux-thunk';
import {Provider} from 'react-redux';

import SdkMap from '@boundlessgeo/sdk/components/map';
import SdkMapReducer from '@boundlessgeo/sdk/reducers/map';

import * as SdkMapActions from '@boundlessgeo/sdk/actions/map';

import BookmarkComponent from './bookmarks';

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
    store.dispatch(SdkMapActions.setView([-90.1980205,38.633941], 18));
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

    store.dispatch(SdkMapActions.addSource('stories', {
      type: 'geojson',
      data: farms
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
    store.dispatch(bookmarkAction.changeSource('stories'));. 
  }

  render() {
    return (
      <div className="App">
        <Provider store={store}>
          <div className='mapContainer'>
            <SdkMap
              className="map"
            />
            <BookmarkComponent/>
          </div>
        </Provider>
      </div>
    );
  }
}

export default App;
