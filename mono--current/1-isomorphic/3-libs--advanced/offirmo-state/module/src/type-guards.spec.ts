import { describe, it, expect } from "vitest"

import { DEMO_ROOT_STATE } from "./__fixtures/examples.ts"
import { LIB } from "./consts.ts"
import {
	isꓽBaseState,
	isꓽUState,
	isꓽTState,
	isꓽRootState,
	isꓽUTBundle,
	isꓽvalid_offirmo_state_object,
} from "./type-guards.ts"

describe(`${LIB} - type guards`, () => {
	describe("isꓽBaseState", () => {
		it("should work on non matching: FALSE", () => {
			expect(isꓽBaseState(undefined)).toBe(false)
			expect(isꓽBaseState(null)).toBe(false)
			expect(isꓽBaseState(0)).toBe(false)
			expect(isꓽBaseState([])).toBe(false)
			expect(isꓽBaseState({})).toBe(false)
			expect(isꓽBaseState(new Error("Test!"))).toBe(false)
			expect(isꓽBaseState(DEMO_ROOT_STATE)).toBe(false)
		})

		it("should work on matching: TRUE", () => {
			expect(isꓽBaseState(DEMO_ROOT_STATE.t_state)).toBe(true)
			expect(isꓽBaseState(DEMO_ROOT_STATE.u_state)).toBe(true)
		})
	})

	describe("isꓽUState", () => {
		it("should work on non matching: FALSE", () => {
			expect(isꓽUState(undefined)).toBe(false)
			expect(isꓽUState(null)).toBe(false)
			expect(isꓽUState(0)).toBe(false)
			expect(isꓽUState([])).toBe(false)
			expect(isꓽUState({})).toBe(false)
			expect(isꓽUState(new Error("Test!"))).toBe(false)
			expect(isꓽUState(DEMO_ROOT_STATE)).toBe(false)
			expect(isꓽUState(DEMO_ROOT_STATE.t_state)).toBe(false)
		})

		it("should work on matching: TRUE", () => {
			expect(isꓽUState(DEMO_ROOT_STATE.u_state)).toBe(true)
		})
	})

	describe("isꓽTState", () => {
		it("should work on non matching: FALSE", () => {
			expect(isꓽTState(undefined)).toBe(false)
			expect(isꓽTState(null)).toBe(false)
			expect(isꓽTState(0)).toBe(false)
			expect(isꓽTState([])).toBe(false)
			expect(isꓽTState({})).toBe(false)
			expect(isꓽTState(new Error("Test!"))).toBe(false)
			expect(isꓽTState(DEMO_ROOT_STATE)).toBe(false)
			expect(isꓽTState(DEMO_ROOT_STATE.u_state)).toBe(false)
		})

		it("should work on matching: TRUE", () => {
			expect(isꓽTState(DEMO_ROOT_STATE.t_state)).toBe(true)
		})
	})

	describe("isꓽRootState", () => {
		it("should work on non matching: FALSE", () => {
			expect(isꓽRootState(undefined)).toBe(false)
			expect(isꓽRootState(null)).toBe(false)
			expect(isꓽRootState(0)).toBe(false)
			expect(isꓽRootState([])).toBe(false)
			expect(isꓽRootState({})).toBe(false)
			expect(isꓽRootState(new Error("Test!"))).toBe(false)
			expect(isꓽRootState(DEMO_ROOT_STATE.t_state)).toBe(false)
			expect(isꓽRootState(DEMO_ROOT_STATE.u_state)).toBe(false)
		})

		it("should work on matching: TRUE", () => {
			expect(isꓽRootState(DEMO_ROOT_STATE)).toBe(true)
		})
	})

	describe("isꓽUTBundle()", () => {
		it("should work on non matching: FALSE", () => {
			expect(isꓽUTBundle(undefined)).toBe(false)
			expect(isꓽUTBundle(null)).toBe(false)
			expect(isꓽUTBundle(0)).toBe(false)
			expect(isꓽUTBundle([])).toBe(false)
			expect(isꓽUTBundle({})).toBe(false)
			expect(isꓽUTBundle(new Error("Test!"))).toBe(false)
			expect(isꓽUTBundle(DEMO_ROOT_STATE.t_state)).toBe(false)
			expect(isꓽUTBundle(DEMO_ROOT_STATE.u_state)).toBe(false)
		})

		it("should work on matching: TRUE", () => {
			expect(isꓽUTBundle([DEMO_ROOT_STATE.u_state, DEMO_ROOT_STATE.t_state])).toBe(true)
		})
	})

	describe("isꓽvalid_offirmo_state_object()", () => {
		it("should work on non matching: FALSE", () => {
			expect(isꓽvalid_offirmo_state_object(undefined)).toBe(false)
			expect(isꓽvalid_offirmo_state_object(null)).toBe(false)
			expect(isꓽvalid_offirmo_state_object(0)).toBe(false)
			expect(isꓽvalid_offirmo_state_object([])).toBe(false)
			expect(isꓽvalid_offirmo_state_object({})).toBe(false)
			expect(isꓽvalid_offirmo_state_object(new Error("Test!"))).toBe(false)
			expect(isꓽvalid_offirmo_state_object([DEMO_ROOT_STATE.u_state, DEMO_ROOT_STATE.t_state])).toBe(true) // bc not object
		})

		it("should work on matching: TRUE", () => {
			expect(isꓽvalid_offirmo_state_object(DEMO_ROOT_STATE.t_state)).toBe(true)
			expect(isꓽvalid_offirmo_state_object(DEMO_ROOT_STATE.u_state)).toBe(true)
			expect(isꓽvalid_offirmo_state_object(DEMO_ROOT_STATE)).toBe(true)
		})
	})
})
