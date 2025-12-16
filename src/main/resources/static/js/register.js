const registerForm = document.getElementById("registerForm");

if (registerForm) {
    registerForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const nombre = document.getElementById("nombre").value;
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;

        try {
            const response = await fetch(`${API_AUTH}/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ nombre, email, password })
            });

            if (response.ok) {
                alert("Registro exitoso. Ahora inicia sesión.");
                window.location.href = "index.html";
            } else {
                const msg = await response.text();
                alert("Error: " + msg);
            }
        } catch (error) {
            console.error(error);
            alert("Error de conexión");
        }
    });
}