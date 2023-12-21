# Prerequisits

## Defining variables!

```
string = "data1"
number = 1
object = {"key1":"value1"}
array = ["data1","data2","data3"]
```

## Incrementing Variables

To increment the value of a variable you have quite a few options but the variable must be a number in order to be incremented

```
variable_name += 1
variable_name = variable_name + 1
^^ add one to a variable

you can also minus with
variabel_name -= 1
variable_name = variable_name - 1

these also support /= and *=
```

More info on operators: [here](https://github.com/Mistium/Origin-OS/wiki/OSL-%E2%80%90-Operators-and-Expressions)

## Using Variables:

You can use a variable in a command by typing the name of the variable

## example:
`say variable_name`

## Variables in text

```
text "hello" + variable_name ++ ". How are you today?" 10

^^ this command joins "hello" and variable_name's value with a space between, and joins ". How are you today" on the end without a space.

++ joins it's two inputs without a space
+ (if either input is a string) joins its inputs with a space
```

This syntax works everywhere and is not limited to only text commands

Or if you are using text you can use this to make it simpler:
```
text "hello <variable_name>. How are you today?" 10

^^ any variable that is inside <> in a text command will be rendered as it's variable value

(this ONLY works with text commands)
```

Full variables documentation: [here](https://github.com/Mistium/Origin-OS/wiki/OSL-%E2%80%90-Variables)


# Setup

Open originOS

Install v4.3.8

Boot and create an account if you dont have one

Open studio (red <> icon on the dock)

Type in the new file box "session1.app"

Click new file

type `window "stop"` (this will run at the end of your code otherwise it will just run indefinitely)

Click save

An open button will appear, press it to open an app and run your code

# Tasks

1. Define a integer

2. Define a string

3. Define a array

4. Set a integer to the value of `task1's variable value / 2`
  if your variable is equal to 8 you should end up with a variable that has the value of 4

5. Set a variable to the length of your array in question 3 with `variable_name.len`

6. Output letter 2 of your string from task2
   You can use varible.[2] - to return the second item of a string or array
   (if you have "hello" if should output "e")

7. Set your variable to letter 2 of your variable joined on the end of your variable
   (if you have the string "hello" you should end up with "helloe")

7. Complete this code:
   
  the loop command will run any code you put inside it the same number of times as the number you give it,
  in this case it will run the code here 5 times

  You need to make it output the count every time the count is incremented
  ```
  count = 0
   loop 5 (
     count += 1
   )
   ```
8. Use the loop command to split your string from task 2 into a array of letters

  Here is some code to start you off:
```
count = 0
loop string.len (
  count += 1
  
)
