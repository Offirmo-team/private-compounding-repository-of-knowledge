import { prefixRegex } from '@rolldown/pluginutils';

const prefix = prefixRegex('~/');

export default function myPlugin() {
	return {
		name: 'missing-parcel-features',

		transform: {
			filter: {
				id: prefix,
			},
			handler(...args) {
				console.log('XXX', args);
				return undefined
			},
		},
	}
}
