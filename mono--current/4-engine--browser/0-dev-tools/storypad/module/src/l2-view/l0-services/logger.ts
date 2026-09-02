/////////////////////////////////////////////////

let _logger = console // safe default

function getꓽlogger() {
	return _logger
}

function _setꓽlogger(new_logger: any): void {
	_logger = new_logger
	console.log(`🗂 Logger up with level "${(_logger as any).getLevel?.()}". Reminder to check your dev tools log level!`)
}

/////////////////////////////////////////////////

export { getꓽlogger, _setꓽlogger }
