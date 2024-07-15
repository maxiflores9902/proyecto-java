package dao;
import conexion.ConexionDB;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
public class UserDao {
    public boolean validarUsuario(String email, String password) {
        boolean validar = false;
        String sql = "SELECT * FROM registroUsuarios WHERE email = ? AND password = ?";
        System.out.println(email);
        System.out.println(password);
        try {
            Connection conexion = ConexionDB.obtenerConexion();
            PreparedStatement consulta = conexion.prepareStatement(sql);
            consulta.setString(1, email);
            consulta.setString(2, password);
            ResultSet resultado = consulta.executeQuery();
            validar = resultado.next();
        } catch (SQLException e) {
            e.printStackTrace();
        }
        System.out.println(validar);
        return validar;
    }
}
