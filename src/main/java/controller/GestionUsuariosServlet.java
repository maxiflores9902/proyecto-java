package controller;
import com.fasterxml.jackson.databind.ObjectMapper;
import dao.UsuarioDAO;
import modelo.Usuario;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.List;
@WebServlet("/GestionUsuariosServlet")
public class GestionUsuariosServlet extends HttpServlet {
    private UsuarioDAO usuarioDAO;
    private ObjectMapper objectMapper;
    public GestionUsuariosServlet() {
        this.usuarioDAO = new UsuarioDAO();
        this.objectMapper = new ObjectMapper();
    }
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        String idParam = request.getParameter("id");
        if (idParam != null) {
            int id = Integer.parseInt(idParam);
            Usuario usuario = usuarioDAO.obtenerPorId(id);
            objectMapper.writeValue(response.getWriter(), usuario);
        } else {
            List<Usuario> usuarios = usuarioDAO.obtenerTodos();
            objectMapper.writeValue(response.getWriter(), usuarios);
        }
    }
    @Override
    protected void doPut(HttpServletRequest request, HttpServletResponse response) throws IOException {
        Usuario usuario = objectMapper.readValue(request.getReader(), Usuario.class);
        System.out.println("Invoco metodo DO PUT");
        boolean exito = usuarioDAO.modificar(usuario);
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        response.getWriter().write("{\"exito\": " + exito + "}");
    }
    // ---------------------------------------------- //
    @Override
    protected void doDelete(HttpServletRequest request, HttpServletResponse response) throws IOException {
        // -- Obtiene el ID del parámetro de la URL 
        int id = Integer.parseInt(request.getParameter("id"));
        boolean exito = usuarioDAO.eliminar(id);
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        response.getWriter().write("{\"exito\": " + exito + "}");
    }
}
