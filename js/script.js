document.addEventListener("DOMContentLoaded", function () {
    const trainingTypes = [
        {
            title: "Módulo Financeiro",
            image: "https://img.freepik.com/free-photo/digital-graph-performance-with-businessman-hand-overlay_53876-101943.jpg?uid=R180807379&ga=GA1.1.728869221.1720634505&semt=ais_hybrid",
            trainings: [
                { name: "Contas a Pagar", link: "#" },
                { name: "Contas a Receber", link: "#" },
                { name: "Controle de Transferências", link: "#" },
            ],
        },
        {
            title: "Cadastros Gerais",
            image: "https://img.freepik.com/free-photo/form-business-exam-comparison-option_1232-3835.jpg?t=st=1738351677~exp=1738355277~hmac=4b29133c0d1d1ba7779b978dd49b7e1999003c016fbc3f6bf09bf5a7c16691d3&w=1380",
            trainings: [
                { name: "Cadastrar Fornecedores", link: "#" },
                { name: "Cadastrar Condomínios", link: "#" },
            ],
        },
        {
            title: "Módulo de Convivência",
            image: "https://img.freepik.com/free-photo/paper-dolls-against-sky_23-2148144531.jpg?uid=R180807379&ga=GA1.1.728869221.1720634505&semt=ais_hybrid",
            trainings: [
                { name: "Reserva de Áreas", link: "#" },
                { name: "Quadro de Avisos", link: "#" },
            ],
        },
    ];

    const container = document.getElementById("courses-container");

    // Limpa o container antes de adicionar os cards
    container.innerHTML = "";

    // Renderizar os tipos de treinamento
    trainingTypes.forEach((type) => {
        const cardElement = document.createElement("div");
        cardElement.classList.add("col-md-4", "mb-4");
        cardElement.innerHTML = `
            <div class="card course-card">
                <img src="${type.image}" alt="${type.title}" class="card-img-top training-image">
                <div class="card-body text-center">
                    <h5 class="card-title">${type.title}</h5>
                    <button class="btn btn-primary btn-sm toggle-options">
                        Ver Treinamentos
                    </button>
                    <ul class="training-options mt-3" style="display: none;">
                        ${type.trainings
                            .map(
                                (training) =>
                                    `<li><a href="${training.link}">${training.name}</a></li>`
                            )
                            .join("")}
                    </ul>
                </div>
            </div>
        `;
        container.appendChild(cardElement);
    });

    // Interatividade para exibir/ocultar treinamentos
    const toggleButtons = document.querySelectorAll(".toggle-options");
    toggleButtons.forEach((button) => {
        button.addEventListener("click", function () {
            const options = this.nextElementSibling; // Seleciona a lista de treinamentos
            const isExpanded = this.textContent === "Fechar Treinamentos";

            if (!isExpanded) {
                options.style.display = "block";
                this.textContent = "Fechar Treinamentos";
            } else {
                options.style.display = "none";
                this.textContent = "Ver Treinamentos";
            }
        });
    });

    // FAQ interatividade
    const faqItems = document.querySelectorAll(".faq-item");
    faqItems.forEach((item) => {
        item.querySelector(".faq-question").addEventListener("click", () => {
            item.classList.toggle("open");
        });
    });
});
