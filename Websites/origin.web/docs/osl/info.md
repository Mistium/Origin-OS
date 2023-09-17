OSL draws user interface objects at the "draw cursor" (an x/y value)

This allows the script to place objects at any position.

It seems like you've provided a list of variables and their descriptions in an OSL (Open Scripting Language) environment. These variables are used to interact with various aspects of the system, user interface, and application state. Here's a breakdown of some of the key variables and their meanings:

---

## Default OSL Variables:

1. **wincreatetime**: The time when the window was created.

2. **mouse_x** and **mouse_y**: The position of the mouse cursor in relation to the window.

3. **window_shown**: Whether the background of the window is currently visible.

4. **window_resizable**: Whether the window can be resized by the user.

5. **window_focused**: Whether the current window is in focus (i.e., the application the user is currently interacting with).

6. **window_colour**: The background color of the current window.

7. **window_width** and **window_height**: The dimensions (in pixels) of the current window.

8. **window_name**: The name or title of the current window.

9. **window_id**: The identifier (ID) of the current window.

10. **passed_data**: Data passed to the current application by its parent application.

11. **accent_colour**: The accent color of the current application.

12. **parent**: The window ID of the current application's parent application.

13. **parent_file**: A JSON array of information about the current application's parent application.

14. **parent_file_id**: The file ID of the current application's parent application's file.

15. **my_desktop**: The desktop of the current window.

16. **current_file**: The file ID of the current .app file.

17. **file_dropped**: The file ID of the last file that was drag-and-dropped onto the window.

---

## Global OSL Variables:

1. **null**: An empty variable.

2. **user_id**: The ID of the logged-in user.

3. **username**: The username of the logged-in user.

4. **days**: A JSON array containing information about days of the week and months.

5. **mouse_down** and **mouse_right**: Whether the left and right mouse buttons are currently pressed.

6. **timer**: The number of seconds since the system's origin was booted.

7. **timestamp**: The current Unicode timestamp.

8. **timezone**: The timezone configuration.

9. **system_accent**: The default application accent color.

10. **focused_application**: The window ID of the application currently in focus.

11. **hour**, **minute**, **second**: The current time components.

12. **day**, **day_number**, **month**, **month_number**, **year**: The current date components.

13. **owp_id**: The user's network ID.

14. **newline**: The newline character ("\n").

15. **cursor**: The current state of the cursor.

16. **origin**: Information about the operating system.

17. **battery_charging**: Whether the computer is plugged in.

18. **battery_percent**: The percentage of the computer's battery charge.

19. **battery_time_untill_full**: The estimated time until the battery is fully charged.

20. **battery_time_untill_empty**: The estimated time until the battery is empty.

21. **ports**: Information about currently used ports and associated applications.

22. **fps**: The current frames per second.

23. **delta_time**: The time elapsed since the last frame.

24. **internet_connection**: Whether the computer is connected to the internet.

25. **screensize_x** and **screensize_y**: The dimensions of the screen.

26. **sys_info**: System information.

27. **current_desktop**: The currently selected desktop for the user.

These variables provide a wide range of information and functionality for scripting in an OSL environment, allowing you to create dynamic and interactive applications or scripts.
