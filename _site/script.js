document.addEventListener('scroll', function() {
    const images = document.querySelectorAll('.image');
    images.forEach(function(image) {
        const position = image.getBoundingClientRect().top;
        const screenHeight = window.innerHeight;
        if (position < screenHeight) {
            const depth = (screenHeight - position) * 0.1; // Adjust the depth factor as needed
            image.style.transform = 'translateY(' + depth + 'px)';
        } else {
            image.style.transform = 'translateY(0)';
        }
    });
});
