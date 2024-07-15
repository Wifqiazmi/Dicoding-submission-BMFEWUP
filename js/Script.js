const books = [];
const RENDER_EVENT = 'render-book';
const SAVED_EVENT = 'saved-book';
const STORAGE_KEY = 'BOOKS_APPS';

function generateId() {
    return +new Date();
}

function generateBookObject(id, title, author, year, isComplete) {
    return {
        id,
        title,
        author,
        year: parseInt(year),
        isComplete
    };
}

function findBook(bookId) {
    for (const bookItem of books) {
        if (bookItem.id === bookId) {
            return bookItem;
        }
    }
    return null;
}

function findBookIndex(bookId) {
    for (const index in books) {
        if (books[index].id === bookId) {
            return index;
        }
    }
    return -1;
}

function isStorageExist() {
    if (typeof (Storage) === undefined) {
        alert('Browser kamu tidak mendukung local storage');
        return false;
    }
    return true;
}

function saveData() {
    if (isStorageExist()) {
        const parsed = JSON.stringify(books);
        localStorage.setItem(STORAGE_KEY, parsed);
        document.dispatchEvent(new Event(SAVED_EVENT));
    }
}

function loadDataFromStorage() {
    const serializedData = localStorage.getItem(STORAGE_KEY);
    let data = JSON.parse(serializedData);

    if (data !== null) {
        for (const book of data) {
            books.push(book);
        }
    }

    document.dispatchEvent(new Event(RENDER_EVENT));
}

function makeBook(bookObject) {
    const {
        id,
        title,
        author,
        year,
        isComplete
    } = bookObject;

    const textTitle = document.createElement('h2');
    textTitle.innerText = title;
    textTitle.style.marginBottom = '5px';
    textTitle.style.textAlign = 'left';

    const textAuthor = document.createElement('p');
    textAuthor.innerText = `Penulis : ${author}`;
    textAuthor.style.marginBottom = '5px';
    textAuthor.style.textAlign = 'left';

    const textYear = document.createElement('p');
    textYear.innerText = `Tahun : ${year}`;
    textYear.style.marginBottom = '25px';
    textYear.style.textAlign = 'left';

    const textContainer = document.createElement('div');
    textContainer.classList.add('inner');
    textContainer.append(textTitle, textAuthor, textYear);

    const container = document.createElement('div');
    container.classList.add('item', 'shadow');
    container.style.marginBottom = '20px';
    container.style.padding = '10px';
    container.style.borderRadius = '5px';
    container.style.backgroundColor = '#fff';
    container.style.boxShadow = '0 5px 10px rgba(154, 160, 185, .05), 0 15px 40px rgba(166, 173, 201, .2)';
    container.style.textAlign = 'right';
    container.append(textContainer);
    container.setAttribute('id', `book-${id}`);

    const removeButton = document.createElement('button');
    removeButton.classList.add('remove-button');
    removeButton.innerText = 'Hapus buku';
    removeButton.addEventListener('click', function () {
        if (isComplete) {
            removeBook(id);
        } else {
            removeBook(id);
        }
    });
    removeButton.style.backgroundColor = '#bb2124';
    removeButton.style.color = '#fff';
    removeButton.style.border = 'none';
    removeButton.style.padding = '5px 10px';
    removeButton.style.cursor = 'pointer';
    removeButton.style.borderRadius = '5px';
    removeButton.style.fontSize = '20px';

    if (isComplete) {
        const undoButton = document.createElement('button');
        undoButton.classList.add('undo-button');
        undoButton.innerText = 'Pulihkan belum dibaca';
        undoButton.addEventListener('click', function () {
            undoBookFromCompleted(id);
        });
        undoButton.style.backgroundColor = '#5bc0de';
        undoButton.style.color = '#fff';
        undoButton.style.border = 'none';
        undoButton.style.padding = '5px 10px';
        undoButton.style.marginRight = '5px';
        undoButton.style.cursor = 'pointer';
        undoButton.style.borderRadius = '5px';
        undoButton.style.fontSize = '20px';

        container.append(undoButton, removeButton);
    } else {
        const completeButton = document.createElement('button');
        completeButton.classList.add('complete-button');
        completeButton.innerText = 'Tandai sudah dibaca';
        completeButton.addEventListener('click', function () {
            addBookToCompleted(id);
        });
        completeButton.style.backgroundColor = '#22bb33';
        completeButton.style.color = '#fff';
        completeButton.style.border = 'none';
        completeButton.style.padding = '5px 10px';
        completeButton.style.marginRight = '15px';
        completeButton.style.cursor = 'pointer';
        completeButton.style.borderRadius = '5px';
        completeButton.style.fontSize = '20px';

        container.append(completeButton, removeButton);
    }

    return container;
}


