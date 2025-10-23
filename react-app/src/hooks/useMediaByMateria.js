import { useState, useEffect } from "react";
import { notasAPI } from "../services/apiService";

export const useMediaByMateria = (materia, tipo = null, bimestre = null) => {
    const [media, setMedia] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMedia = async () => {
            setLoading(true);
            const notas = await notasAPI.filterNotas(materia, tipo, bimestre);
            const mediaCalculada = notas.length > 0
                ? (notas.reduce((sum, nota) => sum + nota.nota, 0) / notas.length).toFixed(2)
                : null;
            setMedia(mediaCalculada);
            setLoading(false);
        };

        fetchMedia();
    }, [materia, tipo, bimestre]);

    return { media, loading };
};
