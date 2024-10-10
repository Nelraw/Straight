
import { now } from './time.js';
import { mark, paint } from './style.js';

/// -------------------------------- ///

function Print(...lines: any[]) {
    try {
        if (lines.length === 0) return console.log(), Print;

        for (const line of lines) {
            const data = [];

            data.push(now(), line);

            console.log(...data);
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

Print.show = (title: string, ...lines: any[]) => {
    try {
        title = paint(title, 'yellow');

        const [ colon ] = mark('colons');

        console.log(now(), `${title} ${colon} `);

        lines.push('');

        for (const line of lines) console.log(line);

        return Print;

    } catch(err) { throw err; }
}

/// -------------------------------- ///

export { Print as default, Print }
