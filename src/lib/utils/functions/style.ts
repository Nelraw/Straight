
import chalk from 'chalk';

/// -------------------------------- ///

const marks = {
    success: { value: '✔', styles: [ 'green' ] },
    failure: { value: '✖', styles: [ 'red' ] },
    warning: { value: '⚠', styles: [ 'yellow' ] },
    info: { value: 'ℹ', styles: [ 'cyan' ] },

    arrow: { value: '→', styles: [ 'gray' ] },
    bullet: { value: '•', styles: [ 'gray' ] },
    colons: { value: ':', styles: [ 'gray' ]},
    semicolons: { value: ';', styles: [ 'gray' ]},
    slash: { value: '/', styles: [ 'gray' ] },

    brackets: { value: '{}', styles: [ 'gray' ] },
    hooks: { value: '[]', styles: [ 'gray' ]},
    parentheses: { value: '()', styles: [ 'gray' ]},
    tags: { value: '<>', styles: [ 'gray' ]},
}

/// -------------------------------- ///

function paint(text: string, ...styles: string[]) {
    try {
        if (styles.length === 0) return chalk.gray(text);

        for (const style of styles) {
            if (!(chalk as any)[style]) {
                const reason = `is not supported by chalk.`;

                throw new Error(`Style ${style} ${reason}`);
            }

            text = (chalk as any)[style.valueOf()](text);
        }

        return text;

    } catch (error) { throw error; }
}

function mark(key: string, stylized: boolean = true) {
    try {
        const mark = (marks as any)[key];
        if (!mark) throw new Error(`Invalid mark key: ${key}`);

        let { value, styles } = mark;
        styles = stylized ? styles : [];

        if (value.length === 2) {
            const callback = (char: string) => paint(char, ...styles);
            
            return value.split('').map(callback);
        }
        
        return [ paint(value, ...styles) ];

    } catch (error) { throw error; }
}

/// -------------------------------- ///

export { marks, paint, mark }
