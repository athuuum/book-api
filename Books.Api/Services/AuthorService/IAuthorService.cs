using System;
using Books.Api.Dtos;
namespace Books.Api.Services.AuthorService;

public interface IAuthorService
{
    public Task<List<GetAuthorDto>> GetAuthorsAsync();

}
