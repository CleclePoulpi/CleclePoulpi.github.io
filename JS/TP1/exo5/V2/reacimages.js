function init() 
{
    
}

function updateImg(x)
{
    imgVari = document.getElementById('vari');

    if(x === 1){
        imgVari.setAttribute('style', 'background-image:url("./img/poulpi_classe.png");');
    }
    else if (x===2) {
        imgVari.setAttribute('style', 'background-image:url("./img/poulpi_musique.png");');
    }
}