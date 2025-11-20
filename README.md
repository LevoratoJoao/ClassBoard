# ClassBoard

ClassBoard é uma plataforma de gestão educacional desenvolvida para auxiliar professores e gestores no acompanhamento do desempenho dos alunos. O sistema oferece visualizações detalhadas das notas, evolução por período, comparativos entre disciplinas e identificação de áreas que precisam de mais atenção, tanto para alunos individuais quanto para a turma como um todo.

---

## Sumário

- [Visão Geral](#visão-geral)
- [Funcionalidades](#funcionalidades)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Como Executar](#como-executar)
- [Tecnologias Utilizadas](#tecnologias-utilizadas)
- [Doc API](./api/README.md)
- [Demonstração](#demonstracão)

---

## Visão Geral

O ClassBoard foi pensado para facilitar o acompanhamento pedagógico, trazendo gráficos interativos, filtros inteligentes e análises automáticas (IA) sobre o desempenho dos alunos. O projeto está dividido em duas implementações principais:

* **Bootstrap**: Versão estática, ideal para prototipação rápida e visualização inicial.
* **React**: Versão dinâmica, com componentes reutilizáveis e integração facilitada com novas funcionalidades.
* **API (FastAPI)**: Fornece os dados para o frontend (alunos, faltas, matérias e turma), já agregando informações como **média por matéria** e **frequência por matéria** por aluno.

---

## Funcionalidades

* Visualização de notas por matéria, bimestre e tipo de avaliação
* Evolução das notas ao longo dos períodos
* Comparativo entre alunos e entre turmas
* Filtros dinâmicos para análise personalizada
* Análise automática de desempenho via IA
* Relatórios exportáveis

---

## Estrutura do Projeto

```
ClassBoard/
├── Bootstrap/
│   ├── src/
│   │   ├── charts.js
│   │   ├── aiAnalysis.js
│   │   ├── services/
│   │   └── data/
│   ├── static/
├── api/
│   ├── data/
│   ├── models/
│   ├── routers/
│   └── main.py
├── react-app/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── assets/
│   │   ├── hooks/
│   ├── public/
│   └── package.json
└── README.md
```

---

## Como Executar (Frontend)

Ambos projetos precisam do Node.js instalado (recomenda-se **Node 16+**).

### Bootstrap

1. Instale as dependências (se necessário):

   ```bash
   cd Bootstrap
   npm install
   ```
2. Suba um servidor estático:

   ```bash
   npx http-server ./static
   # ou
   python -m http.server 8080
   ```
3. Acesse `http://127.0.0.1:8080/Materias/listagem.html`.

### React

1. Instale as dependências:

   ```bash
   cd react-app
   npm install
   ```
2. Execute o projeto:

   ```bash
   npm start
   ```
3. Acesse `http://localhost:3000`.

---

## API (FastAPI)

A API do ClassBoard é construída em **FastAPI** e fornece os dados que abastecem o frontend (React e Bootstrap). Ela organiza o domínio escolar em **recursos** (alunos, avaliações, notas, faltas, matérias e turma), aplicando **validação com Pydantic**, **roteamento modular**, **CORS** e um fluxo simples de **autenticação**.

### Padrões de projeto

* **Dados estáticos** em `api/data/*`.
* **Lógica de agregação/normalização** nos `routers`, nunca em `data`.
* **Modelos Pydantic** como contrato de I/O.
* **Enums** para domínios fechados.
* **CORS** liberado para `http://localhost:3000`.
* **Autenticação** (quando habilitada) baseada em token Bearer; o frontend redireciona a `/login` em `401`.

###  Endpoints

* **Alunos**

  * `GET /alunos` — lista alunos.
  * `GET /alunos/{id}` — detalhe.
  * `GET /alunos/filter?sexo=feminino` — filtro por sexo.

* **Avaliações**

  * `GET /avaliacoes` — lista.
  * `GET /avaliacoes/filter?materia=Matematica&tipo=Prova&bimestre=1` — filtros combináveis.

* **Notas**

  * `GET /notas` — lista.
  * `GET /notas/{aluno_id}` — notas de um aluno.
  * `GET /notas/filter?...` — filtros por matéria/tipo/bimestre/aluno.

* **Faltas**

  * `GET /faltas` — todas.
  * `GET /faltas/{aluno_id}` — faltas de um aluno.
  * `GET /faltas/{aluno_id}/total` — total de faltas do aluno.

* **Matérias**

  * `GET /materias` — `[{ id, label }]`.

* **Turma**

  * `GET /turma` — resumo (id, nome, turno).
  * `GET /turma/{id}` — detalhe com `materias` e `alunos` **enriquecidos** (ex.: média por matéria, frequência por matéria, faltas).

### Autenticação e CORS

* O backend pode proteger endpoints com Bearer Token.
* O **frontend** (`apiService`) injeta o header `Authorization: Bearer <token>` e, ao receber **401**, limpa o token e redireciona para `/login`.
* **CORS** permite chamadas do `http://localhost:3000` (ajuste `allow_origins` para o domínio de produção).

### Integração com o Frontend

* O front centraliza chamadas em `src/services/apiService.js`.
* Services por domínio chamam os endpoints (ex.: `alunosAPI`, `notasAPI`, `avaliacoesAPI`, `faltasAPI`, `materiasAPI`, `turmasAPI`).

### Instalação e Execução

1. Crie e ative um ambiente virtual:

   ```bash
   cd api
   python -m venv .venv
   # Windows:
   .venv\Scripts\activate
   # macOS/Linux:
   source .venv/bin/activate
   ```
2. Instale dependências:

   ```bash
   pip install -r requirements.txt
   ```
3. Rode a API:

   ```bash
   uvicorn main:app --reload --host 0.0.0.0 --port 8000
   ```

---

## Tecnologias Utilizadas

* **FastAPI** (Python) — API
* **Pydantic** — Modelagem e validação
* **Uvicorn** — ASGI server
* **Bootstrap 5** — Estilização
* **React** — Interface dinâmica
* **Chart.js & react-chartjs-2** — Gráficos interativos
* **JavaScript (ES6+)**
* **HTML5 & CSS3**

---

## Demonstracão

[Slides](https://www.canva.com/design/DAG24xqtQ0M/7_ae-hd8f10SjqzLPgbiEg/view?utm_content=DAG24xqtQ0M&utm_campaign=designshare&utm_medium=link2&utm_source=uniquelinks&utlId=h58df531d81)

https://github.com/user-attachments/assets/173bd27c-e6c1-4e43-be6e-b2c24745f540

**Desenvolvido por**

* [@LevoratoJoao](https://github.com/LevoratoJoao)
* [@Sefora-Davanso](https://github.com/Sefora-Davanso)
* [@ThiagoCristovao](https://github.com/ThiagoCristovao)
