import { useEffect, useState, type SubmitEvent } from 'react';
import axios from 'axios';
import type { Book } from '../types';
import './AddBookModal.css';

type AddBookModalProps = {
    onClose: () => void;
    onBookAdded: (book: Book) => void;
};

type Author = {
    id: number;
    name: string;
};

export default function AddBookModal({ onClose, onBookAdded }: AddBookModalProps) {
    const [title, setTitle] = useState('');
    const [authorSearch, setAuthorSearch] = useState('');
    const [selectedAuthor, setSelectedAuthor] = useState<Author | null>(null);
    const [authors, setAuthors] = useState<Author[]>([]);
    const [isLoadingAuthors, setIsLoadingAuthors] = useState(true);
    const [publishedDate, setPublishedDate] = useState('');
    const [error, setError] = useState('');
    const [authorLoadError, setAuthorLoadError] = useState('');

    useEffect(() => {
        const controller = new AbortController();

        async function fetchAuthors() {
            try {
                const response = await axios.get<Author[]>(
                    'http://localhost:5162/api/Author',
                    { signal: controller.signal }
                );
                setAuthors(response.data);
            } catch (error) {
                if (!axios.isCancel(error)) {
                    console.error('Falha ao carregar autores:', error);
                    setAuthorLoadError('Não foi possível carregar a lista de autores.');
                }
            } finally {
                if (!controller.signal.aborted) {
                    setIsLoadingAuthors(false);
                }
            }
        }

        fetchAuthors();
        return () => controller.abort();
    }, []);

    const matchingAuthors = !selectedAuthor && authorSearch.trim()
        ? authors.filter((author) =>
            author.name.toLocaleLowerCase().includes(authorSearch.trim().toLocaleLowerCase())
        )
        : [];

    async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
        event.preventDefault();

        if (!selectedAuthor) {
            setError('Selecione um autor da lista.');
            return;
        }

        try {
            const response = await axios.post<Book>('http://localhost:5162/api/Book', {
                title,
                authorId: selectedAuthor.id,
                publishedDate,
            });

            onBookAdded(response.data);
            onClose();
        } catch (error) {
            console.error('Falha ao adicionar livro:', error);
            setError('Não foi possível adicionar o livro. Verifique se o autor existe.');
        }
    }

    return (
        <div className="add-book-modal-backdrop" onClick={onClose}>
            <section
                className="add-book-modal"
                role="dialog"
                aria-modal="true"
                aria-labelledby="add-book-modal-title"
                onClick={(event) => event.stopPropagation()}
            >
                <h2 id="add-book-modal-title">Add New Book</h2>

                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        placeholder="Title"
                        value={title}
                        onChange={(event) => setTitle(event.target.value)}
                        required
                    />
                    <div className="author-search">
                        <input
                            type="text"
                            placeholder={isLoadingAuthors ? 'Loading authors...' : 'Search author'}
                            value={authorSearch}
                            aria-label="Author"
                            onChange={(event) => {
                                setAuthorSearch(event.target.value);
                                setSelectedAuthor(null);
                                setError('');
                            }}
                            role="combobox"
                            aria-autocomplete="list"
                            aria-expanded={matchingAuthors.length > 0}
                            aria-controls="author-suggestions"
                            autoComplete="off"
                            disabled={isLoadingAuthors || Boolean(authorLoadError)}
                            required
                        />
                        {matchingAuthors.length > 0 && (
                            <ul id="author-suggestions" className="author-suggestions" role="listbox">
                                {matchingAuthors.map((author) => (
                                    <li key={author.id}>
                                        <button
                                            type="button"
                                            role="option"
                                            aria-selected={false}
                                            onClick={() => {
                                                setSelectedAuthor(author);
                                                setAuthorSearch(author.name);
                                                setError('');
                                            }}
                                        >
                                            {author.name}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                    <input
                        type="date"
                        value={publishedDate}
                        onChange={(event) => setPublishedDate(event.target.value)}
                        required
                    />

                    {error && <p role="alert">{error}</p>}
                    {authorLoadError && <p role="alert">{authorLoadError}</p>}

                    <button type="submit">Add Book</button>
                    <button type="button" onClick={onClose}>Cancel</button>
                </form>
            </section>
        </div>
    );
}