/* typed-directory ignore */
import Animal from "./Animal";

import _domestic_cat from "./domestic/cat";
import _domestic_dog from "./domestic/dog";
import _zoo_lion from "./zoo/lion";

const domestic_cat:Animal = _domestic_cat;
const domestic_dog:Animal = _domestic_dog;
const zoo_lion:Animal = _zoo_lion;

export default {
	"domestic": {
		"cat": domestic_cat,
		"dog": domestic_dog
	},
	"zoo": {
		"lion": zoo_lion
	}
};