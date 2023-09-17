
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

## Global Time Variables:

1. **timestamp**:
   - Represents the current timestamp.

2. **year**:
   - Represents the current year.

3. **month**:
   - Represents the current month.

4. **month_number**:
   - Represents the current month of the year.

5. **day**:
   - Represents the current day.

6. **day_number**:
   - Represents the current day of the month.

7. **hour**:
   - Represents the current hour.

8. **minute**:
   - Represents the current minute.

9. **second**:
   - Represents the current second.

These commands and global time variables provide the ability to work with timestamps, convert between different date and time formats, and access various time-related values, making it convenient for managing time-related operations and data in OriginOS applications.
