'use strict'

import memoize_one from 'memoize-one'
import get_loader from '@monorepo-private/iframe--loading'
import { schedule_when_idle_but_within_human_perception } from '@monorepo-private/async-utils'

import { ↆcordova } from './cordova'
import logger from './logger'


ↆcordova.finally(() => {
	// https://cordova.apache.org/docs/en/latest/reference/cordova-plugin-splashscreen/index.html#preferences
	if ('splashscreen' in navigator) {
		navigator.splashscreen.hide()
	}
}).catch(() => {})


const declare_app_loaded = memoize_one(function _declare_app_loaded() {
	schedule_when_idle_but_within_human_perception(() => {
		// @monorepo-private/iframe--loading
		get_loader().on_rsrc_loaded()

		logger.info('🙌 🙌 🙌 App loaded! 🙌 🙌 🙌')
	})
})

export default declare_app_loaded
