namespace TravelGuide.WebAPI.Services.Interfaces
{
    public interface IHashService
    {
        public string Hash(string password);
        public bool VerifyPassword(string password, string hash);

    }
}
