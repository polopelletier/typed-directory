/* typed-directory ignore */
import BaseClass from "./BaseClass";

import _Something from "./Something";
import _SomethingElse from "./SomethingElse";

const Something:{new(): BaseClass} = _Something;
const SomethingElse:{new(): BaseClass} = _SomethingElse;

export default {
	"Something": Something,
	"SomethingElse": SomethingElse
};