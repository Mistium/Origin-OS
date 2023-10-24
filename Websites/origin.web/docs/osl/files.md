A file in originOS is a set of 13 items in a json array
Files are what store and run data within the os and are very important

---

## File Attributes (Items in the JSON Array):

1. **type**:
   - Represents the file type, indicated by its file extension (e.g., .osl, .icn, .txt).

2. **name**:
   - A string representing the name of the file.

3. **location**:
   - A file path indicating the location of the file.

4. **data**,
5. **data2**,
6. **data3**,
7. **data4**:
   - These are fields for various data associated with the file. Each field may store different data related to the file.

8. **id**:
   - The identifier for the file, which could be used for referencing or accessing it.

9. **created**:
   - A Unicode timestamp indicating when the file was created.

10. **edited**:
   - A Unicode timestamp indicating when the file was last edited.

11. **icon**:
   - The code for the file's icon, which is displayed when rendering the file.

12. **size**:
   - Stores the size of the file and potentially any files it contains.

13. **permissions**:
    - Stores the permissions needed to access this file by any application.

---

## Supported File Commands:

1. **file "open" file-path**:
   - Opens the selected file to be modified.
   - Sets the "file" variable to the raw JSON of the current file.
   - Sets the "data" variable to the data value of the open file.

2. **file "open" "id" file-id**:
   - Opens a file with the specified "file-id" for modification.
   
3. **file "open" file-name file-id**:
   - Opens a file with the specified "file-name" and "file-id" for modification.

4. **file "open" "myself"**:
   - Opens the currently selected file for modification.

5. **file "exists" file-path**:
   - Returns a boolean indicating whether a file exists and is accessible by the current program.

6. **file "start"**:
   - Runs/opens the current file in its default application.

7. **file "render" size**:
   - Renders the currently open file.
   - You can add "interactable" at the end of this command to render it as a file instead of as an icon.

8. **file "add" complete-file-json**:
   - Adds the passed JSON representation of a file to the downloads folder of the logged-in user.

9. **file "get" data-id**:
   - Gets a specific file entry based on the data ID.

10. **file "set" data-id**:
    - Sets a specific file entry based on the data ID.

11. **rightclick "file/text/window" "file-id/text/window-id"**:
    - Represents a right-click action on a file, text, or window with specified IDs.

These commands and file attributes allow for file management and manipulation within the OriginOS environment. They enable you to work with files, open them, render them, and perform various operations on them.

You can find the file id of the current window's app file using the "current_file" variable

# Supported on originOS v4.2.4 or later
Or you can get the file path of the current window's app file with the "current_file_path" variable
