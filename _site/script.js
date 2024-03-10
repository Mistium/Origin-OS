document.addEventListener('scroll', function() {
    const images = document.querySelectorAll('.image');
    images.forEach(function(image, index) {
        const position = image.getBoundingClientRect().top;
        const screenHeight = window.innerHeight;
        const depth = (screenHeight - position) * 0.1; // Adjust the depth factor as needed
        const translation = index * 20; // Adjust the translation factor as needed
        if (position < screenHeight) {
            image.style.transform = 'translate(-50%, calc(-50% - ' + translation + 'px))';
        } else {
            image.style.transform = 'translate(-50%, -50%)';
        }
    });
});
