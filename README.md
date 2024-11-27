# API para Ordenes (Orders) 🔒

Esta API maneja el procedimiento de compra de un producto de manera simulada, ya que se realiza siempre a un mismo producto con valores estaticos.

## 🛠️ Tecnologías utilizadas

- **Node.js**: Entorno de ejecución para JavaScript.
- **Express.js**: Framework para crear el servidor y los endpoints.
- **JSON**: Almacenamiento simulado de usuarios.
- **MongoDB**: base de datos no relacional.
  
## ⚙️ Instrucciones para instalar y usar mediante archivo ZIP

1. **Descargar el proyecto como ZIP:**
   - Ve al repositorio de GitHub correspondiente.
   - Haz clic en el botón verde **Code**.
   - Selecciona **Download ZIP** y guarda el archivo en tu computadora.

2. **Extraer los archivos:**
   - Ubica el archivo ZIP descargado en tu computadora.
   - Haz clic derecho y selecciona **Extraer aquí** (debe ser una carpeta APARTE de xampp, puede ser en el escritorio mismo).

3. **Navegar al directorio del proyecto:**
   - Abre una terminal o consola de comandos.
   - ingresa a la ruta donde está el proyecto.
     ```bash
     cd ruta/del/proyecto
     ```

4. **Instalar dependencias:**
   - Asegúrate de tener **Node.js** instalado.(NECESARIOOOOOO)
   - En la terminal, ejecuta:
     ```bash
     npm install
     ```
5. **Iniciar el servidor:**
   - Para iniciar el servidor, ejecuta:
     ```bash
     node index.js
     ```
6. **Crear en "mongodb compass" la base de datos: **
   Si no tienes instalado mongodb, ingresa a este link https://www.mongodb.com/try/download/community.
   debe instalar el programa de escritorio en tu pc.
   Luego, al iniciar sesion, debes crear una nueva "Connection" llamada "orders". Aqui mismo crear una DB llamada "orders"
   
9. **Probar los endpoints:**
   - El servidor estará disponible en `http://localhost:3000`.
   - Usa herramientas como **Postman**, **Insomnia**, o cURL para interactuar con la API.
## 🚀 Endpoints disponibles

### **Usuarios (Auth)**

1. **POST http://localhost:3001/api/v1/**  
   - Registra una nueva  orden.
   - **Cuerpo del request (JSON):**  
     ```json
      {
          "user_id": "12348",
          "item_id": "67890",
          "payment": {
              "method": "Debit Card",
              "card_number": "1234567812345679",
              "valid_at": "11/24",
              "document_number": "45360092"
          },
          "discount_id": "1"
      }
     ```
   - **Respuesta:**  
     ```json
        {
            "user_id": "12348",
            "item_id": "67890",
            "discount_id": "1",
            "payment": {
                "method": "Debit Card",
                "card_number": "1234567812345679",
                "valid_at": "11/24",
                "document_number": "45360092",
                "_id": "67477d67c290f7733579dec2"
            },
            "_id": "67477d67c290f7733579dec1",
            "created_at": "2024-11-27T20:13:27.131Z",
            "updated_at": "2024-11-27T20:13:27.131Z",
            "__v": 0
        }
    ```

2. **GET http://localhost:3001/api/v1/orders/[order_id]**  
   - Obtiene la informacion de una orden en especifico segun su id.
   - **Respuesta exitosa:**  
     ```json
      {
          "_id": "67361b1d51852235ab0d8dbd",
          "user_id": "12348",
          "item_id": "67890",
          "discount_id": "1",
          "payment": {
              "method": "Debit Card",
              "card_number": "1234567812345679",
              "valid_at": "11/24",
              "document_number": "45360092",
              "_id": "67361b1d51852235ab0d8dbe"
          },
          "created_at": "2024-11-14T15:45:33.432Z",
          "updated_at": "2024-11-14T15:45:33.432Z",
          "__v": 0
      },
     ```
   - **Respuesta en caso de error:**  
     ```json
     {
       "message": "No encontrado."
     }
     ```

3. ** GET http://localhost:3001/api/v1/orders/**
      - Obtiene la informacion de todos los registros.

## 📌 Notas adicionales
- El puerto es *3001* a diferencia de la otra api. 
