OSL draws user interface objects at the "draw cursor" (an x/y value)

This allows the script to place objects at any position.

---

# Default OSL Variables:

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

18. **mouse_x**: The x position of the mouse in relation to the window

19. **mouse_y**: The y position of the mouse in relation to the window

---

# Global OSL Variables:

## Constants

- **null**: An empty variable.
  
- **newline**: The newline character ("\n").
  
- **pi**: The mathematical constant Pi (π).
  
## User

- **user_id**: The ID of the logged-in user.

- **username**: The username of the logged-in user.

- **user_icon**: The URL to the image that the user has set as their profile picture.

## Control

- **mouse_down**: Whether the left mouse button is currently pressed.

- **mouse_right**: Whether the right mouse button is currently pressed.

- **pressed**: The most recently pressed (and still pressed) key.

### TIme

- **timer**: The number of seconds since the system's origin was booted.

- **system_accent**: The default application accent color.

- **focused_application**: The window ID of the application currently in focus.

## Time

- **timestamp**: The current Unicode timestamp.

- **timezone**: The timezone configuration.

- **hour**: The current hour.

- **minute**: The current minute.

- **second**: The current second.

- **day**: The current day of the week.

- **day_number**: The current day of the month.

- **month**: The current month.

- **month_number**: The current month number.

- **year**: The current year.
  
- **days**: A JSON array containing days of the week and all the months.

## System Data

- **origin**: Information about the operating system.

- **ports**: Information about currently used ports and associated applications.
  
- **owp_id**: The user's network ID.

- **clipboard**: The content of the clipboard.

- **cursor**: The current state of the cursor.

## Battery

- **battery_charging**: Whether the computer is currently charging.

- **battery_percent**: The percentage of the computer's battery charge.

- **battery_time_until_full**: The estimated time until the battery is fully charged.

- **battery_time_until_empty**: The estimated time until the battery is empty.

## Performance

- **fps**: The current frames per second.

- **delta_time**: The time elapsed since the last frame.

## Colours

- **picker_colour**: The picked color.

- **global_accent**: The global application accent color.

## System Data

- **on_mobile**: Whether the system is running on a mobile device.

- **system_url**: The system's current URL.

- **internet_connection**: Whether the computer is connected to the internet.

- **screensize_x**: The horizontal dimension of the screen.

- **screensize_y**: The vertical dimension of the screen.

## Disk Data

- **Disk_Write_Speed**: The speed of disk write operations.

- **Disk_Read_Speed**: The speed of disk read operations.

- **Disk_Total_Writes**: The total number of disk writes.

- **Disk_Name**: The name of the disk.

- **Disks**: Information about available disks.

## Dock Data

- **segments**: A json array of the names of the .ODE files that the dock uses to render itself.

- **dock_location**: The location of the dock.

## Now Playing

- **nowplaying_mediaurl**: The url of the current media

- **nowplaying_title**: The title of the media

These variables provide a wide range of information and functionality for scripting in an OSL environment, allowing you to create dynamic and interactive applications or scripts.
