# Descripció del projecte

El projecte **VideosApp** consisteix en la creació d'una aplicació web similar a YouTube, on es gestionaran usuaris, vídeos i llistes. A través de diversos sprints, s'implementaran les funcionalitats bàsiques de l'aplicació, incloent la creació i visualització de vídeos, gestió d'usuaris i altres operacions relacionades amb la visualització de contingut.

---

## Sprint 1: Creació del projecte i configuració inicial

### 1. Creació del projecte
Es va crear un projecte Laravel anomenat **'VideosAppPau'**, configurant els següents elements:

- **Jetstream amb Livewire**: Per gestionar l'autenticació i les interaccions dinàmiques.
- **PHPUnit**: Per realitzar proves unitàries.
- **Teams**: Per gestionar equips d'usuaris dins de l'aplicació.
- **SQLite**: Com a base de dades temporal per al desenvolupament inicial.

### 2. Test de helpers
Es va crear un test per verificar la creació de dos tipus d'usuari:

- **Usuari per defecte** amb camps com `name`, `email` i `password`.
- **Usuari professor**, també amb la mateixa estructura.

A més, la contrasenya es va encriptar i els usuaris es van associar a un equip per defecte.

### 3. Configuració de helpers i credencials
Es van crear **helpers** dins la carpeta `app` per facilitar tasques repetitives, i es va configurar el fitxer `config` per utilitzar les credencials d'usuaris per defecte carregades des del fitxer `.env`.

---

## Sprint 2: Migracions, models i proves

### 1. Correcció d'errors
Es van corregir diversos errors detectats durant el primer sprint, incloent l'ús d'una base de dades temporal per als tests, el que va permetre garantir un entorn net i controlat per les proves.

### 2. Migració de vídeos
Es va crear una migració per a la taula de **vídeos** amb els següents camps:

- **id**: Identificador únic del vídeo.
- **title**: Títol del vídeo.
- **description**: Descripció del vídeo.
- **url**: Enllaç al vídeo.
- **published_at**: Data de publicació.
- **previous**: Referència al vídeo anterior (si escau).
- **next**: Referència al vídeo següent (si escau).
- **series_id**: Identificador de la sèrie a la qual pertany el vídeo.

### 3. Controlador i model de vídeos
Es va implementar el controlador **VideosController** amb dues funcions principals:

- **testedBy**: Per realitzar proves específiques associades als vídeos.
- **show**: Per mostrar un vídeo específic.

A més, es va crear el model de **Vídeos** amb funcions per formatar les dates de publicació utilitzant la llibreria **Carbon**.

### 4. Helpers de vídeos per defecte
Es va crear un helper per afegir vídeos per defecte a la base de dades, facilitant així les proves i el desenvolupament inicial.

### 5. Afegir usuaris i vídeos per defecte
Es va configurar el **DatabaseSeeder** per afegir usuaris i vídeos per defecte a la base de dades, assegurant-se que l'aplicació disposés de dades de prova per als tests.

### 6. Creació de layout i rutes
Es va crear el layout **VideosAppLayout**, que es va utilitzar per estructurar les vistes de l'aplicació. A més, es van definir les rutes per mostrar els vídeos en el frontend.

### 7. Proves de vídeos
Es van crear diverses proves per garantir el correcte funcionament de les funcionalitats de vídeos, incloent:

- Creació de vídeos per defecte.
- Visualització correcta dels vídeos.
- Accés als vídeos per part dels usuaris, incloent proves de permisos i validacions de l'usuari autenticat.

---

## Sprint 3: Funcionalitats d'usuaris, permisos i tests

### 1. Corregir els errors del 2n sprint
Es van corregir els errors detectats durant el segon sprint.

### 2. Instal·lació de `spatie/laravel-permission`
Es va instal·lar el paquet `spatie/laravel-permission` per gestionar els rols i permisos dels usuaris dins de l'aplicació, seguint la documentació oficial per a la instal·lació.

### 3. Migració per afegir el camp `super_admin`
Es va crear una migració per afegir el camp `super_admin` a la taula **users**.

### 4. Afegir funcions al model d'usuaris
Es va afegir la funció `testedBy()` i la funció `isSuperAdmin()` al model d'usuari per gestionar la lògica dels permisos.

### 5. Funcions per a la creació d'usuaris
Es va crear la funció `create_default_professor()` per afegir el superadmin al professor, així com altres funcions per crear usuaris de tipus **regular**, **video manager** i **superadmin**:

- **create_regular_user()**
- **create_video_manager_user()**
- **create_superadmin_user()**

A més, es va implementar la funció `define_gates()` per definir les portes d'autorització i les funcions `create_permissions()` per crear permisos predeterminats.

### 6. Política d'autorització
A la funció `book` de **AppServiceProvider**, es van registrar les polítiques d'autorització i es van definir les portes d'accés per gestionar els permisos dels usuaris.

### 7. Afegir usuaris i permisos al `DatabaseSeeder`
Es van afegir usuaris per defecte (superadmin, regular user, video manager) i permisos al **DatabaseSeeder** per garantir que els usuaris i els rols es creessin correctament en la base de dades.

### 8. Publicar els stubs
Es va publicar els stubs per personalitzar la generació de fitxers, seguint la guia de Laravel per personalitzar els stubs.

### 9. Crear tests de vídeos
Es va crear el test **VideosManageControllerTest** dins de la carpeta `tests/Feature/Videos`, amb les funcions següents per comprovar la gestió de vídeos:

- `user_with_permissions_can_manage_videos()`
- `regular_users_cannot_manage_videos()`
- `guest_users_cannot_manage_videos()`
- `superadmins_can_manage_videos()`
- `loginAsVideoManager()`
- `loginAsSuperAdmin()`
- `loginAsRegularUser()`

### 10. Crear test d'usuaris
Es va crear el test **UserTest** a la carpeta `tests/Unit`, amb la funció `isSuperAdmin()` per validar la lògica associada als superadmins.

### 11. Afegir documentació
Es va afegir la descripció dels sprints a **resources/markdown/terms** per mantenir la documentació del projecte actualitzada.

### 12. Comprovar fitxers amb Larastan
Es va utilitzar **Larastan** per comprovar els fitxers creats i assegurar la qualitat del codi.

---

**Conclusió:**
Amb aquest tercer sprint, s'ha aconseguit establir un sistema de rols i permisos robust, amb la creació de diversos usuaris i la implementació de les lògiques de seguretat i autorització. Els pròxims passos implicaran la continuació del desenvolupament de la funcionalitat de vídeos i la millora de l'experiència d'usuari.

---
