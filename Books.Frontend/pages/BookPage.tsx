import './BookPage.css'
import axios from "axios";
import { useEffect, useState } from "react";
import SearchBar from '../components/SearchBar';
import AddBookModal from '../components/AddBookModal';
import EditBookModal from '../components/EditBookModal';
import type { Book } from '../types';

export default function BookPage() {
    const [books, setBooks] = useState<Book[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchField, setSearchField] = useState<'title' | 'author' | 'date'>('title');
    const [isAddBookModalActive, setIsAddBookModalActive] = useState(false);
    const [selectedBook, setSelectedBook] = useState<Book | null>(null);

    useEffect(() => {
        async function fetchBooks() {
            try {
                const response = await axios.get<Book[]>(
                    'http://localhost:5162/api/Book'
                );
                setBooks(response.data);
            } catch (error) {
                console.error('Failed to fetch books:', error);
            }
        }

        fetchBooks();
    }, []);

    const normalizedSearchTerm = searchTerm.trim().toLocaleLowerCase();
    const filteredBooks = books.filter((book) => {
        if (!normalizedSearchTerm) {
            return true;
        }

        const searchableValue = {
            title: book.title,
            author: book.author.name,
            date: `${book.publishedDate} ${new Date(book.publishedDate).toLocaleDateString('pt-BR')}`,
        }[searchField];

        return searchableValue.toLocaleLowerCase().includes(normalizedSearchTerm);
    });

    return (
        <>
            <div className="search-bar-container">
                <SearchBar
                    searchTerm={searchTerm}
                    searchField={searchField}
                    setSearchTerm={setSearchTerm}
                    setSearchField={setSearchField}
                />
                <button onClick={() => setIsAddBookModalActive(true)}>+ Add Book</button>
            </div>
            <div className="books-table-container">
                <table className="books-table">
                    <caption>Livros</caption>
                    <thead>
                        <tr>
                            <th scope="col">ID</th>
                            <th scope="col">Título</th>
                            <th scope="col">Autor</th>
                            <th scope="col">Data de publicação</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredBooks.map((book) => (
                            <tr
                                key={book.id}
                                className="books-table-row"
                                tabIndex={0}
                                aria-label={`Abrir detalhes de ${book.title}`}
                                onClick={() => setSelectedBook(book)}
                                onKeyDown={(event) => {
                                    if (event.key === 'Enter' || event.key === ' ') {
                                        event.preventDefault();
                                        setSelectedBook(book);
                                    }
                                }}
                            >
                                <td>{book.id}</td>
                                <td>{book.title}</td>
                                <td>{book.author.name}</td>
                                <td>{new Date(book.publishedDate).toLocaleDateString('pt-BR')}</td>
                            </tr>
                        ))}
                        {filteredBooks.length === 0 && (
                            <tr>
                                <td colSpan={4}>Nenhum livro encontrado.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
            {isAddBookModalActive && (
                <AddBookModal
                    onClose={() => setIsAddBookModalActive(false)}
                    onBookAdded={(book) => {
                        setBooks((currentBooks) => [book, ...currentBooks]);
                        setSearchTerm('');
                    }}
                />
            )}
            {selectedBook && (
                <EditBookModal
                    book={selectedBook}
                    onClose={() => setSelectedBook(null)}
                    onBookUpdated={(updatedBook) => {
                        setBooks((currentBooks) =>
                            currentBooks.map((book) => book.id === updatedBook.id ? updatedBook : book)
                        );
                    }}
                    onBookDeleted={(bookId) => {
                        setBooks((currentBooks) => currentBooks.filter((book) => book.id !== bookId));
                    }}
                />
            )}
        </>
    );
}
