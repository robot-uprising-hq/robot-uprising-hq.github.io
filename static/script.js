document.addEventListener('DOMContentLoaded', function() {
    setupNavTabs();
    setupFAQInteraction();

    // Remove window controls and resize observer for futuristic design
    function setupFAQInteraction() {
        const faqQuestions = document.querySelectorAll('.faq-question');
        const faqAnswers = document.querySelectorAll('.faq-answer');

        // Initially hide all answers
        faqAnswers.forEach(answer => {
            answer.style.display = 'none';
        });

        faqQuestions.forEach(question => {
            question.addEventListener('click', function() {
                const answer = this.nextElementSibling;
                const container = this.closest('.futuristic-container');

                // Fix the container's width to prevent resizing
                if (container) {
                    container.style.width = `${container.offsetWidth}px`;
                }

                if (answer.classList.contains('open')) {
                    answer.classList.remove('open');
                    this.classList.remove('open');
                    answer.style.display = 'none';
                } else {
                    answer.classList.add('open');
                    this.classList.add('open');
                    answer.style.display = 'block';
                }
            });
        });
    }

    function setupNavTabs() {
        const tabs = document.querySelectorAll('.nav-tab');
        const contents = document.querySelectorAll('.nav-content');

        tabs.forEach(tab => {
            tab.addEventListener('click', function() {
                const tabId = this.getAttribute('data-tab');
                tabs.forEach(t => t.classList.remove('active'));
                contents.forEach(c => c.classList.remove('active'));
                this.classList.add('active');
                document.getElementById(tabId + '-content').classList.add('active');
            });
        });
    }
});
