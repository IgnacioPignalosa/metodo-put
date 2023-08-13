document.addEventListener('DOMContentLoaded', function () {
    const enviarBtn = document.getElementById('enviarDatos');
    const listaAlumnos = document.getElementById('listaAlumnos');
  
    cargarDatos();
  
    enviarBtn.addEventListener('click', function () {
      const nombre = document.getElementById('alumno').value;
      const grupo = document.getElementById('grupo').value;
      const subgrupo = document.getElementById('subgrupo').value;
  
      if (nombre === '' || grupo === '' || subgrupo === '') {
        alert('Por favor, complete todos los campos requeridos.');
        return;
      }
  
      const data = {
        alumno: nombre,
        grupo: grupo,
        subgrupo: subgrupo,
      };
  
      enviarDatosAPI(data)
        .then(() => {
          alert('¡Mensaje enviado con éxito!');
          cargarDatos();
        })
        .catch(error => {
          console.error('Error al enviar el mensaje:', error);
          alert('Ocurrió un error al enviar el mensaje.');
        });
    });
  
    function cargarDatos() {
      obtenerDatosDeAPI()
        .then(datosObtenidos => {
          mostrarDatosEnLista(datosObtenidos);
        });
    }
  
    function mostrarDatosEnLista(datos) {
      listaAlumnos.innerHTML = '';
  
      datos.forEach((alumno, index) => {
        if (index === 0) {
          // Omitir la creación del elemento de lista para el primer objeto
          return;
        }
  
        const li = document.createElement('li');
        li.className = 'list-group-item d-flex justify-content-between align-items-center';
        li.innerHTML = `
          Nombre: ${alumno.alumno}, Grupo: ${alumno.grupo}, Subgrupo: ${alumno.subgrupo}
          <button class="btn btn-danger btn-sm" data-id="${alumno._id}">Eliminar</button>
          <button class="btn btn-info btn-sm" data-id="${alumno._id}">Editar</button>`;
        asignarEventoEliminar(li.querySelector('.btn-danger'), alumno._id);
        asignarEventoEditar(li.querySelector('.btn-info'), alumno);
        listaAlumnos.appendChild(li);
      });
    }

    function asignarEventoEliminar(btnEliminar, id) {
      btnEliminar.addEventListener('click', function () {
        eliminarAlumno(id);
      });
    }

    function asignarEventoEditar(btnEditar, alumno) {
      btnEditar.addEventListener('click', function () {
        mostrarDialogoEdicion(alumno);
      });
    }
  
    function enviarDatosAPI(data) {
      return fetch('https://crudcrud.com/api/adc54d7744e946cd8ffc1851accabb6d/grupo265', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json; charset=utf-8'
        },
        body: JSON.stringify(data)
      })
      .then(response => {
        if (!response.ok) {
          throw new Error('Error en la solicitud.');
        }
        return response.json();
      });
    }
  
    function obtenerDatosDeAPI() {
      return fetch('https://crudcrud.com/api/adc54d7744e946cd8ffc1851accabb6d/grupo265')
        .then(response => {
          if (!response.ok) {
            throw new Error('Error en la solicitud.');
          }
          return response.json();
        })
        .catch(error => {
          console.error('Error al obtener los datos de la API:', error);
          return [];
        });
    }
    // Función para eliminar un alumno mediante una solicitud DELETE
    function eliminarAlumno(id) {
      fetch(`https://crudcrud.com/api/adc54d7744e946cd8ffc1851accabb6d/grupo265/${id}`, {
        method: 'DELETE',
      })
      .then(response => {
        if (!response.ok) {
        }
      })
      .then(response => {
        obtenerDatosDeAPI()
          .then(datosObtenidos => {
            // Filtrar alumnos restantes y mostrar los datos actualizados en la lista
            const alumnosRestantes = datosObtenidos.filter(alumno => alumno._id !== id);
            mostrarDatosEnLista(alumnosRestantes);
          });
      })
      .catch(error => {
        console.error('Error al eliminar el alumno:', error);
      });
    }

    //Función para editar los campos de un alumno
    function mostrarDialogoEdicion(alumno) {
      const nombre = prompt('Nuevo nombre:', alumno.alumno);
      const grupo = prompt('Nuevo grupo:', alumno.grupo);
      const subgrupo = prompt('Nuevo subgrupo:', alumno.subgrupo);
    
      //Muestra alertas que permiten editar cada campo de la lista
      if (nombre !== null && grupo !== null && subgrupo !== null) {
        const data = {
          alumno: nombre,
          grupo: grupo,
          subgrupo: subgrupo,
        };
    
        editarAlumno(alumno._id, data);
      }
    }

    // Método PUT luego de editar los campos
    function editarAlumno(id, data) {
      fetch(`https://crudcrud.com/api/adc54d7744e946cd8ffc1851accabb6d/grupo265/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json; charset=utf-8'
        },
        body: JSON.stringify(data)
      })
      .then(response => {
        if (!response.ok) {
          throw new Error('Error en la solicitud.');
        }
        return response.json();
      })
      .then(updatedAlumno => {
        cargarDatos();
      })
      .catch(error => {
        console.error('Error al editar el alumno:', error);
      });
    }
  
    // Cargar los datos iniciales al cargar la página
    obtenerDatosDeAPI()
      .then(datosObtenidos => {
        mostrarDatosEnLista(datosObtenidos);
      });
  });