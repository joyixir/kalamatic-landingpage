(function () {
    function initScreenshotGallery() {
        var section = document.querySelector('.screenshots-section');

        if (!section) {
            return;
        }

        var triggers = Array.prototype.slice.call(section.querySelectorAll('[data-screenshot-trigger]'));
        var lightbox = section.querySelector('[data-screenshot-lightbox]');
        var dialog = section.querySelector('.screenshots-lightbox-dialog');
        var activeImage = section.querySelector('[data-screenshot-active-image]');
        var closeControls = Array.prototype.slice.call(section.querySelectorAll('[data-screenshot-close]'));
        var prevButton = section.querySelector('[data-screenshot-prev]');
        var nextButton = section.querySelector('[data-screenshot-next]');

        if (!triggers.length || !lightbox || !activeImage) {
            return;
        }

        var currentIndex = 0;
        var items = triggers.map(function (trigger) {
            return {
                src: trigger.getAttribute('data-screenshot-src'),
                alt: trigger.getAttribute('data-screenshot-alt') || ''
            };
        });

        function render(index) {
            var item = items[index];

            if (!item) {
                return;
            }

            currentIndex = index;
            activeImage.src = item.src;
            activeImage.alt = item.alt;
        }

        function open(index) {
            render(index);
            lightbox.hidden = false;
            document.body.classList.add('screenshots-lightbox-open');
        }

        function close() {
            lightbox.hidden = true;
            document.body.classList.remove('screenshots-lightbox-open');
        }

        function showPrevious() {
            render((currentIndex - 1 + items.length) % items.length);
        }

        function showNext() {
            render((currentIndex + 1) % items.length);
        }

        triggers.forEach(function (trigger, index) {
            trigger.addEventListener('click', function () {
                open(index);
            });
        });

        closeControls.forEach(function (control) {
            control.addEventListener('click', close);
        });

        if (dialog) {
            dialog.addEventListener('click', function (event) {
                if (event.target === dialog) {
                    close();
                }
            });
        }

        if (prevButton) {
            prevButton.addEventListener('click', showPrevious);
        }

        if (nextButton) {
            nextButton.addEventListener('click', showNext);
        }

        document.addEventListener('keydown', function (event) {
            if (lightbox.hidden) {
                return;
            }

            if (event.key === 'Escape') {
                close();
                return;
            }

            if (event.key === 'ArrowLeft') {
                showPrevious();
                return;
            }

            if (event.key === 'ArrowRight') {
                showNext();
            }
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initScreenshotGallery, { once: true });
        return;
    }

    initScreenshotGallery();
}());
