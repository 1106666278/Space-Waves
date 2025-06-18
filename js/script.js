document.addEventListener('DOMContentLoaded', () => {
    const languageSwitcher = document.getElementById('languageSwitcher');
    const relatedGamesContainer = document.getElementById('relatedGamesContainer');
    const faqContainer = document.getElementById('faqContainer');

    // --- Language Switching ---
    function setLanguage(lang) {
        document.documentElement.lang = lang;
        localStorage.setItem('preferredLanguage', lang); // Save preference

        const elementsToTranslate = document.querySelectorAll('[data-lang-key]');
        elementsToTranslate.forEach(el => {
            const key = el.getAttribute('data-lang-key');
            if (translations[lang] && translations[lang][key]) {
                if (el.tagName === 'INPUT' && el.type === 'submit' || el.tagName === 'BUTTON') {
                    el.value = translations[lang][key];
                } else if (el.tagName === 'META' && el.name === 'description') {
                    el.content = translations[lang][key];
                }
                else {
                    el.innerHTML = translations[lang][key]; // Use innerHTML for tags like <kbd>
                }
            }
        });
    }

    languageSwitcher.addEventListener('change', (event) => {
        setLanguage(event.target.value);
    });

    // Load saved language or default to English
    const savedLang = localStorage.getItem('preferredLanguage') || 'en';
    languageSwitcher.value = savedLang;
    setLanguage(savedLang);


    // --- Load Related Games ---
    function loadRelatedGames() {
        fetch('data/related-games.json')
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(games => {
                relatedGamesContainer.innerHTML = ''; // Clear existing
                games.forEach(game => {
                    const card = `
                        <div class="bg-gray-800 bg-opacity-80 rounded-lg shadow-xl overflow-hidden p-5 flex flex-col card-hover-effect border border-purple-600">
                            <img src="${game.image}" alt="${game.title[savedLang] || game.title['en']}" class="w-full h-48 object-cover rounded-md mb-4">
                            <h3 class="text-xl font-semibold mb-2 text-purple-400">${game.title[savedLang] || game.title['en']}</h3>
                            <p class="text-gray-400 text-sm mb-4 flex-grow">${game.description[savedLang] || game.description['en']}</p>
                            <a href="${game.url}" target="_blank"
                               class="mt-auto inline-block bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded-lg text-center transition duration-300 ease-in-out transform hover:scale-105"
                               data-lang-key="viewGameButton">
                               ${translations[savedLang]?.viewGameButton || translations['en'].viewGameButton}
                            </a>
                        </div>
                    `;
                    relatedGamesContainer.innerHTML += card;
                });
            })
            .catch(error => {
                console.error("Could not load related games:", error);
                relatedGamesContainer.innerHTML = `<p class="text-red-400 col-span-full">Error loading related games. Please try again later.</p>`;
            });
    }

    // --- Load FAQ ---
    function loadFAQ() {
        fetch('data/faq.json')
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(faqs => {
                faqContainer.innerHTML = ''; // Clear existing
                faqs.forEach(faqItem => {
                    const item = `
                        <div class="faq-item bg-gray-800 bg-opacity-80 rounded-lg shadow-lg p-1 border border-purple-600">
                            <details class="group">
                                <summary class="flex justify-between items-center font-medium p-4 text-purple-300 hover:text-purple-200">
                                    <span>${faqItem.question[savedLang] || faqItem.question['en']}</span>
                                    <span class="text-purple-400 text-xl transition-transform duration-300 group-open:rotate-45"></span>
                                </summary>
                                <div class="text-gray-400 p-4 pt-0">
                                    ${faqItem.answer[savedLang] || faqItem.answer['en']}
                                </div>
                            </details>
                        </div>
                    `;
                    faqContainer.innerHTML += item;
                });
            })
            .catch(error => {
                console.error("Could not load FAQ:", error);
                faqContainer.innerHTML = `<p class="text-red-400">Error loading FAQ. Please try again later.</p>`;
            });
    }

    // Initial load
    loadRelatedGames();
    loadFAQ();

    // Reload content if language changes to update JSON-loaded content
    languageSwitcher.addEventListener('change', () => {
        loadRelatedGames(); // Re-fetch and render with new language
        loadFAQ();          // Re-fetch and render with new language
    });
});
