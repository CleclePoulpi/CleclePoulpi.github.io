document.addEventListener("DOMContentLoaded",init);

let tab;                    // tableau des users
let map;                    // carte
let popup;                  // popup des marqueurs
let markers = [,,,,,,,,,,]; // tableau des marqueurs (10 marqueurs)
let defiler = true;

/* fonction d'initialisation globale */
function init(){
    init_map();         // initialisation de la carte

    tab = document.getElementById("table"); // récupération du tableau des users
    construc_tab();     // construction du tableau des users
    randomUsers();    // ajout des users aléatoires dans le tableau
}

/* --------------- */
/* JS pour Leaflet */
/* --------------- */

// initialisation de la carte
function init_map() {
    // récupération de la carte
    map = L.map("map",{ zoomControl: false,         // retire les contrôles de zoom
                        scrollWheelZoom: false,     // empeche de zoomer au scroll
                        dragging: false             // empeche de déplacer la carte
                    }).setView([47.084,2.035], 6);  // centré sur la France (latlong autour de Bourges) avec zoom adéquat

    // layer de la carte 
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);
}



/* ------------- */
/* JS pour Users */
/* ------------- */

// création de la structure du tableau des users
function construc_tab(){
    let i;

    // ajout du header
    var header = tab.createTHead();
    var row = header.insertRow(0);
    var h1 = row.insertCell(0);
    var h2 = row.insertCell(1);
    var h3 = row.insertCell(2);

    // remplissage du header
    h1.innerHTML = "<b>Prénom</b>";
    h2.innerHTML = "<b>Nom</b>";
    h3.innerHTML = "<b>Ville</b>";

    // ajout des lignes
    for (i=1; i<11 ; i++){
        var lig = tab.insertRow(i);
        var c1 = lig.insertCell(0);
        var c2 = lig.insertCell(1);
        var c3 = lig.insertCell(2);
    }
}

// affichage des users
async function randomUsers(){
    
    let nb = 1;             // ligne du tableau à modifier
    let initOk = false;     // tableau des marqueurs non initialisé
    let tour = 0;           // nombre de lignes du tableau des marqueurs initialisées
    let skip = false;       // user courant non passé

    while(true) {           // boucle infinie
        skip = false;       // par défaut le user généré est utilisé

        // récupération d'un user français aléatoire
        let prom = fetch("https://randomuser.me/api/?nat=fr");          // promesse du fetch
        let resp = await fetch("https://randomuser.me/api/?nat=fr");    // fetch 
        
        if (resp.ok) {      // pas d'erreur dans le fetch
    
            let json = await resp.json();   // récupération de la réponse en format JSON
            
            let row = tab.rows[nb].cells;   // récupération des cases de la ligne courante 
            
            // récupération de la ville et de ses coordonnées
            var ville = json["results"][0].location.city;
            if (!(ville === "Fort-de-France")){ // Seule ville pour laquelle les tests de la fonction calcLatLong() ne fonctionnent pas
                var {lati,longi} = await calcLatLong(ville);

                if (!(lati === "")){ // Si la ville est en France Métropolitaine

                    // récupération des autres informations
                    let prenom = json["results"][0].name.first;     
                    let nom = json["results"][0].name.last;  

                    // modifications des cases de la ligne courante
                    row[0].innerHTML = prenom;  
                    row[1].innerHTML = nom;
                    row[2].innerHTML = ville;
                    
                    let tempe;
                    let vent;
                    let code_m;

                    // gestion du tableau des marqueurs
                    if (initOk){                        // vérification que l'initialisation est terminée
                        markers[nb-1].removeFrom(map);    // retirer le marqueur courant (car ne sera plus dans le tableau)
                    }

                    // récupération de la météo
                    let prom_meteo = fetch("https://api.open-meteo.com/v1/forecast?latitude="+lati+"&longitude="+longi+"&current_weather=true&hourly=temperature_2m,relativehumidity_2m,windspeed_10m");          // promesse du fetch
                    let resp_meteo = await fetch("https://api.open-meteo.com/v1/forecast?latitude="+lati+"&longitude="+longi+"&current_weather=true&hourly=temperature_2m,relativehumidity_2m,windspeed_10m");
                    
                    if(resp_meteo.ok){  // pas d'erreur dans le fetch
                        
                        let json = await resp_meteo.json();   // récupération de la réponse en format JSON
                        
                        tempe = json["current_weather"].temperature;    // récupération de la température
                        vent = json["current_weather"].windspeed;
                        code_m = json["current_weather"].weathercode;

                    } else {    // si erreur dans le fetch
                        alert("HTTP-Error: " + resp.status);
                    }



                    // ajout du nouveau marqueur
                    var marker = L.marker([lati,longi]).addTo(map);            // création et affichage du nouveau marqueur
                    // popup du marqueur
                    var txt = getCodeMeteo(code_m);
                    marker.bindPopup("<b>"+ville+"</b><br>"+nom+" "+prenom+"<br>"+txt+"Température : "+tempe+" °C<br>Vitesse du vent : "+vent+"km/h<br>",keepInView = true).openPopup();
                    markers[nb-1] = marker;                                       // ajout à la liste des marqueurs présents

                } else {            // si la ville n'est pas en France métropolitaine
                    skip = true;    // on passe l'utilisateur généré par l'API
                }
            } else {
                skip = true;
            }
            
                    

        } else {    // si erreur dans le fetch
            alert("HTTP-Error: " + resp.status);
        }

        if (!skip){             // si on ne passe pas le user généré 
            nb = (nb+1)%11;     // incrémentation du numéro du user courant
            if (nb === 0){      // pour ne pas modifier le header (en position 0)
                nb = 1;
            }   
        }

        if (!initOk && !skip) {          // si l'initialisation du tableau des marqueurs n'est pas finie et que le user n'est pas passé
            tour ++;            // un nouveau marqueur a été initialisé
            if (tour === 10) {  // une fois que le tableau est entièrement initialisé
                initOk = true;  // on marque l'initialisation comme terminée
            }
        }
    }

}

