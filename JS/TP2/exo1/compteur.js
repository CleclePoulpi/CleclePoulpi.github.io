let intervID;

function init()
{
    
    compteur = document.getElementById("compteur");

    if (!intervID) {
        intervID = setInterval(cmpt, 1000); // création compteur
    }
    
}

function cmpt ()
    {  
        let texte = compteur.textContent;

        let val = parseInt(texte,10);

        if (val === 0)
        {
            clearInterval(intervID);
        }
        else 
        {
            compteur.innerText= val - 1;
        }

}

