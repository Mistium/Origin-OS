
## Timestamp Commands:

1. **.timestamp("Year/Month/Day/Hour/Minute/Second")**:
   - Gets a specific time value from a timestamp based on the specified component (e.g., "second" for seconds).
   - Example: `1683825624878.timestamp("second")` returns `24`.

2. **1683825624878.timestamp("convert-date")**:
   - Converts a timestamp into a human-readable date and time format (e.g., "2023-05-11 18:20:24").
   - Example: `1683825624878.timestamp("convert-date")` returns `"2023-05-11 18:20:24"`.

3. **"2023-05-11 18:20:24".timestamp("convert-timestamp")**:
   - Converts a human-readable date and time string into a timestamp.
   - Example: `"2023-05-11 18:20:24".timestamp("convert-timestamp")` returns `1683825624878`.

---

[Global Time Variables](https://github.com/Mistium/Origin-OS/blob/main/Websites/origin.web/docs/osl/info%20and%20global%20variables.md#time-1)

These commands and global time variables provide the ability to work with timestamps, convert between different date and time formats, and access various time-related values, making it convenient for managing time-related operations and data in OriginOS applications.