// calcul des latitudes et longitudes à partir de v, le nom d'une ville
async function calcLatLong(v){

    // récupération des informations d'une ville à partir de son nom
    let prom = fetch("https://geocoding-api.open-meteo.com/v1/search?name="+v);         // promesse du fetch
    let resp = await fetch("https://geocoding-api.open-meteo.com/v1/search?name="+v);   // fetch

    if (resp.ok) { // pas d'erreur dans le fetch
        
        let json = await resp.json();   // récupération de la réponse en format JSON

        // récupération des informations d'une ville en France métropolitaine (risque d'homonymes)
        var k = 0;                      // indice de parcours
        var n = json["results"].length; // nombre de résultats possibles

        // tant que le pays n'est pas Français et dans la timezone de Paris, et que l'indice k est valide
        while (!(json["results"][k].timezone === "Europe/Paris" && json["results"][k].country_code === "FR") && k<n){
            k++;
        }

        if (k<n) {  // si un indice correspond à une ville en France métropolitaine

            // récupération des informations dans le JSON
            var lati = json["results"][k].latitude;
            var longi = json["results"][k].longitude;
   
        } else {    // si les résultats ne sont pas en France métropolitaine

            // on renvoie des valeurs vides
            lati ="";
            longi = "";
        }

        return {lati,longi}; // renvoi des valeurs trouvées

    } else {    // si erreur dans le fetch
        alert("HTTP-Error: " + resp.status);
    }
}


/* ------------- */
/* JS pour Météo */
/* ------------- */

// récupération de la météo en fonction du code donné
function getCodeMeteo(code){
    let code_img;   // icone correspondante
    let nom;        // nom de la manifestation

    switch(code) {
        case 0:
            code_img = 100;    //f101
            nom = "Dégagé"
            break;
        case 1:
            code_img = 102;    //f103
            nom = "Peu nuageux"
            break;
        case 2:
            code_img = 101;    //f102
            nom = "Partiellement nuageux"
            break;
        case 3:
            code_img = 104;    //f105
            nom = "Couvert"
            break; 
        case 45:
            code_img = 2003;    //f1ad
            nom = "Brouillard"
            break;
        case 48:
            code_img = 510;     //f136
            nom = "Brouillard givrant" //depositing rime fog
            break;
        case 51:
        case 53:
        case 55:
            code_img = 309;     //f113
            nom = "Bruine" //drizzle
            break;
        case 56:
        case 57:
            code_img = 404;     //f124
            nom = "Bruine givrante"
            break;
        case 61:
            code_img = 305;     //f10f
            nom = "Pluie légère"
            break;
        case 63:
            code_img = 306;     //f110
            nom = "Pluie modérée"
            break;
        case 65:
            code_img = 307;     //f111
            nom = "Pluie forte"
            break;
        case 66:
        case 67:
            code_img = 313;     //f117
            nom = "Pluie givrante"
            break;
        case 71:
        case 77:
            code_img = 400;     //f120
            nom = "Chutes de neige légères"
            break;
        case 73:
            code_img = 401;     //f121
            nom = "Chutes de neige modérées"
            break;
        case 75:
            code_img = 402;     //f122
            nom = "Chutes de neige fortes"
            break;
        case 80:
        case 81:
            code_img = 300;    //f10a
            nom = "Cluie légère ensoleillée"
            break;
        case 82:
            code_img = 301;    //f10b
            nom = "Cluie forte ensoleillée"
            break;
        case 85:
            code_img = 406;     //f126
            nom = "Chutes de neige légères ensoleillées"
            break;
        case 86:
            code_img = 407;     //f127
            nom = "Chutes de neige fortes ensoleillées"
            break;
        case 95:
            code_img = 1043;     //f171
            nom = "Orage faible à moyen"
            break;
        case 96:
            code_img = 304;     //f10e
            nom = "Orage avec grèle faible"
            break;
        case 99:
            code_img = 2016;     //f1ba
            nom = "Orage avec grèle forte"
            break;
    }
        
    return "<table id=\"marqueur\"><tr id=\"marqueur\"><td id=\"marqueur\"><img src=\"./icones/"+code_img+".svg\" width=\"16\" height=\"16\"></td><td id=\"marqueur\">"+nom+"</td></tr></table>"
    
}


