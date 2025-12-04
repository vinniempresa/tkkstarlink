# 🔧 Correção para Deploy no Heroku

## ❌ Problema Identificado

O erro `ERR_MODULE_NOT_FOUND` no Heroku acontece porque o esbuild não está resolvendo corretamente o `import.meta.dirname`.

## ✅ Solução

### Passo 1: Modificar o package.json

Abra o arquivo `package.json` e **substitua** a linha do script `build`:

**❌ ANTES:**
```json
"build": "vite build && esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist",
```

**✅ DEPOIS:**
```json
"build": "vite build && node build.js",
```

E **adicione** esta linha:
```json
"heroku-postbuild": "npm run build",
```

### Resultado final dos scripts:

```json
"scripts": {
  "dev": "NODE_ENV=development tsx server/index.ts",
  "build": "vite build && node build.js",
  "start": "NODE_ENV=production node dist/index.js",
  "heroku-postbuild": "npm run build",
  "check": "tsc",
  "db:push": "drizzle-kit push"
}
```

### Passo 2: Fazer o deploy no Heroku

```bash
# 1. Comitar as mudanças
git add .
git commit -m "Corrigir build para Heroku"

# 2. Fazer push para o Heroku
git push heroku main
```

## 🧪 Testar localmente antes do deploy

```bash
# Build
npm run build

# Testar em produção
NODE_ENV=production npm start
```

Depois abra http://localhost:5000

## 📝 Checklist

- [ ] Modificar script `build` no package.json
- [ ] Adicionar script `heroku-postbuild` no package.json  
- [ ] Configurar variáveis no Heroku:
  ```bash
  heroku config:set FOUR_M_API_KEY=3mpag_p7czqd3yk_mfr1pvd2
  heroku config:set SESSION_SECRET=$(openssl rand -base64 32)
  ```
- [ ] Fazer commit e push para o Heroku
- [ ] Abrir a aplicação: `heroku open`

## 🔍 Verificar logs

Se ainda houver problemas:

```bash
heroku logs --tail
```

## ⚙️ Arquivos criados

- ✅ `build.js` - Script de build customizado que resolve o problema do import.meta.dirname
- ✅ `Procfile` - Define como o Heroku inicia a app
- ✅ `.env.example` - Documenta variáveis necessárias
