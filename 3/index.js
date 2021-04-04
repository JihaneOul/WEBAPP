// initialize parameters and movie

var movieid = 640;
var Movie_list = [movieid];
var number = null;
var actordir = "";

// fetch initial default movie information
// movie title, release date and image of movie are shown

fetch(`https://api.themoviedb.org/3/movie/${movieid}?api_key=db7f7d0752d4ab236e9f908dd550f480`)
        .then(request =>{
        return request.json();
    })
    .then(data =>{
     let container=document.getElementById("default_movie")
        container.innerHTML = `
        <div class = "movie_information">
            <p><b> Title :</b>  ${data.title}</p> 
            <p> <b> Release date :</b> ${data.release_date} </p>
            <img src="http://image.tmdb.org/t/p/w185${data.backdrop_path}" alt="${data.title} Backdrop Path"> 
            </div>`
        
    })

// function determining whether first question is answered correctly 
function CheckAnswer1(){
	actor_id = [];
	actor_image = [];
    var ispartOf = false;
    actordir = document.getElementById("actordir").value;
   //receive input value given either actor or director 
    
    fetch(`https://api.themoviedb.org/3/movie/${movieid}/credits?api_key=db7f7d0752d4ab236e9f908dd550f480`)
    .then(request =>{
    	return request.json();
    })
    .then(data =>{

    	actor_id = data.cast.map(id =>{
            return `${id.id}`})
        actor_image = data.cast.map(picture =>{
            return `${picture.profile_path}`})
        
        
       let possible_answers = []
            for(let i = 0; i < data.crew.length; i++){
                if(data.crew[i].job == 'Director'){
                    possible_answers.push(data.crew[i].name)
                }
            }
            for (i=0; i<data.cast.length;i++){
            	possible_answers.push(data.cast[i].name)
            }

        for (i=0; i<possible_answers.length;i++){
            if (possible_answers[i].toLowerCase().trim() == actordir.toLowerCase().trim()){
                ispartOf = true;
                number = i;
           		}
       		 }
        if (!ispartOf){
            document.getElementById("container1").innerHTML = '<div class= "incorrect_input"> <br> <b>Could not find any actor or director matching the input</b> </div>';
        }
        else{
            document.getElementById("container1").innerHTML = 
            `<p><b> Name : </b> ${possible_answers[number]} </p> 
            <img src="http://image.tmdb.org/t/p/w185${actor_image[number-1]}" alt="${possible_answers[number]}'s profile picture">
            <form>
                    <label for="movie">Enter the name of a movie where this actor or director had a part in: </label><br><br>
                    <input type="text" id="movie" name="movie" /><br><br>
                    <button type="button" id="answer2">Submit</button><br>
            </form>`;
            document.getElementById("answer2").onclick = function() {CheckAnswer2()};
        }
    })
    .catch(err => {
            reject(err);
    })
}



function CheckAnswer2(){
	actor_id = [];
	actor_name = [];
	actor_image = [];
    var movieName = document.getElementById("movie").value;
    movieName = encodeURIComponent(movieName)
    movieidList = [];
    movie_list = [];
    var Used = false;
    var ispartOf = false;

    // look for movie 
    fetch(`https://api.themoviedb.org/3/search/movie?api_key=db7f7d0752d4ab236e9f908dd550f480&query=${movieName}`)
    .then(request =>{
   		return request.json();
    })
    .then(data =>{
        movie_list = data.results.map(id =>{
            return `${id.id}`
        })
        
        // If the movie is used already
        for (l = 0; l<Movie_list.length;l++){
            if (movie_list[0]==Movie_list[l]){
                Used = true;
            }
        }

        if (Used){
            document.getElementById("container2").innerHTML = "<div class= 'incorrect_input'> <br><b> Movie already used</b> </div>";
     
        }
        else{
            // create one list with all possible answers 
            fetch(`https://api.themoviedb.org/3/movie/${movie_list[0]}/credits?api_key=db7f7d0752d4ab236e9f908dd550f480`)
            .then(request =>{
            	return request.json();
            })
            .then(data =>{
                let actor_name = data.cast.map( actor =>{
                    return `${actor.name}`
                })
                
                let possible_answers = []
            	for(let i = 0; i < data.crew.length; i++){
                	if(data.crew[i].job == 'Director'){
                    	possible_answers.push(data.crew[i].name)
                	}	
            	}
            	for (i=0; i<data.cast.length;i++){
            		possible_answers.push(data.cast[i].name)
            	}

        		for (i=0; i<possible_answers.length;i++){
            		if (possible_answers[i].toLowerCase().trim() == actordir.toLowerCase().trim()){
                
                    	ispartOf = true
                    
           				}
       		 		}

               

                if (ispartOf){
                	//start again empty containers
                    Movie_list.push(movie_list[0]);
                    document.getElementById("container1").innerHTML = "";
                    document.getElementById("default_movie").innerHTML = "";
                    document.getElementById("container2").innerHTML = "";
                    movieid = movie_list[0]
                    fetch(`https://api.themoviedb.org/3/movie/${movieid}?api_key=db7f7d0752d4ab236e9f908dd550f480`)
        			.then(request =>{
       					 return request.json();
    							})
   					 .then(data =>{
     			let container=document.getElementById("default_movie")
        			container.innerHTML = `
       					 <div class = "movie_information">
         				   <p><b> Title :</b>  ${data.title}</p> 
          				   <p> <b> Release date :</b> ${data.release_date} </p>
          				   <img src="http://image.tmdb.org/t/p/w185${data.backdrop_path}" alt=" backdrop Path"> 
         			     </div>`
        
    								})
                			}
                else{
                    document.getElementById("container2").innerHTML = '<div class= "incorrect_input"> <br> <b>This is not the right answer</b> </div>';
                   }
            })
            .catch(err => {
            	reject(err);
            })
        }
        
    })
    .catch(err => {
            reject(err)
    })
}
// run the answer function
document.getElementById("answer1").onclick = function() {CheckAnswer1()};