function addBook() {
    const titleInput = document.getElementById('inputBookTitle');
    const authorInput = document.getElementById('inputBookAuthor');
    const yearInput = document.getElementById('inputBookYear');
    const isCompleteInput = document.getElementById('inputBookIsComplete');

    const title = titleInput.value;
    const author = authorInput.value;
    const year = yearInput.value;
    const isComplete = isCompleteInput.checked;

    const isDuplicate = books.some(book => book.title === title);

    if (isDuplicate) {
        alert(' judul buku sudah ada dalam daftar.');
        return; 
    }

    const generatedID = generateId();
    const bookObject = generateBookObject(generatedID, title, author, year, isComplete);
    books.push(bookObject);

    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();

    titleInput.value = '';
    authorInput.value = '';
    yearInput.value = '';
    isCompleteInput.checked = false;

    Toastify({
        text: "Buku berhasil ditambahkan!",
        duration: 3000,
        gravity: "top",
        close: true,
        position: 'center',
        className: "toastify-center",
        style: {
            background: "#22bb33"
        }
    }).showToast();

    console.log(`Jumlah buku setelah penambahan: ${books.length}`);
}

function addBookToCompleted(bookId) {
    const bookTarget = findBook(bookId);

    if (bookTarget == null) return;

    bookTarget.isComplete = true;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();

    Toastify({
        text: "Buku ditandai sudah dibaca",
        duration: 3000,
        close: true,
        gravity: "top",
        className: "toastify-center",
        style: {
            background: "#22bb33"
        }
    }).showToast();
}

function removeBook(bookId) {
    const bookTargetIndex = findBookIndex(bookId);

    if (bookTargetIndex === -1) return;

    books.splice(bookTargetIndex, 1);
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();

    Toastify({
        text: "Buku telah dihapus!",
        duration: 3000,
        close: true,
        gravity: "top",
        className: "toastify-center",
        style: {
            background: "#bb2124"
        }
    }).showToast();
}

function undoBookFromCompleted(bookId) {
    const bookTarget = findBook(bookId);
    if (bookTarget == null) return;

    bookTarget.isComplete = false;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();

    Toastify({
        text: "Buku berhasil dipulihkan!",
        duration: 3000,
        gravity: "top",
        className: "toastify-center",
        style: {
            background: "#5bc0de"
        }
    }).showToast();
}




document.addEventListener('DOMContentLoaded', function () {
    const submitForm = document.getElementById('inputBook');

    submitForm.addEventListener('submit', function (event) {
        event.preventDefault();
        addBook();
    });

    if (isStorageExist()) {
        loadDataFromStorage();
    }

    const searchForm = document.getElementById('searchBook');
    searchForm.addEventListener('submit', function (event) {
        event.preventDefault();
        const searchInput = document.getElementById('searchBookTitle').value.toLowerCase();
        filterBooks(searchInput);
    });
});

function filterBooks(query) {
    const uncompletedBookList = document.getElementById('incompleteBookshelfList');
    const completedBookList = document.getElementById('completeBookshelfList');

    uncompletedBookList.innerHTML = '';
    completedBookList.innerHTML = '';

    const filteredBooks = books.filter(book => book.title.toLowerCase().includes(query));

    if (filteredBooks.length === 0) {
        const notFoundMessage = document.createElement('p');
        notFoundMessage.innerText = 'Mohon maaf, buku tidak ditemukan.';
        notFoundMessage.style.textAlign = 'center';
        notFoundMessage.style.marginTop = '20px';
        uncompletedBookList.appendChild(notFoundMessage);
    } else {
        filteredBooks.forEach(bookItem => {
            const bookElement = makeBook(bookItem);
            if (bookItem.isComplete) {
                completedBookList.append(bookElement);
            } else {
                uncompletedBookList.append(bookElement);
            }
        });
    }
}


document.addEventListener(RENDER_EVENT, function () {
    const uncompletedBookList = document.getElementById('incompleteBookshelfList');
    const completedBookList = document.getElementById('completeBookshelfList');

    uncompletedBookList.innerHTML = '';
    completedBookList.innerHTML = '';

    for (const bookItem of books) {
        const bookElement = makeBook(bookItem);
        if (bookItem.isComplete) {
            completedBookList.append(bookElement);
        } else {
            uncompletedBookList.append(bookElement);
        }
    }
});