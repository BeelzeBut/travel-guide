using Microsoft.EntityFrameworkCore;
using TravelGuide.Database.Models;
using static System.Net.Mime.MediaTypeNames;
using Image = TravelGuide.Database.Models.Image;

namespace TravelGuide.Database
{
    public class TravelGuideContext : DbContext
    {
        public TravelGuideContext(DbContextOptions<TravelGuideContext> options) : base(options)
        {

        }

        public DbSet<User> Users { get; set; }
        public DbSet<Location> Locations { get; set; }
        public DbSet<Image> Images { get; set; }
        public DbSet<Review> Reviews { get; set; }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            foreach (var relationship in modelBuilder.Model.GetEntityTypes().SelectMany(e => e.GetForeignKeys()))
            {
                relationship.DeleteBehavior = DeleteBehavior.Restrict;
            }

            modelBuilder.Entity<User>().ToTable("User");
            modelBuilder.Entity<Location>().ToTable("Location");
            modelBuilder.Entity<Image>().ToTable("Image");
            modelBuilder.Entity<Review>().ToTable("Review");
        }
    }
}