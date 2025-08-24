// clase Producto que representa un producto del e-commerce
class Producto {
    constructor({ id, nombre, precio, categoria, descripcion }) {
        this.id = id;
        this.nombre = nombre;
        this.precio = precio;
        this.categoria = categoria;
        this.descripcion = descripcion;
    }

    // método para mostrar la información del producto en formato legible
    mostrarInformacion = () => {
        // Desestructuración de las propiedades
        const { id, nombre, precio, categoria, descripcion } = this;
        return `Producto: ${nombre}\nID: ${id}\nPrecio: $${precio}\nCategoría: ${categoria}\nDescripción: ${descripcion}`;
    };

    // método estático para crear un producto desde un objeto
    static crearDesdeObjeto = (obj) => new Producto(obj);
}

// lógica para manipulación del DOM y carrito

const listaProductos = document.getElementById('lista-productos');
const carritoLista = document.getElementById('carrito-lista');
let carrito = [];
let productosCargados = [];

// función para renderizar productos en el DOM
const renderizarProductos = (productos) => {
    listaProductos.innerHTML = '';
    productos.forEach((productoObj) => {
        const producto = Producto.crearDesdeObjeto(productoObj);
        const div = document.createElement('div');
        div.className = 'producto';
        div.innerHTML = `
			<img src="${productoObj.imagen}" alt="${producto.nombre}">
			<div class="producto-info">
				<h3>${producto.nombre}</h3>
				<p><strong>Precio:</strong> $${producto.precio}</p>
				<p><strong>Categoría:</strong> ${producto.categoria}</p>
				<p>${producto.descripcion}</p>
				<button data-id="${producto.id}">Agregar al carrito</button>
			</div>
		`;
        listaProductos.appendChild(div);
    });
    // asociar eventos a los botones
    document.querySelectorAll('.producto button').forEach((btn) => {
        btn.addEventListener('click', (e) => {
            const id = parseInt(e.target.getAttribute('data-id'));
            agregarAlCarrito(id);
        });
    });
};

// función para agregar producto al carrito
const agregarAlCarrito = (id) => {
    const producto = productosCargados.find((p) => p.id === id);
    if (producto) {
        carrito.push(producto);
        renderizarCarrito();
    }
};

// función para renderizar el carrito
const renderizarCarrito = () => {
    carritoLista.innerHTML = '';
    carrito.forEach((item) => {
        const li = document.createElement('li');
        li.textContent = `${item.nombre} - $${item.precio}`;
        carritoLista.appendChild(li);
    });
};

// función asíncrona para obtener productos desde la API externa
const obtenerProductosAPI = async () => {
    try {
        const respuesta = await fetch('https://api.escuelajs.co/api/v1/products?offset=0&limit=10');
        const data = await respuesta.json();
        // adaptar los datos de la API al formato esperado por Producto, incluyendo imagen
        productosCargados = data.map((item) => {
            let imagenUrl = 'https://placehold.co/100x100?text=Producto';
            if (Array.isArray(item.images) && item.images.length > 0 && typeof item.images[0] === 'string') {
                imagenUrl = item.images[0];
            }
            return {
                id: item.id,
                nombre: item.title,
                precio: item.price,
                categoria: item.category?.name || 'Sin categoría',
                descripcion: item.description,
                imagen: imagenUrl,
            };
        });
        renderizarProductos(productosCargados);
    } catch (error) {
        listaProductos.innerHTML = '<p>Error al cargar productos. Intenta nuevamente.</p>';
        console.error('Error al obtener productos:', error);
    }
};

// inicializar la interfaz obteniendo productos de la API
obtenerProductosAPI();
