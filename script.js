function scrollToSection(id) {
    document.getElementById(id).scrollIntoView({
        behavior: "smooth"
    });
}

function sendMessage(event) {
    event.preventDefault();
    document.getElementById("success-message").innerText =
        "Message sent successfully!";
}
