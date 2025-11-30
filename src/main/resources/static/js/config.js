// URLs da API
const API_GASTOS = "http://localhost:8081/gastos";
const API_INGRESOS = "http://localhost:8081/ingresos";

// helpers
const $ = (sel) => document.querySelector(sel);
const fmt = (num) => (Number(num) || 0).toFixed(2);

// gráfico (Chart.js)
let grafico = null;

// estado global de upload
let uploadMeta = { tipo: null, id: null, origin: null };

// caches para "Últimos movimientos"
let ingresosCache = [];
let gastosCache = [];
