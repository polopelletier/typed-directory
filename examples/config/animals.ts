/* typed-directory ignore */
import Animal from "../animals/Animal";

import _domestic_cat from "../animals/domestic/cat";
import _domestic_dog from "../animals/domestic/dog";
import _zoo_lion from "../animals/zoo/lion";

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