const getBooks = () => {
  axios
    .get('books.json')
    .then((res) => {
      allBooks = res.data.books;
      console.log(allBooks);
      booksList(allBooks);
      search(allBooks);
    })
    .catch((err) => console.log(err));
};
getBooks();

const booksList = (allBooks) => {
  document.getElementById('theBooks').innerHTML = '';
  allBooks.forEach((book) => {
    let card = document.createElement('div');
    card.className = 'flip-card';
    card.innerHTML = `
        <div class="flip-card-inner">
          <div class="flip-card-front">
            <img src="${book.cover}" alt="Avatar">
          </div>
          <div class="flip-card-back">
            <p>${book.description}</p>
            <button type="button" data-url="${book.url}" onclick="goToPdf(this)" class="card-button" >Read in Pdf</button>
          </div>
        </div>`;

    document.querySelector('#theBooks').appendChild(card);

    /*  window.document.location = 'pdf.html' + '?url=' + url; */
  });
};

//check posoi xaraktires sto description gia na mi feugei ap to plaisio
/* const test = allBooks[2].description;
    console.log(test.length); */

const goToPdf = (element) => {
  const url = element.getAttribute('data-url');
  console.log(url);
  window.document.location = 'pdf.html' + '?url=' + url;
};

function search(allBooks) {
  const searchingTitles = document.querySelectorAll('.flip-card');
  console.log(searchingTitles);
  const searchBar = document.forms['search-books'].querySelector('input');
  searchBar.addEventListener('keyup', function (e) {
    const term = e.target.value.toLowerCase();
    console.log(term);
    let filteredBooks = [];
    allBooks.forEach(function (book) {
      if (
        book.title.toLowerCase().indexOf(term) != -1 ||
        book.description.toLowerCase().indexOf(term) != -1 ||
        book.author.toLowerCase().indexOf(term) != -1
      ) {
        filteredBooks.push(book);
      }
    });
    console.log(filteredBooks);
    booksList(filteredBooks);
  });
}

/* const booksList = (allBooks) => {
  document.getElementById('theBooks').innerHTML = '';
  allBooks.forEach((book) => {
    let card = document.createElement('div');
    card.className = 'flip-card';
    card.innerHTML = `
        <div class="flip-card-inner">
          <div class="flip-card-front">
            <img src="${book.cover}" alt="Avatar">
          </div>
          <div class="flip-card-back">
            <h2>${book.title}</h2>
            <p>${book.description}</p>
            <button class="card-button" data-book="${book.title}">More info</button>
          </div>
        </div>`;
    document.querySelector('#theBooks').appendChild(card);
  });
}; */
