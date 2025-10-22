@Component
public class IngresoApp {
    private final IngresoService service;
    public IngresoApp(IngresoService service) { this.service = service; }

    public IngresoResponse crear(IngresoRequest req) {
        // 1) mapear DTO → domínio
        Ingreso model = new Ingreso(null, req.getDescripcion(), req.getMonto(), req.getFecha(), req.getCategoriaId());
        // 2) regra + persistência via service
        Ingreso saved = service.crear(model);
        // 3) mapear domínio → DTO de saída
        return IngresoResponse.from(saved);
    }

    public List<IngresoResponse> listar() { return service.listar().stream().map(IngresoResponse::from).toList(); }

    public void borrar(Long id) { service.borrar(id); }
}
