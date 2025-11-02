namespace Ibcraft.Infrastructure
{
    public class EmailOptions
    {
        public string SMTPHost { get; set; } = string.Empty;
        public int SMTPPort { get; set; }
        public string SenderEmail { get; set; } = string.Empty;
        public string SenderPassword { get; set; } = string.Empty;
    }
}