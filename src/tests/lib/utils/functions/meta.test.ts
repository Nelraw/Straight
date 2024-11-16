
import { Print } from '../../../../lib/utils/functions/print.js';
import { ProcessObject } from '../../../../lib//njsp/Process.js';
import { List, ListError } from '../../../../lib/utils/classes/iterables/List.js';

import * as $Meta from '../../../../lib/utils/functions/meta.js';

const testing: Global.Dict = {};

testing.X = class X extends ProcessObject {}
testing.x = new testing.X();

testing.Y = class Y extends testing.X {}
testing.y = new testing.Y();

testing.Path = class Path extends String {}
testing.path = new testing.Path(`/path/to/file`);

testing.Bytes = class Bytes extends Number {}

testing.MatrixError = class MatrixError extends ListError<string, any> {}
testing.MegaMatrixError = class MegaMatrixError extends testing.MatrixError {}
testing.Matrix = class Matrix extends List<string, any> {}

testing.object = { bits: 64 };
testing.array = [  1, 2, 3, 4, 5 ];

testing.true = true;
testing.false = false;

testing.undefined = undefined;
testing.null = null;

testing.function = function() { return true; }
testing.anonymousFunction = () => true;

testing.async = async function() { return true; }
testing.anonymousAsync = async () => true;

async function test(objects: Global.Dict = testing) {
    try {

        for (const key in objects) {
            const object = objects[key];
            const meta = new $Meta.Meta(object);

            const { name, type, parent, family, elder } = meta;
            const { primitive, nullish, falsy, truthy } = meta;

            const lines = [
                [ `Name`, name ],
                [ `Type`, type ],
                [ `Parent`, parent ],
                [ `Elder`, elder ],
                [ `Primitive`, primitive ],
                [ `Nullish`, nullish ],
                [ `Falsy`, falsy ],
                [ `Truthy`, truthy ],
                [ `Family`, family ],
            ]

            Print.log.show(`Meta of ${key}`);

            for (const line of lines) {
                const [ title, value ] = line;

                Print.titled(`  → ${title}`, value);
            }

            Print.br();
        }

    } catch(err) { throw err; }
}

export { test }
