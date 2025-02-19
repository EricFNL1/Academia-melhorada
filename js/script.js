document.addEventListener("DOMContentLoaded", function () {
  const trainingTypes = [
    {
      title: "Módulo Financeiro",
      image:
        "https://img.freepik.com/free-photo/businesswoman-using-tablet-analysis-graph-company-finance-strategy-statistics-success-concept-planning-future-office-room_74952-1410.jpg",
      trainings: [
        { name: "Contas a Pagar", link: "contas-a-pagar.html" },
        { name: "Contas a Receber", link: "contasareceber.html" },
        { name: "Contas Bancárias", link: "#" },
        { name: "Configurar Boleto & Banco", link: "#" },
        { name: "Controle de Transferências", link: "controle-de-transferencias.html" },
      ],
    },
    {
      title: "Cadastros Gerais",
      image:
        "https://img.freepik.com/free-photo/form-business-exam-comparison-option_1232-3835.jpg",
      trainings: [
        { name: "Cadastrar Fornecedores", link: "fornecedores.html" },
        { name: "Cadastrar Condomínios", link: "#" },
      ],
    },
    {
      title: "Módulo de Convivência",
      image:
        "https://img.freepik.com/free-photo/paper-dolls-against-sky_23-2148144531.jpg",
      trainings: [
        { name: "Reserva de Áreas", link: "#" },
        { name: "Quadro de Avisos", link: "quadro-de-avisos.html" },
      ],
    },
  ];

  const container = document.getElementById("courses-container");
  const searchInput = document.getElementById("search-courses");
  // Converte NodeList em array para facilitar a manipulação
  const faqItems = Array.from(document.querySelectorAll(".faq-item"));
  const itemsPerPage = 4;
  let currentPage = 1;

  // Recupera os treinamentos concluídos do localStorage
  const completedTrainings =
    JSON.parse(localStorage.getItem("completedTrainings")) || [];

  // Função para atualizar a barra de progresso de um módulo
  function atualizarProgresso(moduleTitle) {
    const moduleKey = moduleTitle.replace(/\s+/g, "-").toLowerCase();
    const moduleTrainings = trainingTypes.find(
      (t) => t.title === moduleTitle
    ).trainings.length;
    const completedTrainingsInModule = completedTrainings.filter((t) =>
      trainingTypes
        .find((m) => m.title === moduleTitle)
        ?.trainings.some((train) => train.name === t)
    ).length;

    const porcentagem = (completedTrainingsInModule / moduleTrainings) * 100;
    const progressBar = document.getElementById(`progress-${moduleKey}`);

    if (progressBar) {
      progressBar.style.width = `${porcentagem}%`;
      progressBar.setAttribute("aria-valuenow", porcentagem);
      progressBar.textContent = `${Math.round(porcentagem)}%`;
    }
  }

  // Função para renderizar os treinamentos
  function renderTrainings(trainings, searchTerm = "") {
    container.innerHTML = ""; // Limpa o container

    trainings.forEach((type) => {
      const filteredTrainings = type.trainings.filter((training) =>
        training.name.toLowerCase().includes(searchTerm)
      );

      // Exibe o card se houver treinamentos filtrados ou se não houver filtro
      if (filteredTrainings.length > 0 || searchTerm === "") {
        const cardElement = document.createElement("div");
        cardElement.classList.add("col-md-4");
        const isExpanded = filteredTrainings.length > 0 && searchTerm !== "";
        cardElement.innerHTML = `
          <div class="card course-card">
            <img src="${type.image}" alt="${type.title}" class="card-img-top training-image">
            <div class="card-body text-center">
              <h5 class="card-title">${type.title}</h5>
              <!-- Barra de progresso -->
              <div class="progress mb-2" style="height: 20px;">
                <div id="progress-${type.title.replace(/\s+/g, "-").toLowerCase()}" 
                     class="progress-bar bg-success" role="progressbar" 
                     style="width: 0%;" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100">
                  0%
                </div>
              </div>
              <button class="btn btn-primary btn-sm toggle-options">
                ${isExpanded ? "Fechar Treinamentos" : "Ver Treinamentos"}
              </button>
              <div class="training-options mt-3 scrollable-list" style="display: ${
                isExpanded ? "block" : "none"
              };">
                ${filteredTrainings
                  .map(
                    (training) =>
                      `<button class="btn ${
                        completedTrainings.includes(training.name)
                          ? "btn-success"
                          : "btn-outline-primary"
                      } btn-sm btn-block mb-2 training-button" 
                          data-training="${training.name}" 
                          data-module="${type.title}"
                          data-link="${training.link}">
                          ${training.name} ${
                        completedTrainings.includes(training.name) ? "✔" : ""
                      }
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

    // Anexa o event listener para os botões "Ver/Fechar Treinamentos"
    const toggleButtons = container.querySelectorAll(".toggle-options");
    toggleButtons.forEach((button) => {
      button.addEventListener("click", function () {
        const options = this.nextElementSibling; // Seleciona a lista de treinamentos
        if (this.textContent.trim() === "Fechar Treinamentos") {
          options.style.display = "none";
          this.textContent = "Ver Treinamentos";
        } else {
          options.style.display = "block";
          this.textContent = "Fechar Treinamentos";
        }
      });
    });

    // Atualiza a barra de progresso para cada módulo
    trainingTypes.forEach((type) => atualizarProgresso(type.title));
  }

  // Função para renderizar FAQs com paginação numérica
  function renderFAQs(page = 1, filteredFAQs = faqItems) {
    const start = (page - 1) * itemsPerPage;
    const end = start + itemsPerPage;

    // Oculta todas as FAQs
    faqItems.forEach((faq) => (faq.style.display = "none"));
    // Exibe as FAQs da página atual
    filteredFAQs.forEach((faq, index) => {
      if (index >= start && index < end) {
        faq.style.display = "block";
      }
    });

    // Atualiza os botões de paginação numérica
    renderPagination(filteredFAQs, page);
    currentPage = page;
  }

  // Função para renderizar os botões de paginação numérica
  function renderPagination(filteredFAQs, currentPage) {
    const paginationContainer = document.getElementById("pagination-numbers");
    paginationContainer.innerHTML = "";
    const totalPages = Math.ceil(filteredFAQs.length / itemsPerPage);

    for (let i = 1; i <= totalPages; i++) {
      const btn = document.createElement("button");
      btn.textContent = i;
      btn.className = "btn btn-secondary mx-1 pagination-btn";
      if (i === currentPage) btn.classList.add("active");

      btn.addEventListener("click", () => {
        renderFAQs(i, filteredFAQs);
      });
      paginationContainer.appendChild(btn);
    }

    // Atualiza os botões "prev" e "next" caso existam
    document.getElementById("prev-btn").disabled = currentPage === 1;
    document.getElementById("next-btn").disabled = currentPage === totalPages;
  }

  // Anexa a interatividade para as FAQs (clique para abrir/fechar)
  faqItems.forEach((item) => {
    const question = item.querySelector(".faq-question");
    const answer = item.querySelector(".faq-answer");

    question.addEventListener("click", () => {
      item.classList.toggle("open");
      answer.style.display = item.classList.contains("open") ? "block" : "none";
    });
  });

  // Função para filtrar FAQs com base na busca
  function filterFAQs(searchTerm) {
    const filteredFAQs = faqItems.filter((item) => {
      const question = item
        .querySelector(".faq-question")
        .textContent.toLowerCase();
      const answer = item
        .querySelector(".faq-answer")
        .textContent.toLowerCase();
      const match = question.includes(searchTerm) || answer.includes(searchTerm);

      // Abre automaticamente as FAQs que correspondem
      item.classList.toggle("open", match);
      item.querySelector(".faq-answer").style.display = match ? "block" : "none";
      return match;
    });

    renderFAQs(1, filteredFAQs);
    return filteredFAQs;
  }

  // Função para fechar todas as FAQs
  function closeAllFAQs() {
    faqItems.forEach((item) => {
      item.classList.remove("open");
      item.querySelector(".faq-answer").style.display = "none";
    });
  }

  // Event listener único para o input de busca
  searchInput.addEventListener("input", function () {
    const searchTerm = this.value.toLowerCase();

    // Filtra e renderiza os treinamentos e FAQs
    renderTrainings(trainingTypes, searchTerm);
    const filteredFAQs = filterFAQs(searchTerm);

    // Exibe mensagem "Nenhum resultado encontrado" se não houver resultados
    const noResultsMessage = document.getElementById("no-results-message");
    const noTrainingResults = container.innerHTML.trim() === "";
    const noFAQResults = filteredFAQs.length === 0;

    noResultsMessage.style.display =
      noTrainingResults && noFAQResults ? "block" : "none";

    // Se o campo de busca estiver vazio, fecha as FAQs e renderiza todas
    if (searchTerm === "") {
      closeAllFAQs();
      renderFAQs();
    }
  });

  // Event listeners para os botões "prev" e "next" (se existirem)
  document.getElementById("prev-btn").addEventListener("click", () => {
    if (currentPage > 1) {
      renderFAQs(currentPage - 1);
    }
  });

  document.getElementById("next-btn").addEventListener("click", () => {
    const filteredFAQs = faqItems;
    if (currentPage < Math.ceil(filteredFAQs.length / itemsPerPage)) {
      renderFAQs(currentPage + 1, filteredFAQs);
    }
  });

  // Event delegation para os botões de treinamento
  // Agora usamos o atributo data-link em vez de onclick inline
  document.addEventListener("click", function (event) {
    if (event.target.classList.contains("training-button")) {
      const button = event.target;
      const trainingName = button.getAttribute("data-training");
      const moduleTitle = button.getAttribute("data-module");
      const trainingLink = button.getAttribute("data-link");

      // Marca o treinamento como concluído (se ainda não estiver salvo)
      if (!completedTrainings.includes(trainingName)) {
        completedTrainings.push(trainingName);
        localStorage.setItem("completedTrainings", JSON.stringify(completedTrainings));
      }

      // Re-renderiza os treinamentos e atualiza a barra de progresso
      renderTrainings(trainingTypes, searchInput.value.toLowerCase());
      atualizarProgresso(moduleTitle);

      // Redireciona para o link do treinamento (opcional: com delay para ver o update)
      setTimeout(() => {
        window.location.href = trainingLink;
      }, 200);
    }
  });

  // Renderiza os treinamentos e FAQs inicialmente
  renderTrainings(trainingTypes);
  renderFAQs();
});
