using System;
using Books.Api.Data;
using Books.Api.Dtos;
using Books.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace Books.Api.Services.BookServices;

public class BookService(AppDbContext context) : IBookService
{
    public async Task<GetBooksDto?> CreateBookAsync(PostBookDto book)
    {
        var author = await context.Authors.FindAsync(book.AuthorId);
        if (author is null)
        {
            return null;
        }

        var newBook = new Book
        {
            Title = book.Title,
            AuthorId = book.AuthorId,
            Author = author,
            PublishedDate = book.PublishedDate
        };

        context.Books.Add(newBook);
        await context.SaveChangesAsync();

        return new GetBooksDto
        {
            Id = newBook.Id,
            Title = newBook.Title,
            Author = new GetAuthorDto
            {
                Id = author.Id,
                Name = author.Name
            },
            PublishedDate = newBook.PublishedDate
        };
    }

    public async Task<bool> DeleteBookAsync(int id)
    {
        var book = await context.Books.FindAsync(id);
        if (book is null)
        {
            return false;
        }

        context.Books.Remove(book);
        await context.SaveChangesAsync();
        return true;
    }

    public async Task<GetBooksDto?> GetBookByIdAsync(int id)
    {
        return await context.Books.Select(b => new GetBooksDto
        {
            Id = b.Id,
            Title = b.Title,
            Author = new GetAuthorDto
            {
                Id = b.Author.Id,
                Name = b.Author.Name
            },
            PublishedDate = b.PublishedDate
        }).FirstOrDefaultAsync(b => b.Id == id);

    }

    public async Task<List<GetBooksDto>> GetBooksAsync()
    {
        return await context.Books.Select(b => new GetBooksDto
        {
            Id = b.Id,
            Title = b.Title,
            Author = new GetAuthorDto
            {
                Id = b.Author.Id,
                Name = b.Author.Name
            },
            PublishedDate = b.PublishedDate
        }).ToListAsync();
    }

    public async Task<UpdateBookResult> UpdateBookAsync(int id, PutBookDto book)
    {
        var existingBook = await context.Books.FindAsync(id);
        if (existingBook is null)
        {
            return UpdateBookResult.BookNotFound;
        }

        var author = await context.Authors.FindAsync(book.AuthorId);
        if (author is null)
        {
            return UpdateBookResult.AuthorNotFound;
        }

        existingBook.Title = book.Title;
        existingBook.AuthorId = book.AuthorId;
        existingBook.PublishedDate = book.PublishedDate;

        await context.SaveChangesAsync();
        return UpdateBookResult.Updated;
    }
}
