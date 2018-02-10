import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import { createStore, combineReducers } from 'redux';

import SdkMap from '@boundlessgeo/sdk/components/map';
import SdkMapReducer from '@boundlessgeo/sdk/reducers/map';
import * as SdkMapActions from '@boundlessgeo/sdk/actions/map';

import SdkPopup from '@boundlessgeo/sdk/components/map/popup';

const store = createStore(combineReducers({
  'map': SdkMapReducer,
}));

class App extends Component {

  componentDidMount() {
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
  }

  render() {
    return (
      <div className="App">
        <SdkMap
          store={store}
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
              map.addPopup(<SdkPopup coordinate={xy}><i>This is a popup!</i></SdkPopup>);
            }
          });
      }}
    />
      </div>
    );
  }
}

export default App;
