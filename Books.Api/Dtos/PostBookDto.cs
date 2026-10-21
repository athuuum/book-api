using System;

namespace Books.Api.Dtos;

public class PostBookDto
{
    public string Title { get; set; } = string.Empty;
    public int AuthorId { get; set; }
    public DateTime PublishedDate { get; set; }
}
