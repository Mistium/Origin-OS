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

2. **sys_icnhit_hidden**: A hidden system variable related to icon hits.

3. **sys_sqhit_hidden**: A hidden system variable related to square hits.

4. **user_id**: The ID of the logged-in user.

5. **username**: The username of the logged-in user.

6. **days**: A JSON array containing information about days of the week and months.

7. **mouse_down**: Whether the left mouse button is currently pressed.

8. **mouse_right**: Whether the right mouse button is currently pressed.

9. **timer**: The number of seconds since the system's origin was booted.

10. **timestamp**: The current Unicode timestamp.

11. **timezone**: The timezone configuration.

12. **system_accent**: The default application accent color.

13. **focused_application**: The window ID of the application currently in focus.

14. **hour**: The current hour.

15. **minute**: The current minute.

16. **second**: The current second.

17. **day**: The current day of the week.

18. **day_number**: The current day of the month.

19. **month**: The current month.

20. **month_number**: The current month number.

21. **year**: The current year.

22. **owp_id**: The user's network ID.

23. **newline**: The newline character ("\n").

24. **cursor**: The current state of the cursor.

25. **origin**: Information about the operating system.

26. **battery_charging**: Whether the computer is currently charging.

27. **battery_percent**: The percentage of the computer's battery charge.

28. **battery_time_until_full**: The estimated time until the battery is fully charged.

29. **battery_time_until_empty**: The estimated time until the battery is empty.

30. **ports**: Information about currently used ports and associated applications.

31. **fps**: The current frames per second.

32. **delta_time**: The time elapsed since the last frame.

33. **internet_connection**: Whether the computer is connected to the internet.

34. **screensize_x**: The horizontal dimension of the screen.

35. **screensize_y**: The vertical dimension of the screen.

36. **picker_colour**: The picked color.

37. **global_accent**: The global application accent color.

38. **clipboard**: The content of the clipboard.

39. **user_icon**: The URL to the image that the user has set as their profile picture.

40. **pressed**: The most recently pressed (and still pressed) key.

41. **pi**: The mathematical constant Pi (π).

42. **on_mobile**: Whether the system is running on a mobile device.

43. **system_url**: The system's current URL.

44. **Disk_Write_Speed**: The speed of disk write operations.

45. **Disk_Read_Speed**: The speed of disk read operations.

46. **Disk_Total_Writes**: The total number of disk writes.

47. **Disk_Name**: The name of the disk.

48. **Disks**: Information about available disks.

49. **segments**: A json array of the names of the .ODE files that the dock uses to render itself.

50. **dock_location**: The location of the dock.

These variables provide a wide range of information and functionality for scripting in an OSL environment, allowing you to create dynamic and interactive applications or scripts.
