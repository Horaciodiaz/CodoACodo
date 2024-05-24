document.addEventListener("DOMContentLoaded", function() {

    document.getElementById("año").innerText = new Date().getFullYear();
    let productos = [];
    let productosDestacados = [];
    let tarjetaProducto = document.querySelector('#productos .productos');
    let tarjetaProductoDestacado = document.querySelector('#productos-destacados .productos');

    const obtenerProductos = () => {
        fetch("productos.json")
            .then(res => res.json())
            .then(data => {
                productos = [...data.productos];
                let index = [];
                for(let i = 0; i < 3; i++) {
                    index.push(Math.floor(Math.random() * data.productos.length));
                }
                productosDestacados = index.map(i => productos[i]);
                if(!tarjetaProducto){
                    productosDestacados.map(producto => {
                        console.log(tarjetaProductoDestacado)
                        tarjetaProductoDestacado.innerHTML += `
                        <div class="producto">
                                <img src="${producto.img}" alt="${producto.nombre}">
                                <h3>${producto.nombre}</h3>
                                <p>Precio: $${producto.precio}</p>
                                <a href="#" class="boton">Ver detalles</a>
                            </div>
                        `;
                    });
                }
                else{
                    productos.map(producto => {
                        tarjetaProducto.innerHTML += `
                            <div class="producto">
                                <img src="${producto.img}" alt="${producto.nombre}">
                                <h3>${producto.nombre}</h3>
                                <p>Precio: $${producto.precio}</p>
                                <a href="#" class="boton">Ver detalles</a>
                            </div>
                        `;
                    });
                }

            })
            .catch(error => console.log("Hubo un error",error));
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



