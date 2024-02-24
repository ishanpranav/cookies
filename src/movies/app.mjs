// app.mjs
// Copyright (c) 2024 Ishan Pranav
// Licensed under the MIT license.

import express from 'express';
const app = express();

app.listen(process.env.PORT ?? 3000);
