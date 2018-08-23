import React, { Component } from 'react';
import {locations} from './location'
import escapeRegExp from 'escape-string-regexp'

class Map extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            locations: locations, 
            map: '',  
            infoWindow: '',
            previousMarker: '',
            markers: [],
            filterLocations: {},
            query: ''
        }
        this.initMap = this.initMap.bind(this);
        this.openInfoWindow = this.openInfoWindow.bind(this);
        this.closeInfoWindow = this.closeInfoWindow.bind(this);
        this.filter = this.filter.bind(this);
        this.updateQuery = this.updateQuery.bind(this);
        this.resetQuery = this.resetQuery.bind(this);
    }

    componentDidMount() {
        window.initMap = this.initMap;
        loadJS("https://maps.googleapis.com/maps/api/js?key=AIzaSyBTy_Dyw1ErxbzVbY_S2w8Je1GgdearAuI&callback=initMap")
    }

    updateQuery = (query) => {
        this.setState({query: query.trim()})
    }

    resetQuery = () => {
        this.setState({query: ''})
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

        this.state.filterLocations.map(location => {
            let marker = new window.google.maps.Marker({
                position: new window.google.maps.LatLng(location.lat, location.lng),
                map: map,
                title: location.title,
                address: location.address,
                id: location.id
            });
           
            marker.addListener('click', () => {
                this.openInfoWindow(marker);
                bounds.extend(marker.position);
                map.fitBounds(bounds);
            });

            this.state.markers.push(marker);
        })        
    }

    filter(query) {
       if(query) {
        const match = new RegExp(escapeRegExp(query), 'i');
        this.state.filterLocations = locations.filter(location => match.test(location.title))
       }else{
           this.state.filterLocations = locations
       }
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
        this.setState({
            previousMarker: ''
        });

        this.state.infoWindow.close();
    }

    render() {        
        const {query} = this.state

        this.filter(query);

const locationList = this.state.filterLocations.map(location => {
    return (
        <li key={location.id} id={location.id} name={location.title}>{location.title}</li>
    )
})

        return (
            <div>
            <div ref="map" id="map" role="application" />
            <div className='search-bar'>
                <div className='search-input'>
                    <input type='text' placeholder='Search restaurant'
                    aria-label='Search restaurants'
                    role="search"
                    tabIndex='1'
                    value={query}
                    onChange={(event) => this.updateQuery(event.target.value)}               
                   />
                    <ul className='location-list' aria-label='List of restaurants'>
                        {locationList}
                    </ul>
                </div>
            </div>
            </div>
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