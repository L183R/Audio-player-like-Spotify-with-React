import React, { useState, useEffect, useRef } from "react";

const Home = () => {
  const [indexActual, setIndexActual] = useState(0);
  const [canciones, setCanciones] = useState([]);
  const [volume, setVolume] = useState(0.5);
  const [reproduciendo, setReproduciendo] = useState(false);
  const [seguir, setSeguir] = useState(false);
  const [repetir, setRepetir] = useState(false);
  const [random, setRandom] = useState(false);
  const audioRef = useRef(null);

  function reprodicirTema(index) {
    let cancionElegida = canciones[index];
    const urlTema =
      "https://assets.breatheco.de/apis/sound/" + cancionElegida.url;
    audioRef.current.src = urlTema;
    setIndexActual(index);
    audioRef.current.play();
    setReproduciendo(true);

    if (repetir) {
      audioRef.current.onended = () => {
        reprodicirTema(index);
      };
    } else {
      audioRef.current.onended = () => {
        if (seguir) {
          let siguienteIndex = index + 1;
          if (siguienteIndex === canciones.length) {
            siguienteIndex = 0;
          }
          reprodicirTema(siguienteIndex);
        }
      };
    }
  }

  function pausarTema() {
    if (reproduciendo) {
      audioRef.current.pause();
      setReproduciendo(false);
    } else {
      reanudarTema();
    }
  }

  function seguirReproduciendo(index) {
    let cancionElegida = canciones[index];
    const urlTema =
      "https://assets.breatheco.de/apis/sound/" + cancionElegida.url;
    audioRef.current.src = urlTema;
    setIndexActual(index);
    audioRef.current.play();
    setReproduciendo(true);
    seguir ? index++ : "";
    if (siguienteIndex === canciones.length) {
      siguienteIndex = 0;
    }
    seguir
      ? (audioRef.current.onended = () => {
          seguirReproduciendo(index);
        })
      : "";
  }

  function reanudarTema() {
    audioRef.current.play();
    setReproduciendo(true);
  }

  function adelantarTema() {
    let siguienteIndex = indexActual + 1;
    if (siguienteIndex === canciones.length) {
      siguienteIndex = 0;
    }
    reprodicirTema(siguienteIndex);
  }

  function retrocederTema() {
    let anteriorIndex = indexActual - 1;
    if (anteriorIndex < 0) {
      anteriorIndex = canciones.length - 1;
    }
    reprodicirTema(anteriorIndex);
  }

  function reproducirMusica() {
    const urlTema =
      "https://www.televisiontunes.com/uploads/audio/Pac%20Man%20-%20Techno%20Remix.mp3";
    audioRef.current.src = urlTema;
    setIndexActual(Math.floor(Math.random() * canciones.length));
    audioRef.current.play();
    setReproduciendo(true);

    if (repetir) {
      audioRef.current.onended = () => {
        reprodicirTema(index);
      };
    } else {
      audioRef.current.onended = () => {
        if (seguir) {
          let siguienteIndex = index + 1;
          if (siguienteIndex === canciones.length) {
            siguienteIndex = 0;
          }
          reprodicirTema(siguienteIndex);
        }
      };
    }
  }

  function subirVolumen() {
    let vol = volume + 0.1;
    if (vol > 1) {
      vol = 1;
    }
    setVolume(vol);
    audioRef.current.volume = vol;
  }

  function bajarVolumen() {
    let vol = volume - 0.1;
    if (vol < 0) {
      vol = 0;
    }
    setVolume(vol);
    audioRef.current.volume = vol;
  }

  function ponerSeguir() {
    seguir ? setSeguir(false) : setSeguir(true);
  }

  function ponerRandom() {
    random ? setRandom(false) : setRandom(true);
  }

  useEffect(() => {
    fetch("https://assets.breatheco.de/apis/sound/songs")
      .then((response) => response.json())
      .then((data) => setCanciones(data));
  }, []);

  return (
    <>
      <nav className="navbar bg-dark d-flex sticky-top">
        <button
          type="button"
          className="btn btn-outline-dark mx-auto"
          onClick={reproducirMusica}> 
          <img src="https://www.beatmashmagazine.com/wp-content/uploads/2012/01/Music-Games.jpg"></img>
        </button>
      </nav>

      <div className="bg-dark">
        <ul>
          {canciones.map((item, index) => (
            <div className="row">
              <button
                type="button"
                className={`btn col-6 mx-auto ${
                  index === indexActual ? "btn-success" : "btn-outline-success"
                }`}
                onClick={() => reprodicirTema(index)}
                key={item.id}
              >
                {item.name}{" "}
              </button>
            </div>
          ))}
        </ul>
        <div className="bg-success text-center sticky-bottom">
          <div className="text-center row">
            <audio ref={audioRef} className="bg-info"></audio>
            
            <button
              type="button"
              className="btn btn-outline-dark col-1 me-1"
              onClick={retrocederTema}
            >
              {" "}
              Anterior{" "}
            </button>
            <button
              type="button"
              className="btn btn-outline-dark col-1 me-1"
              onClick={reproduciendo ? pausarTema : reanudarTema}
            >
              {reproduciendo ? <i className="fa fa-pause"></i> : <i className="fa fa-play"></i>}
            </button>
            <button
              type="button"
              className="btn btn-outline-dark col-1 me-1"
              onClick={adelantarTema}
            >
              {" "}
              Siguiente{" "}
            </button>
            <button
              type="button"
              className="btn btn-outline-dark col-1 me-1"
              onClick={bajarVolumen}
            >
              {" "}
              <i class="fa fa-minus"></i>{" "}
            </button>
            <button
              type="button"
              className="btn btn-outline-dark col-1 me-1"
              onClick={subirVolumen}
            >
              {" "}
              <i class="fa fa-plus"></i>{" "}
            </button>
            <button
              type="button"
              className="btn btn-outline-dark col-1 me-1"
              onClick={ponerSeguir}
            >
              {seguir ? "1 Tema" : "Seguir"}
            </button>
            <div className="col-1">
              <input type="checkbox" onChange={() => setRepetir(!repetir)} />{" "}
              Repetir
            </div>
            <button
              type="button"
              className="btn btn-outline-dark col-1 me-1"
              onClick={ponerRandom}
            >
              {random ? "RND on" : "RND off"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
