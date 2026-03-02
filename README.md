# Mini Job Processing Task

## Requirements

- Node.js >= 18
- PostgreSQL
- npm

---

## 1. Install Dependencies

```bash
npm install
```

---



## 2. Run Migrations

```bash
npm run migration:run
```

---

## 3. Start the Application

```bash
npm run dev
```

Server will be running at `http://localhost:3000`.

---

## Available Scripts

| Script | Description |
|--------|-------------|
| `npm run migration:generate <path>` | Generate a new migration |
| `npm run migration:run` | Run all pending migrations |
| `npm run migration:revert` | Revert the last migration |
| `npm run dev` | Start the development server |
| `npm run build` | Build the project |

