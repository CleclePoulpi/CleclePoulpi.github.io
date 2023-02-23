document.addEventListener("DOMContentLoaded",machin);

let tab;

function machin(){
    tab = document.getElementById("table");
    truc();
}

async function truc(){
    
    let nb =0;
        while(nb < 10) {
            nb++;
            let prom = fetch("https://randomuser.me/api/");
            let resp = await fetch("https://randomuser.me/api/");
            
            if (resp.ok) { // if HTTP-status is 200-299
                // get the resp body (the method explained below)
                
        
                let json = await resp.json();
        
                var lig = tab.insertRow(0);
                var c1 = lig.insertCell(0);
                var c2 = lig.insertCell(1);
                var c3 = lig.insertCell(2);
        
                c1.innerHTML = json["results"][0].name.first;
                c2.innerHTML = json["results"][0].name.last;
                c3.innerHTML = "<img src=\" "+json['results'][0].picture.medium+"\"></img>";
        
        
            } else {
                alert("HTTP-Error: " + resp.status);
            }
            
        }

  
}

/*
    var row = table.insertRow(0);
    var case1 = row.insertCell(0);
    var case2 = row.insertCell(1);
    case1.innerHTML = truc.machin.machin

*/
