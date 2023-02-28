namespace TravelGuide.WebAPI.Services.Interfaces
{
    public interface IImageService
    {
        public Task<byte[]> GetImageAsync(string imagePath);
        public Task<byte[]> GetImageAsync(Guid imageId);
    }
}
