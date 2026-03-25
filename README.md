# Prueba técnica QA Automation — Farmatodo

Automatización con **Playwright** y **TypeScript**: pruebas de **integración** contra la API pública [PokéAPI](https://pokeapi.co/) y pruebas **E2E** sobre [Saucedemo](https://www.saucedemo.com/).

La siguiente configuración se realizó en una **máquina virtual con Ubuntu 24.04.4 LTS**. En este documento hay pasos equivalentes para **Windows** y **macOS**.

---

## 1. Clonar el repositorio

Antes de instalar dependencias, obtén el código en tu máquina:

```bash
git clone https://github.com/haciendotestingqa/Practical_Challenge_FARMATODO.git
cd Practical_Challenge_FARMATODO
```

Repositorio: [haciendotestingqa/Practical_Challenge_FARMATODO](https://github.com/haciendotestingqa/Practical_Challenge_FARMATODO).

---

## 2. Requisitos (por sistema operativo)

### Comunes a todos

- **Node.js** 18 o superior ([descargas oficiales](https://nodejs.org/))
- **npm** (viene con Node; comprueba con `npm -v`)
- **Git** para clonar el repositorio
- Conexión a internet (PokéAPI y Saucedemo son servicios externos)

### Linux (Ubuntu / Debian y similares)

- Paquetes de sistema que a veces pide Chromium en entornos mínimos; Playwright puede instalar dependencias con:
  - `npx playwright install-deps chromium` (puede requerir `sudo` en Ubuntu)
- Herramientas de compilación solo si Playwright lo indica al instalar navegadores (poco habitual en un equipo de escritorio completo)

### Windows

- **Windows 10/11** (64 bits recomendado)
- Instalador de Node.js LTS desde [nodejs.org](https://nodejs.org/) o, con [winget](https://learn.microsoft.com/en-us/windows/package-manager/winget/):
  - `winget install OpenJS.NodeJS.LTS`
- **Git para Windows** ([git-scm.com](https://git-scm.com/download/win)) o `winget install Git.Git`
- Terminal: **PowerShell**, **CMD** o **Git Bash** (los comandos `npm`/`npx` son los mismos; las variables de entorno en scripts se explican más abajo)

### macOS

- **macOS** reciente (Intel o Apple Silicon)
- Node.js: instalador desde [nodejs.org](https://nodejs.org/) o, con [Homebrew](https://brew.sh/):
  - `brew install node`
- Herramientas de línea de comandos de Xcode (algunas herramientas las piden la primera vez: `xcode-select --install` si hace falta)

---

## 3. Instalación

En todos los casos, trabaja **dentro de la carpeta del repositorio** llamada **`Practical_Challenge_FARMATODO`** (es la que crea `git clone`).

> Si acabas de clonar y ya hiciste `cd Practical_Challenge_FARMATODO`, no repitas el `cd`.

### Linux — Ubuntu 24.04.4 LTS

```bash
cd Practical_Challenge_FARMATODO
npm install
npx playwright install chromium
```

Opcional, si el navegador de pruebas falla por librerías del sistema:

```bash
npx playwright install-deps chromium
```

### Windows (consola PowerShell)

```powershell
cd Practical_Challenge_FARMATODO
npm install
npx playwright install chromium
```

Si clonaste en otra ruta, ajusta el `cd`, por ejemplo:

```powershell
cd $HOME\Documents\Practical_Challenge_FARMATODO
```

### macOS (Terminal, shell zsh)

```bash
cd Practical_Challenge_FARMATODO
npm install
npx playwright install chromium
```

### Otros navegadores (cualquier sistema operativo)

Si amplías `playwright.config.ts` con Firefox/WebKit:

```bash
npx playwright install
```

---

## 4. Ejecutar pruebas

| Comando | Descripción |
|--------|-------------|
| `npm run test:integration` | Solo integración de API (proyecto `api`) |
| `npm run test:e2e` | Solo E2E de interfaz (proyecto `e2e`) |
| `npm run test:e2e:slow` | E2E en navegador visible y más lento (`SLOW_MO=1000`) |
| `npm run test:ui` | Modo UI de Playwright para depuración |
| `npm run test:ui:slow` | Modo UI para E2E con ejecución lenta |
| `npm run test:all` o `npm test` | Ejecuta toda la suite de pruebas |

Equivalentes con `npx` (Linux, macOS o Git Bash en Windows):

```bash
npx playwright test --project=api
npx playwright test --project=e2e
SLOW_MO=1000 npx playwright test --project=e2e --headed
```

### Variables de entorno en Windows (PowerShell)

Los scripts de `npm` usan sintaxis tipo Linux (`VAR=valor comando`). En **PowerShell** puedes ejecutar lo mismo así:

```powershell
$env:PLAYWRIGHT_FORCE_TTY="200"; npm test
$env:SLOW_MO="1000"; $env:PLAYWRIGHT_FORCE_TTY="200"; npm run test:e2e:slow
```

En **CMD**:

```bat
set PLAYWRIGHT_FORCE_TTY=200 && npm test
```

O usa **Git Bash** en Windows con los mismos comandos que en Linux indicados arriba.

### ¿Qué hace cada prueba y cómo se visualiza?

- **Prueba de integración (`api`)**  
  Ejecuta llamadas HTTP a PokéAPI para obtener la cadena de evolución de Squirtle, consulta el peso de cada especie y ordena los resultados alfabéticamente sin usar `.sort()`.  
  **La salida se ve en la terminal**, con una tabla como la siguiente:

```text
| Pokemon   | Peso(hg) |
|-----------|----------|
| blastoise |      855 |
| squirtle  |       90 |
| wartortle |      225 |
```

- **Prueba E2E (`e2e`)**  
  Automatiza el flujo completo en Saucedemo: login, selección del producto, validación en carrito y checkout hasta confirmación.  
  **La ejecución se ve de forma gráfica en una ventana del navegador** cuando usas `npm run test:e2e:slow` (modo visible y más lento), lo que permite observar cada paso cómodamente.

---

## 5. Estructura del proyecto

```text
.
├── 1-Integration_Test/     # Pruebas de integración (HTTP / PokéAPI)
│   ├── evolution.spec.ts
│   └── helpers/
├── 2-E2E_Test/             # Pruebas E2E (UI / Saucedemo)
│   ├── fleece.spec.ts
│   └── pages/              # Modelo de objetos de página (POM)
├── playwright.config.ts    # Proyectos api + e2e
├── package.json
└── tsconfig.json
```

---

## 6. Qué cubre cada parte

| Carpeta | Enfoque |
|--------|---------|
| [`1-Integration_Test`](1-Integration_Test/) | Cadena de evolución desde **Squirtle**, nombres y **weight**, orden alfabético **sin** `Array.prototype.sort()`. |
| [`2-E2E_Test`](2-E2E_Test/) | Login en Saucedemo, producto **Sauce Labs Fleece Jacket**, captura nombre/precio, validación en carrito y checkout hasta confirmación. |

---

## 7. Notas útiles

**Salida truncada en la terminal:** el modo de salida en consola de Playwright adapta el texto al ancho del panel. Los scripts `npm run test*` usan `PLAYWRIGHT_FORCE_TTY=200` para reducir el corte. Si ejecutas `npx playwright test` a mano y se trunca, usa `PLAYWRIGHT_FORCE_TTY=200 npx playwright test` o ensancha la terminal.
