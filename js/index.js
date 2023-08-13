(function () {
    const srchKeywrd = document.getElementById("search");
    const sugestionCont = document.getElementById("crd-cont");
    const favMoviesCont = document.getElementById("fav-movies-cont");
    const emptyText = document.getElementById("empty-search-text");
    const showFavourites = document.getElementById("fav-sec");
    const emptyFvTxt = document.getElementById("empty-fav-text");
  

    
window.addEventListener("DOMContentLoaded", (event) => {
  showFavourites.style.display = "none";
});

    addToFavDOM();
    showEmptyText();
    let suggestionList = [];
    let favMovieArray = [];
  
    srchKeywrd.addEventListener("keydown", (event) => {
      if (event.key == "Enter") {
        event.preventDefault();
      }
    });
  
    function showEmptyText() {
      if (favMoviesCont.innerHTML == "") {
        emptyFvTxt.style.display = "block";
      } else {
        emptyFvTxt.style.display = "none";
      }
    }

    srchKeywrd.addEventListener("keyup", function () {
      let search = srchKeywrd.value;
      if (search === "") {
        emptyText.style.display = "block";
        sugestionCont.innerHTML = "";
     
        suggestionList = [];
      } else {
        emptyText.style.display = "none";
        (async () => {
          let data = await fetchMovies(search);
          addToSuggestionContainerDOM(data);
        })();
  
        sugestionCont.style.display = "grid";
      }
    });
  
    async function fetchMovies(search) {
      const url = `https://www.omdbapi.com/?t=${search}&apikey=b78b8d7d`;
      try {
        const response = await fetch(url);
        const data = await response.json();
        return data;
      } catch (err) {
        console.log(err);
      }
    }
  
 
    function addToSuggestionContainerDOM(data) {
      //document.getElementById("empty-fav-text").style.display = "none";
      let isPresent = false;
  
      suggestionList.forEach((movie) => {
        if (movie.Title == data.Title) {
          isPresent = true;
        }
      });
  
      if (!isPresent && data.Title != undefined) {
        if (data.Poster == "N/A") {
          data.Poster = "./images/not-found.png";
        }
        suggestionList.push(data);
        const movieCard = document.createElement("div");
        movieCard.setAttribute("class", "text-decoration");
        movieCard.innerHTML = `
          <div class="card my-2" data-id = " ${data.Title} ">
          <a href="movie.html" >
            <img
              src="${data.Poster} "
              class="card-img-top"
              alt="..."
              data-id = "${data.Title} "
            />
            <div class="card-body text-start">
              <h5 class="card-title" >
                <a href="movie.html" data-id = "${data.Title} "> ${data.Title}  </a>
              </h5>
  
              <p class="card-text">
                <i class="fa-solid fa-star">
                  <span id="rating">&nbsp;${data.imdbRating}</span>
                </i>
  
                <button class="fav-btn">
                  <i class="fa-solid fa-heart add-fav" data-id="${data.Title}"></i>
                </button>
              </p>
            </div>
          </a>
        </div>
      `;
      showFavourites.style.display = "none";
      sugestionCont.prepend(movieCard);
      }
    }
  
    async function handleFavBtn(e) {
      const target = e.target;
  
      let data = await fetchMovies(target.dataset.id);
  
      let favMoviesLocal = localStorage.getItem("favMoviesList");
  
      if (favMoviesLocal) {
        favMovieArray = Array.from(JSON.parse(favMoviesLocal));
      } else {
        localStorage.setItem("favMoviesList", JSON.stringify(data));
      }
  
      let isPresent = false;
      favMovieArray.forEach((movie) => {
        if (data.Title == movie.Title) {
          notify("already added to fav list");
          isPresent = true;
        }
      });
  
      if (!isPresent) {
        favMovieArray.push(data);
      }
  
      localStorage.setItem("favMoviesList", JSON.stringify(favMovieArray));
      isPresent = !isPresent;
      addToFavDOM();
      showEmptyText();
    }
  
    function addToFavDOM() {
      favMoviesCont.innerHTML = "";
  
      let favList = JSON.parse(localStorage.getItem("favMoviesList"));
      if (favList) {
        favList.forEach((movie) => {
          const div = document.createElement("div");
          div.classList.add(
            "fav-movie-card",
            "d-flex",
            "justify-content-between",
            "align-content-center",
            "my-2"
          );
          div.innerHTML = `
     
      <img
        src="${movie.Poster}"
        alt=""
        class="movieposter"
      />
      <div class="movie-details">
        <p class="movie-name mt-3 mb-0">
         <a href = "movie.html" class="moviename" data-id="${movie.Title}">${movie.Title}<a> 
        </p>
        <small class="text-muted">${movie.Year}</small>
      </div>
  
      <div class="delete-btn my-4">
          <i class="fa-solid fa-trash-can" data-id="${movie.Title}"></i>
      </div>
      `;
  
      favMoviesCont.prepend(div);
        });
      }
    }
  
   
    function notify(text) {
      window.alert(text);
    }
  
  
    function deleteMovie(name) {
      let favList = JSON.parse(localStorage.getItem("favMoviesList"));
      let updatedList = Array.from(favList).filter((movie) => {
        return movie.Title != name;
      });
  
      localStorage.setItem("favMoviesList", JSON.stringify(updatedList));
  
      addToFavDOM();
      showEmptyText();
    }
  
    async function handleClickListner(e) {
      const target = e.target;
  
      if (target.classList.contains("add-fav")) {
        e.preventDefault();
        handleFavBtn(e);
      } else if (target.classList.contains("fa-trash-can")) {
        deleteMovie(target.dataset.id);
      } else if (target.classList.contains("fa-bars") || target.classList.contains("menu-fav")) {
        if (showFavourites.style.display == "flex") {
          document.getElementById("show-fav").style.color = "#8b9595";
          showFavourites.style.display = "none";
          emptyText.style.display="block";
        } else {
          // showFavourites.classList.add("animate__backInRight");
          document.getElementById("show-fav").style.color =
            "var(--logo-color)";
          showFavourites.style.display = "flex";
          emptyText.style.display="none";
        }
      }
      showEmptyText();
      localStorage.setItem("movieName", target.dataset.id);
    }
  
  
    document.addEventListener("click", handleClickListner);
  })();
