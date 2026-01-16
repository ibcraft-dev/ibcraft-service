using System;

namespace Ibcraft.Infrastructure;

public record AuthUser(Guid Id, string Email,
    string Nickname);
