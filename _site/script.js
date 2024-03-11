document.addEventListener('scroll', function() {
    const image1 = document.getElementById('Image1');
    const image3 = document.getElementById('Image3');
    const scrollY = window.scrollY;

    const newPosition = scrollY / 50 + 5;

    image1.style.top = `calc(50% + ${newPosition}vw)`;
    image1.style.left = `calc(50% + ${newPosition}vw)`;

    image3.style.top = `calc(50% + ${newPosition* -1}vw)`;
    image3.style.left = `calc(50% + ${newPosition* -1}vw)`;
});
