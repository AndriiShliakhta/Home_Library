import './sass/main.scss';
const axios = require('axios').default;

const refs = {
    additionForm: document.querySelector('.additionForm'),
    bookName: document.querySelector('.bookName'),
    authorName: document.querySelector('.authorName'),
    litWork: document.querySelector('.litWork'),
    publicYear: document.querySelector('.publicYear'),
    addBook: document.querySelector('.addBook'),

    bookItem: document.querySelector('.bookItem'),
    booksList:document.querySelector('.booksList')
}


const data = {
    books: [],
    book: {
        bookName:'',
        authorName: '',
        litWork: '',
        publicYear:''
    }
}

addToDataFromStorage();

 function addToDataFromStorage () {
    axios.get('https://home-library-9bd89-default-rtdb.firebaseio.com/book.json')
        .then(function (response) {
            return data.books = Object.entries(response.data)
                .map(item => {
                    return { ...item[1], id: item[0] }
                });
        }).then( createMarkup )
        .catch(console.log);
};


function createMarkup (books) {
    books.reduce((acc, item) => {
        acc += `<li class="bookItem" id="${item['id']}">
                    <img src="#" alt="Обкладинка книги" class="bookPhoto_bookItem bookItem-elements hidden">          
                    <div class="book-content-wrap">
                        <p class="bookName_bookItem bookItem-elements hidden">Book name: ${item['bookName']}</p>
                        <p class="authorName_bookItem bookItem-elements">Author name: ${item['authorName']}</p>
                        <p class="litWork_bookItem bookItem-elements">Literary work: ${item['litWork']}</p>
                        <p class="publicYear_bookItem bookItem-elements hidden">Publication year: ${item['publicYear']}</p>
                    </div>
                    <div class="button-item-wrap">
                        <div class="removeBook hidden">Remove a book</div>
                        <div class="changeDataBook hidden">Change data book</div>
                    </div>
                </li>`;
        return refs.booksList.innerHTML = acc;
    }, '')
}


const addBook = function (e) {
    e.preventDefault();
    for (const { name, value } of e.target) {
        if (name !== 'addBook' && value) {
            data.book[name] = value;
        }
    }

    axios.post('https://home-library-9bd89-default-rtdb.firebaseio.com/book.json', data.book)
        .then(addToDataFromStorage)
        .catch(console.log);
    refs.additionForm.reset();
};


function expandItem(e) {
    const chosenLiElem = e.target.closest(".bookItem");
    // const chosenElem = data.books.find(elem => { return elem.id === chosenLiElem.id });

    chosenLiElem.classList.add('expand-item');
    chosenLiElem.querySelector('.bookPhoto_bookItem').classList.remove('hidden');
    chosenLiElem.querySelector('.bookName_bookItem').classList.remove('hidden');
    chosenLiElem.querySelector('.publicYear_bookItem').classList.remove('hidden');
    chosenLiElem.querySelector('.removeBook').classList.remove('hidden');
    chosenLiElem.querySelector('.changeDataBook').classList.remove('hidden');

}



refs.additionForm.addEventListener('submit', addBook);
refs.booksList.addEventListener('click', expandItem);
