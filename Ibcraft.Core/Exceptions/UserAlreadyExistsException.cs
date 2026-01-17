
namespace Ibcraft.Core.Exceptions;

public class UserAlreadyExistsExceptionEmail(string email) : Exception($"Email {email} is already registered!");
public class UserAlreadyExistsExceptionNikname(string nikname) : Exception($"Nikname {nikname} is already taken!");

