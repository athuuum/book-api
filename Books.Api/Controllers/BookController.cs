using Books.Api.Dtos;
using Books.Api.Models;
using Books.Api.Services.BookServices;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Books.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BookController(IBookService service) : ControllerBase
    {
        [HttpGet]
        public async Task<ActionResult<List<GetBooksDto>>> GetBooks()
        {
            return await service.GetBooksAsync();
        }
    
        [HttpGet("{id}")]
        public async Task<ActionResult<GetBooksDto>> GetBookById(int id)
        {
            var book = await service.GetBookByIdAsync(id);
            if (book == null)
            {
                return NotFound();
            }
            return Ok(book);
        }

        [HttpPost]
        public async Task<ActionResult<GetBooksDto>> CreateBook(PostBookDto book)
        {
            var createdBook = await service.CreateBookAsync(book);
            if (createdBook is null)
            {
                return BadRequest("The specified author does not exist.");
            }

            return CreatedAtAction(nameof(GetBookById), new { id = createdBook.Id }, createdBook);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult> UpdateBook(int id, PutBookDto book)
        {
            if (id != book.Id)
            {
                return BadRequest("The book ID in the URL does not match the book ID in the request body.");
            }

            var result = await service.UpdateBookAsync(id, book);
            return result switch
            {
                UpdateBookResult.Updated => NoContent(),
                UpdateBookResult.BookNotFound => NotFound($"Book with ID {id} was not found."),
                UpdateBookResult.AuthorNotFound => BadRequest($"Author with ID {book.AuthorId} was not found."),
                _ => throw new InvalidOperationException($"Unexpected update result: {result}.")
            };
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteBook(int id)
        {
            var deleted = await service.DeleteBookAsync(id);
            return deleted ? NoContent() : NotFound();
        }
    }
    
}
