class Efe {
	constructor() {
		this.DEV_TOOLS_DETECT_INTERVAL_MS = 1e4,
			this.open = !1,
			this.detectors = [this.detectorByLoggingDate(), this.detectorByLoggingPerformance(), this.detectorByDebugger()],
			this.interval = setInterval( () => {
					this.detect()
				}
				, this.DEV_TOOLS_DETECT_INTERVAL_MS),
			this.detect()
	}
	detect() {
		for (const t of this.detectors) {
			const r = t();
			if (this.open || (this.open = r),
				this.open)
				break
		}
		return this.open && this.dispose(),
			this.open
	}
	detectorByLoggingDate() {
		let t = 0;
		const r = new Date;
		return r.toString = () => (t += 1,
			""),
			() => (t = 0,
				console.log(r),
			t >= 3)
	}
	detectorByLoggingPerformance() {
		function t(s) {
			const l = Date.now();
			return s(),
			Date.now() - l
		}
		function r() {
			const s = {};
			for (let l = 0; l < 500; l++)
				s[`${l}`] = `${l}`;
			return s
		}
		function n() {
			const s = r()
				, l = [];
			for (let c = 0; c < 50; c++)
				l.push(s);
			return l
		}
		let i = 0;
		const a = n();
		return () => {
			const s = t( () => console.table(a))
				, l = t( () => console.log(a));
			return i = Math.max(i, l),
				i === 0 && s < 5 ? !1 : s >= 5 && s > i * 10
		}
	}
	detectorByDebugger() {
		return () => {
			const t = new Date;
			return ( () => {
					debugger
				}
			)(),
			new Date().valueOf() - t.valueOf() > 100
		}
	}
	dispose() {
		clearInterval(this.interval)
	}
}
