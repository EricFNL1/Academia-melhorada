document.addEventListener("DOMContentLoaded", function() {
  /* ----------------------------------------
     1) DADOS DOS MÓDULOS
  ---------------------------------------- */
  const trainingTypes = [
    {
      title: "Módulo Financeiro",
      image: "https://img.freepik.com/free-photo/businesswoman-using-tablet-analysis-graph-company-finance-strategy-statistics-success-concept-planning-future-office-room_74952-1410.jpg",
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
      image: "https://img.freepik.com/free-photo/form-business-exam-comparison-option_1232-3835.jpg",
      trainings: [
        { name: "Cadastrar Fornecedores", link: "fornecedores.html" },
        { name: "Cadastrar Condomínios", link: "#" },
      ],
    },
    {
      title: "Módulo de Convivência",
      image: "https://img.freepik.com/free-photo/paper-dolls-against-sky_23-2148144531.jpg",
      trainings: [
        { name: "Reserva de Áreas", link: "#" },
        { name: "Quadro de Avisos", link: "quadro-de-avisos.html" },
      ],
    },
    // Adicione mais módulos se quiser
  ];

  // Container do carousel
  const carouselContainer = document.getElementById("courses-carousel");
  // Input de busca
  const searchInput = document.getElementById("search-courses");
  // Mensagem de “Nenhum resultado”
  const noResultsMessage = document.getElementById("no-results-message") || { style: { display: "none" } };
  // Slide atual
  let currentSlide = 0;

  // Recupera treinamentos concluídos do localStorage
  const completedTrainings = JSON.parse(localStorage.getItem("completedTrainings")) || [];

  /* ----------------------------------------
     2) chunkArray: divide array em grupos de 3
  ---------------------------------------- */
  function chunkArray(array, size) {
    const result = [];
    for (let i = 0; i < array.length; i += size) {
      result.push(array.slice(i, i + size));
    }
    return result;
  }

  /* ----------------------------------------
     3) Atualiza barra de progresso
  ---------------------------------------- */
  function atualizarProgresso(moduleTitle) {
    const moduleKey = moduleTitle.replace(/\s+/g, "-").toLowerCase();
    const moduleData = trainingTypes.find(t => t.title === moduleTitle);
    if (!moduleData) return;

    const totalTrainings = moduleData.trainings.length;
    const completedCount = completedTrainings.filter(tName =>
      moduleData.trainings.some(tr => tr.name === tName)
    ).length;

    const porcentagem = (completedCount / totalTrainings) * 100 || 0;
    const progressBar = document.getElementById(`progress-${moduleKey}`);
    if (progressBar) {
      progressBar.style.width = `${porcentagem}%`;
      progressBar.setAttribute("aria-valuenow", porcentagem);
      progressBar.textContent = `${Math.round(porcentagem)}%`;
    }
  }

  /* ----------------------------------------
     4) Renderiza o carousel (3 módulos/slide)
  ---------------------------------------- */
  function renderCarousel(modules, searchTerm = "") {
    carouselContainer.innerHTML = "";

    // Filtro: busca no título do módulo e nome dos treinamentos
    let filtered = modules.filter(m =>
      m.title.toLowerCase().includes(searchTerm) ||
      m.trainings.some(t => t.name.toLowerCase().includes(searchTerm))
    );
    // Se busca vazio, exibe todos
    if (searchTerm === "") {
      filtered = modules;
    }

    // Exibe mensagem se não houver resultados
    noResultsMessage.style.display = filtered.length === 0 ? "block" : "none";

    // Divide em grupos de 3
    const slides = chunkArray(filtered, 3);

    slides.forEach((group, index) => {
      // Cria o slide => row row-cols-1 row-cols-md-3 g-3
      const slideDiv = document.createElement("div");
      slideDiv.className = "carousel-slide row row-cols-1 row-cols-md-3 g-3";
      if (index === 0) slideDiv.classList.add("active");

      group.forEach(module => {
        // Coluna
        const col = document.createElement("div");
        col.className = "col d-flex"; // d-flex => expande card

        // Monta o card do módulo
        let cardHTML = `
          <div class="course-card flex-grow-1">
            <img src="${module.image}" alt="${module.title}" class="card-img-top training-image">
            <div class="card-body text-center">
              <h5 class="card-title">${module.title}</h5>
              <div class="progress mb-2" style="height: 20px;">
                <div id="progress-${module.title.replace(/\s+/g, "-").toLowerCase()}"
                     class="progress-bar bg-success" role="progressbar"
                     style="width: 0%;" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100">
                  0%
                </div>
              </div>
              <button class="btn btn-primary btn-sm toggle-options">Ver Treinamentos</button>
              <div class="training-options mt-3 scrollable-list" style="display: none;">
        `;

        // Lista de treinamentos
        module.trainings.forEach(t => {
          const isCompleted = completedTrainings.includes(t.name);
          cardHTML += `
            <button class="btn ${isCompleted ? "btn-success" : "btn-outline-primary"} btn-sm btn-block mb-2 training-button"
                    data-training="${t.name}" data-module="${module.title}" data-link="${t.link}">
              ${t.name} ${isCompleted ? "✔" : ""}
            </button>
          `;
        });

        cardHTML += `
              </div>
            </div>
          </div>
        `;

        col.innerHTML = cardHTML;
        slideDiv.appendChild(col);
      });

      carouselContainer.appendChild(slideDiv);
    });

    // Após renderizar, atualiza a barra de progresso de todos os módulos
    trainingTypes.forEach(m => atualizarProgresso(m.title));
  }

  /* ----------------------------------------
     5) Exibe apenas o slide atual
  ---------------------------------------- */
  function showSlide(index) {
    const slides = document.querySelectorAll(".carousel-slide");
    if (slides.length === 0) return;

    if (index < 0) index = slides.length - 1;
    if (index >= slides.length) index = 0;

    slides.forEach((slide, i) => {
      slide.classList.toggle("active", i === index);
      slide.style.display = i === index ? "flex" : "none";
    });
    currentSlide = index;
  }

  /* ----------------------------------------
     6) Inicializa
  ---------------------------------------- */
  renderCarousel(trainingTypes);
  showSlide(0);

  // Botões de navegação do carousel
  document.getElementById("prev-btn").addEventListener("click", () => {
    showSlide(currentSlide - 1);
  });
  document.getElementById("next-btn").addEventListener("click", () => {
    showSlide(currentSlide + 1);
  });

  /* ----------------------------------------
     7) Toggle "Ver Treinamentos"
  ---------------------------------------- */
  document.addEventListener("click", function(event) {
    if (event.target.classList.contains("toggle-options")) {
      const button = event.target;
      const trainingOptions = button.nextElementSibling;
      if (trainingOptions.style.display === "block") {
        trainingOptions.style.display = "none";
        button.textContent = "Ver Treinamentos";
      } else {
        trainingOptions.style.display = "block";
        button.textContent = "Fechar Treinamentos";
      }
    }
  });

  /* ----------------------------------------
     8) Clique em um treinamento => conclui e re-render
  ---------------------------------------- */
  document.addEventListener("click", function(event) {
    if (event.target.classList.contains("training-button")) {
      const btn = event.target;
      const trainingName = btn.getAttribute("data-training");
      const moduleTitle = btn.getAttribute("data-module");
      const link = btn.getAttribute("data-link");

      // Marca como concluído se não estiver salvo
      if (!completedTrainings.includes(trainingName)) {
        completedTrainings.push(trainingName);
        localStorage.setItem("completedTrainings", JSON.stringify(completedTrainings));
      }

      // Re-renderiza com o termo de busca atual
      const term = searchInput.value.toLowerCase();
      renderCarousel(trainingTypes, term);
      showSlide(currentSlide);

      // Atualiza a barra de progresso do módulo
      atualizarProgresso(moduleTitle);

      // Redireciona
      setTimeout(() => {
        if (link !== "#") {
          window.location.href = link;
        }
      }, 200);
    }
  });

  /* ----------------------------------------
     9) Filtro de busca
  ---------------------------------------- */
  if (searchInput) {
    searchInput.addEventListener("input", function() {
      const term = this.value.toLowerCase();
      renderCarousel(trainingTypes, term);
      showSlide(0);
    });
  }
});


