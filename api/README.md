# ClassBoard API Documentation

## Overview

ClassBoard API é uma API REST desenvolvida com FastAPI para gerenciamento de dados educacionais. A API oferece endpoints para autenticação, gestão de alunos, avaliações, notas, faltas e turmas.

**Base URL:** `http://localhost:8000`
**Swagger UI:** `http://localhost:8000/docs`

## Installation

To install the required dependencies, run:

```bash
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
fastapi dev main.py
```

### Auth Endpoints

#### POST /auth/token

Realiza login e retorna token de acesso.

**Request Body:**

```json
{
  "username": "admin",
  "password": "admin123"
}
```

**Response:**

```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer"
}
```

#### GET /auth/me

Retorna informações do usuário autenticado.

**Headers:** `Authorization: Bearer <token>`

**Response:**

```json
{
  "username": "admin",
  "is_active": true
}
```

#### POST /auth/logout

Realiza logout invalidando o token.

**Headers:** `Authorization: Bearer <token>`

#### POST /auth/register

Registra novo usuário.

**Request Body:**

```json
{
  "username": "novo_usuario",
  "password": "senha123"
}
```

## Alunos

### GET /alunos

Lista todos os alunos.

**Headers:** `Authorization: Bearer <token>`

**Response:**

```json
[
  {
    "id": 0,
    "nome": "João",
    "sexo": "masculino",
    "notas": []
  }
]
```

### GET /alunos/{aluno_id}

Busca aluno por ID.

**Response:**

```json
{
  "id": 0,
  "nome": "João",
  "sexo": "masculino",
  "notas": []
}
```

### GET /alunos/filter

Filtra alunos por sexo.

**Query Parameters:**

- `sexo` (optional): "masculino", "feminino", ou "All"

### POST /alunos

Cria novo aluno.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**

```json
{
  "nome": "Novo Aluno",
  "sexo": "masculino"
}
```

## Avaliações

### GET /avaliacoes

Lista todas as avaliações.

**Headers:** `Authorization: Bearer <token>`

**Response:**

```json
[
  {
    "id": 1,
    "materia": "Matematica",
    "tipo": "Prova",
    "bimestre": 1
  }
]
```

### GET /avaliacoes/filter

Filtra avaliações por critérios.

**Headers:** `Authorization: Bearer <token>`

**Query Parameters:**

- `materia` (optional): "Matematica", "Portugues", etc.
- `tipo` (optional): "Prova", "Trabalho"
- `bimestre` (optional): 1, 2, 3, 4

## Notas

### GET /notas

Lista todas as notas.

**Headers:** `Authorization: Bearer <token>`

**Response:**

```json
[
  {
    "avaliacao": {
      "id": 1,
      "materia": "Matematica",
      "tipo": "Prova",
      "bimestre": 1
    },
    "nota": 8
  }
]
```

### POST /notas

Cria ou atualiza uma nota.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**

```json
{
  "aluno_nome": "João",
  "avaliacao_id": 1,
  "nota": 8.5
}
```

### GET /notas/filter

Filtra notas por critérios.

**Headers:** `Authorization: Bearer <token>`

**Query Parameters:**

- `materia` (optional): Nome da matéria
- `tipo` (optional): Tipo da avaliação
- `bimestre` (optional): Número do bimestre
- `aluno_id` (optional): ID do aluno

### GET /notas/{aluno_id}

Lista notas de um aluno específico.

**Headers:** `Authorization: Bearer <token>`

## Faltas

### GET /faltas

Lista todas as faltas de todos os alunos.

**Response:**

```json
[
  {
    "aluno_id": 0,
    "faltas": [
      {
        "data": "2024-03-15",
        "materia": "Matematica",
        "tipo": "Aula"
      }
    ]
  }
]
```

### GET /faltas/{aluno_id}

Lista faltas de um aluno específico.

**Response:**

```json
[
  {
    "data": "2024-03-15",
    "materia": "Matematica",
    "tipo": "Aula"
  }
]
```

### GET /faltas/{aluno_id}/total

Retorna total de faltas de um aluno.

**Response:**

```json
{
  "aluno_id": 0,
  "total_faltas": 3
}
```

## Matérias

### GET /materias

Lista todas as matérias disponíveis.

**Response:**

```json
[
  {
    "id": "Portugues",
    "label": "Português"
  },
  {
    "id": "Matematica",
    "label": "Matemática"
  }
]
```

## Turma

### GET /turma

Lista todas as turmas.

**Response:**

```json
[
  {
    "id": 1,
    "nome": "5º Ano - Fundamental I",
    "turno": "Manhã"
  }
]
```

### GET /turma/{turma_id}

Busca turma por ID com dados completos dos alunos.

**Response:**

```json
{
  "id": 1,
  "nome": "5º Ano - Fundamental I",
  "turno": "Manhã",
  "materias": [
    {
      "id": "Portugues",
      "label": "Português"
    }
  ],
  "alunos": [
    {
      "id": 0,
      "nome": "João",
      "sexo": "masculino",
      "notas": {
        "Matematica": 7.5,
        "Portugues": 8.0
      },
      "frequencia": {
        "Matematica": 0.95,
        "Portugues": 1.0
      },
      "faltas": ["2024-03-15", "2024-04-20"]
    }
  ]
}
```

## Error Responses

A API retorna códigos de status HTTP padrão:

- `200`: Sucesso
- `400`: Requisição inválida
- `401`: Não autorizado
- `404`: Recurso não encontrado
- `422`: Erro de validação

**Exemplo de erro:**

```json
{
  "detail": "Aluno não encontrado"
}
```

## Data Models

### Matérias Disponíveis

- `Portugues`: Português
- `Matematica`: Matemática
- `Ciencias`: Ciências
- `Geografia`: Geografia
- `Historia`: História
- `Artes`: Artes

### Tipos de Avaliação

- `Prova`
- `Trabalho`

### Bimestres

- `1`, `2`, `3`, `4`
