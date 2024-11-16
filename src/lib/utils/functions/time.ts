
import { paint, mark } from './style.js';

/// -------------------------------- ///

type Time = number | Date | Timestamp;

/// -------------------------------- ///

class Timestamp {

    static elapsed(first: Time, second?: Time) {
        try {
            const f = new Timestamp(first) as Timestamp;
            const s = new Timestamp(second) as Timestamp;

            return Math.abs(f.stamp - s.stamp);

        } catch(error) { throw error; }
    }

    stamp!: number;
    protected _date!: Date;

    constructor(timestamp?: Time, renew: boolean = false) {
        try {
            if (timestamp instanceof Timestamp) {
                if (!renew) return timestamp;

                timestamp = timestamp.stamp;
            }

            if (!timestamp) timestamp = Date.now();

            this.stamp = timestamp instanceof Date
                ? timestamp.getTime()
                : timestamp as number;

            this._date = timestamp instanceof Date
                ? timestamp
                : new Date(timestamp as number);

        } catch(error) { throw error; }
    }

    get year() { return this._date.getFullYear(); }
    get month() { return this._date.getMonth() + 1; }
    get day() { return this._date.getDate(); }
    get hours() { return this._date.getHours(); }
    get minutes() { return this._date.getMinutes(); }
    get seconds() { return this._date.getSeconds(); }
    get milliseconds() { return this._date.getMilliseconds(); }

    get date() {
        try {
            const sep = paint('-', 'gray');
            const format = (t: string) => paint(this.pad(t), 'green');

            return [ 'year', 'month', 'day' ].map(format).join(sep); 

        } catch(error) { throw error; }
    }
    
    get clock() {
        try {
            const sep = paint(':', 'gray');

            const format = (t: string, i: number) => {
                const color = i === 3 ? 'cyan' : 'cyan';

                return paint(this.pad(t), color);
            }

            return [ 'hours', 'minutes', 'seconds', 'milliseconds' ]
                .map(format).join(sep);

        } catch(error) { throw error; }
    }

    elapsed(time?: Time) {
        try {
            const stamp = new Timestamp(time) as Timestamp;

            return this.stamp - stamp.stamp;

        } catch(error) { throw error; }
    }

    format(level: 'date' | 'clock' | true = true): string {	
        try {
            if (level !== true) {
                const key = level as string;

                return (this as any)[key];
            }

            return `${this.date} ${this.clock}`;

        } catch(error) { throw error; }
    }

    private pad(key: string) {
        try {
            if (!(key in this)) throw new Error(`Invalid key: ${key}`);

            const value = (this as any)[key].toString();
            if (key === 'year') return value.slice(-2);

            const pad = key === 'milliseconds' ? 3 : 2;
            return value.padStart(pad, '0');

        } catch(error) { throw error; }
    }

    [Symbol.toPrimitive](hint: string) {
        try {
            if (hint === 'string') return this.format();
            if (hint === 'number') return this.stamp;

            return this.stamp;

        } catch(error) { throw error; }
    }
}

/// -------------------------------- ///

const timestamp = (timestamp?: Time) => new Timestamp(timestamp);

const today = () => {
    try {
        const [ open, close ] = mark('hooks');
        const { date } = new Timestamp();

        return `${open}${date}${close}`; 

    } catch(err) { throw err; }
}

const clock = () => {
    try {
        const [ open, close ] = mark('hooks');
        const { clock } = new Timestamp();

        return `${open}${clock}${close}`; 

    } catch(err) { throw err; }
}

const now = () => {
    try {
        const [ open, close ] = mark('hooks');
        const now = new Timestamp().format(true);

        return `${open}${now}${close}`; 

    } catch(err) { throw err; }
}

/// -------------------------------- ///

export {    
    Timestamp, timestamp, today, clock, now,

    type Time,
}
