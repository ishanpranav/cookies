// app.mjs
// Copyright (c) 2024 Ishan Pranav
// Licensed under the MIT license.

import './config.mjs'; // first

import express from 'express';
import { access } from 'fs/promises';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';
import { Movie } from './db.mjs';

const rootDirectory = dirname(fileURLToPath(import.meta.url));
const bootstrapDistDirectory = '../../node_modules/bootstrap/dist/';
const bootstrapPath = resolve(rootDirectory, bootstrapDistDirectory);
const publicPath = resolve(rootDirectory, 'public');
const app = express();

let useFallbackStyles = false;

try {
    await access(bootstrapDistDirectory);

    app.use(express.static(bootstrapPath));

    useFallbackStyles = false;
} catch {
    useFallbackStyles = true;

    console.log(`
Missing optional dependency 'bootstrap'. Please run 'npm install'. Using
fallback styles for now (requires Internet connection).`);
}

app
    .use(express.static(publicPath))
    .use(express.urlencoded({ extended: false }))
    .set('view engine', 'hbs')
    .get('/', (_, response) => response.redirect('/movies'))
    .get('/movies', async (request, response) => {
        let query;

        if (request.query.director) {
            query = { director: request.query.director };
        }

        try {
            response.render('movies', {
                director: request.query.director,
                foundData: await Movie.find(query),
                useFallbackStyles: useFallbackStyles
            });
        } catch (ex) {
            console.log(ex);
            response.status(500).send();
        }
    })
    .get('/movies-add', (_, response) => response.render('movies-add', {
        useFallbackStyles: useFallbackStyles,
        year: new Date().getFullYear()
    }))
    .post('/movies-add', async (request, response) => {
        const added = new Movie({
            title: request.body.title,
            year: request.body.year,
            director: request.body.director
        });

        try {
            await added.save();

            response.redirect('/movies');
        } catch (ex) {
            console.log(ex);
            response.status(500).send();
        }
    })
    .listen(process.env.PORT ?? 3000, process.env.HOSTNAME);
