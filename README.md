# ClassBoard

ClassBoard é uma plataforma de gestão educacional desenvolvida para auxiliar professores e gestores no acompanhamento do desempenho dos alunos. O sistema oferece visualizações detalhadas das notas, evolução por período, comparativos entre disciplinas e identificação de áreas que precisam de mais atenção, tanto para alunos individuais quanto para a turma como um todo.

---

## Sumário

- [Visão Geral](#visão-geral)
- [Funcionalidades](#funcionalidades)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Como Executar](#como-executar)
- [Tecnologias Utilizadas](#tecnologias-utilizadas)

---

## Visão Geral

O ClassBoard foi pensado para facilitar o acompanhamento pedagógico, trazendo gráficos interativos, filtros inteligentes e análises automáticas (IA) sobre o desempenho dos alunos. O projeto está dividido em duas implementações principais:

- **Bootstrap**: Versão estática, ideal para prototipação rápida e visualização inicial.
- **React**: Versão dinâmica, com componentes reutilizáveis e integração facilitada com novas funcionalidades.

---

## Funcionalidades

- Visualização de notas por matéria, bimestre e tipo de avaliação
- Evolução das notas ao longo dos períodos
- Comparativo entre alunos e entre turmas
- Filtros dinâmicos para análise personalizada
- Análise automática de desempenho via IA
- Relatórios exportáveis

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
├── react-app/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── data/
│   │   ├── assets/
│   │   ├── hooks/
│   ├── public/
│   └── package.json
└── README.md
```

---

## Como Executar

Ambos projetos precisam do Node.js instalado. Recomenda-se usar o Node.js versão 14 ou superior. Para instalar o Node.js, visite [nodejs.org](https://nodejs.org/).

### Bootstrap

Devido a modularização do projeto com scripts separados, siga os passos abaixo para rodar a versão Bootstrap:

1. Instale as dependências (se necessário):
   ```bash
   cd Bootstrap
   npm install
   ```
2. Execute o comando para iniciar um servidor local:
   ```bash
    npx http-server ./static
   ```
3. Acesse `http://127.0.0.1:8080/Materias/listagem.html` no navegador.

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
3. Acesse `http://localhost:3000` no navegador.

---

## Tecnologias Utilizadas

- **Bootstrap 5**: Estilização rápida e responsiva
- **React**: Interface dinâmica e componentes reutilizáveis
- **Chart.js & react-chartjs-2**: Gráficos interativos
- **JavaScript (ES6+)**
- **HTML5 & CSS3**

---

**Desenvolvido por**

- [@LevoratoJoao](https://github.com/LevoratoJoao)
- [@Sefora-Davanso](https://github.com/Sefora-Davanso)
- [@ThiagoCristovao](https://github.com/ThiagoCristovao)
