// app.mjs
// Copyright (c) 2024 Ishan Pranav
// Licensed under the MIT license.

import './config.mjs'; // first

import express from 'express';
import session from 'express-session';
import { access } from 'fs/promises';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';
import { Movie } from './db.mjs';

function ensureSession(session) {
    if (!session.added) {
        session.added = [];
    }
}

const rootDirectory = dirname(fileURLToPath(import.meta.url));
const bootstrapDistDirectory = '../../node_modules/bootstrap/dist/';
const bootstrapPath = resolve(rootDirectory, bootstrapDistDirectory);
const publicPath = resolve(rootDirectory, 'public');
const app = express();

let secret = process.env.SECRET;
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

if (!secret) {
    secret = '12004';

    console.log(
`Missing environment variable 'SECRET': using the default secret is a security
vulnerability.`);
}

app
    .use(express.static(publicPath))
    .use(express.urlencoded({ extended: false }))
    .use(session({
        resave: false,
        saveUninitialized: false,
        secret: secret
    }))
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
    .get('/mymovies', (request, response) => {
        ensureSession(request.session);
        console.log(request.session.added);
        response.render('movies', {
            added: true,
            foundData: request.session.added,
            useFallbackStyles: useFallbackStyles
        });
    })
    .post('/movies-add', async (request, response) => {
        const obj = {
            title: request.body.title,
            year: request.body.year,
            director: request.body.director
        };
        const added = new Movie(obj);

        ensureSession(request.session);
        request.session.added.push(obj);

        try {
            await added.save();

            response.redirect('/movies');
        } catch (ex) {
            console.log(ex);
            response.status(500).send();
        }
    })
    .listen(process.env.PORT ?? 3000, process.env.HOSTNAME);
