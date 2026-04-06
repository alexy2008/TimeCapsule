namespace HelloTime.AspNetCore.Dtos;

public sealed record TechStackResponse(
    string Framework,
    string Language,
    string Database
);

public sealed record HealthPayload(
    string Status,
    string Timestamp,
    TechStackResponse TechStack
);
