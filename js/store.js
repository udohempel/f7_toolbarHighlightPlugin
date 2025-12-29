var createStore = Framework7.createStore;

const store = createStore({
	state: {
		server:window.location.origin,
		update:0,
		languages:false,
		selectedLanguage:false,
		countryList:false,
		geo:{
			lat:false,
			lon:false
		},
		welcome:{
			newLocations:false,
			newArticles:false,
		},
		radius:{
			distance:false,
		},
		search:{
			selectedCountry:false,
			selectedCity:false,
			searchOptions:false,
			pagination:false,
		},
		preferences:{
		}
	},
	getters: {
		server({ state }) {
			return state.server;
		}
	},
	actions: {

	},
});

