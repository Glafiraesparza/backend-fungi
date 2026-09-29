const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
require("dotenv").config();

const authenticateToken = require("./middleware/auth");

const app = express();
const PORT = process.env.PORT || 3001;

const especiesPath = path.join(__dirname, "../data/especies.json");

app.use(cors({
    origin: "http://localhost:5173"
}));

app.use(express.json());

app.get("/", (req, res) => {
    res.json({
        message: "Fungi Atlas Backend funcionando"
    });
});

// Obtener todas las especies
app.get("/api/especies", authenticateToken, (req, res) => {
    try {
        const data = fs.readFileSync(especiesPath, "utf8");
        const especies = JSON.parse(data);

        res.json(especies);
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Error al obtener las especies"
        });
    }
});

// Agregar una nueva especie
app.post("/api/especies", authenticateToken, (req, res) => {
    try {
        const {
            nombreComun,
            nombreCientifico,
            categoria,
            descripcion,
            imagen
        } = req.body;

        if (!nombreComun || !nombreCientifico || !categoria || !descripcion) {
            return res.status(400).json({
                message: "Faltan datos obligatorios"
            });
        }

        const data = fs.readFileSync(especiesPath, "utf8");
        const especies = JSON.parse(data);

        const nuevoId = especies.length > 0
            ? Math.max(...especies.map(especie => especie.id)) + 1
            : 1;

        const nuevaEspecie = {
            id: nuevoId,
            nombreComun,
            nombreCientifico,
            categoria,
            descripcion,
            imagen: imagen || ""
        };

        especies.push(nuevaEspecie);

        fs.writeFileSync(
            especiesPath,
            JSON.stringify(especies, null, 2)
        );

        res.status(201).json({
            message: "Especie agregada correctamente",
            especie: nuevaEspecie
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Error al agregar la especie"
        });
    }
});

app.listen(PORT, () => {
    console.log(`Backend ejecutándose en http://localhost:${PORT}`);
});