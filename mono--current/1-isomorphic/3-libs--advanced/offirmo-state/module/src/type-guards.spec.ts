import { expect } from "chai"

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

describe(`${LIB} - type guards`, function () {
	describe("isꓽBaseState", function () {
		it("should work on non matching: FALSE", () => {
			expect(isꓽBaseState(undefined)).to.be.false
			expect(isꓽBaseState(null)).to.be.false
			expect(isꓽBaseState(0)).to.be.false
			expect(isꓽBaseState([])).to.be.false
			expect(isꓽBaseState({})).to.be.false
			expect(isꓽBaseState(new Error("Test!"))).to.be.false
			expect(isꓽBaseState(DEMO_ROOT_STATE)).to.be.false
		})

		it("should work on matching: TRUE", () => {
			expect(isꓽBaseState(DEMO_ROOT_STATE.t_state)).to.be.true
			expect(isꓽBaseState(DEMO_ROOT_STATE.u_state)).to.be.true
		})
	})

	describe("isꓽUState", function () {
		it("should work on non matching: FALSE", () => {
			expect(isꓽUState(undefined)).to.be.false
			expect(isꓽUState(null)).to.be.false
			expect(isꓽUState(0)).to.be.false
			expect(isꓽUState([])).to.be.false
			expect(isꓽUState({})).to.be.false
			expect(isꓽUState(new Error("Test!"))).to.be.false
			expect(isꓽUState(DEMO_ROOT_STATE)).to.be.false
			expect(isꓽUState(DEMO_ROOT_STATE.t_state)).to.be.false
		})

		it("should work on matching: TRUE", () => {
			expect(isꓽUState(DEMO_ROOT_STATE.u_state)).to.be.true
		})
	})

	describe("isꓽTState", function () {
		it("should work on non matching: FALSE", () => {
			expect(isꓽTState(undefined)).to.be.false
			expect(isꓽTState(null)).to.be.false
			expect(isꓽTState(0)).to.be.false
			expect(isꓽTState([])).to.be.false
			expect(isꓽTState({})).to.be.false
			expect(isꓽTState(new Error("Test!"))).to.be.false
			expect(isꓽTState(DEMO_ROOT_STATE)).to.be.false
			expect(isꓽTState(DEMO_ROOT_STATE.u_state)).to.be.false
		})

		it("should work on matching: TRUE", () => {
			expect(isꓽTState(DEMO_ROOT_STATE.t_state)).to.be.true
		})
	})

	describe("isꓽRootState", function () {
		it("should work on non matching: FALSE", () => {
			expect(isꓽRootState(undefined)).to.be.false
			expect(isꓽRootState(null)).to.be.false
			expect(isꓽRootState(0)).to.be.false
			expect(isꓽRootState([])).to.be.false
			expect(isꓽRootState({})).to.be.false
			expect(isꓽRootState(new Error("Test!"))).to.be.false
			expect(isꓽRootState(DEMO_ROOT_STATE.t_state)).to.be.false
			expect(isꓽRootState(DEMO_ROOT_STATE.u_state)).to.be.false
		})

		it("should work on matching: TRUE", () => {
			expect(isꓽRootState(DEMO_ROOT_STATE)).to.be.true
		})
	})

	describe("isꓽUTBundle()", function () {
		it("should work on non matching: FALSE", () => {
			expect(isꓽUTBundle(undefined)).to.be.false
			expect(isꓽUTBundle(null)).to.be.false
			expect(isꓽUTBundle(0)).to.be.false
			expect(isꓽUTBundle([])).to.be.false
			expect(isꓽUTBundle({})).to.be.false
			expect(isꓽUTBundle(new Error("Test!"))).to.be.false
			expect(isꓽUTBundle(DEMO_ROOT_STATE.t_state)).to.be.false
			expect(isꓽUTBundle(DEMO_ROOT_STATE.u_state)).to.be.false
		})

		it("should work on matching: TRUE", () => {
			expect(isꓽUTBundle([DEMO_ROOT_STATE.u_state, DEMO_ROOT_STATE.t_state])).to.be.true
		})
	})

	describe("isꓽvalid_offirmo_state_object()", function () {
		it("should work on non matching: FALSE", () => {
			expect(isꓽvalid_offirmo_state_object(undefined)).to.be.false
			expect(isꓽvalid_offirmo_state_object(null)).to.be.false
			expect(isꓽvalid_offirmo_state_object(0)).to.be.false
			expect(isꓽvalid_offirmo_state_object([])).to.be.false
			expect(isꓽvalid_offirmo_state_object({})).to.be.false
			expect(isꓽvalid_offirmo_state_object(new Error("Test!"))).to.be.false
			expect(isꓽvalid_offirmo_state_object([DEMO_ROOT_STATE.u_state, DEMO_ROOT_STATE.t_state])).to.be.true // bc not object
		})

		it("should work on matching: TRUE", () => {
			expect(isꓽvalid_offirmo_state_object(DEMO_ROOT_STATE.t_state)).to.be.true
			expect(isꓽvalid_offirmo_state_object(DEMO_ROOT_STATE.u_state)).to.be.true
			expect(isꓽvalid_offirmo_state_object(DEMO_ROOT_STATE)).to.be.true
		})
	})
})
