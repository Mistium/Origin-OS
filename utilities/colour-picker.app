window "show"
hex = "123456789abcdef"

def "converthex" "data"
data = data.cast("int")
out = hex.[data]
endef
mainloop:

loc 999 999 0 50
slider 100 5 "r"
loc 999 999 0 0
slider 100 5 "g"
loc 999 999 0 -50
slider 100 5 "b"

converthex input_r
r = out
converthex input_g
g = out
converthex input_b
b = out
