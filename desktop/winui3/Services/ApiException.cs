using System;

namespace HelloTimeWinUI.Services;

public sealed class ApiException : Exception
{
    public ApiException(string message) : base(message)
    {
    }
}
