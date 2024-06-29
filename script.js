document.addEventListener("DOMContentLoaded", function() {
    console.log("DOM completamente cargado y analizado.");
    document.getElementById("año").innerText = new Date().getFullYear();
    
    let productos = [];
    let productosDestacados = [];
    let tarjetaProducto = document.querySelector('#productos .productos');
    let tarjetaProductoDestacado = document.querySelector('#productos-destacados .productos');

    console.log("Elementos del DOM:", {
        tarjetaProducto,
        tarjetaProductoDestacado
    });

    const obtenerProductos = async () => {
        try {
            const response = await fetch("http://127.0.0.1:5000/productos");
            if (!response.ok) {
                throw new Error(`Error en la respuesta: ${response.status}`);
            }
            const data = await response.json();
            console.log("Datos obtenidos:", data);

            productos = [...data];
            console.log("Productos:", productos);

            // Obtener 3 índices únicos
            let indexSet = new Set();
            while (indexSet.size < 3) {
                indexSet.add(Math.floor(Math.random() * productos.length));
            }
            let indices = Array.from(indexSet);
            productosDestacados = indices.map(i => productos[i]);
            console.log("Productos destacados:", productosDestacados);
            
            if (tarjetaProductoDestacado) {
                productosDestacados.forEach(producto => {
                    tarjetaProductoDestacado.innerHTML += `
                        <div class="producto">
                            <img src="./static/images/${producto.imagen_url}" alt="${producto.nombre}">
                            <h3>${producto.nombre}</h3>
                            <p>Precio: $${producto.precio}</p>
                            <a href="producto.html?id=${producto.id}" class="boton">Ver detalles</a>
                        </div>
                    `;
                });
            } else {
                console.log("tarjetaProductoDestacado no encontrado");
            }

            if (tarjetaProducto) {
                productos.forEach(producto => {
                    tarjetaProducto.innerHTML += `
                        <div class="producto">
                            <img src="./static/images/${producto.imagen_url}" alt="${producto.nombre}">
                            <h3>${producto.nombre}</h3>
                            <p>Precio: $${producto.precio}</p>
                            <a href="producto.html?id=${producto.id}" class="boton">Ver detalles</a>
                        </div>
                    `;
                });
            } else {
                console.log("tarjetaProducto no encontrado");
            }
        } catch (error) {
            console.log("Hubo un error", error);
        }
    }

    obtenerProductos();
});




document.addEventListener('DOMContentLoaded', (event) => {
    function validateForm(event) {
        event.preventDefault();
        
        const form = document.querySelector('#contactoForm');
            const inputs = form.querySelectorAll('.control');
        let isValid = true;

        var mensajeDiv = document.querySelector('#requisitos')
        setTimeout(function() {
            mensajeDiv.style.display = 'none';
        }, 7000);
        mensajeDiv.innerHTML = '';
        mensajeDiv.style.display = 'none';
        
        var emailInput = document.querySelector('#email').value;

        if (emailInput.trim() !== '') {
            
            if (emailInput.endsWith('@gmail.com')) {
                console.log('El correo electrónico termina en @gmail.com.');
            } else {
                var parrafo = document.createElement('p');
    
                parrafo.textContent = '• El correo electrónico no termina en @gmail.com.';
                mensajeDiv.appendChild(parrafo);
    
                mensajeDiv.style.display = 'block';
    
                formularioValido = false;

            }
        }

        var passwordInput = document.querySelector('#password').value;
        var repasswordInput = document.querySelector('#repassword').value;
        
        if (passwordInput.trim() !== '') {
            if (passwordInput.length < 8 || passwordInput.length > 16) {
                var parrafo = document.createElement('p');
    
                parrafo.textContent = '• La contraseña debe tener entre 8 y 16 caracteres.';
                mensajeDiv.appendChild(parrafo);
    
                mensajeDiv.style.display = 'block';
    
                formularioValido = false;
            }
    
            if (passwordInput !== repasswordInput) {
                var parrafo = document.createElement('p');
    
                parrafo.textContent = '• Las contraseñas deben coincidir';
                mensajeDiv.appendChild(parrafo);
    
                mensajeDiv.style.display = 'block';
    
                formularioValido = false;
            }
        } 

        for (var i = 0; i < inputs.length; i++) {
            if (inputs[i].value.trim() === '') {
                var parrafo = document.createElement('p');
                
                var msjerror = inputs[i].placeholder;
                
                parrafo.textContent = '• ' + msjerror;
                mensajeDiv.appendChild(parrafo);
    
                // Mostrar el div de mensaje
                mensajeDiv.style.display = 'block';
    
                // Cambiar el estado del formulario a no válido
                formularioValido = false;
                
            }
        }

        if (isValid) {
            alert('Formulario válido!');
            
        }
        
    }   

    const submitButton = document.querySelector('#submitButton');
    submitButton.addEventListener('click', validateForm);
});



