const express = require('express');
const cors = require('cors');
const ytdl = require('ytdl-core');
const app = express();

// Permite que seu site IronMusic converse com esse servidor
app.use(cors());

// Rota principal para testar se está vivo
app.get('/', (req, res) => {
    res.send('Servidor IronMusic está ON! 🎸');
});

// Rota mágica que toca a música
// Uso: https://seu-servidor.onrender.com/stream?url=LINK_DO_YOUTUBE
app.get('/stream', async (req, res) => {
    try {
        const videoUrl = req.query.url;
        
        if (!videoUrl || !ytdl.validateURL(videoUrl)) {
            return res.status(400).send('URL inválida');
        }

        // Pega informações do vídeo
        const info = await ytdl.getInfo(videoUrl);
        
        // Escolhe o melhor formato de áudio (mp3/webm)
        const format = ytdl.chooseFormat(info.formats, { 
            quality: 'highestaudio',
            filter: 'audioonly' 
        });

        // Configura o cabeçalho para o navegador entender que é música
        res.header('Content-Type', 'audio/mpeg');
        
        // Faz o streaming do áudio direto para o seu app
        ytdl(videoUrl, { format: format }).pipe(res);

    } catch (error) {
        console.error("Erro no stream:", error);
        res.status(500).send('Erro ao processar áudio');
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});