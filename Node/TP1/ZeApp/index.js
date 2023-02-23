let arrayOfLocations=[];

function setRandomUserURL(country, number){
	return `https://randomuser.me/api/?nat=${country}&results=${number}`;
}
fetch(setRandomUserURL("FR", 0))
	.then((response)=>{
    return response.json()
  })
	.then((data)=>{
		for(const user of data.results){
            arrayOfLocations.push(user.location);
            console.log(user.location);
		}
	})
	.catch((err)=>{console.log(`OUPS ${err}`)})

