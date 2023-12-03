### Basic Syntax
```
for variable variable_start int step (
  commands and stuff
)
```
---

### Function Osl Equivalent

```
step = 1
i = 0
loop int (
  i += step
  commands and stuff
)
```

---

### Example Use
```
for "i" 0 10 1 (
  print i
)
```
### Example as osl
```
i = 0
loop 10 (
  i += 1
  print i
)
```
