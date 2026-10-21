using System;

namespace Books.Api.Dtos;

public class PutBookDto
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public int AuthorId { get; set; }
    public DateTime PublishedDate { get; set; }
}

