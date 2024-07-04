from flask import Flask, request, jsonify

from flask_cors import CORS

import mysql.connector

from werkzeug.utils import secure_filename

import os
import time


app = Flask(__name__)
CORS(app)


class Catalogo:
    def __init__(self, host, user, password, database):
        self.conn = mysql.connector.connect(
            host = host, #cambiar por la de pythonanywhere
            user = user, #cambiar por la de pythonanywhere
            password = password, #cambiar por la de pythonanywhere
        )
        self.cursor = self.conn.cursor()

        try:
            self.cursor.execute(f"USE {database}")
        except mysql.connector.Error as err:
            if err.errno == mysql.connector.errorcode.ER_BAD_DB_ERROR:
                self.cursor.execute(f"CREATE DATABASE {database}")
                self.conn.database = database
            else:
                raise err
        
        self.cursor.execute('''CREATE TABLE IF NOT EXISTS productos (
                            id INT AUTO_INCREMENT PRIMARY KEY,
                            nombre VARCHAR(255) NOT NULL,
                            precio DECIMAL(10,2) NOT NULL,
                            imagen_url VARCHAR(255));''')
        self.conn.commit()

        self.cursor.close()

        self.cursor = self.conn.cursor(dictionary=True)

    def agregar_producto(self, nombre, precio, imagen):
        
        sql = "INSERT INTO productos(nombre,  precio, imagen_url) VALUES( %s, %s, %s)"
        valores = (nombre, precio, imagen)

        self.cursor.execute(sql, valores) #guarda los datos de valores en la consulta sql
        self.conn.commit()#confirma la operacion y guarda en la base de datos.
        return self.cursor.lastrowid #retorna el id del ultimo registro insertado
    
    def consultar_producto(self, id):
        self.cursor.execute(f"SELECT * FROM productos WHERE id = {id}")
        return self.cursor.fetchone()
    
    def modificar_producto(self, id, nuevo_nombre, nuevo_precio, nueva_imagen):
        sql = "UPDATE productos SET nombre = %s,  precio = %s, imagen_url = %s WHERE id = %s"
        valores = (nuevo_nombre,  nuevo_precio, nueva_imagen, id)
        self.cursor.execute(sql, valores)
        self.conn.commit()
        return self.cursor.rowcount > 0
    
    def listar_productos(self):
        self.cursor.execute("SELECT * FROM productos")
        productos = self.cursor.fetchall()
        return productos

    def eliminar_producto(self, id):
        self.cursor.execute(f"DELETE FROM productos WHERE id = {id}")
        self.conn.commit()
        return self.cursor.rowcount > 0

# catalogo = Catalogo('localhost', 'root', '', 'ferreteria')
catalogo = Catalogo('paradaice.mysql.pythonanywhere-services.com', 'paradaice', 'root-codoacodo', 'paradaice$ferreteria')
#catalogo = Catalogo(host='florcodo1.mysql.pythonanywhere-services.com', user='FlorCodo1', password='root-123456', database='FlorCodo1$miapp')

# ruta_destino = './static/images/'
ruta_destino = '/home/paradaice/mysite/static/images/'

@app.route("/productos", methods=["GET"])
def listar_productos():
    productos = catalogo.listar_productos()
    return jsonify(productos)

@app.route("/productos/<int:id>", methods=["GET"])
def mostrar_producto(id):
    producto = catalogo.consultar_producto(id)
    if producto:
        return jsonify(producto)
    else:
        return "Producto no encontrado", 404
    
@app.route("/productos", methods=["POST"])
def agregar_producto():
    nombre = request.form['nombre']
    precio = request.form['precio']
    imagen = request.files['image']
    nombre_imagen = ""

    nombre_imagen = secure_filename(imagen.filename)
    nombre_base, extension = os.path.splitext(nombre_imagen)
    nombre_imagen = f"{nombre_base}_{int(time.time())}{extension}"

    nuevo_id = catalogo.agregar_producto(nombre, precio, nombre_imagen)
    if nuevo_id:
        imagen.save(os.path.join(ruta_destino, nombre_imagen))
        return jsonify({"mensaje": "Producto agregado correctamente.", "id": nuevo_id, "imagen": nombre_imagen}), 201
    else:
        return jsonify({"mensaje":"Error al agregar el producto."}), 500

@app.route("/productos/<int:id>", methods=["PUT"])
def modificar_producto(id):
    producto = catalogo.consultar_producto(id)
    if not producto:
        return jsonify({"mensaje": "Producto no encontrado"}), 403
    
    nuevo_nombre = request.form.get('nombre')
    nuevo_precio = request.form.get('precio')
    nombre_imagen = producto.get("imagen_url")
    
    if 'image' in request.files:
        imagen = request.files['image']
        nombre_imagen = secure_filename(imagen.filename)
        nombre_base, extension = os.path.splitext(nombre_imagen)
        nombre_imagen = f"{nombre_base}_{int(time.time())}{extension}"
        imagen.save(os.path.join(ruta_destino, nombre_imagen))

        # Eliminar la imagen vieja
        imagen_vieja = producto.get('imagen_url')
        if imagen_vieja:
            ruta_imagen = os.path.join(ruta_destino, imagen_vieja)
            if os.path.exists(ruta_imagen):
                os.remove(ruta_imagen)

    if catalogo.modificar_producto(id, nuevo_nombre, nuevo_precio, nombre_imagen):
        return jsonify({"mensaje": "Producto Modificado"}), 200
    else:
        return jsonify({"mensaje": "Error al modificar el producto"}), 500

@app.route("/productos/<int:id>", methods=["DELETE"])
def eliminar_producto(id):
    producto = catalogo.consultar_producto(id)
    if producto:
        ruta_imagen = os.path.join(ruta_destino, producto['imagen_url'])
        if os.path.exists(ruta_imagen):
            os.remove(ruta_imagen)

        if catalogo.eliminar_producto(id):
            return jsonify({"mensaje": "Producto eliminado"}), 200
        else:
            return jsonify({"mensaje": "Error al eliminar el producto"}), 500
    else:
        return jsonify({"mensaje": "Producto no encontrado"}), 404

if __name__=='__main__':
    app.run(debug=True) 