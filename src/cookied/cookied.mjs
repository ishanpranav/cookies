// cookied.mjs
// Copyright (c) 2024 Ishan Pranav
// Licensed under the MIT license.

// CONSTRAINT: May not use `express-session` or `cooke-parser`.

import { v4 } from 'uuid';

const sessions = {};

export function parseCookies(request, _, next) {
    request.hwCookies = {};

    if (!request.headers.cookie) {
        next();

        return;
    }

    for (const pair of request.headers.cookie.split(';')) {
        const [key, value] = pair.split('=');

        request.hwCookies[key.trim()] = value.trim();
    }

    next();
}

export function manageSession(request, response, next) {
    request.hwSession = sessions[request.hwCookies.sessionId];

    if (request.hwSession) {
        console.log("session already exists:", request.hwCookies.sessionId);
    } else {
        const id = v4();

        sessions[id] = { sessionId: id };
        request.hwSession = sessions[id];

        response.append('Set-Cookie', 'sessionId=' + id + '; HttpOnly');
        console.log("session generated:", id);
    }

    next();
}
