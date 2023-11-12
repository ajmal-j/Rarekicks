document.addEventListener('DOMContentLoaded', () => {
    const productImageMain2 = document.querySelectorAll('.productImageMain2');
    const firstImage = document.querySelector('.firstImage');
    let isMouseOver = false;

    productImageMain2.forEach((element) => {
        element.addEventListener('mouseenter', () => {
            isMouseOver = true;
        });

        element.addEventListener('mouseleave', () => {
            isMouseOver = false;
        });
    });
  
    setInterval(() => {
        var currentOpacity = window.getComputedStyle(firstImage).getPropertyValue('opacity');
        if (currentOpacity === '1') {
            firstImage.style.opacity = '0.9999';
            firstImage.style.transform = 'scale(1.08)';
        } else {
            firstImage.style.opacity = '1';
            firstImage.style.transform = 'scale(1)';
        }
        if (!isMouseOver) {
            productImageMain2.forEach((element) => {
                element.style.opacity = (element.style.opacity === '1') ? '0' : '1';
            });
        }
    }, 1500);
});