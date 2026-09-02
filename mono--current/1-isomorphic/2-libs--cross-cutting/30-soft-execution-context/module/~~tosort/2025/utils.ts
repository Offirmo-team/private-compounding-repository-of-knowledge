
// for debug
function _flattenSXC(SXC: SoftExecutionContext) {
	const plugins = {
		...SXC[INTERNAL_PROP].plugins,
	}

	plugins.analytics.details = flattenToOwn(
		plugins.analytics.details,
	)

	plugins.dependency_injection.context = flattenToOwn(
		plugins.dependency_injection.context,
	)

	plugins.error_handling.details = flattenToOwn(
		plugins.error_handling.details,
	)

	plugins.logical_stack.stack = flattenToOwn(
		plugins.logical_stack.stack,
	)

	return plugins
}
