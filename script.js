// Auto-update year in footer
document.addEventListener("DOMContentLoaded", () => {
  const year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();
});

// Contact form: mailto fallback (no backend required)
function mailtoFallback(e) {
  e.preventDefault();

  const name = document.getElementById("name")?.value?.trim() || "";
  const email = document.getElementById("email")?.value?.trim() || "";
  const msg = document.getElementById("msg")?.value?.trim() || "";

  const sent = document.getElementById("sent");
  if (sent) sent.textContent = "Opening your email app…";

  // ✅ Change this to your real email
  const to = "your.email@example.com";

  const subject = encodeURIComponent(`Portfolio message from ${name || "Visitor"}`);
  const body = encodeURIComponent(
    `Name: ${name}\nEmail: ${email}\n\nMessage:\n${msg}\n`
  );

  // Open mail client
  window.location.href = `mailto:${to}?subject=${subject}&body=${body}`;

  // Optional: clear form + better feedback
  setTimeout(() => {
    if (e.target && typeof e.target.reset === "function") e.target.reset();
    if (sent) sent.textContent = "Draft created — hit send in your email app.";
  }, 700);

  return false;
}
