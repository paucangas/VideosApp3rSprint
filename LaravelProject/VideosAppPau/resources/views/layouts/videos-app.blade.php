<!-- resources/views/layouts/videos-app.blade.php -->

<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Videos App</title>
</head>
<body>
<header>
    <nav>
        <ul>
            <li><a href="/">Inici</a></li>
            <li><a href="/videos">Videos</a></li>
        </ul>
    </nav>
</header>

<main>
    @yield('content')
</main>

<footer>
    <p>&copy; 2025 Videos App</p>
</footer>
</body>
</html>
