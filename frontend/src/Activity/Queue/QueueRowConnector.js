import _ from 'lodash';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { grabQueueItem, removeQueueItem } from 'Store/Actions/queueActions';
import createArtistSelector from 'Store/Selectors/createArtistSelector';
import createEpisodeSelector from 'Store/Selectors/createEpisodeSelector';
import createUISettingsSelector from 'Store/Selectors/createUISettingsSelector';
import QueueRow from './QueueRow';

function createMapStateToProps() {
  return createSelector(
    createArtistSelector(),
    createEpisodeSelector(),
    createUISettingsSelector(),
    (artist, episode, uiSettings) => {
      const result = _.pick(uiSettings, [
        'showRelativeDates',
        'shortDateFormat',
        'timeFormat'
      ]);

      result.artist = artist;
      result.episode = episode;

      return result;
    }
  );
}

const mapDispatchToProps = {
  grabQueueItem,
  removeQueueItem
};

class QueueRowConnector extends Component {

  //
  // Listeners

  onGrabPress = () => {
    this.props.grabQueueItem({ id: this.props.id });
  }

  onRemoveQueueItemPress = (blacklist) => {
    this.props.removeQueueItem({ id: this.props.id, blacklist });
  }

  //
  // Render

  render() {
    if (!this.props.episode) {
      return null;
    }

    return (
      <QueueRow
        {...this.props}
        onGrabPress={this.onGrabPress}
        onRemoveQueueItemPress={this.onRemoveQueueItemPress}
      />
    );
  }
}

QueueRowConnector.propTypes = {
  id: PropTypes.number.isRequired,
  episode: PropTypes.object,
  grabQueueItem: PropTypes.func.isRequired,
  removeQueueItem: PropTypes.func.isRequired
};

export default connect(createMapStateToProps, mapDispatchToProps)(QueueRowConnector);
