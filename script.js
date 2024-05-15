document.addEventListener("DOMContentLoaded", function() {

    document.getElementById("año").innerText = new Date().getFullYear();
    let productos = [];
    tarjetaProducto = document.querySelector('#productos .productos');

    const obtenerProductos = () => {
        fetch("productos.json")
            .then(res => res.json())
            .then(data => {
                productos = [...data.productos];
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
            })
            .catch(error => console.log("Hubo un error",error));
    }
    obtenerProductos();
});
