import { expect } from 'chai'

import { LIB } from '../../../consts.ts'

import { getꓽwebᝍpropertyᝍbundle } from '../../../index.ts'

import { SPEC as _SPEC } from '../../__fixtures/specs--blog--personal.ts'

/////////////////////////////////////////////////

describe(`${LIB} -- hosting -- AWS Cloudfront`, function() {
	const SPEC: typeof _SPEC = {
		..._SPEC,
		host: 'aws--cloudfront',
	}

	describe('404 Not Found', function () {

		it('should be handled through a error.html', () => {
			//
			const entry_points = getꓽwebᝍpropertyᝍbundle(SPEC).files
			expect(entry_points).to.have.property('error.html')
			expect(entry_points).not.to.have.property('404.html')
		})
	})

	//describe('server functions')

	//describe('edge workers')

})
