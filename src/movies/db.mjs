// db.mjs
// Copyright (c) 2024 Ishan Pranav
// Licensed under the MIT license.

import { Schema, connect, model } from 'mongoose';

connect(process.env.DSN);

/**
 * Specifies the constructor for the `Movie` model, which represents a film.
 * 
 * NOTE: By exporting this method, we avoid having to retrieve the model later.
*/
export const Movie = model('Movie', new Schema({ 
    title: String,
    director: String,
    year: Number
}));
