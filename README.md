# ClassBoard

ClassBoard é uma plataforma de gestão educacional desenvolvida para auxiliar professores e gestores no acompanhamento do desempenho dos alunos. O sistema oferece visualizações detalhadas das notas, evolução por período, comparativos entre disciplinas e identificação de áreas que precisam de mais atenção, tanto para alunos individuais quanto para a turma como um todo.

---

## Sumário

- [Visão Geral](#visão-geral)
- [Funcionalidades](#funcionalidades)
- [Arquitetura](#arquitetura)
- [Deployment](#deployment)
- [Desenvolvimento Local](#desenvolvimento-local)
- [Tecnologias Utilizadas](#tecnologias-utilizadas)
- [Demonstração](#demonstração)

---

## Visão Geral

O ClassBoard é uma aplicação full-stack que combina um frontend React interativo com uma API robusta em FastAPI. A plataforma está deployada em produção e oferece:

- Interface responsiva e intuitiva
- Gráficos interativos com Chart.js
- Sistema de autenticação seguro
- Análises automáticas por IA (Gemini AI)
- Relatórios em PDF exportáveis
- Gestão completa de alunos, notas e avaliações

**Aplicação em Produção**: [https://classboard-front.vercel.app](https://classboard-front.vercel.app)  
**API Backend**: [https://classboard-back-aa9y.onrender.com](https://classboard-back-aa9y.onrender.com)

---

## Funcionalidades

- **Gestão de Alunos**: Cadastro, visualização de perfis, upload em lote via Excel e filtros avançados
- **Análise de Notas**: Dashboard com gráficos interativos, visualização por matéria/bimestre/tipo de avaliação
- **Relatórios**: Geração de PDFs personalizáveis com análises detalhadas
- **Análise por IA**: Insights automáticos sobre padrões de desempenho usando Gemini AI
- **Sistema de Autenticação**: Login seguro com tokens JWT
- **Interface Responsiva**: Design moderno adaptável a qualquer dispositivo
- **Filtros Dinâmicos**: Análise personalizada por múltiplos critérios

---

## Arquitetura

```
ClassBoard/
├── react-app/                   # Frontend React
│   ├── src/
│   │   ├── components/          # Componentes reutilizáveis
│   │   ├── pages/               # Páginas da aplicação
│   │   ├── services/            # Comunicação com API
│   │   ├── hooks/               # Hooks customizados
│   │   ├── context/             # Contextos React
│   │   └── utils/               # Utilitários
│   └── build/                   # Build de produção
├── api/                         # Backend FastAPI
│   ├── routers/                 # Endpoints da API
│   ├── models/                  # Modelos Pydantic
│   ├── services/                # Lógica de negócio
│   ├── database/                # Configuração BD
│   ├── data/                    # Dados estáticos
│   └── utils/                   # Utilitários backend
└── Entregáveis/                 # Documentação do projeto
```

---

## 🚀 Deployment

### 🌐 **Produção**

- **Frontend**: Deployado no **Vercel** - [https://classboard-front.vercel.app](https://classboard-front.vercel.app)
- **Backend**: Deployado no **Render** - [https://classboard-back-aa9y.onrender.com](https://classboard-back-aa9y.onrender.com)
- **Banco de Dados**: SQLite integrado

### 🔧 **Configurações de Deploy**

**Variáveis de Ambiente (Backend):**

```bash
CORS_ORIGINS=https://classboard-front.vercel.app
SECRET_KEY=your-secret-key
```

**Variáveis de Ambiente (Frontend):**

```bash
REACT_APP_GEMINI_API_KEY=your-gemini-api-key
```

---

## 💻 Desenvolvimento Local

### 📋 **Pré-requisitos**

- Node.js 16+
- Python 3.8+
- Git

### 🎨 **Frontend (React)**

1. **Clone e instale dependências:**

   ```bash
   git clone https://github.com/LevoratoJoao/ClassBoard.git
   cd ClassBoard/react-app
   npm install
   ```

2. **Configure variáveis de ambiente:**

   ```bash
   # Crie .env na pasta react-app
   REACT_APP_GEMINI_API_KEY=your-api-key
   ```

3. **Execute o projeto:**
   ```bash
   npm start
   ```
4. **Acesse:** `http://localhost:3000`

### 🔧 **Backend (FastAPI)**

1. **Navegue para a pasta da API:**

   ```bash
   cd api
   ```

2. **Crie ambiente virtual:**

   ```bash
   python -m venv .venv

   # Windows
   .venv\Scripts\activate

   # macOS/Linux
   source .venv/bin/activate
   ```

3. **Instale dependências:**

   ```bash
   pip install -r requirements.txt
   ```

4. **Configure variáveis de ambiente:**

   ```bash
   # Crie .env na pasta api
   CORS_ORIGINS=http://localhost:3000
   SECRET_KEY=your-secret-key
   ```

5. **Execute a API:**

   ```bash
   uvicorn main:app --reload --host 0.0.0.0 --port 8000
   ```

6. **Acesse a documentação:** `http://localhost:8000/docs`

---

## Tecnologias Utilizadas

### Frontend

- **React** — Interface dinâmica
- **Chart.js & react-chartjs-2** — Gráficos interativos
- **JavaScript (ES6+)** — Linguagem principal
- **CSS3** — Estilização
- **Gemini AI** — Análises inteligentes

### Backend

- **FastAPI** (Python) — API REST
- **Pydantic** — Modelagem e validação
- **SQLite** — Banco de dados
- **Uvicorn** — ASGI server

### Deploy

- **Vercel** — Hospedagem frontend
- **Render** — Hospedagem backend

---

## Demonstração

[Slides](https://www.canva.com/design/DAG6GGgSurM/58BZgw-dgertquPA-r_M-g/view?utm_content=DAG6GGgSurM&utm_campaign=designshare&utm_medium=link2&utm_source=uniquelinks&utlId=hd739151728)

https://github.com/user-attachments/assets/173bd27c-e6c1-4e43-be6e-b2c24745f540

**Desenvolvido por**

- [@LevoratoJoao](https://github.com/LevoratoJoao)
- [@Sefora-Davanso](https://github.com/Sefora-Davanso)
- [@ThiagoCristovao](https://github.com/ThiagoCristovao)
