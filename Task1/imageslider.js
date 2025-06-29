document.addEventListener('DOMContentLoaded', function () {
    const sliderWrapper = document.querySelector('.slider-wrapper');
    const slides = document.querySelectorAll('.slider-card');
    const prevButton = document.querySelector('.slider-button.prev');
    const nextButton = document.querySelector('.slider-button.next');
    const sliderContainer = document.querySelector('.slider-container');

    let currentIndex = 0;
    let slideWidth;
    let slidesToShow;
    let autoSlideInterval;
    let startX;
    let currentX;
    let isDragging = false;

    function calculateSlideWidth() {
        const viewportWidth = window.innerWidth;

        if (viewportWidth > 1200) {
            slidesToShow = 3;
        } else if (viewportWidth > 768) {
            slidesToShow = 2;
        } else {
            slidesToShow = 1;
        }

        if (viewportWidth <= 480) {
            slideWidth = 320;
            slides.forEach(slide => {
                slide.style.flex = `0 0 320px`;
            });
        } else {
            const containerWidth = sliderContainer.clientWidth;
            slideWidth = (containerWidth / slidesToShow) - 20;
            slides.forEach(slide => {
                slide.style.flex = `0 0 ${slideWidth}px`;
            });
        }
    }

    function moveSlides() {
        if (currentIndex > slides.length - slidesToShow) {
            currentIndex = 0;
        } else if (currentIndex < 0) {
            currentIndex = slides.length - slidesToShow;
        }

        const translateX = -currentIndex * (slideWidth + 20);
        sliderWrapper.style.transform = `translateX(${translateX}px)`;
    }

    function startAutoSlide() {
        autoSlideInterval = setInterval(() => {
            currentIndex++;
            if (currentIndex > slides.length - slidesToShow) {
                currentIndex = 0;
            }
            moveSlides();
        }, 3000);
    }

    function stopAutoSlide() {
        clearInterval(autoSlideInterval);
    }

    function initSlider() {
        calculateSlideWidth();
        moveSlides();
        startAutoSlide();
    }

    prevButton.addEventListener('click', () => {
        currentIndex--;
        moveSlides();
        stopAutoSlide();
        startAutoSlide();
    });

    nextButton.addEventListener('click', () => {
        currentIndex++;
        moveSlides();
        stopAutoSlide();
        startAutoSlide();
    });

    sliderContainer.addEventListener('mouseenter', stopAutoSlide);
    sliderContainer.addEventListener('mouseleave', startAutoSlide);

    // Swipe & Drag
    sliderWrapper.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
        isDragging = true;
        stopAutoSlide();
    }, { passive: true });

    sliderWrapper.addEventListener('touchmove', (e) => {
        if (!isDragging) return;
        currentX = e.touches[0].clientX;
        const diffX = currentX - startX;
        const translateX = -currentIndex * (slideWidth + 20) + diffX * 0.5;
        sliderWrapper.style.transform = `translateX(${translateX}px)`;
    }, { passive: true });

    sliderWrapper.addEventListener('touchend', () => {
        if (!isDragging) return;
        isDragging = false;
        const diffX = currentX - startX;

        if (Math.abs(diffX) > 50) {
            currentIndex += (diffX > 0) ? -1 : 1;
        }
        moveSlides();
        startAutoSlide();
    });

    sliderWrapper.addEventListener('mousedown', (e) => {
        e.preventDefault();
        startX = e.clientX;
        isDragging = true;
        stopAutoSlide();
        sliderWrapper.style.cursor = 'grabbing';
    });

    window.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        currentX = e.clientX;
        const diffX = currentX - startX;
        const translateX = -currentIndex * (slideWidth + 20) + diffX * 0.5;
        sliderWrapper.style.transform = `translateX(${translateX}px)`;
    });

    window.addEventListener('mouseup', () => {
        if (!isDragging) return;
        isDragging = false;
        sliderWrapper.style.cursor = 'grab';
        const diffX = currentX - startX;

        if (Math.abs(diffX) > 50) {
            currentIndex += (diffX > 0) ? -1 : 1;
        }

        moveSlides();
        startAutoSlide();
    });

    window.addEventListener('resize', () => {
        stopAutoSlide();
        calculateSlideWidth();
        moveSlides();
        startAutoSlide();
    });

    initSlider();
});
