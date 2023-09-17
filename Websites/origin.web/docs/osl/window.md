
## Window Position:

- **window "x" x**:
  - Sets the window's x_position to the specified value.
  - Example: `window "x" 100` sets the window's x_position to 100.

- **window "y" y**:
  - Sets the window's y_position to the specified value.
  - Example: `window "y" 200` sets the window's y_position to 200.

---

## Window Dimensions:

- **window "dimensions" width height**:
  - Sets the window's width and height to the specified values.
  - Example: `window "dimensions" 800 600` sets the window's width to 800 and height to 600.

---

## Window Title:

- **window "title" "Window_name"**:
  - Allows you to set the title of the current window to the specified name.
  - Example: `window "title" "My App"` sets the window's title to "My App."

---

## Showing/Hiding Window:

- **window "show"/"hide"**:
  - Shows or hides the background of the window.
  - Example: `window "show"` would show the window's background.

---

## Window Resizability:

- **window "resizable" "true/false"**:
  - Allows or stops the user from resizing the application window based on the provided value ("true" or "false").
  - Example: `window "resizable" "true"` allows window resizing, while `window "resizable" "false"` disables it.

---

## Responsive Window:

- **window "responsive"**:
  - Disables window caching, allowing the window to update even when not focused. However, it may impact system performance.
  - Use this command when you need the window to refresh when not in use.

---

## Stopping Script Execution:

- **window "stop"**:
  - Ends the current script process, closing the window associated with the script.

- **exit "exit_code"**:
  - Ends the current process with an optional exit code. This can be used to terminate scripts cleanly with a specified exit code.

---

## File Location for Drag and Drop:

- **movefileloc "path"**:
  - Sets the folder path where files are moved when they are dragged and dropped onto the application window.
These commands provide control over window properties, script execution, and file handling within your application. They allow you to customize the behavior of your application's window and manage file operations effectively.
