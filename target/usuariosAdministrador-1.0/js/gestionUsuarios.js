document.addEventListener('DOMContentLoaded', cargarUsuarios);

// Función para cargar usuarios de la base de datos
function cargarUsuarios() {
    fetch('/proyecto_final_v2/GestionUsuariosServlet')
            .then(response => response.json())
            .then(usuarios => {
                const tbody = document.querySelector('#usuariosTable tbody');
                tbody.innerHTML = '';

                usuarios.forEach(usuario => {
                    const fechaFormateada = new Date(usuario.fechaNacimiento).toISOString().split('T')[0];
                    const row = document.createElement('tr');
                    row.innerHTML = `
          <td>${usuario.id}</td>
          <td>${usuario.nombre}</td>
          <td>${usuario.apellido}</td>
          <td>${usuario.email}</td>
          <td>${usuario.password}</td>
          <td>${fechaFormateada}</td>
          <td>${usuario.pais}</td>
          <td>
            <button class="btn btn-primary btn-sm" onclick="mostrarModificarModal(${usuario.id})" data-bs-toggle="modal" data-bs-target="#modificarUsuarioModal">Modificar</button>
            <button class="btn btn-danger btn-sm" onclick="eliminarUsuario(${usuario.id})">Eliminar</button>
          </td>
        `;
                    tbody.appendChild(row);
                });
            })
            .catch(error => {
                console.error('Error al cargar usuarios:', error);
                // Mostrar mensaje de error al usuario
            });
}

// Función para eliminar un usuario
function eliminarUsuario(idUsuario) {
    if (!confirm('¿Estás seguro de que quieres eliminar este usuario? Esta acción es irreversible.')) {
        return; // Cancelar la eliminación si el usuario no confirma
    }
    fetch('/proyecto_final_v2/GestionUsuariosServlet?id=' + idUsuario, {
        method: 'DELETE'
    })
            .then(response => response.json())
            .then(resultado => {
                if (resultado.exito) {
                    // Usuario eliminado correctamente
                    alert('Usuario eliminado correctamente');
                    cargarUsuarios(); // Recargar la tabla de usuarios
                } else {
                    // Error al eliminar el usuario
                    console.error('Error al eliminar el usuario:', resultado.mensajeError);
                    alert('Error al eliminar el usuario: ' + resultado.mensajeError); // Mostrar mensaje al usuario
                }
            })
            .catch(error => {
                console.error('Error en la petición:', error);
            });
}
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


function cargarDatosEnFormulario(usuario) {
    const form = document.getElementById('modificarUsuarioForm');
    const fechaFormateada = new Date(usuario.fechaNacimiento).toISOString().split('T')[0];
    // Asignar valores a los campos del formulario
    form.usuarioId.value = usuario.id;
    form.nombre.value = usuario.nombre;
    form.apellido.value = usuario.apellido;
    form.email.value = usuario.email;
    form.password.value = usuario.password; // Considerar manejo seguro de contraseñas
    form.fechaNacimiento.value = fechaFormateada;
    form.pais.value = usuario.pais;
}


function mostrarModificarModal(id) {
    console.log("Cargo usuarios al modal")
    fetch(`/proyecto_final_v2/GestionUsuariosServlet?id=${id}`)
            .then(response => response.json())
            .then(usuario => {
                const modal = new bootstrap.Modal(document.getElementById('modificarUsuarioModal'));
                console.log(modal);
                const form = document.getElementById('modificarUsuarioForm');
                form.reset(); // Limpiar campos del formulario

                // Cargar datos del usuario en el formulario
                cargarDatosEnFormulario(usuario);

                modal.show();
            })
            .catch(error => {
                console.error('Error al obtener datos del usuario:', error);
                modal.close();
                // Mostrar mensaje de error al usuario
            });

}

/////////////////////////////////////////////////

const modificarUsuarioForm = document.getElementById('modificarUsuarioForm');
modificarUsuarioForm.addEventListener('submit', function(event) {
  event.preventDefault(); // Prevent default form submission

  // Get form data (consider using FormData object for easier handling)
  const formData = new FormData(modificarUsuarioForm);
  const id = formData.get('id');
  const nombre = formData.get('nombre');
  const apellido = formData.get('apellido');
  const email = formData.get('email');
  const password = formData.get('password'); // Handle password securely (avoid storing plain text)
  const fechaNacimiento = formData.get('fechaNacimiento');
  const pais = formData.get('pais');

  // Make an asynchronous request to update the user data (using Fetch API)
  fetch(`/proyecto_final_v2/GestionUsuariosServlet?id=${id}`, {
    method: 'PUT',
    body: JSON.stringify({
      id,
      nombre,
      apellido,
      email,
      password, // Handle password securely (hashing)
      fechaNacimiento,
      pais,
    }),
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then(response => response.json())
    .then(resultado => {
      if (resultado.exito) {
        alert('Usuario actualizado correctamente');
        // Close the modal (assuming you want to close it after successful update)
        const modal = document.getElementById('modificarUsuarioModal');
        const modalInstance = new bootstrap.Modal(modal);
        modalInstance.hide();
        // Optionally, reload the user table to reflect the changes
        cargarUsuarios();
      } else {
        alert('Error al actualizar el usuario: ' + resultado.mensajeError);
      }
    })
    .catch(error => {
      console.error('Error al actualizar el usuario:', error);
      alert('Error al actualizar el usuario');
    });
});