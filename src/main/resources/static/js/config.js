const API_BASE = "http://localhost:8081";
const API_GASTOS = `${API_BASE}/gastos`;
const API_INGRESOS = `${API_BASE}/ingresos`;
const API_AUTH = `${API_BASE}/auth`;
const API_FILES = `${API_BASE}/api/files`;

const $ = (sel) => document.querySelector(sel);
const fmt = (num) => (Number(num) || 0).toFixed(2);

let ingresosCache = [];
let gastosCache = [];
let grafico = null; // Instancia del gráfico

function getUsuarioId() {
    const userStr = sessionStorage.getItem("user");
    if (!userStr) return null;
    try {
        return JSON.parse(userStr).id;
    } catch (e) {
        return null;
    }
}