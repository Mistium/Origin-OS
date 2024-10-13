let size = document.getElementById("screen");
console.log(size);

if (size) {
	size.innerHTML = window.innerWidth + "x" + window.innerHeight;
} else {
	console.error("Element with ID 'screen' not found.");
}