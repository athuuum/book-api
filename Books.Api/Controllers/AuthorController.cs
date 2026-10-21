using Books.Api.Data;
using Books.Api.Dtos;
using Books.Api.Services.AuthorService;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Books.Api.Controllers;

[Route("api/[controller]")]
[ApiController]
public class AuthorController(IAuthorService service) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<List<GetAuthorDto>>> GetAuthors()
    {
        return await service.GetAuthorsAsync();
    }
}