
using System.ComponentModel.DataAnnotations;

namespace Ibcraft.Core.Requests;

public record LoginRequest(
        [Required] string Nikname,
        [Required] string Password
);