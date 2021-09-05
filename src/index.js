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
        acc += `<li class="bookItem collapse-expand" id="${item['id']}">
                    <img src="#" alt="Обкладинка книги" class="bookPhoto_bookItem bookItem-elements show_hide hidden">          
                    <div class="book-content-wrap  collapse-expand">
                        <p class="bookName_bookItem bookItem-elements show_hide hidden"><span>Book name:</span> ${item['bookName']}</p>
                        <p class="authorName_bookItem bookItem-elements"><span class="text show_hide hidden">Author name:</span> ${item['authorName']}</p>
                        <p class="litWork_bookItem bookItem-elements"><span class="text show_hide hidden">Literary work:</span> ${item['litWork']}</p>
                        <p class="publicYear_bookItem bookItem-elements show_hide hidden"><span>Publication year:</span> ${item['publicYear']}</p>
                    </div>
                    <div class="button-item-wrap">
                        <div class="bookItem-elements close show_hide hidden">X</div>
                        <div class="bookItem-elements removeBook show_hide hidden">Remove a book</div>
                        <div class="bookItem-elements changeDataBook show_hide hidden">Change data book</div>
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
    if(e.target.nodeName!=="P"){return}
    const chosenLiElem = e.target.closest(".bookItem");

    chosenLiElem.querySelectorAll('.show_hide').forEach(element => {
        element.classList.remove('hidden');
    });
    chosenLiElem.querySelectorAll('.collapse-expand').forEach(element => {
        element.classList.add('expand-book-content');
    }); 

    chosenLiElem.querySelector('.close').addEventListener('click', (evt) => {
            console.log(evt.target);
            chosenLiElem.querySelectorAll('.show_hide').forEach(element => {
                element.classList.add('hidden');
            });
            chosenLiElem.querySelectorAll('.collapse-expand').forEach(element => {
                element.classList.remove('expand-book-content');
            });
    })
}



refs.additionForm.addEventListener('submit', addBook);
refs.booksList.addEventListener('click', expandItem);
