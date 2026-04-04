package com.hellotime.config;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

import java.time.Instant;
import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.time.format.DateTimeFormatter;
import java.time.temporal.ChronoUnit;

@Converter(autoApply = false)
public class InstantStringConverter implements AttributeConverter<Instant, String> {

    private static final DateTimeFormatter STORAGE_FORMATTER =
            DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ss'Z'").withZone(ZoneOffset.UTC);

    @Override
    public String convertToDatabaseColumn(Instant attribute) {
        if (attribute == null) {
            return null;
        }
        return STORAGE_FORMATTER.format(attribute.truncatedTo(ChronoUnit.SECONDS));
    }

    @Override
    public Instant convertToEntityAttribute(String dbData) {
        if (dbData == null || dbData.isBlank()) {
            return null;
        }

        String normalized = dbData.trim().replace(' ', 'T');
        if (!normalized.endsWith("Z") && !normalized.matches(".*[+-]\\d{2}:\\d{2}$")) {
            normalized = normalized + "Z";
        }

        return OffsetDateTime.parse(normalized).toInstant();
    }
}
