import {
	get_raw_diff,
	tsconfigⵧdefault__compilerOptions‿resolved,
	get_tsconfig__compilerOptions‿resolved,
	tsconfigⵧlegacy__compilerOptions‿resolved,
} from '../../__fixtures/index.ts'

const resolved = get_tsconfig__compilerOptions‿resolved('./tsconfig.json');
console.log('DEFAULT', tsconfigⵧdefault__compilerOptions‿resolved);
console.log('PREVIOUS', tsconfigⵧlegacy__compilerOptions‿resolved);
console.log('WIP', resolved);
console.log('DIFF', get_raw_diff(
	tsconfigⵧlegacy__compilerOptions‿resolved,
	resolved,
))
