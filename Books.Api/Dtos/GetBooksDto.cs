using System;

namespace Books.Api.Dtos;

public class GetBooksDto
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public GetAuthorDto Author { get; set; } = new();
    public DateTime PublishedDate { get; set; }

}
