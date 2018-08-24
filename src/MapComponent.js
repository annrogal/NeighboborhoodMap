import React, { Component } from 'react';
import {locations} from './location'


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
    }

    //way to initialize the map from https://www.klaasnotfound.com/2016/11/06/making-google-maps-work-with-react/
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
                bounds.extend(marker.position);
                map.fitBounds(bounds);
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



    updateQuery = (query) => {
        this.setState({query: query.trim()})

        this.closeInfoWindow();

        this.state.locations.map(location => {
            if(location.title.toLowerCase().indexOf(query.toLowerCase()) >= 0){
                location.marker.setVisible(true);
            }else{
                location.marker.setVisible(false);
            }
        })
    }

    onListClick(event) {
        let clickedItem = this.state.locations.filter(location => location.title == event.getAttribute('name'));
        this.openInfoWindow(clickedItem[0].marker)
        
    }

    render() {        
        const locationList = this.state.locations.map(location => {
             return (
                <li key={location.id} id={location.id} name={location.title} onClick={(event) => this.onListClick(event.target)}>{location.title}</li>
                )
        })

        return (
            <div>
            <div ref="map" id="map" role="application" tabIndex='1' aria-label='Map of Gdynia'/>
            <div className='search-bar'>
                <div className='search-input'>
                    <input type='text' placeholder='Search restaurant'
                    aria-label='Search restaurants'
                    role="search"
                    tabIndex='2'
                    value={this.state.query}
                    onChange={(event) => this.updateQuery(event.target.value)}               
                   />
                    <ul className='location-list' aria-label='List of restaurants' tabIndex='3'>
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
    script.src = src;
    script.async = true;
    script.defer = true;
    ref.parentNode.insertBefore(script, ref);
}