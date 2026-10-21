import { useEffect, useState, type SubmitEvent } from 'react';
import axios from 'axios';
import './EditBookModal.css';
import './AddBookModal.css';
import type { Book } from '../types';

type EditBookModalProps = {
    book: Book;
    onClose: () => void;
    onBookUpdated: (book: Book) => void;
    onBookDeleted: (bookId: number) => void;
};

type Author = {
    id: number;
    name: string;
};

export default function EditBookModal({
    book,
    onClose,
    onBookUpdated,
    onBookDeleted,
}: EditBookModalProps) {
    const [title, setTitle] = useState(book.title);
    const [authorSearch, setAuthorSearch] = useState(book.author.name);
    const [selectedAuthor, setSelectedAuthor] = useState<Author | null>(book.author);
    const [authors, setAuthors] = useState<Author[]>([]);
    const [isLoadingAuthors, setIsLoadingAuthors] = useState(true);
    const [publishedDate, setPublishedDate] = useState(book.publishedDate.slice(0, 10));
    const [error, setError] = useState('');
    const [authorLoadError, setAuthorLoadError] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

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

        setIsSaving(true);
        setError('');

        try {
            await axios.put(`http://localhost:5162/api/Book/${book.id}`, {
                id: book.id,
                title,
                authorId: selectedAuthor.id,
                publishedDate,
            });

            onBookUpdated({
                ...book,
                title,
                author: selectedAuthor,
                publishedDate,
            });
            onClose();
        } catch (error) {
            console.error('Falha ao atualizar livro:', error);
            setError('Não foi possível atualizar o livro.');
        } finally {
            setIsSaving(false);
        }
    }

    async function handleDelete() {
        if (!window.confirm(`Tem certeza que deseja excluir "${book.title}"?`)) {
            return;
        }

        setIsDeleting(true);
        setError('');

        try {
            await axios.delete(`http://localhost:5162/api/Book/${book.id}`);
            onBookDeleted(book.id);
            onClose();
        } catch (error) {
            console.error('Falha ao excluir livro:', error);
            setError('Não foi possível excluir o livro.');
        } finally {
            setIsDeleting(false);
        }
    }

    return (
        <div className="edit-book-modal-backdrop" onClick={onClose}>
            <section
                className="edit-book-modal add-book-modal"
                role="dialog"
                aria-modal="true"
                aria-labelledby="edit-book-modal-title"
                onClick={(event) => event.stopPropagation()}
            >
                <h2 id="edit-book-modal-title">Editar livro</h2>
                <form onSubmit={handleSubmit}>
                    <input type="text" value={title} onChange={(event) => setTitle(event.target.value)} required />
                    <div className="author-search">
                        <input
                            type="text"
                            placeholder={isLoadingAuthors ? 'Carregando autores...' : 'Buscar autor'}
                            value={authorSearch}
                            aria-label="Autor"
                            onChange={(event) => {
                                setAuthorSearch(event.target.value);
                                setSelectedAuthor(null);
                                setError('');
                            }}
                            role="combobox"
                            aria-autocomplete="list"
                            aria-expanded={matchingAuthors.length > 0}
                            aria-controls="edit-author-suggestions"
                            autoComplete="off"
                            disabled={isLoadingAuthors || Boolean(authorLoadError)}
                            required
                        />
                        {matchingAuthors.length > 0 && (
                            <ul id="edit-author-suggestions" className="author-suggestions" role="listbox">
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
                    <button type="submit" disabled={isSaving || isDeleting || isLoadingAuthors || Boolean(authorLoadError)}>
                        {isSaving ? 'Salvando...' : 'Salvar alterações'}
                    </button>
                    <button type="button" className="delete-book-button" onClick={handleDelete} disabled={isSaving || isDeleting}>
                        {isDeleting ? 'Excluindo...' : 'Excluir livro'}
                    </button>
                    <button type="button" onClick={onClose} disabled={isSaving || isDeleting}>Cancelar</button>
                </form>
            </section>
        </div>
    );
}