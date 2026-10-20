
const contactForm = document.getElementById("contactForm");
const formStatus = document.getElementById("formStatus");

contactForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    const submitButton = contactForm.querySelector(
        'button[type="submit"]'
    );

    const formData = new FormData(contactForm);

    const contactData = {
        name: formData.get("name"),
        email: formData.get("email"),
        message: formData.get("message")
    };

    submitButton.disabled = true;
    formStatus.textContent = "Sending your message...";

    try {
        const response = await fetch(
            "http://localhost:5000/api/contact",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(contactData)
            }
        );

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message || "Submission failed.");
        }

        formStatus.textContent = result.message;
        contactForm.reset();
    } catch (error) {
        formStatus.textContent =
            "Could not send your message. Check the backend connection.";
        console.error(error);
    } finally {
        submitButton.disabled = false;
    }
});

document.addEventListener("DOMContentLoaded", () => {
    const elements = document.querySelectorAll(
        ".section-title, .about-container, .skill-card, " +
        ".education-card, .project-card, .contact-info, " +
        ".contact-form"
    );

    elements.forEach((element) => {
        element.classList.add("reveal");
    });

    if ("IntersectionObserver" in window) {
        const observer = new IntersectionObserver(
            (entries, observer) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("show");
                        observer.unobserve(entry.target);
                    }
                });
            },
            {
                threshold: 0.12
            }
        );

        elements.forEach((element) => {
            observer.observe(element);
        });
    } else {
        elements.forEach((element) => {
            element.classList.add("show");
        });
    }
});
