document.addEventListener("DOMContentLoaded", function () {
    const courses = [
        { title: "Introdução ao Sistema", duration: "3 min", image: "https://via.placeholder.com/300", link: "#" },
        { title: "Gestão de Condomínios", duration: "10 min", image: "https://via.placeholder.com/300", link: "#" },
        { title: "Financeiro e Cobrança", duration: "20 min", image: "https://via.placeholder.com/300", link: "#" },
    ];

    const container = document.getElementById("courses-container");

    // Renderizar cursos
    courses.forEach((course) => {
        const courseElement = document.createElement("div");
        courseElement.classList.add("col-md-4", "mb-4");
        courseElement.innerHTML = `
            <div class="card course-card">
                <img src="${course.image}" alt="${course.title}" class="card-img-top">
                <div class="card-body text-center">
                    <h5 class="card-title">${course.title}</h5>
                    <p class="card-text"><i class="bi bi-clock"></i> ${course.duration}</p>
                    <a href="${course.link}" class="btn btn-primary">Iniciar</a>
                </div>
            </div>
        `;
        container.appendChild(courseElement);
    });

    // FAQ interatividade
    const faqItems = document.querySelectorAll(".faq-item");
    faqItems.forEach((item) => {
        item.querySelector(".faq-question").addEventListener("click", () => {
            item.classList.toggle("open");
        });
    });
});
