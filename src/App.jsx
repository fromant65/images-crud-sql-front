import { useEffect, useState } from "react";
import "./App.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";

const serverURL = "http://localhost:3000";

function App() {
  const [imgName, setImgName] = useState("");
  const [imagen, setImagen] = useState(null);
  const [images, setImages] = useState(null);

  useEffect(() => {
    const fetchImages = async () => {
      let res = await fetch(serverURL);
      let data = await res.json();
      setImages(data);
    };
    fetchImages();
  }, []);

  function handleImagenSeleccionada(e) {
    const archivo = e.target.files[0];
    console.log(archivo);
    setImagen(archivo);
  }

  function uploadImage(e) {
    e.preventDefault();
    if (!imagen || !imgName) {
      alert(
        `Aun debe ingresar los siguientes datos: ${!imagen ? "\nArchivo" : ""}${
          !imgName ? "\nNombre" : ""
        }`
      );
      return;
    }
    const formData = new FormData();
    formData.append("nombre", imgName);
    formData.append("imagen", imagen);
    //console.log(formData.forEach((entry) => console.log(entry)));
    fetch(serverURL, {
      method: "POST",
      body: formData,
    })
      .then((res) => res.json())
      .then((data) => {
        window.location.reload();
      });
  }

  function manageDeleteImg(e) {
    const imgName = e.target.getAttribute("name");
    const deleteImg = async () => {
      console.log(imgName);
      const res = await fetch(serverURL + "/delete", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nombre: imgName,
        }),
      });
      const data = await res.json();
      console.log(data);
    };
    deleteImg();
  }

  return (
    <div className="App">
      <form className="form" action="" onSubmit={(e) => uploadImage(e)}>
        <input
          type="text"
          value={imgName}
          onChange={(e) => setImgName(e.target.value)}
          placeholder="Nombre de la imágen"
        />
        <div className="input-wrapper">
          <input
            type="file"
            id="file-input"
            onChange={handleImagenSeleccionada}
          />
          <label htmlFor="file-input" className="archivo">
            <b>Seleccionar Archivo:</b> {imagen && imagen.name}
          </label>
        </div>

        <button type="submit">Subir archivo</button>
      </form>
      <div className="gallery">
        <div className="gallery-title">Imágenes</div>
        <div className="gallery-container">
          {images &&
            images.map((item, key) => {
              let imgUrl = item.imagen;
              let nombre = item.nombre;
              return (
                <div key={key} className="gallery-item-container">
                  <div className="image-container">
                    <img src={imgUrl} alt="img" />
                  </div>
                  <div
                    className="delete-img"
                    name={nombre}
                    onClick={(e) => manageDeleteImg(e)}
                  >
                    <FontAwesomeIcon
                      icon={faTrash}
                      className="trash-icon"
                    ></FontAwesomeIcon>
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
}

export default App;
