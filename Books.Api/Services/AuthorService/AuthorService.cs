using System;
using Books.Api.Data;
using Books.Api.Dtos;
using Microsoft.EntityFrameworkCore;

namespace Books.Api.Services.AuthorService;

public class AuthorService(AppDbContext context) : IAuthorService
{
    public async Task<List<GetAuthorDto>> GetAuthorsAsync()
    {
        return await context.Authors
            .OrderBy(author => author.Name)
            .Select(author => new GetAuthorDto
            {
                Id = author.Id,
                Name = author.Name,
                Biography = author.Biography
            })
            .ToListAsync();
    }
}
