package com.hellotime.view;

import java.time.Instant;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;

public final class ViewFormats {

    private static final DateTimeFormatter DATETIME =
            DateTimeFormatter.ofPattern("yyyy/MM/dd HH:mm").withZone(ZoneId.systemDefault());

    private static final DateTimeFormatter DATETIME_LOCAL =
            DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm").withZone(ZoneId.systemDefault());

    public ViewFormats() {}

    public static String display(Instant instant) {
        return instant == null ? "" : DATETIME.format(instant);
    }

    public static String datetimeLocal(Instant instant) {
        return instant == null ? "" : DATETIME_LOCAL.format(instant);
    }
}
