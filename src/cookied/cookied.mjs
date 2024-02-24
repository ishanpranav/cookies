// cookied.mjs
// Copyright (c) 2024 Ishan Pranav
// Licensed under the MIT license.

// CONSTRAINT: May not use `express-session` or `cooke-parser`.

import { v4 } from 'uuid';

const sessions = {};

/**
 * Provides Express middleware for parsing the HTTP `Cookie` header.
 * 
 * @param {Request}  request  the HTTP request.
 * @param {Response} response (unused) the HTTP response.
 * @param {Function} next     the callback invoked after the middleware.
 */
export function parseCookies(request, response, next) {
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

/**
 * Provides Express middleware for managing user sessions.
 *  
 * @param {Request}  request  the HTTP request.
 * @param {Response} response the HTTP response.
 * @param {Function} next     the callback invoked after the middleware.
 */
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
