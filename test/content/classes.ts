import BaseClass from "./BaseClass";

import _Something from "./classes/Something";
import _SomethingElse from "./classes/SomethingElse";

const Something:{new(): BaseClass} = _Something;
const SomethingElse:{new(): BaseClass} = _SomethingElse;

export default {
	"Something": Something,
	"SomethingElse": SomethingElse
};