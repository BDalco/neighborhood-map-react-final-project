import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
/*
	React Bootstrap Dropdown Navigation
	https://www.davebennett.tech/bootstrap-navbar-collapse-reactjs/
*/
class Nav extends Component {
	constructor(props) {
		super(props);
		this.toggleNavbar = this.toggleNavbar.bind(this);
		this.toggleOpen = this.toggleOpen.bind(this);
		this.state = {
			collapsed: true,
			toggleIsOpen: false
		};
	}
	toggleNavbar() {
		this.setState({
			collapsed: !this.state.collapsed
		});
	}
	toggleOpen() {
		this.setState({
			toggleIsOpen: !this.state.toggleIsOpen
		})
	}
	render() {
		const locations = this.props.locations;
		const barFiltering = this.props.barFiltering;
		const barSelected = this.props.barSelected;
		const collapsed = this.state.collapsed;
		const classOne = collapsed ? 'collapse navbar-collapse' : 'collapse navbar-collapse show';
		const classTwo = collapsed ? 'navbar-toggler navbar-toggler-right collapsed' : 'navbar-toggler navbar-toggler-right';
		const items = barFiltering === [] ? locations : barFiltering;
		const menuClass = `dropdown-menu${this.state.toggleIsOpen ? ' show' : ''}`;
		const query = this.props.query;
		const selectBar = this.props.selectBar;
		return (
			<nav className="navbar navbar-expand-md navbar-dark bg-primary transparent-nav main-nav">
				<div className="navbar-nav">
					<a className="navbar-brand" href="/">Chicago Breweries</a>
				</div>
				<button onClick={this.toggleNavbar} className={`${classTwo}`} type="button" data-toggle="collapse" data-target="#navbarResponsive" aria-controls="navbarResponsive" aria-expanded="false" aria-label="Toggle navigation">
					<span className="navbar-toggler-icon" />
				</button>
				
				<div className={`${classOne}`} id="navbarResponsive">
					<ul 
						className="navbar-nav mr-auto" 
						arial-label="navigation" 
						role="navigation"
					>
						<li 
							className="nav-item dropdown" 
							onClick={this.toggleOpen}
						>
							<a
								className="nav-link dropdown-toggle"
								href="#"
								id="dropdown-toggle"
								data-toggle="barDropdown"
								aria-haspopup="true"
								aria-expanded="false"
							> 
							Bar List
							</a>
							<div className={menuClass} aria-labelledby="barDropdown">
								<ul className='list'
									aria-label="List of locations"
									role="tabpanel"
									tabIndex="0"
								> 
					            {items.map((location, index) => {
									const itemSelected = (location.id === barSelected.id ? 'selectedItem' : '');
										return (
											<li role="tab" className={itemSelected}
												key={index}
												onClick={() => selectBar(location)}
												onKeyDown={(event) => {
													if (event.keyCode === 13) {
														selectBar(location)
													}
												}}
												tabIndex="0"
											>
												{location.name}
											</li>
											)
										})}
									</ul>
							</div>
						</li>
					</ul>
					<input className="search-box form-control mr-sm-12"
						aria-label="Search for Bar Locations"
						placeholder="Search for Bar Locations"
						type="text"
						onChange={event => query(event.target.value)}
					/>
				</div>
 			</nav>
		)
	}
}
export default Nav;