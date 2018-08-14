import React, { Component } from 'react';

class Map extends Component {

    componentDidMount() {
        window.initMap = this.initMap;
        loadJS("https://maps.googleapis.com/maps/api/js?key=AIzaSyBTy_Dyw1ErxbzVbY_S2w8Je1GgdearAuI&callback=initMap")
    }

    initMap() {
        const mapDiv = document.getElementById('map');
        let map = new window.google.maps.Map(mapDiv, {
            center: {lat: 54.506207, lng: 18.538278},
            zoom: 13
        })
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