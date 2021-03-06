import React from 'react';
import {connect} from 'react-redux';

import MoveButtonComponent from './moveButton';

// Custom Bookmark Component
class BookmarkComponent extends React.PureComponent {
  render() {
    // Get the feature selected by the count in state
    // Render the modal window using style from app.css
    const id = this.props.bookmark.id;

    if (this.props.map.sources[this.props.bookmark.source] &&
      this.props.map.sources[this.props.bookmark.source].data.features) {
      const feature = this.props.map.sources[this.props.bookmark.source].data.features[id];
      const image = {backgroundImage: `url("${feature.properties.Link_Image}")`, color:"#00000" };
      return (
        <div className='panelContainer'>
          <div className="panel">
            <div className="imageContainer" style={image}>
              <div className="closeButton"></div>
              <div className="title">
                {feature.properties.Title}
              </div>
            </div>
            <div className="storyContainer">
              {feature.properties.Story}
            </div>
            <div className="controls">
              <MoveButtonComponent store={this.props.store} />
            </div>
          </div>

        </div>
      );
    } else {
      return (
        <div> </div>
      );
    }
  }
}
// Getting the bookmark and map stores
function mapStateToProps(state) {
  return {
    bookmark: state.bookmark,
    map: state.map,
  };
}

export default connect(mapStateToProps, null)(BookmarkComponent);
