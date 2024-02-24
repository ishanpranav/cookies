// app.mjs
// Copyright (c) 2024 Ishan Pranav
// Licensed under the MIT license.

import express from 'express';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';
import { colorOptions } from './colors.mjs';
import { parseCookies, manageSession } from './cookied.mjs';

const publicPath = resolve(dirname(fileURLToPath(import.meta.url)), 'public');

express()
    .use(express.static(publicPath))
    .use(express.urlencoded({ extended: false }))
    .use(parseCookies)
    .use(manageSession)
    .set('view engine', 'hbs')
    .get('/', (request, response) => {
        const favColor = request.hwSession.favColor || '#ffffff';

        response.render('index', {
            favColor: favColor,
            sessionData: JSON.stringify(request.hwSession, null, 2)
        });
    })
    .get('/preferences', (request, response) => {
        const favColor = request.hwSession.favColor || '#ffffff';

        const options = colorOptions.map(colorOption => {
            colorOption.selected = colorOption.hex === favColor;

            return colorOption;
        });

        response.render('preferences.hbs', { 
            favColor: favColor, 
            options: options
        });
    })
    .post('/preferences', function (request, response) {
        request.hwSession.favColor = request.body.favColor;

        response.redirect('/preferences');
    })
    .listen(process.env.PORT ?? 3000);
