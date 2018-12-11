import React, { Component } from 'react';
import { bars } from './bars';
import Nav from './TopNavBar';
import escapeRegExp from 'escape-string-regexp';
import 'bootstrap/dist/css/bootstrap.min.css';

/* Create Google Map in React 
	https://www.klaasnotfound.com/2016/11/06/making-google-maps-work-with-react/ 
	https://github.com/fullstackreact/google-maps-react/issues/108
*/
class Map extends Component {
	constructor(props) {
		super(props);
		this.state = {
			barFiltering: [],
			barSelected: '',
			infoWindow: {},
			locations: [],
			mapMarkers: [],
			setMap: {}
		}
		this.state.locations = bars;
		this.state.barFiltering = this.state.locations;
	}

	componentDidMount() {
		const script = document.createElement("script");
		const APIKey = 'AIzaSyAxpuGln7ZnHQqpUdjsYx1uCymLaeWRaII';
		script.src = `https://maps.googleapis.com/maps/api/js?key=${APIKey}&v=3&callback=initMap`;
		script.async = true;
		script.defer = true;
		document.body.appendChild(script);
		window.initMap = this.initMap;
	}

	/* Start initializing the map */
	initMap = () => {
		let mapId = document.getElementById('map');
		const mapGoogle = new window.google.maps.Map(mapId, {
			center: { lat: 41.886940, lng: -87.672260 },
			zoom: 15
		});

		/* Set Boundaries of the map */
		const bounds = new window.google.maps.LatLngBounds();

		/* Create InfoWindow */
		const infoWindow = new window.google.maps.InfoWindow({
		});

		/* Create and Set The Markers */
		this.setState({setMap: mapGoogle}, (() => {
			const locations = this.state.locations;
			const mapSet = this.state.setMap;
			const mapMarkers = locations.map((position) => {
				const barName = position.name
				const markerPosition = position.location
				const marker = new window.google.maps.Marker({
					map: mapSet,
					position: markerPosition,
					barName: barName,
					id: position.id
				});
				bounds.extend(marker.position);

				/* click event for info window */
				marker.addListener('click', () => {
					this.createInfoWindow(marker, infoWindow, mapSet);
				});

				return marker;
			});
			mapSet.fitBounds(bounds);
			this.setState({ mapMarkers })

		}))

		this.setState({infoWindow}, (() => 
			this.createInfoWindow = (marker, infoWindow, mapSet) => {
				const venueID = marker.id;
				const clientID = 'DBGTQ5ZRH4UPHSNPA1ZJ1DXO2ZLQ2HHUFGP2ZJIIK0KFVC1K';
				const secret = 'XNEU1FSBNYYT1FUV2OSBHB0KFLFPT5VFDCNFDFIAJ052TCJF';
				const url =
			    	'https://api.foursquare.com/v2/venues/' +
					venueID +
					'?&client_id=' +
					clientID +
					'&client_secret=' +
					secret +
					'&v=20171023';
				if (infoWindow.marker !== marker) {
					fetch(url)
					.then(function(response) {
						if (response.status !== 200) {
							infoWindow.setContent('<p>Unable to get any data for this location.</p>');
						}
						response
							.json()
							.then(function(data) {
								const venue = data.response.venue;
								
								let innerHTML = '<div aria-label="infowindow" tabindex="1">'
								innerHTML += `<h2 class="iw-title" tabIndex="1">${marker.barName}</h2>`
								innerHTML += '<div class="iw-content">'
								innerHTML += '<div class="left-popup">'
								if (venue.location.address !== undefined) {				
									innerHTML += '<p>' + venue.location.address + '<br>'
									} else {
										innerHTML += ' '
									}
									if (venue.location.city !== undefined) {				
									innerHTML += venue.location.city + `,`
									} else {
										innerHTML += ' '
									}
									if (venue.location.state !== undefined) {				
									innerHTML += venue.location.state + '</p>'
								} else {
									innerHTML += '<br>'
								}
								if (venue.url !== undefined) {
									let url = venue.url;
									innerHTML += `<p><a href="${url}" target="_blank">Website</a></p>`
								} else {
									innerHTML += '<p>No Website</p>'
								}
								// phone number
								if (venue.contact.formattedPhone !== undefined) {
									innerHTML += '<p>' + venue.contact.formattedPhone + '</p>'
									} else {
									innerHTML += ' '
								}
								// bar hours
								if (venue.hours !== undefined) {
									let times = venue.hours.timeframes;
									innerHTML += '<p>';
									innerHTML += '<strong>Hours:</strong> <br>';
									times.forEach(day => {
										day.open.forEach(time => {
										innerHTML += day.days + ' ' + time.renderedTime + '<br>';
										});
									});
									innerHTML += '</p>';
								} else {
									innerHTML += '<strong>Hours not listed.</strong> <br>'
								}
								innerHTML += '</div>'

								innerHTML += '<div class="right-popup">'
								
								// handle image
								const imgprefix = venue.photos.groups[1].items[0].prefix;
								const imgsuffix = venue.photos.groups[1].items[0].suffix;
								if (imgsuffix !== undefined) {
									innerHTML +=
										'<img src="' +
										imgprefix +
										'original' +
										imgsuffix +
										'" style="max-width:140px;" alt="Photo of ' +
										marker.barName +
										'" /> <br>';
								} else {
									innerHTML += '';
								}
								if (venue.rating !== undefined) {
									innerHTML += '<p> <strong>Rating:</strong>' + venue.rating + '/10 </p>'
								} else {
									innerHTML += ' '
								}

								innerHTML += '</div>'

								innerHTML += '<div class="full-popup">'

								
								if (venue.canonicalUrl !== undefined) {
									const foursquareurl = venue.canonicalUrl;
									innerHTML += `<p>Data provided by <a href="${foursquareurl}" target="_blank">Foursquare</a></p>`
								} else {
									innerHTML += '';
								}
								innerHTML += '</div>'
								innerHTML += '</div>'
								innerHTML += '</div>'


								infoWindow.setContent(`${innerHTML}`);
							})
					});
					infoWindow.marker = marker;
					// Close the "previous" infowindow
					infoWindow.close();
					infoWindow.open(mapSet, marker);
					// Close the current infowindow
					infoWindow.addListener('closeclick', function() {
						infoWindow.marker = null;
					});
				}
			}

		))
	};
	
