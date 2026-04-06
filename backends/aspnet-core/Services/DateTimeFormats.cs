using System.Globalization;

namespace HelloTime.AspNetCore.Services;

public static class DateTimeFormats
{
    public static string FormatUtc(DateTimeOffset value)
        => value.UtcDateTime.ToString("yyyy-MM-dd'T'HH:mm:ss'Z'", CultureInfo.InvariantCulture);

    public static bool TryParseUtc(string raw, out DateTimeOffset value)
    {
        var normalized = raw.Trim().Replace(" ", "T", StringComparison.Ordinal);
        if (!normalized.EndsWith("Z", StringComparison.OrdinalIgnoreCase) &&
            !HasOffset(normalized))
        {
            normalized += "Z";
        }

        return DateTimeOffset.TryParse(
            normalized,
            CultureInfo.InvariantCulture,
            DateTimeStyles.AssumeUniversal | DateTimeStyles.AdjustToUniversal,
            out value
        );
    }

    private static bool HasOffset(string value)
    {
        if (value.Length < 6)
        {
            return false;
        }

        var span = value.AsSpan();
        var signIndex = span.LastIndexOf('+');
        if (signIndex < 0)
        {
            signIndex = span.LastIndexOf('-');
        }

        return signIndex >= 0 && value.Length - signIndex == 6 && value[signIndex + 3] == ':';
    }
}
