# ver
git branch veo q rama estoy
git status, veo info en general

# ramas
git checkout otraRama -> me voy de la rama actual "a otraRama"
git checkout -b ramaNueva ->(Build) ramaNueva y me voy a "esa rama nueva"

# git add nombre archivo
envio archivo a "staged" y prepara el "commit"

# git commit nombre archivo -m "comentario"
ante-ultimo paso, ahora puedo hacer "push" y subir el file a mi "rama"

# git push origin "rama actual"
Si cambie de rama, el primer push lo hago asi

# git push 
luego del push origin "rama actual" uso siempre este

# git add -A
suma archivos nuevos o modificados + lo eliminados

# git rm archivo
borra archivo y lo manda a staged para borar en github(cuando hago el commit -m "borro archivo + nombre") se concreta el borrado luego del push

# git rm -r carpeta
es igual al rm, pero se agrega -r que es recursivo, hace alusion a el borrado de unix/linux, rm -r

----------
Configurar Git en Windows

1. Instalar Git
Descargar e instalar:

Ve a git-scm.com

Descarga la versión para Windows

Ejecuta el instalador y sigue los pasos (puedes usar la configuración por defecto)

2. Configuración básica inicial

# Configurar tu nombre de usuario
git config --global user.name "Tu Nombre"

# Configurar tu email
git config --global user.email "tu.email@ejemplo.com" (si tenes el mail como privado, deberias, tenes q ir a mail en git y poner el que genera ahi)

# Configurar el editor por defecto (opcional)
git config --global core.editor "code --wait"

# Configurar main como default folder (siempre)
git config --global init.defaultBranch main

# Esto ayuda a que al juntar ramas no se nos enquilombe
git config --global pull.rebase false

# Ahora configuramos las credenciales
# Generar nueva clave SSH (usa tu email)
ssh-keygen -t ed25519 -C "tu.email@ejemplo.com"

# Ver el contenido de la clave pública
cat ~/.ssh/id_ed25519.pub

# Agregar clave a GitHub/GitLab
Copia el contenido del archivo .pub

Ve a GitHub → Settings → SSH and GPG keys

Pega la clave pública

LISTO!
