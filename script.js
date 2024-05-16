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
