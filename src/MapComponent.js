import React, { Component } from 'react';
import {locations} from './location'

class Map extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            locations: locations, 
            map: '', 
            markers: [], 
            infoWindow: '',
            previousMarker: ''
        }
        this.initMap = this.initMap.bind(this);
        this.openInfoWindow = this.openInfoWindow.bind(this);
        this.closeInfoWindow = this.closeInfoWindow.bind(this);
    }

    componentDidMount() {
        window.initMap = this.initMap;
        loadJS("https://maps.googleapis.com/maps/api/js?key=AIzaSyBTy_Dyw1ErxbzVbY_S2w8Je1GgdearAuI&callback=initMap")
    }

    initMap() {
        const mapDiv = document.getElementById('map');
        let infoWindow = new window.google.maps.InfoWindow({});
        let bounds = new window.google.maps.LatLngBounds();

        let map = new window.google.maps.Map(mapDiv, {
            center: {lat: 54.520498, lng: 18.539023},
            zoom: 15
        })

        this.setState({
            map: map,
            infoWindow: infoWindow
        })

        this.state.locations.map(location => {
            let marker = new window.google.maps.Marker({
                position: new window.google.maps.LatLng(location.lat, location.lng),
                map: map,
                title: location.title,
                address: location.address,
                id: location
            });

            this.state.markers.push(marker);

           
            
            marker.addListener('click', () => {
                    
                this.openInfoWindow(marker);

                bounds.extend(marker.position);
                

                map.fitBounds(bounds);
                
            });
        })        
    }

    openInfoWindow(marker) {
        marker.infoWindow = new window.google.maps.InfoWindow({});

        this.closeInfoWindow();

        this.state.infoWindow.open(this.state.map, marker);
                
                this.state.infoWindow.setContent(`${marker.title}</br>address: ${marker.address}</br>${marker.position}`);

                this.state.infoWindow.addListener('closeclick', () => {
                    this.state.infoWindow.setMarker = null;
                });

                this.setState({
                    previousMarker: marker
                })

    }

    closeInfoWindow() {
        if(this.state.previousMarker) {
            this.state.previousMarker.setAnimation(null);
        }
        this.setState({
            previousMarker: ''
        });

        this.state.infoWindow.close();
    }

    render() {        
        return (
            <div ref="map" id="map" role="application"/>
        )
    }
}

export default Map;

function loadJS(src) {
    const ref = window.document.getElementsByTagName("script")[0];
    const script = window.document.createElement("script");
    console.log(script);
    script.src = src;
    script.async = true;
    script.defer = true;
    ref.parentNode.insertBefore(script, ref);
    console.log(ref.parentNode)
}