	/* Dropdown selection */
	itemSelected = (marker) => {
		const selectedLocation = this.state.barSelected;
		if(marker.id === selectedLocation.id) {
			this.createInfoWindow(marker, this.state.infoWindow, this.state.setMap);
			return
		} else {
			return null
		}
	}

	/* Select a bar */
	selectBar = (location) => {
		if (location.id === this.state.barSelected.id) {
			this.setState({barSelected: ''});
		} else {
			this.setState({barSelected: location});
		}
	}
	
	/* Search Query */
	query = (value) => {
		this.setState(currentSelection => {
			let barFiltering = this.state.barFiltering;
			const barName = currentSelection.locations;
			if(value !== '') {
				barFiltering = barName.filter(position => {
					return position.name.toLowerCase().includes(value.toLowerCase());
				})
			} else {
				barFiltering = barName;
			}
			return({barFiltering});
		});
	}

	render() {
		/* Filtering bar listings */
		const barFiltered = this.state.mapMarkers.filter(eachMarker => {
			eachMarker.setMap(null);
			return this.state.barFiltering.some(position => position.id === eachMarker.id)
		})
		return (
			<div id="container">
				{
					barFiltered.forEach(eachMarker => {
						eachMarker.setMap(this.state.setMap);
						eachMarker.setAnimation(this.itemSelected(eachMarker));
					})
				}
				<Nav 
					locations={this.state.locations}
					barSelected={this.state.barSelected}
					barFiltering={this.state.barFiltering}
					selectBar={this.selectBar}
					query={this.query}
				/>
				<div id="map" aria-label="Top Chicago Bars" role="application"></div>
			</div>
		)
	}

}
export default Map