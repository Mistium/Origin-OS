window "show"
hex = "123456789abcdef"

def "converthex" "data"
data = data.cast("int")
out = hex.[data]
endef
mainloop:

slider 100 5 "r"
slider 100 5 "g"
slider 100 5 "b"

converthex input_r
r = out
converthex input_g
g = out
converthex input_b
b = out
