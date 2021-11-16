import * as yup from "yup";

export function yupFormatSchemaErrors(err: yup.ValidationError) {
	const errors = err.inner.map((e) => {
		return {
			path: e.path,
			message: e.message,
		};
	});
	return errors;
}

export type YupErrorsFormatted = ReturnType<typeof yupFormatSchemaErrors>;
