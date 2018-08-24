import React, { Component } from 'react';

//class in wich search component is initiated
class SearchComponent extends Component {
    constructor(props){
        super(props)
        this.state = {
            locations: this.props.locations
        }
        this.openInfoWindow = this.props.openInfoWindow
        this.closeInfoWindow = this.props.closeInfoWindow
    }

    //function which update markers when query is typing in search input
    updateMarkers = (query) => {
        this.setState({query: query.trim()})

        //close InfoWindow if it is open
        this.closeInfoWindow();

        //map by locations and looking one that matching query 
        this.state.locations.map(location => {
            //method to serach first occurance of typing query in location title with ignore the lower case
            if(location.title.toLowerCase().indexOf(query.toLowerCase()) >= 0){
                location.marker.setVisible(true);
            }else{
                location.marker.setVisible(false);
            }
        })
    }

    //function call when locatio in list clicked
    onListClick(event) {
        let clickedItem = this.state.locations.filter(location => location.title === event.getAttribute('name'));
        this.openInfoWindow(clickedItem[0].marker)
    }

    render() {

        //create location list by li element
        const locationList = this.state.locations.map(location => {
            return (
               <li key={location.id} id={location.id} name={location.title} onClick={(event) => this.onListClick(event.target)}>{location.title}</li>
               )
       })

        return (
            <div className='search-bar'>
            <div className='search-input'>
                <input type='text' placeholder='Search restaurant'
                aria-label='Search restaurants'
                role="search"
                tabIndex='2'
                value={this.state.query}
                onChange={(event) => this.updateMarkers(event.target.value)}               
               />
                <ul className='location-list' aria-label='List of restaurants' tabIndex='3'>
                    {locationList}
                </ul>
            </div>
        </div>
        )
    }

}

export default SearchComponent