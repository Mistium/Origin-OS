# Variables

They are fundamental.

```
variable_name = value
% your code here %
```

But let's learn what the possibilities are.

- The variable name can be anything: user_name, age, is_raining, etc.
- The value can be a string, number, bool, or another variable.
- To define a variable, use the format: variable_name = value.
- To retrieve the value, simply use the variable name.

Here are some examples, i will let you see the patterns first:
- 1
```
user_name = "Alice"
console("Welcome, " + user_name + "!")
```
Output:
```
Welcome, Alice!
```
- 2
```
user_age = 25
if user_age > 18 then
  console("You're an adult!")
elseif user_age < 13 do
  console("You're a kid!")
else do
  console("You're a teenager!")
end
```

Output:
```
You're an adult!
```
As you probably saw or not, to define variables you need this specific format:
```
name_of_variable_here = "value"
```
Example:
```
coins = 1
name = "Elon Musk"
bool = True
oher_bool = False
```
But thats not all! We can do amazing things.
```
coins = 0
coins += 1
print(coins)
```
Output:
```
1
```
We print variables wihout quotes, we print text or values with quotes.
`coins` was initially 0 but we added 1 and 0 + 1 = 1
You can also substract: `coins -= 1`
⚠️If you atempt to use a variable that was not defined your code will give an error!
You can join text together:
```
a = "y"
b = "e"
c = a + b
% a += b will give an error %
print(c)
```
Output:
```
ye
```
# You completed this lesson! Congrats! 🎉
[back to docs](https://github.com/Mistium/Origin-OS/blob/main/3rd%20Party/3rdPartyLanguages/BC/README.md)
