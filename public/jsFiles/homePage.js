document.addEventListener('DOMContentLoaded', () => {
    const productImageMain2 = document.querySelectorAll('.productImageMain2');
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
        if (!isMouseOver) {
            productImageMain2.forEach((element) => {
                element.style.opacity = (element.style.opacity === '1') ? '0' : '1';
            });
        }
    }, 1500);
});