<!DOCTYPE html>
<html lang="fr" class="scroll-smooth">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="theme-color" content="#061b15">

        <link rel="icon" type="image/png" href="/images/brand/favicon.png">
        <link rel="apple-touch-icon" href="/images/brand/favicon.png">

        {{-- Preload the first hero frame so the landing paint is immediate --}}
        <link rel="preload" as="image" href="/images/hero/outreach-team.webp" fetchpriority="high">

        @routes
        @vite(['resources/css/app.css', 'resources/js/app.tsx'])
        @inertiaHead
    </head>

    <body class="antialiased">
        @inertia
    </body>
</html>
