class Loop {
    constructor(callback, fps=60.0) {
        const that = this;
        this.update = callback;     // update fn
        this.fps = 0.0;             // frames / second
        this.isActive = false;      // state
        this.last = null;           // last ms
        this.limit = 1000.0 / fps;  // largest step allowed
        this.run = function(ts) {
            const step = ts - that.last;
            const delta = step / 1000.0;
    
            if (step >= that.limit) {
                that.fps = Math.floor(1.0 / delta);
                that.last = ts;
                that.update(delta);
            }
    
            if (that.isActive) requestAnimationFrame(that.run);
        }
    }

    start() {
        this.isActive = true;
        this.last = performance.now();
        requestAnimationFrame(this.run);
        return this;
    }

    stop() {
        this.isActive = false;
        return this;
    }
}