var $ = Dom7;

// Sofort-Check ohne Framework-Abhängigkeit
(function () {
	var isStandalone = window.navigator.standalone === true || window.matchMedia('(display-mode: standalone)').matches;
	if (isStandalone) {
		document.documentElement.classList.add('device-standalone');
	}
})();
    
const app = new Framework7({
	name: 'Eurosouvenir Navigator',
	theme:'ios',
	el: '#app',
	store: store,
	routes:routes,
	darkMode:'auto',
	disableContextMenu:true,
});


