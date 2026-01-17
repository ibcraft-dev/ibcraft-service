
namespace Ibcraft.Core.Exceptions;

public class LoginFailedException(string Nikname) : Exception($"Invalid email: {Nikname} or password.");

