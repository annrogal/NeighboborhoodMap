import React, { Component } from 'react';
import {withGoogleMap, GoogleMap} from 'react-google-maps';
class Map extends Component {
    render() {
        const GoogleMapExample = withGoogleMap(props => (
        <GoogleMap 
            defaultCenter={{lat: 54.506207, lng: 18.538278}}
            defaultZoom={13}>
        </GoogleMap>
        ));
        
        return (
            <div id="map">
                <GoogleMapExample
                    containerElement={ <div style={{ height: `1000px`, width: '100%' }} /> }
                    mapElement={ <div style={{ height: `100%` }} /> }
                />
            </div>
        )
    }
}

export default Map;