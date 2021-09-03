import './sass/main.scss';
const axios = require('axios').default;

const refs = {
    additionForm: document.querySelector('.additionForm'),
    bookName: document.querySelector('.bookName'),
    authorName: document.querySelector('.authorName'),
    litWork: document.querySelector('.litWork'),
    publicYear: document.querySelector('.publicYear'),
    addBook: document.querySelector('.addBook'),
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
            // console.log(response);
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
                    <p class="authorName_bookItem bookItem-elements">${item['authorName']}</p>
                    <p class="litWork_bookItem bookItem-elements">${item['litWork']}</p>
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
    console.log(e.target.parentNode.id);
}



refs.additionForm.addEventListener('submit', addBook);
refs.booksList.addEventListener('click', expandItem);
