import React, { Component } from 'react';
import {locations} from './location'
import SearchComponent from './SearchComponent';


//class in which the map is initiated with marker and infoWindow
class Map extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            locations: locations, 
            map: '',  
            infoWindow: '',
            previousMarker: '',
            query: ''
        }
        this.initMap = this.initMap.bind(this);
        this.openInfoWindow = this.openInfoWindow.bind(this);
        this.closeInfoWindow = this.closeInfoWindow.bind(this);
        this.mapFailure = this.mapFailure.bind(this);
    }

    //way to initialize the map from https://www.klaasnotfound.com/2016/11/06/making-google-maps-work-with-react/
    componentDidMount() {
        window.initMap = this.initMap;
        loadJS("https://maps.googleapis.com/maps/api/js?key=AIzaSyBTy_Dyw1ErxbzVbY_S2w8Je1GgdearAuI&callback=initMap", this.mapFailure())
    }

    mapFailure() {
        window.gm_authFailure = function() {
            alert('Google maps failed to load!');
            console.log('test')
         }
    }

    initMap() {
        const mapDiv = document.getElementById('map');
        let infoWindow = new window.google.maps.InfoWindow({});

        let map = new window.google.maps.Map(mapDiv, {
            center: {lat: 54.520498, lng: 18.539023},
            zoom: 15
        })

        this.setState({
            map: map,
            infoWindow: infoWindow
        })


        //add marker to locations
        this.state.locations.map(location => {
            let marker = new window.google.maps.Marker({
                position: new window.google.maps.LatLng(location.lat, location.lng),
                map: map,
                title: location.title,
                address: location.address,
                id: location.id
            });
           
            marker.addListener('click', () => {
                this.openInfoWindow(marker);
            });

            location.marker = marker;
        })        
    }

    //function to open InfoWindow to marker when it clicked
    openInfoWindow(marker) {
        marker.infoWindow = new window.google.maps.InfoWindow({});
        marker.setAnimation(window.google.maps.Animation.DROP);
     
        //if another InfoWindow is open, close it
        this.closeInfoWindow();

        this.state.infoWindow.open(this.state.map, marker);
        this.state.infoWindow.setContent(`${marker.title}</br>address: ${marker.address}</br>${marker.position}`);

        //add to InfoWindow listener to close it by click
        this.state.infoWindow.addListener('closeclick', () => {
            this.state.infoWindow.setMarker = null;
        });

        this.setState({
            previousMarker: marker
        })
    }

    //function to close opened InfoWindow 
        closeInfoWindow() {
        this.setState({
            previousMarker: ''
        });

        this.state.infoWindow.close();
    }

    render() {       
        return (
            <div>
            <div ref="map" id="map" role="application" tabIndex='1' aria-label='Map of Gdynia'/>
            <SearchComponent 
                locations={this.state.locations} 
                openInfoWindow={this.openInfoWindow} 
                closeInfoWindow={this.closeInfoWindow}
            />
            </div>
        )
    }
}

export default Map;

//function to asynchronous load map
function loadJS(src, mapFailure) {
    const ref = window.document.getElementsByTagName("script")[0];
    const script = window.document.createElement("script");
    script.src = src;
    script.onerror = mapFailure;
    script.async = true;
    script.defer = true;
    ref.parentNode.insertBefore(script, ref);
}