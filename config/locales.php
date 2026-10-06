<?php

return [
    'supported' => ['es', 'ca', 'en'],
    'default' => 'es',
    'og_locales' => ['es' => 'es_ES', 'ca' => 'ca_ES', 'en' => 'en_GB'],
    'routes' => [
        'home' => ['es' => '', 'ca' => '', 'en' => ''],
        'about' => ['es' => 'sobre-mi', 'ca' => 'sobre-mi', 'en' => 'about'],
        'projects' => ['es' => 'proyectos', 'ca' => 'projectes', 'en' => 'projects'],
        'contact' => ['es' => 'contacto', 'ca' => 'contacte', 'en' => 'contact'],
    ],
    'components' => [
        'home' => 'Home',
        'about' => 'About',
        'projects' => 'Projects',
        'contact' => 'Contact',
    ],
];
