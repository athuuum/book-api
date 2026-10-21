using System;
using Books.Api.Dtos;
using Books.Api.Models;

namespace Books.Api.Services.BookServices;

public interface IBookService
{
    Task<List<GetBooksDto>> GetBooksAsync();
    Task<GetBooksDto?> GetBookByIdAsync(int id);
    Task<GetBooksDto?> CreateBookAsync(PostBookDto book);
    Task<UpdateBookResult> UpdateBookAsync(int id, PutBookDto book);
    Task<bool> DeleteBookAsync(int id);

}
