// ==UserScript==
// @name         ZT
// @namespace    http://tampermonkey.net/
// @version      2024-03-02
// @description  Get Latest Viewed
// @author       matthieuEv
// @match        https://*/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// ==/UserScript==

(function() {
    if(/^(.*)\.(.*)$/.exec(window.location.host)[1] == "www.zone-telechargement"){
        window.onload = function() {
            console.log('Script Loaded');

            // Function to create the "onetitle" div
            function createOneTitleDiv() {
                const onetitleDiv = document.createElement("div");
                onetitleDiv.classList.add("onetitle");

                const exclusLink = document.createElement("p");
                exclusLink.style.letterSpacing = "3px";
                exclusLink.style.color = "black";
                exclusLink.textContent = "Last Viewed";
                onetitleDiv.appendChild(exclusLink);

                return onetitleDiv;
            }

            // Function to create the "cover_global" div (can be modified for different content)
            function createCoverGlobalDiv() {
                const storage = JSON.parse(localStorage.getItem("latest"));

                console.log('len:', storage.length);

                let content = "";

                for (let i = 0; i < storage.length; i++) {
                  let item = storage[i];
                  let coverGlobalDiv = document.createElement("div");
                  coverGlobalDiv.classList.add("cover_global");
                  coverGlobalDiv.style.height = "294px";

                  const coverContent = `
                    <button style="position: absolute;right: 0;cursor: crosshair;border: none;background: none;font-weight: 600;" id="removeLatest" data-id="${item.url}">X</button>
                    <div style="height:193px;">
                      <a href="${item.url}">
                        <img class="mainimg" data-newsid="880" src="${item.img_url}" width="145" height="193" border="0">
                      </a>
                    </div>

                    <span>Rating: ${item.rating}<span>

                    <div style="clear:both;">
                      <div class="cover_infos_global">
                        <div class="cover_infos_title">
                          <a href="${item.url}">${item.name}</a>
                        </div>
                      </div>
                    </div>
                    <span style="color:#1ba100"><b>${item.quality}</b></span> <span style="color:#00ccff"><b>${item.lang}</b></span>
                    <div class="cover_infos_genre">
                      <a>${item.genre}</a>
                    </div>
                    <div class="cover_infos_release_date">(${item.date})</div>
                  `;

                  coverGlobalDiv.innerHTML = coverContent;

                  // Add click event listener to the "removeLatest" button
                  const removeButton = coverGlobalDiv.querySelector('#removeLatest');
                  removeButton.addEventListener('click', () => {
                    const itemId = removeButton.dataset.id;

                    // Remove the item from local storage
                    const updatedStorage = storage.filter(movie => movie.url !== itemId);
                    localStorage.setItem("latest", JSON.stringify(updatedStorage));

                    // Remove the element from the DOM (optional)
                    coverGlobalDiv.parentNode.removeChild(coverGlobalDiv);
                  });

                  heading.parentNode.insertBefore(coverGlobalDiv, heading.nextSibling);
                }
              }

            // add the data to the local storage
            function addMovieToQueue(movieData) {
                // Définir les propriétés de l'objet film
                const movie = {
                    "url": movieData.url,
                    "img_url": movieData.img_url,
                    "rating": movieData.rating,
                    "star_rating": movieData.star_rating,
                    "name": movieData.name,
                    "quality": movieData.quality,
                    "genre": movieData.genre,
                    "date": movieData.date,
                    "lang": movieData.lang
                };

                // Récupérer la file d'attente existante du stockage local
                const storedData = localStorage.getItem("latest");
                let movies = [];

                // Si la file d'attente existe, la convertir en tableau
                if (storedData) {
                    movies = JSON.parse(storedData);
                }

                // Vérifier si le film est déjà dans la file d'attente
                const movieExists = movies.some(existingMovie => existingMovie.url === movie.url);

                // Si le film n'est pas déjà présent, l'ajouter
                if (!movieExists) {
                    // Si la file d'attente est pleine (5 éléments), supprimer le premier élément
                    if (movies.length === 5) {
                        movies.shift(); // Retire le premier élément
                    }

                    // Ajouter le nouveau film à la fin de la file d'attente
                    movies.push(movie);

                    // Enregistrer la file d'attente mise à jour dans le stockage local
                    localStorage.setItem("latest", JSON.stringify(movies));
                }
            }

            // Scrap data from page
            function getInformations(type){
                let url,img_url,rating,name,quality,genre,date,lang ="";
                if(type == "film"){
                    console.log("-------GetInformation-------")
                    url = window.location.href;
                    console.log("url: ",url)
                    img_url = document.getElementsByTagName('img')[4].src;
                    console.log("img_url: ",img_url);
                    rating = document.getElementById('dle-content').innerHTML.match(/<strong><u>Critiques Spectateurs<\/u> :<\/strong>\s*([^<]+)\/5<br>/)[1];
                    console.log("rating: ",rating)
                    name = document.getElementById('dle-content').getElementsByTagName('h1')[0].outerText;
                    console.log("name: ",name)
                    quality = document.getElementById('dle-content').innerHTML.match(/<strong><u>Qualité<\/u> :<\/strong>\s*([^<]+)<br>/)[1];
                    console.log("quality: ",quality)
                    lang = "("+document.getElementById('dle-content').innerHTML.match(/<strong><u>Langue<\/u> :<\/strong>\s*([^<]+)<br>/)[1]+")";
                    console.log("lang: ",lang);
                    genre = "";
                    date = document.getElementById('dle-content').innerHTML.match(/<strong><u>Année de production<\/u> :<\/strong>\s*([^<]+)<br>/)[1];
                    console.log("date: ",date)
                    console.log("----------------------------")
                }
                else if (type == "serie"){
                    console.log("-------GetInformation-------")
                    url = window.location.href;
                    console.log("url: ",url)
                    img_url = document.getElementsByTagName('img')[4].src;
                    console.log("img_url: ",img_url);
                    rating = document.getElementById('dle-content').innerHTML.match(/<strong><u>Critiques Spectateurs<\/u> :<\/strong>\s*([^<]+)\/5<br>/)[1];
                    console.log("rating: ",rating)
                    name = document.getElementById('dle-content').getElementsByTagName('h1')[0].outerText;
                    console.log("name: ",name)
                    quality = document.querySelector('.masha_index7').nextSibling.textContent.split('\n')[0];
                    console.log("quality: ",quality)
                    lang = "";
                    genre = "";
                    date = document.getElementById('dle-content').innerHTML.match(/<strong><u>Année de production<\/u> :<\/strong>\s*([^<]+)<br>/)[1];
                    console.log("date: ",date)
                    console.log("----------------------------")
                }
                return {
                    url,
                    img_url,
                    rating,
                    name,
                    quality,
                    genre,
                    date,
                    lang
                };
            }

            const location = window.location.search;
            const heading = document.getElementsByClassName("heading")[0];
            console.log("location: ",location);

            const data = []; // Tableau pour stocker les données des films

            if (location == ''){
                console.log("isroot");
                if (heading) {
                    if(localStorage.getItem("latest") != null){
                        createCoverGlobalDiv();
                        // Create and append the "onetitle" div
                        heading.parentNode.insertBefore(createOneTitleDiv(), heading.nextSibling);
                    }
                } else {
                    console.error("L'élément avec la classe 'heading' n'a pas été trouvé.");
                }
            }
            else if (!(/&s/.test(location)) && location.substring(0, 3)=="?p="){
                console.log("regex: ",/\?p=(.*?)(?=&id=)/.exec(location)[1]);
                let type = /\?p=(.*?)(?=&id=)/.exec(location)[1]
                if(type == "film"){
                    getData = getInformations(type);
                    console.log("getData",getData)

                    movieData = {
                        "url":getData.url,
                        "img_url":getData.img_url,
                        "rating":getData.rating,
                        "name":getData.name,
                        "quality":getData.quality,
                        "genre":getData.genre,
                        "lang":getData.lang,
                        "date":getData.date
                    }

                    addMovieToQueue(movieData)
                }
                else if (type == "serie"){
                    getData = getInformations(type);
                    console.log("getData",getData)

                    movieData = {
                        "url":getData.url,
                        "img_url":getData.img_url,
                        "rating":getData.rating,
                        "name":getData.name,
                        "quality":getData.quality,
                        "genre":getData.genre,
                        "lang":getData.lang,
                        "date":getData.date
                    }

                    addMovieToQueue(movieData)
                }
            }
        };
    }
})();
