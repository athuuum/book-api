namespace Books.Api.Dtos;

public class GetAuthorDto
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;

    public string Biography { get; set; } = string.Empty;
}
