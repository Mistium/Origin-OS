# EXAMPLES

# 1
```
a = 10
b = 10
c = a * b
console(c)
```
Output:
```
100
```

# 2
```
console('*')
console('**')
console('***')
console('****')
console('*****')
```
Output:
```
*
**
***
****
*****
```

# 3
```
for i in range(1, 6):
    console('*' * i)
```
Output:
```
*
**
***
****
*****
```

# 4
```
def calculate_area(radius):
    pi = 3.14
    area = pi * radius ** 2
    return area

radius = 5
result = calculate_area(radius)
console(result)
```
Output:
```
78.5
```

# 5
```
numbers = [1, 2, 3, 4, 5]
sum_numbers = sum(numbers)
average = sum_numbers / len(numbers)
console(average)
```
Output:
```
3.0
```

# 6
```
def reverse_string(input_str):
    reversed_str = input_str[::-1]
    console(reversed_str)

text = "Hello, World!"
reverse_string(text)
```
Output:
```
!dlroW ,olleH
```
