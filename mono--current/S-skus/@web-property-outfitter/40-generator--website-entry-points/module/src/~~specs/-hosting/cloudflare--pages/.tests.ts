import { expect } from 'chai'

import { LIB } from '../../../consts.ts'

import { getꓽwebᝍpropertyᝍbundle } from '../../../index.ts'

import { SPEC as _SPEC } from '../../__fixtures/specs--blog--personal.ts'

/////////////////////////////////////////////////

describe(`${LIB} -- hosting -- Cloudflare Pages`, function() {
	const SPEC: typeof _SPEC = {
		..._SPEC,
		host: 'cloudflare--pages',
	}

	describe('404 Not Found', function () {
		context('when NOT a SPA', function () {
			it('should be handled through a 404.html', () => {
				// https://developers.cloudflare.com/pages/configuration/serving-pages/#not-found-behavior
				const entry_points = getꓽwebᝍpropertyᝍbundle(SPEC).files
				expect(entry_points).to.have.property('404.html')
			})
		})

		context('when a SPA', function () {
			it('should NOT have a 404.html', () => {
				// https://developers.cloudflare.com/pages/configuration/serving-pages/#single-page-application-spa-rendering
				const entry_points = getꓽwebᝍpropertyᝍbundle({
					...SPEC,
					isꓽcatching_all_routes: true,
				}).files
				expect(entry_points).not.to.have.property('404.html')
			})
		})
	})

	describe('config', function () {
		it('should have _headers', () => {
			// https://developers.cloudflare.com/pages/configuration/headers/
			const entry_points = getꓽwebᝍpropertyᝍbundle(SPEC).files
			expect(entry_points).to.have.property('_headers')
		})

		it('should have _redirects', () => {
			// https://developers.cloudflare.com/pages/configuration/redirects/
			const entry_points = getꓽwebᝍpropertyᝍbundle(SPEC).files
			expect(entry_points).to.have.property('_redirects')
		})
	})

	//describe('server functions')

	//describe('edge workers')
	// NO! Functions ARE workers, packaged with a better devx
	// https://developers.cloudflare.com/pages/how-to/refactor-a-worker-to-pages-functions/
})
