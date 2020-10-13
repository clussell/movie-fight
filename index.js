const autoCompleteConfig = {
    renderOption(movie) {
        const imgSrc = movie.Poster === 'N/A' ? '' : movie.Poster;
        return `
            <img src="${imgSrc}" />
            ${movie.Title} (${movie.Year})
        `;
    },
    //make input value match selected movie
    inputValue(movie) {
        return movie.Title;
    },
    //fetch movie titles for search term
    async fetchData(searchTerm) {
        const response = await axios.get('http://www.omdbapi.com/',{
            params: {
                apikey: 'a58c4040',
                s: searchTerm
            }
        });
    
        if (response.data.Error) {
            return [];
        }
    
        return response.data.Search;
    },

}

//left input box
createAutoComplete({
    ...autoCompleteConfig,
    root: document.querySelector('#left-autocomplete'),
    //when a user clicks a movie
    onOptionSelect(movie) {
        document.querySelector('.tutorial').classList.add('is-hidden');
        onMovieSelect(movie, document.querySelector('#left-summary'), 'left');
    }
});

//right input box
createAutoComplete({
    ...autoCompleteConfig,
    root: document.querySelector('#right-autocomplete'),
    //when a user clicks a movie
    onOptionSelect(movie) {
        document.querySelector('.tutorial').classList.add('is-hidden');
        onMovieSelect(movie, document.querySelector('#right-summary'), 'right');
    }
});

let leftMovie;
let rightMovie;

// request for clicked movie
const onMovieSelect = async (movie, summaryElement, side) => {
    const response = await axios.get('http://www.omdbapi.com/', {
        params: {
            apikey: 'a58c4040',
            i: movie.imdbID
        }
    });
    console.log(response.data);
    summaryElement.innerHTML= movieTemplate(response.data)

    if (side=== 'left') {
        leftMovie = response.data;
    } else {
        rightMovie = response.data;
    }

    if(leftMovie && rightMovie) {
        runComparison();

    }
};

const runComparison = () => {
    const leftSideStats = document.querySelectorAll('#left-summary .notification');
    const rightSideStats = document.querySelectorAll('#right-summary .notification');

    leftSideStats.forEach((leftStat, index) => {
        const rightStat = rightSideStats[index];

        const leftSideValue = parseInt(leftStat.dataset.value);
        const rightSideValue = parseInt(rightStat.dataset.value);

        //Reset the colors
        leftStat.classList.remove('is-warning');
        rightStat.classList.remove('is-warning');
        leftStat.classList.add('is-primary');
        rightStat.classList.add('is-primary');

        if(rightSideValue > leftSideValue) {
            rightStat.classList.remove('is-primary');
            rightStat.classList.add('is-warning');
        }else {
            leftStat.classList.remove('is-primary');
            leftStat.classList.add('is-warning');
        }
    });
};

const movieTemplate = (movieDetail) => {
    const tomatoRating = parseInt(
        movieDetail.Ratings[1].Value.replace(/\%/g, ''));
    const metascore = parseInt(
        movieDetail.Metascore);
    const imdbRating = parseFloat(
        movieDetail.imdbRating);
    const imdbVotes = parseInt(
        movieDetail.imdbVotes.replace(/,/g, ''));

 
    const awards = movieDetail.Awards.split(' ').reduce((prev, word) => {
        const value = parseInt(word);

        if(isNaN(value)) {
            return prev;
        }else {
            return prev + value;
        }
    }, 0);

    return `
        <article class="media">
            <figure class="media-left">
                <p class="image">
                <img src="${movieDetail.Poster}" />
                </p>
            </figure>
            <div class="media-content">
                <div class="content">
                    <h1>${movieDetail.Title}</h1>
                    <h4>${movieDetail.Genre}</h4>
                    <p>${movieDetail.Plot}</p>
                </div>
            </div>
        </article>
        <article data-value=${awards} class="notification is-primary">
            <p class="title">${movieDetail.Awards}</p>
            <p class="subtitle">Awards</p>
        </article>
        <article data-value=${tomatoRating} class="notification is-primary">
            <p class="title">${movieDetail.Ratings[1].Value}</p>
            <p class="subtitle">Rotten Tomatoes</p>
        </article>
        <article data-value=${metascore} class="notification is-primary">
            <p class="title">${movieDetail.Metascore}</p>
            <p class="subtitle">Metascore</p>
        </article>
        <article data-value=${imdbRating} class="notification is-primary">
            <p class="title">${movieDetail.imdbRating}</p>
            <p class="subtitle">IMDB Rating</p>
        </article>
        <article data-value=${imdbVotes} class="notification is-primary">
            <p class="title">${movieDetail.imdbVotes}</p>
            <p class="subtitle">IMDB Votes</p>
        </article>
    `;
}