/* ---------------------------------------------------
   2) SEÇÃO DE FAQs (com paginação)
--------------------------------------------------- */
const faqItems = Array.from(document.querySelectorAll(".faq-item"));
let currentPageFAQ = 1;
const itemsPerPage = 4; // Exemplo de quantas FAQs por página

function renderFAQs(page = 1, filteredFAQs = faqItems) {
  const start = (page - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  faqItems.forEach(f => f.style.display = "none");
  filteredFAQs.forEach((f, i) => {
    if (i >= start && i < end) {
      f.style.display = "block";
    }
  });
  renderPagination(filteredFAQs, page);
  currentPageFAQ = page;
}

function renderPagination(filteredFAQs, currentPage) {
  const paginationContainer = document.getElementById("pagination-numbers");
  if (!paginationContainer) return; // se não existir
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
  // Se existirem os botões "prev-btn-faq" e "next-btn-faq", atualiza
  const prevFaqBtn = document.getElementById("prev-btn-faq");
  const nextFaqBtn = document.getElementById("next-btn-faq");
  if (prevFaqBtn) prevFaqBtn.disabled = currentPage === 1;
  if (nextFaqBtn) nextFaqBtn.disabled = currentPage === totalPages;
}

// Clique para abrir/fechar FAQ
faqItems.forEach(item => {
  const question = item.querySelector(".faq-question");
  const answer = item.querySelector(".faq-answer");
  question.addEventListener("click", () => {
    item.classList.toggle("open");
    answer.style.display = item.classList.contains("open") ? "block" : "none";
  });
});

// Filtro de FAQs (se quiser usar)
function filterFAQs(searchTerm) {
  const filtered = faqItems.filter(item => {
    const q = item.querySelector(".faq-question").textContent.toLowerCase();
    const a = item.querySelector(".faq-answer").textContent.toLowerCase();
    const match = q.includes(searchTerm) || a.includes(searchTerm);
    item.classList.toggle("open", match);
    item.querySelector(".faq-answer").style.display = match ? "block" : "none";
    return match;
  });
  renderFAQs(1, filtered);
  return filtered;
}

function closeAllFAQs() {
  faqItems.forEach(i => {
    i.classList.remove("open");
    i.querySelector(".faq-answer").style.display = "none";
  });
}

// Renderiza as FAQs inicialmente
renderFAQs();

// Botões de navegação de FAQ (se existirem)
const prevBtnFaq = document.getElementById("prev-btn-faq");
const nextBtnFaq = document.getElementById("next-btn-faq");
if (prevBtnFaq) {
  prevBtnFaq.addEventListener("click", () => {
    if (currentPageFAQ > 1) {
      renderFAQs(currentPageFAQ - 1);
    }
  });
}
if (nextBtnFaq) {
  nextBtnFaq.addEventListener("click", () => {
    const filtered = faqItems;
    if (currentPageFAQ < Math.ceil(filtered.length / itemsPerPage)) {
      renderFAQs(currentPageFAQ + 1, filtered);
    }
  });
}
