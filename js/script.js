document.addEventListener("DOMContentLoaded", function () {
    const trainingTypes = [
        {
            title: "Módulo Financeiro",
            image: "https://img.freepik.com/free-photo/digital-graph-performance-with-businessman-hand-overlay_53876-101943.jpg?uid=R180807379&ga=GA1.1.728869221.1720634505&semt=ais_hybrid",
            trainings: [
                { name: "Contas a Pagar", link: "contas-a-pagar.html" },
                { name: "Contas a Receber", link: "contasareceber.html" },
                { name: "Controle de Transferências", link: "controle-de-transferencias.html" },
            ],
        },
        {
            title: "Cadastros Gerais",
            image: "https://img.freepik.com/free-photo/form-business-exam-comparison-option_1232-3835.jpg?t=st=1738351677~exp=1738355277~hmac=4b29133c0d1d1ba7779b978dd49b7e1999003c016fbc3f6bf09bf5a7c16691d3&w=1380",
            trainings: [
                { name: "Cadastrar Fornecedores", link: "fornecedores.html" },
                { name: "Cadastrar Condomínios", link: "#" },
            ],
        },
        {
            title: "Módulo de Convivência",
            image: "https://img.freepik.com/free-photo/paper-dolls-against-sky_23-2148144531.jpg?uid=R180807379&ga=GA1.1.728869221.1720634505&semt=ais_hybrid",
            trainings: [
                { name: "Reserva de Áreas", link: "#" },
                { name: "Quadro de Avisos", link: "quadro-de-avisos.html" },
            ],
        },
    ];

    const container = document.getElementById("courses-container");
    const searchInput = document.getElementById("search-courses");
    const faqItems = document.querySelectorAll(".faq-item");
    const itemsPerPage = 3;
    let currentPage = 1;

    // Função para renderizar FAQs por página
    function renderFAQs(page = 1, filteredFAQs = faqItems) {
        const start = (page - 1) * itemsPerPage;
        const end = start + itemsPerPage;

        faqItems.forEach((faq) => (faq.style.display = "none")); // Oculta todas as FAQs
        filteredFAQs.forEach((faq, index) => {
            if (index >= start && index < end) {
                faq.style.display = "block";
            }
        });

        // Atualiza os botões de paginação
        document.getElementById("prev-btn").disabled = page === 1;
        document.getElementById("next-btn").disabled = end >= filteredFAQs.length;

        currentPage = page; // Atualiza a página atual
    }

    faqItems.forEach((item) => {
        const question = item.querySelector(".faq-question");
    
        // Adiciona interatividade para exibir/ocultar respostas
        question.addEventListener("click", () => {
            item.classList.toggle("open"); // Adiciona/remove a classe 'open'
        });
    });

    // Função para filtrar FAQs
    function filterFAQs(searchTerm) {
        const filteredFAQs = [...faqItems].filter((item) => {
            const question = item.querySelector(".faq-question").textContent.toLowerCase();
            const answer = item.querySelector(".faq-answer").textContent.toLowerCase();
            const match = question.includes(searchTerm) || answer.includes(searchTerm);
            item.classList.toggle("open", match); // Abre automaticamente as respostas correspondentes
            item.querySelector(".faq-answer").style.display = match ? "block" : "none";
            return match;
        });

        renderFAQs(1, filteredFAQs); // Renderiza a página inicial das FAQs filtradas
    }
    

    // Função para filtrar treinamentos
    function renderTrainings(trainings, searchTerm = "") {
        container.innerHTML = ""; // Limpa o container
        trainings.forEach((type) => {
            const filteredTrainings = type.trainings.filter((training) =>
                training.name.toLowerCase().includes(searchTerm)
            );

            if (filteredTrainings.length > 0 || searchTerm === "") {
                const cardElement = document.createElement("div");
                cardElement.classList.add("col-md-4", "mb-4");
                const isExpanded = filteredTrainings.length > 0 && searchTerm !== "";
                cardElement.innerHTML = `
                    <div class="card course-card">
                        <img src="${type.image}" alt="${type.title}" class="card-img-top training-image">
                        <div class="card-body text-center">
                            <h5 class="card-title">${type.title}</h5>
                            <button class="btn btn-primary btn-sm toggle-options">
                                ${isExpanded ? "Fechar Treinamentos" : "Ver Treinamentos"}
                            </button>
                            <div class="training-options mt-3" style="display: ${isExpanded ? "block" : "none"};">
                                ${filteredTrainings
                                    .map(
                                        (training) =>
                                            `<button class="btn btn-outline-primary btn-sm btn-block mb-2 training-button" onclick="window.location.href='${training.link}'">
                                                ${training.name}
                                            </button>`
                                    )
                                    .join("")}
                            </div>
                        </div>
                    </div>
                `;
                container.appendChild(cardElement);
            }
        });
    }

    // Renderiza os treinamentos e FAQs inicialmente
    renderTrainings(trainingTypes);
    renderFAQs();

    // Adiciona eventos aos botões de paginação
    document.getElementById("prev-btn").addEventListener("click", () => {
        if (currentPage > 1) {
            renderFAQs(currentPage - 1);
        }
    });

    document.getElementById("next-btn").addEventListener("click", () => {
        if (currentPage * itemsPerPage < faqItems.length) {
            renderFAQs(currentPage + 1);
        }
    });

    // Evento de busca
    searchInput.addEventListener("input", function () {
        const searchTerm = this.value.toLowerCase();

        // Filtrar treinamentos e FAQs
        renderTrainings(trainingTypes, searchTerm);
        filterFAQs(searchTerm);
    });
});
