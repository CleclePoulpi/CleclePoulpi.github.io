// random users statique
async function randomUsersV0(){
    
    let nb =0;
        while(nb < 10) {
            nb++;
            let prom = fetch("https://randomuser.me/api/?nat=fr");
            let resp = await fetch("https://randomuser.me/api/?nat=fr");
            
            if (resp.ok) { // if HTTP-status is 200-299
                // get the resp body (the method explained below)
                
        
                let json = await resp.json();
        
                var lig = tab.insertRow(0);
                var c1 = lig.insertCell(0);
                var c2 = lig.insertCell(1);
                var c3 = lig.insertCell(2);
                var c4 = lig.insertCell(3);
                var c5 = lig.insertCell(4);
        
                let nom = json["results"][0].name.last;
                let prenom = json["results"][0].name.first;
                c1.innerHTML = prenom;
                c2.innerHTML = nom;
                
                var ville = json["results"][0].location.city;

                c3.innerHTML = ville;

                var {lati,longi} = await calcLatLong(ville);
                c4.innerHTML = lati;
                c5.innerHTML = longi;
                
                console.log(tab.rows.item(nb-1));

                // ajout des marqueurs
                var marker = L.marker([lati,longi]).addTo(map);               // création du marqueur
                marker.bindPopup("<b>"+ville+"</b><br>"+nom+" "+prenom);   // popup du marqueur
                markers[nb-1] = marker;
        
            } else {
                alert("HTTP-Error: " + resp.status);
            }
            
        }
    console.log(markers);
}
// random user sans skip
async function randomUsersV1(){
    
    let nb = 0;             // ligne du tableau à modifier
    let initOk = false;     // tableau des marqueurs non initialisé
    let tour = 0;           // nombre de lignes du tableau des marqueurs initialisées

    while(true) {           // boucle infinie

        // récupération d'un user français aléatoire
        let prom = fetch("https://randomuser.me/api/?nat=fr");          // promesse du fetch
        let resp = await fetch("https://randomuser.me/api/?nat=fr");    // fetch 
        
        if (resp.ok) {      // pas d'erreur dans le fetch
    
            let json = await resp.json();   // récupération de la réponse en format JSON
            
            let row = tab.rows[nb].cells;   // récupération des cases de la ligne courante 
            
            // récupération des informations dans le JSON
            let prenom = json["results"][0].name.first;     
            let nom = json["results"][0].name.last;         
            var ville = json["results"][0].location.city;   

            // modifications des cases de la ligne courante
            row[0].innerHTML = prenom;  
            row[1].innerHTML = nom;
            row[2].innerHTML = ville;

            var {lati,longi} = await calcLatLong(ville);    // calcul de la longitude et de la latitude
            row[3].innerHTML = lati;
            row[4].innerHTML = longi;
            
            // ajout des marqueurs
            if (initOk){                        // vérification que l'initialisation est terminée
                markers[nb].removeFrom(map);    // retirer le marqueur courant (car ne sera plus dans le tableau)
            }
            
            var marker = L.marker([lati,longi]).addTo(map);            // création et affichage du nouveau marqueur
            marker.bindPopup("<b>"+ville+"</b><br>"+nom+" "+prenom).openPopup();   // popup du marqueur
            markers[nb] = marker;                                      // ajout à la liste des marqueurs présents

        } else {    // si erreur dans le fetch
            alert("HTTP-Error: " + resp.status);
        }

        nb = (nb+1)%10;         // incrémentation du numéro du user courant

        if (!initOk) {          // si l'initialisation du tableau des marqueurs n'est pas finie
            tour ++;            // un nouveau marqueur a été initialisé
            if (tour === 10) {  // une fois que le tableau est entièrement initialisé
                initOk = true;  // on marque l'initialisation comme terminée
            }
        }
    }

}

// init map test
function init_map() {
    /* récup de la map */
    map = L.map("map",{ zoomControl: false,     // retire les contrôles de zoom
                        scrollWheelZoom: false,  // empeche de zoomer au scroll
                        dragging: false
                    }).setView([47.084,2.035], 6);

    /* layer de la map */
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);
    
    
    // test marqueur 
    var marker = L.marker([48.732,-3.458]).addTo(map);               // création du marqueur
    marker.bindPopup("<b>Lannion</b><br>Poulpi<li id=\"img1\"/>");   // popup du marqueur

    // test click 
    popup = L.popup(); 
    map.on('click', onMapClick);
    
}
function onMapClick(e) {
    popup
        .setLatLng(e.latlng)
        .setContent("You clicked the map at " + e.latlng.toString())
        .openOn(map);
}

// calcul des Lat et Long simple
async function calcLatLongV0(v){

    // récupération des informations d'une ville à partir de son nom
    let prom = fetch("https://geocoding-api.open-meteo.com/v1/search?name="+v);         // promesse du fetch
    let resp = await fetch("https://geocoding-api.open-meteo.com/v1/search?name="+v);   // fetch

    if (resp.ok) { // pas d'erreur dans le fetch
        
        let json = await resp.json();   // récupération de la réponse en format JSON

        // récupération des informations dans le JSON
        let lati = json["results"][0].latitude;
        let longi = json["results"][0].longitude;

        return {lati,longi};            // renvoi des valeurs trouvées

    } else {    // si erreur dans le fetch
        alert("HTTP-Error: " + resp.status);
    }

}
// calc lat long avec gestion métropole (non fonctio)
async function calcLatLongV1(v){

    // récupération des informations d'une ville à partir de son nom
    let prom = fetch("https://geocoding-api.open-meteo.com/v1/search?name="+v);         // promesse du fetch
    let resp = await fetch("https://geocoding-api.open-meteo.com/v1/search?name="+v);   // fetch

    if (resp.ok) { // pas d'erreur dans le fetch
        
        let json = await resp.json();   // récupération de la réponse en format JSON

        // récupération des informations d'une ville en France métropolitaine (risque d'homonymes)
        var k = 0;
        var n = json["results"].length;
        console.log(json["results"]);
        while (!(json["results"][k].country_code === "FR" && json["results"][k].timezone === "Europe/Paris") && k<n){
            k++;
        }

        // récupération des informations dans le JSON
        let lati = json["results"][k].latitude;
        let longi = json["results"][k].longitude;

        return {lati,longi};            // renvoi des valeurs trouvées

    } else {    // si erreur dans le fetch
        alert("HTTP-Error: " + resp.status);
    }
}