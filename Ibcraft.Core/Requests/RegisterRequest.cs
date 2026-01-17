using System.ComponentModel.DataAnnotations;

namespace Ibcraft.Core.Requests;

public record RegisterRequest(
    [Required] string Nikname,
    [Required] string Password,
    [Required] string ConfirmPassword,
    [Required] string Email
    );