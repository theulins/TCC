# 🧩 Sistema Web de Gestão de Propostas – TCCv7

Este projeto implementa um sistema web completo para **gestão de empresas associadas**, com **cadastro, geração de PDFs personalizados**, controle de usuários, auditoria e versionamento de documentos.  
O backend é construído em **Node.js + Express + MySQL**, e o frontend em **HTML, CSS e JavaScript puro**.

---

## 🚀 Funcionalidades Principais

- ✅ Autenticação JWT (login, roles: viewer, editor, admin)  
- ✅ CRUD de empresas e sócios  
- ✅ Geração automática de PDF baseado no template oficial da ACIU  
- ✅ Controle de versões de documentos (`company_documents`)  
- ✅ Auditoria automática (`audit_logs`)  
- ✅ Download de PDFs diretamente no navegador  
- ✅ Interface responsiva com dark mode

---

## ⚙️ Tecnologias Utilizadas

| Camada | Tecnologia |
|--------|-------------|
| Backend | Node.js (Express, PDFKit, MySQL2, Joi, JWT) |
| Banco de Dados | MySQL 8+ |
| Frontend | HTML, CSS, JavaScript |
| Autenticação | JSON Web Token (JWT) |
| PDF | PDFKit com template “Proposta Associados 2024” |

---

## 🗃️ Estrutura de Pastas

```
TCCv7/
├── backend/
│   ├── server.js
│   ├── db.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── companies.js
│   │   └── users.js
│   ├── middleware/
│   │   └── auth.js
│   ├── storage/
│   │   └── docs/             ← PDFs gerados aqui
│   └── package.json
│
├── frontend/
│   ├── index.html            ← Tela de login
│   ├── pages/
│   │   ├── dashboard.html
│   │   ├── nova-empresa.html
│   │   └── usuarios.html
│   ├── js/
│   │   ├── login.js
│   │   └── nova-empresa.js
│   ├── css/
│   │   └── styles.css
│
└── database/
    └── schema.sql            ← Script de criação do banco
```

---

## 🧱 Instalação e Configuração

### 1️⃣ Pré-requisitos
- Node.js **>= 18**
- MySQL **>= 8.0**
- XAMPP (opcional, se rodar localmente)
- Git (para clonar o projeto)

---

### 2️⃣ Clonar e instalar dependências
```bash
git clone https://github.com/usuario/TCCv7.git
cd TCCv7/backend
npm install
```

---

### 3️⃣ Configurar o banco de dados
1. Abra o MySQL (Workbench, phpMyAdmin ou CLI).  
2. Execute o script abaixo:

```sql
SOURCE ./database/schema.sql;
```

> Esse script cria as tabelas `users`, `companies`, `company_partners`, `company_documents`, `audit_logs` e insere o usuário administrador padrão.

---

### 4️⃣ Configurar variáveis de ambiente `.env`
Crie um arquivo `.env` dentro da pasta `backend/` com o seguinte conteúdo:

```ini
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=tcc3
JWT_SECRET=meusegredotcc
PORT=3000
```

---

### 5️⃣ Iniciar o servidor
```bash
cd backend
npm start
```

O servidor será iniciado em:  
👉 **http://localhost:3000**

---

### 6️⃣ Acessar o sistema

Abra no navegador:
```
http://localhost:3000
```

Usuário padrão:
```
Email: admin@tcc3.local
Senha: admin123 (ou conforme hash configurado)
```

---

## 🧾 Geração de PDFs

Os PDFs são gerados automaticamente após criar ou editar uma empresa.  
O arquivo é salvo em:
```
backend/storage/docs/company_{id}_v{versão}.pdf
```

O layout segue o modelo **PROPOSTA ASSOCIADOS 2024**, com os dados de:
- Empresa  
- Endereço e contato  
- Sócios / diretores  
- Serviços contratados  
- Autorização de divulgação  

---

## 🧰 Rotas Principais da API

| Método | Rota | Descrição |
|---------|------|-----------|
| POST | `/api/auth/login` | Autenticação JWT |
| GET | `/api/companies` | Lista todas as empresas |
| GET | `/api/companies/:id` | Retorna dados completos da empresa |
| POST | `/api/companies` | Cria empresa e gera PDF |
| PUT | `/api/companies/:id` | Atualiza empresa e gera nova versão do PDF |
| GET | `/api/companies/:id/pdf` | Baixa o PDF da última versão |
| GET | `/api/companies/:id/documents` | Lista versões anteriores |

---

## 🧑‍💻 Scripts úteis

```bash
# rodar servidor
npm start

# checar erros de dependências
npm audit fix

# resetar o banco (opcional)
mysql -u root -p < database/schema.sql
```

---

## 💾 Backup e versão

Os PDFs e registros ficam salvos localmente em `/backend/storage/docs`.  
Cada atualização cria uma nova entrada em `company_documents` com `version` incremental.

---

## 🧠 Créditos

Projeto acadêmico desenvolvido por **Matheus Lins Fernandes** – UNIPAR (2025)  
Tema: *Desenvolvimento de um Sistema Web para Gestão de Propostas de Associação Comercial*  
Orientado com base na norma **ISO/IEC 27001 – Segurança da Informação**

---

## 📄 Licença

Uso acadêmico e não comercial.  
Distribuição e cópia permitidas para fins de aprendizado e TCC.
