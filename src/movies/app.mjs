// app.mjs
// Copyright (c) 2024 Ishan Pranav
// Licensed under the MIT license.

import './config.mjs'; // first

import express from 'express';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';
import { Movie } from './db.mjs';

const rootDirectory = dirname(fileURLToPath(import.meta.url));
const bootstrapDistDirectory = '../../node_modules/bootstrap/dist/';
const bootstrapPath = resolve(rootDirectory, bootstrapDistDirectory);
const publicPath = resolve(rootDirectory, 'public');

express()
    .use(express.static(bootstrapPath))
    .use(express.static(publicPath))
    .set('view engine', 'hbs')
    .get('/movies', async (request, response) => {
        try {
            response.render('movies', {
                foundData: await Movie.find()
            });
        } catch (ex) {
            console.log(ex);
            response.status(500).send();
        }
    })
    .listen(process.env.PORT ?? 3000);
