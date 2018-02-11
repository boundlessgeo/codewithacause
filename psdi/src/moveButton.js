import React from 'react';
import {connect} from 'react-redux';

import * as bookmarkAction from './action';
import * as mapActions from '@boundlessgeo/sdk/actions/map';

// Custom Bookmark Component
class MoveButtonComponent extends React.PureComponent {
  // This is the where action really happens, update state and move the map
  moveBookmark(id) {
    this.props.moveSlide(id);
    if (this.props.map.sources[this.props.bookmark.source]) {
      const feature = this.props.map.sources[this.props.bookmark.source].data.features[id];

      // Simple hack to adjust center of the map to compensate for the image
      const adjustGeo = [feature.geometry.coordinates[0] - 0.0005, feature.geometry.coordinates[1]];
      this.props.zoomTo(adjustGeo, 18);
    }

  }
  // Logic for handling next button
  nextBookmark() {
    const featureCount = this.props.map.sources[this.props.bookmark.source].data.features.length;
    const currentId = this.props.bookmark.id;
    const newId  = currentId >= featureCount - 1 ? 0 : currentId + 1;
    this.moveBookmark(newId);
  }
  // Logic for handling previous button
  previousBookmark() {
    const featureCount = this.props.map.sources[this.props.bookmark.source].data.features.length;
    const currentId = this.props.bookmark.id;
    const newId = currentId <= 0 ? featureCount - 1 : currentId - 1;
    this.moveBookmark(newId);
  }
  componentDidUpdate(nextProps, nextState) {
    if (nextProps.bookmark.source !== this.props.bookmark.source) {
      this.moveBookmark(this.props.bookmark.id);
    }
  }
  // Render the buttons
  render() {
    return (
      <span className="buttons">
        <button className="" onClick={() => {
          this.previousBookmark();
        }}  ><i className="fa fa-angle-left"></i> Previous</button> <button className="" onClick={() => {
          this.nextBookmark();
        }}>Next <i className="fa fa-angle-right"></i></button>
      </span>
    );
  }
}
// Getting the bookmark and map stores
function mapStateToProps(state) {
  return {
    bookmark: state.bookmark,
    map: state.map,
  };
}
// Need the moveSlide function from bookmark reducer
// Need setView function from map reducer
function mapDispatchToProps(dispatch) {
  return {
    moveSlide: (id) => {
      dispatch(bookmarkAction.moveSlide(id));
    },
    zoomTo: (coords, zoomLevel) => {
      dispatch(mapActions.setView(coords, zoomLevel));
    }
  };
}
export default connect(mapStateToProps, mapDispatchToProps)(MoveButtonComponent);
