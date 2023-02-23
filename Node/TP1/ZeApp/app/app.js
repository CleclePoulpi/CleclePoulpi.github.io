//This code first includes the Node.js http module in its standard library.
const http = require('http'); 
const { array } = require('yargs');

const hostname = '127.0.0.1';
const port = 3000;

let arrayOfLocations=[];

function setRandomUserURL(country, number){
	return `https://randomuser.me/api/?nat=${country}&results=${number}`;
}
let i;

fetch(setRandomUserURL("FR", 100))
    .then((response)=>{
    return response.json()
})
    .then((data)=>{
        for(const user of data.results){
            arrayOfLocations.push(user.location);
            
        }
    })
    .catch((err)=>{console.log(`OUPS ${err}`)}) 


//The createServer() method of the http module creates a new HTTP server and returns it.
/*
Whenever a new request is received, the request event is called, providing two objects: a request (an http.IncomingMessage object) and a response (an http.ServerResponse object).
*/
const server = http.createServer((req, res) => { //req and res are JS objects  containing the http request and response
  res.statusCode = 200; //(return) status code is a field of the http response object
  res.setHeader('Content-Type', 'text/plain'); // is the set of headers
  for (i=0;i<100;i++){
    res.write(arrayOfLocations[i].street.number+" "+arrayOfLocations[i].street.name+" "+arrayOfLocations[i].postcode+" "+arrayOfLocations[i].city+"\n"); // the end methods pack the response and send it to the client.
    console.log(arrayOfLocations[i].street.number+" "+arrayOfLocations[i].street.name+" "+arrayOfLocations[i].postcode+" "+arrayOfLocations[i].city+"\n");
  }

});

//The server is set to listen on the specified port and host name. 
//When the server is ready, the callback function is called, 
// in this case informing us that the server is running.
server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});


