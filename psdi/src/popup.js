import React from 'react';

import './App.css';

import SdkPopup from '@boundlessgeo/sdk/components/map/popup';

class MarkFeaturesPopup extends SdkPopup {

  // constructor(props) {
  //   super(props);
  //   //this.markFeatures = this.markFeatures.bind(this);
  // }

  // markFeatures(evt) {
  //   const feature_ids = [];
  //   const features = this.props.features;
  //
  //   for (let i = 0, ii = features.length; i < ii; i++) {
  //     // create an array of ids to be removed from the map.
  //     feature_ids.push(features[i].properties.Title);
  //     // set the feature property to "marked".
  //     features[i].properties.isMarked = true;
  //   }
  //
  //   // remove the old unmarked features
  //   //store.dispatch(SdkMapActions.removeFeatures('stories', ['in', 'id'].concat(feature_ids)));
  //   // add the new freshly marked features.
  //   //store.dispatch(SdkMapActions.addFeatures('stories', features));
  //   // close this popup.
  //   this.close(evt);
  // }

  render() {
    console.log(this.props)
    //console.log(this.props.features[0].properties.pkuid)
    //console.log(store.getState().bookmark.id)
    const feature_ids = this.props.features.map(f => f.properties.Title);

    return this.renderPopup((
      <div className="sdk-popup-content">
        <p>
          { feature_ids }
        </p>
      </div>
    ));
  }
}

export default MarkFeaturesPopup;
