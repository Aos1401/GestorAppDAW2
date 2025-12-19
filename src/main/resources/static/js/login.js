const loginForm = document.getElementById("loginForm");

if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;

        try {
            const response = await fetch(`${API_AUTH}/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password })
            });

            if (response.ok) {
                const user = await response.json();
                sessionStorage.setItem("user", JSON.stringify(user));
                window.location.href = "app.html";
            } else {
                alert("Usuario o contraseña incorrectos");
            }
        } catch (error) {
            console.error(error);
            alert("Error de conexión con el servidor");
        }
    });
}