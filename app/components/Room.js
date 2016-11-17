import React from 'react';
import {getRoomData, getSongsData, getUserIds} from '../server';

export default class Room extends React.Component{

    constructor(props) {
      super(props);
      var roomId = this.props.location.query.roomId;
      this.state = {currentRoomId: roomId, playlist: {}, participants: {}}
    }

    componentWillMount() {
      this.setState({currentRoomId: this.state.currentRoomId, playlist: this.getRoomPlaylistSongs(this.state.currentRoomId), participants: this.getRoomParticipants(this.state.currentRoomId)});
    }

    getRoomPlaylist(roomId) {
      return getRoomData(parseInt(roomId));
    }

    getRoomPlaylistSongs(roomId) {
      var roomData = getRoomData(parseInt(roomId));
      var songs = [];

      for (var track in roomData.playlists) {
        var songData = getSongsData(parseInt(roomData.playlists[track].trackID));
        songData.likes = roomData.playlists[track].likes;
        songs.push(songData);
      }

      return songs;
    }

    getRoomParticipants(roomId) {
      var roomData = getRoomData(parseInt(roomId));
      var pars = [];

      for (var participant in roomData.participants) {
        pars.push(parseInt(roomData.participants[participant]));
      }

      return pars;
    }

    render() {
        var currentRoomId = this.state.currentRoomId;
        var currentSongToPlay = this.state.playlist[0].title

        var roomPlaylistSongsElements = [];
        for (var song in this.state.playlist) {
          roomPlaylistSongsElements.push(
            <tr>
              <td><button type="button" className="btn btn-secondary btn-playlist"><span className="glyphicon glyphicon-thumbs-up"></span></button> | {this.state.playlist[song].likes} likes</td>
              <td>{this.state.playlist[song].title}</td>
              <td>{this.state.playlist[song].artist}</td>
              <td>{this.state.playlist[song].album}</td>
            </tr>
          );
        }

        var userIds = getUserIds();
        var roomParticipantsNames = [];
        for (var participant in this.state.participants) {
          for (var id in userIds){
            if (userIds[id]._id == this.state.participants[participant]){
              roomParticipantsNames.push(
                <tr>
                  <td>{userIds[id].firstname + " " + userIds[id].lastname}</td>
                </tr>
              );
            }
          }
        }

        return (
            <div>
            <div>
            <div>
            <div>
                <div className="col-md-9">
                  <div>
                    <div className="media">
                      <div className="media-left">
                        <img className="media-object album-cover" src="/img/views_album_cover.jpg" width="150px" alt="Drake - Views" />
                      </div>
                      <div className="media-body">
                        <h3 id="current_song_playing_in_room" className="media-heading">Playing: {currentSongToPlay}</h3>
                          <br />
                            </div>
                          </div>

                          <table className="table room-playlist">
                          <tbody>
                            <tr>
                              <th>Votes</th>
                              <th>Song</th>
                              <th>Artist</th>
                              <th>Album</th>
                            </tr>
                            {roomPlaylistSongsElements}
                          </tbody>
                          </table>
                        </div>
                      </div>
                      <div className="col-md-3">
                      <div id="imaginary_container">
                          <div className="input-group stylish-input-group">
                              <input type="text" className="form-control"  placeholder="Search Tracks"></input>
                              <span className="input-group-addon">
                                  <button type="submit">
                                      <span className="glyphicon glyphicon-search"></span>
                                  </button>
                              </span>
                          </div>
                      </div>
                        <table className="table room-list">
                        <tbody>
                          <tr>
                            <th>Participants</th>
                          </tr>
                          {roomParticipantsNames}

                        </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
            </div>
        );
    }
}
