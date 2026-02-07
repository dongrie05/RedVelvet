# Enviar o projeto para o GitHub (dongrie05/RedVelvet)

## Usar a Action para fazer o push para main (recomendado)

A Action **Build e push para main** faz o seguinte: quando fazes push para o branch **dev**, ela faz o build e, se correr bem, faz **merge de dev para main** e **push para main**. Assim só precisas de trabalhar no branch `dev`; a Action atualiza o `main` e o Vercel faz deploy automático do `main`.

**O que precisas de fazer:**

1. **Uma vez no teu PC** (na pasta do projeto):
   ```powershell
   cd "C:\Users\GC\Downloads\RedVelvet-main\RedVelvet-main"
   git config --global user.email "o-teu-email@exemplo.com"
   git config --global user.name "O Teu Nome"
   ```

2. **Criar o branch `dev` e enviar** (só na primeira vez, ou quando quiseres enviar alterações):
   ```powershell
   git checkout -b dev
   git add .
   git commit -m "Alterações"
   git push -u origin dev
   ```

3. **Daqui em diante**, sempre que quiseres atualizar o site:
   ```powershell
   git add .
   git commit -m "Descrição do que mudou"
   git push origin dev
   ```
   A Action corre sozinha, faz merge para `main` e o Vercel faz o deploy.

**Secrets no GitHub (Settings → Secrets and variables → Actions):**  
Para o build passar, adiciona (se ainda não tiveres):  
`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`.

---

## Resolver os erros de identidade e push

Se aparecer **"Please tell me who you are"** ou **"src refspec main does not match any"**, faz **por esta ordem** no PowerShell (na pasta do projeto):

```powershell
cd "C:\Users\GC\Downloads\RedVelvet-main\RedVelvet-main"
```

**1. Dizer ao Git quem és** (usa o teu email e nome; o email pode ser o do GitHub):
```powershell
git config --global user.email "o-teu-email@exemplo.com"
git config --global user.name "O Teu Nome"
```

**2. Garantir que há um commit:**
```powershell
git add .
git status
git commit -m "Deploy: APIs produtos, categorias, destaques, filtros, Vercel"
git branch -M main
```

**3. Enviar para o GitHub:**
```powershell
git push -u origin main
```

Se pedir **credenciais**: utilizador = o teu username do GitHub (ex: dongrie05). Palavra-passe = um **Personal Access Token** (GitHub → Settings → Developer settings → Personal access tokens → Generate new token, com permissão `repo`).

---

## Forma mais fácil: usar o script

1. Abre **PowerShell** (clica no menu Iniciar, escreve `PowerShell`, abre "Windows PowerShell").
2. Na primeira vez que usares Git no PC, pode ser preciso instalar. Cola e executa:
   ```powershell
   winget install --id Git.Git -e --source winget
   ```
   Reinicia o PowerShell depois de instalar.
3. Vai à pasta do projeto:
   ```powershell
   cd "C:\Users\GC\Downloads\RedVelvet-main\RedVelvet-main"
   ```
4. Executa o script:
   ```powershell
   .\push-to-github.ps1
   ```
5. Se pedir **login do GitHub**: o browser abre; faz login e autoriza. Se pedir **utilizador/email do Git**, usa o teu nome e o email da conta GitHub.

---

## Fazer tudo à mão (sem script)

Cola estes comandos **um bloco de cada vez** no PowerShell (na pasta do projeto).

**1. Instalar Git (só uma vez no PC)**  
```powershell
winget install --id Git.Git -e --source winget
```
Fecha e abre o PowerShell de novo.

**2. Ir à pasta do projeto**  
```powershell
cd "C:\Users\GC\Downloads\RedVelvet-main\RedVelvet-main"
```

**3. Inicializar repositório e definir remote**  
```powershell
git init
git remote add origin https://github.com/dongrie05/RedVelvet.git
```

**4. Adicionar ficheiros, fazer commit e enviar**  
```powershell
git add .
git commit -m "Deploy: APIs produtos e categorias, destaques, filtros, config Vercel"
git branch -M main
git push -u origin main
```

- Se pedir **credenciais**: usa o teu utilizador GitHub e um **Personal Access Token** em vez da palavra-passe (em GitHub.com → Settings → Developer settings → Personal access tokens).
- Se o repositório **já tiver commits** e der erro no push, podes usar (sobrescreve o que está no GitHub):
  ```powershell
  git push -u origin main --force
  ```

---

## Depois do push

- O código fica em: https://github.com/dongrie05/RedVelvet  
- Se o repositório estiver ligado à Vercel, o deploy é feito automaticamente.  
- Configura na Vercel as variáveis **NEXT_PUBLIC_SUPABASE_URL** e **NEXT_PUBLIC_SUPABASE_ANON_KEY** para a loja e os produtos funcionarem.
