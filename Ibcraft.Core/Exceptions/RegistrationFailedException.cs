
namespace Ibcraft.Core.Exceptions;

public class RegistrationFailedException(IEnumerable<string> errors) : Exception($"Registration failed with following errors: {string.Join(Environment.NewLine, errors)}");
