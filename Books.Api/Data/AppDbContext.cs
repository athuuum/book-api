using System;
using Books.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace Books.Api.Data;

public class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
{
    public DbSet<Book> Books => Set<Book>();
    public DbSet<Author> Authors => Set<Author>();

}
