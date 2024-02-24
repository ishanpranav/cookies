// db.mjs
// Copyright (c) 2024 Ishan Pranav
// Licensed under the MIT license.

import { Schema, connect, model } from 'mongoose';

connect(process.env.DSN);

export const Movie = model('Movie', new Schema({ 
    title: String,
    director: String,
    year: Number
}));
