
import { today, clock, now } from './time.js';
import { mark, paint } from './style.js';

/// -------------------------------- ///

function Print(...objects: any[]) {
    try {
        if (objects.length === 0) return console.log(), Print;

        console.log(...objects);

        return Print;

    } catch(err) { throw err; }
}

function log(...objects: any[]) {
    try {
        if (objects.length == 0) return console.log(), Print;

        const time = clock();
        console.log(...[ time, objects ]);

        return Print;

    } catch(err) { throw err; }
}

Print.log = log;

Print.lines = (...lines: any[]) => {
    try {
        if (lines.length === 0) return console.log(), Print;

        for (const line of lines) {
            console.log(line);
        }

        return Print;

    } catch(err) { throw err; }
}

log.lines = (...lines: any[]) => {
    try {
        if (lines.length === 0) return console.log(), Print;

        const time = clock();

        for (const line of lines) {
            console.log(...[ time, line ]);
        }

        return Print;

    } catch(err) { throw err; }
}

Print.br = (count: number | any | any[] = 1) => {
    try {
        if (typeof count === 'number') {
            for (let i = 0; i < count; i++) {
                console.log();
            }

            return Print;
        }

        if (!Array.isArray(count)) count = [ count ];

        console.log();
        return Print(...count);

    } catch(err) { throw err; }
}

const getTitle = (title: string, time?: `date` | `clock` | true) => {
    try {
        const [ colons ] = mark('colons');
        title = `${paint(title, 'yellow')} ${colons}`;

        if (time == undefined) return title;
        else {
            if (time == true) return `${now()} ${title}`;
            
            time = time == `date` ? today() : clock() as any;

            return `${time} ${title}`;
        }

    } catch(err) { throw err; }
}

Print.title = (title: string, time?: `date` | `clock` | true) => {
    try {
        title = getTitle(title, time);

        return console.log(title), Print;

    } catch(err) { throw err; }
}

Print.titled = (title: string, ...lines: any[]) => {
    try {
        title = getTitle(title);

        if (lines.length == 0) return console.log(title), Print;

        return console.log(...[ title, ...lines ]), Print;

    } catch(err) { throw err; }
}

log.titled = (title: string, ...lines: any[]) => {
    try {
        Print.title(title, `clock`);

        if (lines.length == 0) return Print;

        return log(...lines), Print;

    } catch(err) { throw err; }
}

Print.show = (title: string, ...lines: any[]) => {
    try {
        Print.title(title);
        if (lines.length === 0) return Print;

        Print.lines(...lines);

        return Print;

    } catch(err) { throw err; }
}

log.show = (title: string, ...lines: any[]) => {
    try {
        Print.title(title, `clock`);
        if (lines.length === 0) return Print;

        log.lines(...lines);

        return Print;

    } catch(err) { throw err; }
}

/// -------------------------------- ///

export { Print as default, Print }
