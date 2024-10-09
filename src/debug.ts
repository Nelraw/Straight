
import { ProcessObject } from './lib/core/Process.js';
import { Print } from './lib/utils/functions/print.js';

import njsp from './lib/njsp.js';

Print.show('njsp', njsp)
    (njsp.pid)

Print.show('njsp.PACKAGE', njsp.PACKAGE.name)
    (njsp.PACKAGE.version, njsp.PACKAGE.dependencies)


type Tuple = [ 'foo', 'bar', 'baz' ];

type Obj = { bits: 64; id: "2" };
type Arr = Array<boolean>;


type TestArr = Node.Objects.Values<Arr>;

type Union = Node.Utils.TupleToUnion<Tuple>
